import { useImmer } from "use-immer";
import { CalculatorDrawerProps } from "../components/CalculatorDrawer";
import { ConfigurationFullWithSavedProps } from "@viss/db";
import { SelectChangeEvent } from "@mui/material";
import { fromVectorString, useCalculator } from "@viss/viss";
import { useEffect } from "react";
import { useHash } from "apps/configurator/hooks/useHash";

const initialState: {
  open: boolean,
} = {
  open: false,
}

export const useCalculatorDrawer = ({ configuration, groups }: CalculatorDrawerProps) => {
  
  const { setValue, setDefaults, selection, score, vectorString } = useCalculator(configuration);
  const [ hash, updateHash ] = useHash();

  const [state, setState] = useImmer({
    ...initialState,
  });

  const setOpen = (open: boolean) => {
    setState(draft => {
      draft.open = open;
    });
  }

  const updateSelectField = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    setValue(name, value);
  }

  useEffect(() => {
    setDefaults()
  }, []);

  useEffect(() => {
    vectorString && updateHash(vectorString);
  }, [vectorString]);

  useEffect(() => {
    Object
      .entries(fromVectorString(hash).selection)
      .forEach(([key, value]) => {
        setValue(key, value);
    })
  }, [hash]);

  return {
    configuration,
    groups,

    selection,
    score,
    open: state.open,

    action: {
      setOpen,
      updateSelectField,
      reset: setDefaults
    }
  }
}