import { Dispatch, PropsWithChildren, createContext, useContext, useReducer, useState } from "react";
import { NotificationMessage } from "./types";

const initialState: NotificationMessage = {
  message: '',
  open: false,
  severity: 'info',
  timeout: 5000,
  timestamp: 0,
};

const NotificationContext = createContext<{
  state: NotificationMessage,
  dispatch: Dispatch<NotificationMessage>
} | undefined>(undefined);

export const NotificationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(
    (state: NotificationMessage, payload: NotificationMessage) => {
      return {
        ...state,
        ...payload
      }
    }, initialState);
  
  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      { children }
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext);

  if (ctx === undefined) {
    throw new Error('useNotification must be used inside a Notification provider');
  }

  const showNotification = (notification: NotificationMessage) => {
    ctx.dispatch({
      ...notification,
      open: true,
      timestamp: new Date().getTime()
    });
  }

  const clearNotification = () => {
    ctx.dispatch({
      ...ctx.state,
      open: false,
      timestamp: new Date().getTime()
    });
  }

  return {
    notification: ctx.state,
    showNotification,
    clearNotification
  }
}