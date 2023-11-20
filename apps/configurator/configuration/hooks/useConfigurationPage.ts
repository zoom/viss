import { ConfigurationFullWithSavedProps, MetricWithValuesAndCount, ValueWithHistoryCount, ValueWithHistoryCountAndSavedProps } from "@viss/db"
import { ConfigurationPageProps } from "../../pages/configuration/[id]"
import { useNotification } from "apps/configurator/notification/context"
import { Metric, Value } from "@prisma/client"
import { useImmer } from "use-immer"
import useLocalStorage from "apps/configurator/hooks/useLocalStorage"
import { useEffect, useMemo } from "react"
import { useDebouncing } from "apps/configurator/hooks/useDebouncing"
import { MetricRepositoryApi } from "apps/configurator/api/repository/metric"
import { ValueRepositoryApi } from "apps/configurator/api/repository/value"

type EditableValueProps = 'key' | 'name' | 'weight' | 'deleted';

type ModalType = 'reviewChanges';

type FilterType = 'deleted';

const props = ['key', 'name', 'weight', 'deleted'];

const initialState: {
  configuration: ConfigurationFullWithSavedProps,
  modal: {
    reviewChanges: {
      open: boolean
    }
  },
  filter: {
    deleted: boolean
  }
} = {
  configuration: null,
  modal: {
    reviewChanges: {
      open: false
    }
  },
  filter: {
    deleted: false
  }
}

