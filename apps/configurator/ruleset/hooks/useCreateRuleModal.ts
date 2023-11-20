import { SelectChangeEvent } from "@mui/material"
import { useEffect } from "react"
import { useImmer } from "use-immer"
import { CreateRuleModalProps } from "../components/CreateRuleModal"
import { ModalProps } from "apps/configurator/common/components/Modal"

const initialState: {
  form: {
    select: {
      metric: string,
      activationMetric: string,
      activationValue: string
    }
  }
} = {
  form: {
    select: {
      metric: '',
      activationMetric: '',
      activationValue: 'any'
    }
  }
}

export const useCreateRuleModal = ({ configuration, rules, onCreate, ...rest }: CreateRuleModalProps & ModalProps) => {

  const [state, setState] = useImmer({
    ...initialState
  });

  useEffect(() => {
    setState(draft => {
      draft.form.select.activationMetric = initialState.form.select.activationMetric;
      draft.form.select.activationValue = initialState.form.select.activationValue;
    })
  }, [state.form.select.metric]);

  useEffect(() => {
    setState(draft => {
      draft.form.select.activationValue = initialState.form.select.activationValue;
    })
  }, [state.form.select.activationMetric]);

  useEffect(() => {
    setState(draft => {
      draft.form.select = {
        ...initialState.form.select
      }
    });
  }, [rest.open]);

  const updateRuleFormField = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;

    setState(draft => {
      draft.form.select[name] = value;
    });
  }

  const handleCreate = () => {
    onCreate(
      state.form.select.metric,
      state.form.select.activationMetric,
      state.form.select.activationValue === initialState.form.select.activationValue ? 
        null : 
        state.form.select.activationValue
    );
  }

  return ({
    configuration,
    rules,
    form: state.form,
    action: {
      updateRuleFormField,
      handleCreate
    },
    ...rest
  })

}
