import { ChangeEvent, useEffect } from "react";
import { useImmer } from "use-immer";
import { GroupTableRowProps } from "../components/GroupTableRow";

type ModalType = 'rename' | 'description';

const initialState: {
  isHovering: boolean,
  modal: {
    rename: {
      open: boolean
    },
    description: {
      open: boolean
    }
  },
  form: {
    rename: {
      disabled: boolean,
      input: {
        name: string
      }
    },
    description: {
      input: {
        description: string
      }
    }
  }
} = {
  isHovering: false,
  modal: {
    rename: {
      open: false
    },
    description: {
      open: false
    }
  },
  form: {
    rename: {
      disabled: false,
      input: {
        name: ''
      }
    },
    description: {
      input: {
        description: ''
      }
    }
  }
}

export const useGroupTableRow = ({ group, onChange }: GroupTableRowProps) => {

  const [state, setState] = useImmer({
    ...initialState,
    form: {
      ...initialState.form,
      rename: {
        ...initialState.form.rename,
        input: {
          name: group.name
        }
      }
    }
  });

  useEffect(() => {
    setState(draft => {
      draft.form.rename.disabled = !state.form.rename.input.name;
    });
  }, [state.form.rename.input.name]);

  useEffect(() => {
    setState(draft => {
      if (state.modal.rename.open)
        draft.form.rename.input.name = group.name;

      if (state.modal.description.open)
        draft.form.description.input.description = group.description;
    });
  }, [state.modal]);

  const setModalOpen = (modal: ModalType, open: boolean) => {
    setState(draft => {
      draft.modal[modal].open = open;
    })
  }

  const setIsHovering = (hovering: boolean) => {
    setState(draft => {
      draft.isHovering = hovering;
    });
  }

  const updateRenameFormInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    
    setState(draft => {
      draft.form.rename.input[name.replace('group-', '')] = value;
    })
  }

  const updateDescriptionFormField = (value: string) => {
    setState(draft => {
      draft.form.description.input.description = value;
    })
  }

  const renameGroup = () => {
    onChange(group.id, state.form.rename.input.name)
      .finally(() => setModalOpen('rename', false));
  }

  const updateDescription = () => {
    onChange(group.id, null, state.form.description.input.description)
      .finally(() => setModalOpen('description', false));
  }

  return {
    group,
    isHovering: state.isHovering,
    modal: state.modal,
    action: {
      setModalOpen,
      setIsHovering,
      updateRenameFormInput,
      updateDescriptionFormField,
      renameGroup,
      updateDescription
    },
    form: state.form
  }
}