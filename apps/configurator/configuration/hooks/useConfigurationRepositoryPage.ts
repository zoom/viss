import { ChangeEvent, useEffect } from "react";
import { useDebouncing } from "apps/configurator/hooks/useDebouncing";
import { ConfigurationWithVersionAndCount } from "@viss/db";
import { ConfigurationRepositoryApi } from "apps/configurator/api/repository/configuration";
import { toPrintableVersion } from "@viss/viss";
import { useNotification } from "apps/configurator/notification/context";
import { useImmer } from "use-immer";
import { Config, colors, starWars, uniqueNamesGenerator } from "unique-names-generator";
import { ConfigurationRepositoryPageProps } from "apps/configurator/pages/configuration";

const ungConfig: Config = {
  dictionaries: [colors, starWars],
  separator: ' ',
  style: 'capital'
};

const initialState: {
  configurations: ConfigurationWithVersionAndCount[],
  modal: {
    create: {
      open: boolean
    }
  },
  form: {
    create: {
      disabled: boolean,
      input: {
        name: string,
      }
    }
  },
  filter: {
    deleted: boolean,
    versionedOnly: boolean
  }
} = {
  configurations: [],
  modal: {
    create: {
      open: false
    }
  },
  form: {
    create: {
      disabled: true,
      input: {
        name: '',
      }
    }
  },
  filter: {
    deleted: false,
    versionedOnly: false
  }
}

type FilterType = 'deleted' | 'versionedOnly';

type ModalType = 'create';

