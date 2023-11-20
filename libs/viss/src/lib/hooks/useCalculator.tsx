import { useEffect, useMemo, useState } from "react"
import { MetricKey } from "../types"
import { ConfigurationBasic, ConfigurationFull, ConfigurationFullWithSavedProps } from "@viss/db";
import { toPrintableVersion } from "../helpers";

const initialState: {
  selection: Record<MetricKey, string>,
  score: {
    infrastructure: number,
    tenancy: number,
    data: number,
    viss: number
  },
  vectorString: string,
} = {
  selection: {
    PLI: '',
    ICI: '',
    III: '',
    IAI: '',
    ITN: '',
    STN: '',
    DTN: '',
    TIM: '',
    DCI: '',
    DII: '',
    DAI: '',
    DCL: '',
    UCI: ''
  },
  score: {
    infrastructure: 0,
    tenancy: 0,
    data: 0,
    viss: 0
  },
  vectorString: ''
}

export const useCalculator = (configuration: ConfigurationBasic | ConfigurationFull | ConfigurationFullWithSavedProps) => {
  
  const [state, setState] = useState({
    ...initialState
  });

  const mapped = useMemo(() => {
    const map = new Map<MetricKey, Map<string, number>>();

    configuration
      .metrics
      .forEach(metric => {
        const values = new Map<string, number>();

        metric
          .values
          .forEach(value => {
            values.set(value.key, value.weight);
          });

        map.set(metric.key as MetricKey, values);
      });
    
    return map;
  }, [configuration]);

  const setValue = (metric: string, value: string | null) => {
    setState(_state => ({
      ..._state,
      selection: {
        ..._state.selection,
        [metric]: value || ''
      }
    }));
  }

  const setDefaults = () => {
    configuration
      .metrics
      .forEach(metric => {
        setValue(metric.key, metric.defaultValue?.key || null);
      });
  }

  const getWeight = (metric: MetricKey) => {
    return mapped.get(metric)?.get(state.selection[metric]) || 0;
  }

  const getMin = (num: number) => {
    return Number.isNaN(num) ? 0 : Math.min(Number(num.toFixed(2)), 100);
  }

  useEffect(() => {

    const tenancy = 
      getMin(
        55.93 * 
        (1 - (1 - getWeight('ITN')) * 
        (1 - getWeight('STN')) * 
        (1 - getWeight('DTN'))) * 
        getWeight('PLI') * getWeight('TIM')
      );

    const infrastructure = 
      getMin(83.43 *
        (1 - (1 - getWeight('ICI')) * 
        (1 - getWeight('III')) * 
        (1 - getWeight('IAI'))) * 
        getWeight('PLI')
      );

    const data = 
      getMin(49.44 * 
        (1 - (1 - getWeight('DCI')) * 
        (1 - getWeight('DII')) * 
        (1 - getWeight('DAI'))) * 
        getWeight('DCL') * getWeight('PLI')
      );

    const t = [tenancy, infrastructure, data].sort((s1, s2) => { return s1 - s2 });
    const sum = tenancy + infrastructure + data;

    const viss = 
      getMin(
        (1 + t[0] / sum) *
        (1 + t[1] / sum) *
        t[2] * 
        getWeight('UCI')
      );

    setState(_state => ({
      ..._state,
      score: {
        tenancy,
        infrastructure,
        data,
        viss
      }
    }));

  }, [configuration, state.selection]);

  useEffect(() => {
    if (Object.values(state.selection).some(value => value === ''))
      return;

    const vectorString = 'VISS:' +
        (configuration.version?.id ? toPrintableVersion(configuration.version?.id) : 'U') +
        ':' +
        Object.entries(state.selection).reduce((pairs, entry) => {
          return pairs.concat(`${entry[0]}:${entry[1]}`);
        }, [] as string[]).join('/');

    setState(_state => ({
      ..._state,
      vectorString
    }));

  }, [state.selection]);

  return {
    setValue,
    setDefaults,
    selection: state.selection,
    score: state.score,
    vectorString: state.vectorString
  }
}