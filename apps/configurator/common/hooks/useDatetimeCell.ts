import { DatetimeCellProps } from "../components/DatetimeCell";
import { useEffect, useState } from "react";

const initialState: {
  time: string | null,
  date: string | null,
  isToday: boolean | null
} = {
  time: null,
  date: null,
  isToday: null
}

export const useDatetimeCell = ({ datetime }: DatetimeCellProps) => {
  const [state, setState] = useState(initialState);
  
  const today = new Date();

  useEffect(() => {
    const t = new Date(datetime);

    setState({
      time: t.toLocaleTimeString(),
      date: t.toDateString(),
      isToday: t.toDateString() === today.toDateString()
    });

  }, [datetime]);

  return {
    ...state
  }
}
