import Cookies from 'js-cookie';
import React, { createContext, useContext, useReducer } from 'react';
import { ReactNode } from 'react-markdown';

const GlobalStateContext = createContext<any[]>([]);

const THEME = Cookies.get('theme');
const DEBUG = Cookies.get('debug') === 'true' ? true : false;

const initialState = {
  theme: THEME || null,
  debug: DEBUG || false,
  accountAddress: '0xf503017d7baf7fbc0fff7492b751025c6a78179b',
  names: null,
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
      Cookies.set('debug', action.debug ? 'true' : 'false');
      return {
        ...state,
        debug: action.debug,
      };
    case 'SET_ACCOUNT_ADDRESS':
      return {
        ...state,
        accountAddress: action.address,
      };
    case 'SET_NAMES':
      return {
        ...state,
        names: action.names,
      };
    default:
      return state;
  }
};

const useGlobalState = () => {
  const [state, dispatch] = useContext(GlobalStateContext);

  const setTheme = (theme: any) => {
    dispatch({ type: 'SET_THEME', theme });
  };

  const setDebug = (debug: boolean) => {
    dispatch({ type: 'SET_DEBUG', debug });
  };

  const setAccountAddress = (address: string) => {
    dispatch({ type: 'SET_ACCOUNT_ADDRESS', address });
  };

  const setNames = (names: any) => {
    dispatch({ type: 'SET_NAMES', names });
  };

  return {
    theme: state.theme,
    setTheme,
    debug: state.debug,
    setDebug,
    accountAddress: state.accountAddress,
    setAccountAddress,
    names: state.names,
    setNames,
  };
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState);

  return <GlobalStateContext.Provider value={[state, dispatch]}>{children}</GlobalStateContext.Provider>;
};

export default useGlobalState;
