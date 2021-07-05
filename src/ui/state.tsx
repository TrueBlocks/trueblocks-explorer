import Cookies from 'js-cookie';
import React, { createContext, useContext, useReducer } from 'react';
import { ReactNode } from 'react-markdown';

const GlobalStateContext = createContext<any[]>([]);

const THEME = Cookies.get('theme');
const DEBUG = Cookies.get('debug') === 'true' ? true : false;

const initialState = {
  theme: THEME || null,
  debug: DEBUG || false,
  accountAddresses: ['0xf503017d7baf7fbc0fff7492b751025c6a78179b', '0xd1629474d25a63B1018FcC965e1d218A00F6CbD3'],
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
    case 'SET_ACCOUNT_ADDRESSES':
      return {
        ...state,
        accountAddresses: action.addresses,
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

  const setAccountAddresses = (addresses: string[]) => {
    dispatch({ type: 'SET_ACCOUNT_ADDRESSES', addresses });
  };

  return {
    theme: state.theme,
    setTheme,
    debug: state.debug,
    setDebug,
    accountAddresses: state.accountAddresses,
    setAccountAddresses,
  };
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState);

  return <GlobalStateContext.Provider value={[state, dispatch]}>{children}</GlobalStateContext.Provider>;
};

export default useGlobalState;
