import { useState } from "react"

export function useDebouncing<T>(initialState: T, t = 500): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initialState);
  const [timer, setTimer] = useState<NodeJS.Timeout>(null);

  const setDebouncedState = (value: T) => {
    clearTimeout(timer);

    setTimer(setTimeout(() => {
      setState(value);
    }, t));
  }

  return [state, setDebouncedState];
}