export const useConfigurationPage = ({ configuration, groups }: ConfigurationPageProps) => {

  const { showNotification } = useNotification();

  const { localStorageState } = useLocalStorage<Record<string, Pick<Value, EditableValueProps>>>(configuration.id);

  const [searchTerm, setSearchTerm] = useDebouncing<string>('', 500);

  const [state, setState] = useImmer({
    ...initialState,
    configuration: {
      ...configuration,
      metrics: configuration.metrics.map(metric => ({
        ...metric,
        values: metric.values.map(value => ({
          ...value,
          savedProps: {
            key: value.key,
            name: value.name,
            weight: value.weight,
            deleted: value.deleted
          }
        }))
      }))
    }
  });

  // Load entries from the localStorage
  useEffect(() => {
    setState(draft => {
      draft.configuration = {
        ...draft.configuration,
        metrics: draft.configuration.metrics.map(metric => ({
          ...metric,
          values: metric.values.map(value => ({
            ...value,
            ...localStorageState.getJSON()[value.id]
          }))
        }))
      }
    })
  }, []);

  const setModalOpen = (modal: ModalType, open: boolean) => {
    setState(draft => {
      draft.modal[modal].open = open;
    })
  }

  const toggleFilter = (filter: FilterType) => {
    setState(draft => {
      draft.filter[filter] = !draft.filter[filter];
    });
  }

  const rename = (metric: Metric, name: string) => {
    setState(draft => {
      const idx = draft
        .configuration
        .metrics
        .findIndex(find => find.id === metric.id);

      if (idx !== -1) {
        draft.configuration.metrics[idx] = {
          ...draft.configuration.metrics[idx],
          ...metric,
          name
        }
      }
    })
  }

  const replace = (find: ValueWithHistoryCount, replaceWith: ValueWithHistoryCount) => {
    setState(draft => {
      const metric = draft
        .configuration
        .metrics
        .find(metric => metric.id === find.metricId);

      if (metric) {
        const idx = metric
          .values
          .findIndex(value => value.id === find.id);

        if (idx !== -1) {
          metric.values[idx] = {
            ...replaceWith,
            savedProps: {
              key: replaceWith.key,
              name: replaceWith.name,
              weight: replaceWith.weight,
              deleted: replaceWith.deleted
            }
          }
        }
      }
    })
  }

  const add = (to: MetricWithValuesAndCount, value: ValueWithHistoryCount) => {
    setState(draft => {
      const metric = draft
        .configuration
        .metrics
        .find(find => find.id === to.id);
      
      if (metric) {
        metric.values = metric.values.concat({
          ...value,
          savedProps: {
            key: value.key,
            name: value.name,
            weight: value.weight,
            deleted: false
          },
        })
      }
    })
  }

  const changeValueProp = (value: ValueWithHistoryCount, prop: EditableValueProps, to: string | number | boolean) => {
    setState(draft => {
      const metric = draft
        .configuration
        .metrics
        .find(metric => metric.id === value.metricId);

      if (metric) {
        const idx = metric
          .values
          .findIndex(find => find.id === value.id);

        if (idx !== -1) {
          metric.values[idx] = {
            ...metric.values[idx],
            [prop]: to
          } 
        }
      }
    });
  }

  // Collect draft entries
  const drafts = useMemo(() => {
    return state
      .configuration
      .metrics
      .flatMap(metric => metric.values)
      .filter(value => props.some(prop => value[prop] !== value.savedProps[prop]));
  }, [state.configuration]);

  const draftsCount = useMemo(() => {
    return drafts.reduce((ret, value) => {      
      props.forEach(prop => {
        if (value[prop] !== value.savedProps[prop]) {
          ret++;
        }
      });
      return ret;
    }, 0);
  }, [drafts]);

  // Update the localStorage bucket or remove the item if the draft object doesn't contain entries
  useEffect(() => {
    const values = drafts.reduce((ret, value) => {
      ret[value.id] = {}
      
      // Save changed props only to prevent filling up the bucket
      props.forEach(prop => {
        if (value[prop] !== value.savedProps[prop]) {
          ret[value.id][prop] = value[prop];
        }
      });
      
      return ret;
    }, {});

    Object.keys(values).length === 0 ?
      localStorageState.removeItem() :
      localStorageState.putJSON(values);
  }, [drafts]);

  const renameMetric = (metric: MetricWithValuesAndCount, name: string): Promise<any> => {
    return MetricRepositoryApi.rename({
      id: metric.id,
      name
    })
      .then((ret: Metric) => rename(metric, name))
      .catch(() => {
        showNotification({
          message: 'Error while renaming metric',
          severity: 'error'
        });
      });
  }

  const addValue = (metric: MetricWithValuesAndCount, value: Pick<Value, 'key' | 'name' | 'weight'>) => {
    return ValueRepositoryApi.create({
      key: value.key,
      name: value.name,
      weight: value.weight,
      metricId: metric.id
    })
      .then((value: ValueWithHistoryCount) => add(metric, value))
      .catch(() => {
        showNotification({
          message: 'Error while creating new value',
          severity: 'error'
        });
      });
  }

  const saveChanges = () => {
    return ValueRepositoryApi.updateBulk(drafts)
      .then((values: ValueWithHistoryCount[]) => {
        values.forEach(value => replace(value, value));
      })
      .then(() => localStorageState.removeItem())
      .then(() => {
        showNotification({
          message: 'Configuration correctly saved',
          severity: 'success'
        });
      })
      .catch(() => {
        showNotification({
          message: 'Error while saving configuration',
          severity: 'error'
        });
      })
  }

  const filterBySearchTerm = (value: ValueWithHistoryCountAndSavedProps) => {
    return ['key', 'name', 'weight'].some(prop => value[prop].toString().toLowerCase().includes(searchTerm.toLowerCase()));
  }

  const filterByDeletedState = (value: ValueWithHistoryCountAndSavedProps) => {
    return state.filter.deleted ? true : !value.deleted;
  }

  return {
    configuration: state.configuration,
    modal: state.modal,
    draftsCount,
    groups,
    searchTerm,
    handleMetricRename: renameMetric,
    handleAddValue: addValue,
    handleSaveChanges: saveChanges,
    changeValueProp,
    filter: {
      deleted: state.filter.deleted,
      bySearchTerm: filterBySearchTerm,
      byDeletedState: filterByDeletedState
    },
    action: {
      setSearchTerm,
      setModalOpen,
      toggleFilter
    }
  }
}