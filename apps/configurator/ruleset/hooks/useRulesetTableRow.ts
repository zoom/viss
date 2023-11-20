import { useState } from "react";
import { RulesetTableRowProps } from "../components/RulesetTableRow";

const initialState: {
  isHovering: boolean
} = {
  isHovering: false
}

export const useRulesetTableRow = ({ rule, onDelete }: RulesetTableRowProps) => {
  
  const [state, setState] = useState({
    ...initialState
  });

  const setIsHovering = (hovering: boolean) => {
    setState(_state => ({
      ..._state,
      isHovering: hovering
    }));
  }

  return {
    rule,
    isHovering: state.isHovering,
    handleDelete: onDelete,
    action: {
      setIsHovering
    }
  }
}