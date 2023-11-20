import { RuleWithMetricsAndValues } from "@viss/db";
import { RuleRepositoryApi } from "apps/configurator/api/repository/rule";
import { useNotification } from "apps/configurator/notification/context";
import { ConfigurationRulePageProps } from "apps/configurator/pages/configuration/[id]/ruleset";
import { useImmer } from "use-immer";

type ModalType = 'create';

const initialState: {
  rules: RuleWithMetricsAndValues[]
  modal: {
    create: {
      open: boolean
    }
  }
} = {
  rules: [],
  modal: {
    create: {
      open: false
    }
  }
}

export const useConfigurationRulePage = ({ configuration, rules }: ConfigurationRulePageProps) => {
  
  const { showNotification } = useNotification();

  const [state, setState] = useImmer({
    ...initialState,
    rules
  });

  const setModalOpen = (modal: ModalType, open: boolean) => {
    setState(draft => {
      draft.modal[modal].open = open;
    });
  }

  const add = (rule: RuleWithMetricsAndValues) => {
    setState(draft => {
      draft.rules.push(rule);
    });
  }

  const remove = (rule: RuleWithMetricsAndValues) => {
    setState(draft => {
      draft.rules = draft.rules.filter(find => find.id !== rule.id);
    });
  }

  const handleCreate = (metricId: string, activationMetricId: string, activationValueId: string) => {
    return RuleRepositoryApi.create({
      metricId,
      activationMetricId,
      activationValueId
    })
      .then((rule: RuleWithMetricsAndValues) => add(rule))
      .catch(() => {
        showNotification({
          message: 'Error while creating new rule',
          severity: 'error'
        })
      })
      .finally(() => setModalOpen('create', false));
  }

  const handleDelete = (rule: RuleWithMetricsAndValues) => {
    return RuleRepositoryApi.remove({
      id: rule.id
    })
      .then(() => remove(rule))
      .catch(() => {
        showNotification({
          message: 'Error while removing rule',
          severity: 'error'
        })
      });
  }

  return {
    configuration,
    rules: state.rules,
    modal: state.modal,
    handleCreate,
    handleDelete,
    action: {
      setModalOpen
    }
  }
}