export const useConfigurationRepositoryPage = ({ configurations }: ConfigurationRepositoryPageProps) => {

  const { showNotification } = useNotification();
  
  const [searchTerm, setSearchTerm] = useDebouncing<string>('', 500);

  const [state, setState] = useImmer({
    ...initialState,
    configurations: configurations || []
  });

  const addConfiguration = (configuration: ConfigurationWithVersionAndCount) => {
    setState(draft => {
      draft.configurations.push(configuration);
    });
  }

  const replaceConfiguration = (find: ConfigurationWithVersionAndCount, replaceWith: ConfigurationWithVersionAndCount) => {
    setState(draft => {
      const idx = draft.configurations.findIndex(configuration => configuration.id === find.id);

      if (idx !== -1) {
        draft.configurations[idx] = replaceWith;
      }
    });
  }

  const setActiveConfiguration = (configuration: ConfigurationWithVersionAndCount) => {
    setState(draft => {
      (draft.configurations.find(configuration => configuration.active) || { active: null }).active = null;

      const idx = draft.configurations.findIndex(find => find.id === configuration.id);

      if (idx !== -1) {
        draft.configurations[idx] = configuration;
      }
    });
  }

  const setModalOpen = (modal: ModalType, open: boolean) => {
    setState(draft => {
      draft.modal[modal].open = open;
    });
  }

  const toggleFilter = (filter: FilterType) => {
    setState(draft => {
      draft.filter[filter] = !draft.filter[filter];
    })
  }

  const rename = (configuration: ConfigurationWithVersionAndCount, name: string): Promise<any> => {
    return ConfigurationRepositoryApi.rename({
      id: configuration.id,
      name
    })
      .then((ret: ConfigurationWithVersionAndCount) => replaceConfiguration(configuration, ret))
      .catch(() => {
        showNotification({
          message: 'Error while renaming configuration',
          severity: 'error'
        })
      });
  };

  const duplicate = (configuration: ConfigurationWithVersionAndCount, name: string): Promise<any> => {
    return ConfigurationRepositoryApi.duplicate({
      id: configuration.id,
      name
    })
      .then((ret: ConfigurationWithVersionAndCount) => addConfiguration(ret))
      .catch(() => {
        showNotification({
          message: 'Error while duplicating configuration',
          severity: 'error'
        })
      });
  }

  const assignVersion = (configuration: ConfigurationWithVersionAndCount): Promise<any> => {
    return ConfigurationRepositoryApi.assignVersion({
      id: configuration.id
    })
      .then((ret: ConfigurationWithVersionAndCount) => replaceConfiguration(configuration, ret))
      .catch(() => {
        showNotification({
          message: 'Error while versioning configuration',
          severity: 'error'
        })
      });
  }
  
  const setActive = (configuration: ConfigurationWithVersionAndCount): Promise<any> => {
    return ConfigurationRepositoryApi.setActive({
      id: configuration.id
    })
      .then((ret: ConfigurationWithVersionAndCount) => setActiveConfiguration(ret))
      .catch(() => {
        showNotification({
          message: 'Error while setting active configuration',
          severity: 'error'
        })
      });
  }

  const remove = (configuration: ConfigurationWithVersionAndCount): Promise<any> => {
    return ConfigurationRepositoryApi.remove({
      id: configuration.id
    })
      .then((ret: ConfigurationWithVersionAndCount) => replaceConfiguration(configuration, ret))
      .catch(() => {
        showNotification({
          message: 'Error while deleting configuration',
          severity: 'error'
        })
      });
  }

  const restore = (configuration: ConfigurationWithVersionAndCount): Promise<any> => {
    return ConfigurationRepositoryApi.restore({
      id: configuration.id
    })
      .then((ret: ConfigurationWithVersionAndCount) => replaceConfiguration(configuration, ret))
      .catch(() => {
        showNotification({
          message: 'Error while restoring configuration',
          severity: 'error'
        })
      });
  }

  const create = (): Promise<any> => {
    return ConfigurationRepositoryApi.createNew({
      name: state.form.create.input.name
    })
      .then((ret: ConfigurationWithVersionAndCount) => addConfiguration(ret))
      .finally(() => setModalOpen('create', false))
      .catch(() => {
        showNotification({
          message: 'Error while creating new configuration',
          severity: 'error'
        })
      });
  }

  const updateCreateFormInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setState(draft => {
      draft.form.create.input[name.replace('configuration-', '')] = value;
    })
  }

  const generateRandomName = () => {
    setState(draft => {
      draft.form.create.input.name = uniqueNamesGenerator(ungConfig);
    })
  }

  useEffect(() => {
    if (state.modal.create.open) {
      setState(draft => {
        draft.form.create.input = { ...initialState.form.create.input };
      })
    }
  }, [state.modal.create.open]);

  useEffect(() => {
    setState(draft => {
      draft.form.create.disabled = !state.form.create.input.name;
    })
  }, [state.form.create.input]);

  const searchTermFilter = (configuration: ConfigurationWithVersionAndCount) => {
    return configuration
      .name
      .toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      toPrintableVersion(configuration.version?.id).includes(searchTerm)
  }

  const deletedFilter = (configuration: ConfigurationWithVersionAndCount) => {
    return state.filter.deleted ?
      true :
      !configuration.deleted || configuration.deletedAt === null;
  }

  const versionedOnlyFilter = (configuration: ConfigurationWithVersionAndCount) => {
    return state.filter.versionedOnly ? 
      configuration.version !== null :
      true;
  }

  return {
    configurations: state
      .configurations
      .filter(searchTermFilter)
      .filter(deletedFilter)
      .filter(versionedOnlyFilter),

    handleRenameConfiguration: rename,
    handleDuplicateConfiguration: duplicate,
    handleAssignConfigurationVersion: assignVersion,
    handleSetActive: setActive,
    handleRemove: remove,
    handleRestore: restore,


    filter: state.filter,
    modal: state.modal,
    form: state.form,

    action: {
      openModal: (modal: ModalType) => setModalOpen('create', true),
      closeModal: (modal: ModalType) => setModalOpen('create', false),
      updateCreateFormInput,
      generateRandomName,
      toggleFilter,
      setSearchTerm,
      create
    }
  }
}