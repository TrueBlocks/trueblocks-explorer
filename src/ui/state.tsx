import Cookies from 'js-cookie';
import React, { createContext, useContext, useReducer } from 'react';
import { ReactNode } from 'react-markdown';

const GlobalStateContext = createContext<any[]>([]);

const THEME = Cookies.get('theme');
const DEBUG = Cookies.get('debug');

const initialState = {
  theme: THEME || null,
  debug: DEBUG || null,
};

const GlobalStateReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_THEME':
      Cookies.set('theme', action.theme);
      return {
        ...state,
        theme: action.theme,
      };
    case 'SET_DEBUG':
      Cookies.set('debug', action.debug);
      return {
        ...state,
        debug: action.debug,
      }
    default:
      return state;
  }
};

const useGlobalState = () => {
  const [state, dispatch] = useContext(GlobalStateContext);

  const setTheme = (theme: any) => {
    dispatch({ type: 'SET_THEME', theme });
  };

  const setDebug = (debug: any) => {
    dispatch({ type: 'SET_DEBUG', debug });
  };

  return {
    theme: state.theme,
    setTheme,
    debug: state.debug,
    setDebug,
  };
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState);

  return <GlobalStateContext.Provider value={[state, dispatch]}>{children}</GlobalStateContext.Provider>;
};

export default useGlobalState;
