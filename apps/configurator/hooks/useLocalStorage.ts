import { useEffect, useState } from "react"

const hasWindow = typeof window !== 'undefined';

export function useLocalStorage<T>(key: string, initialState?: T) {

  const [storage, setStorage] = useState(() => hasWindow ? window.localStorage : {
    getItem: (key: string) => {},
    removeItem: (key: string) => {},
    setItem: (key: string) => {}
  });

  hasWindow && initialState && storage.setItem(key, JSON.stringify(initialState));

  const exists = (): boolean => {
    return storage.getItem(key) !== undefined;
  }

  const getJSON = (): T => {
    const data = storage.getItem(key);
    if (!data) {
      return {} as T;
    }

    try {
      const parsed = JSON.parse(storage.getItem(key) as string);
      return parsed;
    } catch {
      return {} as T;
    }
  }

  const putJSON = (object: T) => {
    storage.setItem(key, JSON.stringify(object));
  }

  const removeItem = () => {
    storage.removeItem(key);
  }

  return {
    localStorageState: {
      exists, removeItem, putJSON, getJSON
    }
  }
}

export default useLocalStorage;
