import { useImmer } from "use-immer";
import { MetricTableRowProps } from "../components/MetricTableRow";
import { ChangeEvent, PropsWithChildren, useEffect } from "react";

const initialState: {
  collapsed: boolean,
  isHovering: boolean,
  modal: {
    rename: {
      open: boolean,
    },
    newValue: {
      open: boolean,
    }
  },
  form: {
    rename: {
      disabled: boolean,
      error: boolean,
      input: {
        name: string
      }
    },
    newValue: {
      disabled: boolean,
      error: boolean,
      input: {
        key: string,
        name: string,
        weight: number
      }
    }
  },
} = {
  collapsed: true,
  isHovering: false,
  modal: {
    rename: {
      open: false,
    },
    newValue: {
      open: false,
    }
  },
  form: {
    rename: {
      disabled: false,
      error: false,
      input: {
        name: null
      }
    },
    newValue: {
      disabled: false,
      error: false,
      input: {
        key: null,
        name: null,
        weight: 0
      }
    }
  }
}

type ModalType = 'rename' | 'newValue';

export const useMetricTableRow = ({
  metric,
  totalValues,
  children,
  isEditable,
  isFiltering,
  onRenameMetric,
  onAddValue
}: PropsWithChildren<MetricTableRowProps>) => {

  const [state, setState] = useImmer({
    ...initialState,
    form: {
      ...initialState.form,
      rename: {
        ...initialState.form.rename,
        input: {
          ...initialState.form.rename.input,
          name: metric.name
        }
      }
    }
  });

  const setRowCollapsed = (collapsed: boolean) => {
    setState(draft => {
      draft.collapsed = collapsed;
    });
  }

  const setIsHovering = (hovering: boolean) => {
    setState(draft => {
      draft.isHovering = hovering;
    });
  }

  const setModalOpen = (modal: ModalType, open: boolean) => {
    setState(draft => {
      draft.modal[modal].open = open;
    });
  }

  const renameMetric = () => {
    onRenameMetric(metric, state.form.rename.input.name)
      .finally(() => {
        setModalOpen('rename', false);
      });
  }

  const isUniqueKey = (key: string) => {
    return !key ? true : !metric
      .values
      .filter(filter => !filter.deleted)
      .some(some => some.key === key.toUpperCase());
  }

  const addValue = () => {
    onAddValue(metric, {
      key: state.form.newValue.input.key.toUpperCase(),
      weight: Number(state.form.newValue.input.weight) || 0,
      name: state.form.newValue.input.name
    })
      .finally(() => setModalOpen('newValue', false));
  }

  const updateRenameFormField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;

    setState(draft => {
      draft.form.rename.input[name] = value;
    });
  }

  const updateNewValueFormField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;

    setState(draft => {
      draft.form.newValue.input[name] = value;
    });
  }

  useEffect(() => {
    setState(draft => {
      draft.form.newValue.error = !isUniqueKey(state.form.newValue.input.key);
      draft.form.newValue.disabled = !state.form.newValue.input.key || 
        !state.form.newValue.input.name;
    })
  }, [state.form.newValue.input]);

  useEffect(() => {
    setState(draft => {
      draft.form.rename.disabled = !draft.form.rename.input.name;
    })
  }, [state.form.rename.input]);

  useEffect(() => {
    if (state.modal.rename.open) {
      setState(draft => {
        draft.form.rename.input.name = metric.name;
      })
    }
  }, [state.modal.rename.open]);

  useEffect(() => {
    if (state.modal.newValue.open) {
      setState(draft => {
        draft.form.newValue.input = {
          ...initialState.form.newValue.input
        }
      })
    }
  }, [state.modal.newValue.open]);

  return {
    isEditable,
    metric,
    totalValues,
    children,

    isFiltering,
    collapsed: state.collapsed,
    isHovering: state.isHovering,

    action: {
      collapse: () => setRowCollapsed(true),
      expand: () => setRowCollapsed(false),
      toggleCollapsed: () => setRowCollapsed(!state.collapsed),

      setIsHovering,

      openModal: (modal: ModalType) => setModalOpen(modal, true),
      closeModal: (modal: ModalType) => setModalOpen(modal, false),

      updateNewValueFormField,
      updateRenameFormField,
      renameMetric,
      addValue
    },

    modal: state.modal,
    form: state.form,

    validator: {
      isUniqueKey
    }
  }
}