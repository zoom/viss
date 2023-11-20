import { ChangeEvent, useEffect } from "react";
import { ConfigurationTableRowProps } from "../components/ConfigurationTableRow";
import { useImmer } from "use-immer";
import { Config, colors, starWars, uniqueNamesGenerator } from "unique-names-generator";

const ungConfig: Config = {
  dictionaries: [colors, starWars],
  separator: ' ',
  style: 'capital'
};

const initialState: {
  actionMenu: {
    anchorElement: Element
  },
  modal: {
    rename: {
      open: boolean,
    },
    remove: {
      open: boolean,
    },
    assignVersion: {
      open: boolean,
    },
    duplicate: {
      open: boolean,
    }
  },
  form: {
    rename: {
      disabled: boolean,
      input: {
        name: string
      }
    },
    duplicate: {
      disabled: boolean,
      input: {
        name: string
      }
    }
  }
} = {
  modal: {
    rename: {
      open: false,
    },
    remove: {
      open: false,
    },
    assignVersion: {
      open: false,
    },
    duplicate: {
      open: false,
    }
  },
  form: {
    rename: {
      disabled: false,
      input: {
        name: ''
      }
    },
    duplicate: {
      disabled: true,
      input: {
        name: ''
      }
    }
  },
  actionMenu: {
    anchorElement: null
  }
}

type ModalType = 'remove' | 'rename' | 'assignVersion' | 'duplicate';

type FormType = 'rename' | 'duplicate';

export const useConfigurationTableRow = ({ 
  configuration, 
  onRename, 
  onDuplicate, 
  onAssignVersion,
  onSetActive,
  onRemove,
  onRestore
}: ConfigurationTableRowProps) => {

  const [state, setState] = useImmer({
    ...initialState
  });

  const setAnchorElement = (anchorElement: Element) => {
    setState(draft => ({
      ...draft,
      actionMenu: {
        anchorElement
      }
    }));
  }

  const setModalOpen = (modal: ModalType, open: boolean) => {
    setState(draft => {
      draft.modal[modal].open = open;
      draft.actionMenu.anchorElement = null;
    });
  }

  const remove = () => {
    onRemove(configuration)
      .finally(() => {
        setModalOpen('remove', false);
      });
  }

  const restore = () => {
    onRestore(configuration)
      .finally(() => {
        setModalOpen('remove', false);
      });
  }

  const rename = () => {
    onRename(configuration, state.form.rename.input.name)
      .finally(() => {
        setModalOpen('rename', false);
      });
  }

  const assignVersion = () => {
    onAssignVersion(configuration)
      .finally(() => {
        setModalOpen('assignVersion', false);
      });
  }

  const setActive = () => {
    onSetActive(configuration)
      .finally(() => {
        setModalOpen('assignVersion', false);
      });
  }

  const duplicate = () => {
    onDuplicate(configuration, state.form.duplicate.input.name)
      .finally(() => {
        setModalOpen('duplicate', false);
      });
  }

  const updateRenameFormField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setState(draft => {
      draft.form.rename.input[name.replace('configuration-', '')] = value;
    })
  }

  useEffect(() => {
    setState(draft => {
      draft.form.rename.disabled = !state.form.rename.input.name;
    });
  }, [state.form.rename.input]);

  const updateDuplicateFormField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setState(draft => {
      draft.form.duplicate.input[name.replace('configuration-', '')] = value;
    })
  }

  useEffect(() => {
    setState(draft => {
      draft.form.duplicate.disabled = !state.form.duplicate.input.name;
    });
  }, [state.form.duplicate.input]);

  const generateRandomName = (form: FormType) => {
    setState(draft => {
      draft.form[form].input.name = uniqueNamesGenerator(ungConfig);
    });
  }
  
  return {
    configuration,
    
    modal: state.modal,
    
    actionMenu: {
      isOpen: !!state.actionMenu.anchorElement,
      anchorElement: state.actionMenu.anchorElement,

      open: (anchorElement: Element) => setAnchorElement(anchorElement),
      close: () => setAnchorElement(null),
    },
    
    form: state.form,

    action: {
      
      openModal: (modal: ModalType) => setModalOpen(modal, true),
      closeModal: (modal: ModalType) => setModalOpen(modal, false),

      updateRenameFormField,
      updateDuplicateFormField,
      generateRandomName,
      
      rename,
      remove,
      restore,
      assignVersion,
      setActive,
      duplicate
    }
  }
}