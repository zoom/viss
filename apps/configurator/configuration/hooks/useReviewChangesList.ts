import { MetricWithValuesAndCountAndSavedProps, ValueWithHistoryCountAndSavedProps } from "@viss/db"
import { ReviewChangesList } from "../components/ReviewChangesList"

const props = ['key', 'name', 'weight', 'deleted'];

export const useReviewChangesList = ({ metrics, onChangeValueProp }: ReviewChangesList) => {

  const filterMetricByDrafts = (metric: MetricWithValuesAndCountAndSavedProps) => {
    return metric
      .values
      .some(value => props.some(prop => value[prop] !== value.savedProps[prop]));
  }

  const filterValueByDrafts = (value: ValueWithHistoryCountAndSavedProps) => {
    return props.some(prop => value[prop] !== value.savedProps[prop]);
  }

  return {
    metrics: metrics
      .filter(filterMetricByDrafts)
      .map(metric => ({
        ...metric,
        values: metric.values.filter(filterValueByDrafts)
      })),

    handleChangeValueProp: onChangeValueProp
  }
}