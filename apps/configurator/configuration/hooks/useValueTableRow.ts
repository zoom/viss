import { ChangeEvent, useEffect, useState } from "react";
import { ValueTableRowProps } from "../components/ValueTableRow";
import { useImmer } from "use-immer";

type ModalType = 'edit' | 'history'

const initialState: {
  isHovering: boolean,
  modal: {
    edit: {
      open: boolean,
    },
    history: {
      open: boolean
    }
  },
  form: {
    edit: {
      error: boolean
      disabled: boolean,
      input: {
        key: string,
        name: string,
        weight: number
      }
    }
  }
} = {
  isHovering: false,
  modal: {
    edit: {
      open: false,
    },
    history: {
      open: false
    }
  },
  form: {
    edit: {
      disabled: false,
      error: false,
      input: {
        key: null,
        name: null,
        weight: null
      }
    }
  }
}

export const useValueTableRow = ({ metric, value, isEditable, onKeyChange, onNameChange, onWeightChange, onRemove, onRestore }: ValueTableRowProps) => {

  const [state, setState] = useImmer({
    ...initialState,
    form: {
      ...initialState.form,
      edit: {
        ...initialState.form.edit,
        input: {
          key: value.key,
          name: value.name,
          weight: value.weight
        }
      }
    }
  });

  const setModalOpen = (modal: ModalType, open: boolean) => {
    setState(draft => {
      draft.modal[modal].open = open;
    });
  }

  const setIsHovering = (hovering: boolean) => {
    setState(draft => {
      draft.isHovering = hovering;
    })
  }

  const updateEditFormField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;

    setState(draft => {
      draft.form.edit.input[name] = value;  
    });
  }

  const isUniqueKey = (key: string) => {
    return !key ? true : !metric
      .values
      .filter(filter => filter.id !== value.id)
      .filter(filter => !filter.deleted)
      .some(some => some.key === key.toUpperCase());
  }

  const saveChanges = () => {
    onKeyChange(value, state.form.edit.input.key);
    onNameChange(value, state.form.edit.input.name);
    onWeightChange(value, state.form.edit.input.weight);
    setModalOpen('edit', false);
  }

  useEffect(() => {
    setState(draft => {
      draft.form.edit.disabled = Object.keys(draft.form.edit.input).some(field => draft.form.edit.input[field] === '');
      draft.form.edit.error = !isUniqueKey(draft.form.edit.input.key);
    });
  }, [state.form.edit.input]);

  useEffect(() => {
    if (state.modal.edit.open) {
      setState(draft => {
        draft.form.edit = {
          ...draft.form.edit,
          input: {
            key: value.key,
            name: value.name,
            weight: value.weight
          }
        }
      })
    }
  }, [state.modal.edit.open]);

  return {
    metric,
    value,

    isDefault: metric.defaultValue.id === value.id,
    isUnique: isUniqueKey(value.key),

    isEditable,
    handleWeightChange: onWeightChange,
    handleRemove: onRemove,
    handleRestore: onRestore,

    action: {
      setModalOpen,
      setIsHovering,
      updateEditFormField,
      saveChanges
    },
    
    modal: state.modal,
    form: state.form,
    isHovering: state.isHovering,
  }
}