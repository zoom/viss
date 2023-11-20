import { SelectChangeEvent } from "@mui/material";
import { useCalculator, fromVectorString } from "@viss/viss";
import { useHash } from "apps/calculator/hooks/useHash";
import { useEffect } from "react";
import { CalculatorPageProps } from "../pages/calculator/[version]";

export const useCalculatorPage = ({
  groups,
  configuration,
  rules
}: CalculatorPageProps) => {

  const { setValue, setDefaults, selection, score, vectorString } = useCalculator(configuration);

  const [ hash, setHash ] = useHash();

  useEffect(() => {
    if (!hash) {
      setDefaults();
    } else {
      Object
        .entries(fromVectorString(hash).selection)
        .forEach(([key, value]) => {
          setValue(key, value);
        })
    }
  }, []);


  const getDefault = (metric: string) => {
    return configuration.metrics.find(find => find.key === metric).defaultValue.key;
  }

  const handleValueChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;

    setValue(name, value);
    
    for (const rule of rules) {
      if (rules
        .filter(filter => filter.metric.key === rule.metric.key)
        .reduce((disabled, rule) => {
          return (disabled || []).concat(
            rule.activationValue ?
            rule.activationMetric.key === name ? value !== rule.activationValue.key : selection[rule.activationMetric.key] !== rule.activationValue.key :
            rule.activationMetric.key === name ? value === getDefault(rule.activationMetric.key) : selection[rule.activationMetric.key] === getDefault(rule.activationMetric.key)
          );
        }, [] as boolean[])
        .every(disabled => disabled)) {
          setValue(rule.metric.key, getDefault(rule.metric.key));
        }
    }
  }

  const isDisabled = (key: string) => {
    const ruleset = rules.filter(rule => rule.metric.key === key);

    if (ruleset.length === 0)
      return false;

    return ruleset
      .reduce((disabled, rule) => {
        return (disabled || []).concat(
          rule.activationValue ?
          selection[rule.activationMetric.key] !== rule.activationValue.key :
          selection[rule.activationMetric.key] === getDefault(rule.activationMetric.key)
        );
      }, [] as boolean[])
      .every(disabled => disabled);
  }
  
  useEffect(() => {
    vectorString && setHash(vectorString);
  }, [vectorString]);

  return {
    groups,
    version: configuration.version,
    metrics: configuration.metrics,
    selection,
    score,
    vectorString,
    handleValueChange,
    isDisabled,
    action: {
      setValue,
      reset: setDefaults
    }
  }
}