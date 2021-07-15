import Cookies from 'js-cookie';
import React, { createContext, useContext, useReducer } from 'react';
import { ReactNode } from 'react-markdown';

const GlobalStateContext = createContext<any[]>([]);

const THEME = Cookies.get('theme');
const DEBUG = Cookies.get('debug') === 'true' ? true : false;
const ADDRESS = Cookies.get('address');

const initialState = {
  theme: THEME || null,
  debug: DEBUG || false,
  accountAddress: ADDRESS || null,
  names: null,
  namesEditModal: false,
  transactions: null,
  totalRecords: null,
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
      Cookies.set('address', action.address);
      return {
        ...state,
        accountAddress: action.address,
      };
    case 'SET_NAMES':
      return {
        ...state,
        names: action.names,
      };
    case 'SET_NAMES_EDIT_MODAL':
      return {
        ...state,
        namesEditModal: action.val,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.transactions,
      };
    case 'SET_TOTAL_RECORDS':
      return {
        ...state,
        totalRecords: action.records,
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

  const setNamesEditModal = (val: any) => {
    dispatch({ type: 'SET_NAMES_EDIT_MODAL', val });
  };

  const setTransactions = (transactions: any) => {
    dispatch({ type: 'SET_TRANSACTIONS', transactions });
  };

  const setTotalRecords = (records: any) => {
    dispatch({ type: 'SET_TOTAL_RECORDS', records });
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
    namesEditModal: state.namesEditModal,
    setNamesEditModal,
    transactions: state.transactions,
    setTransactions,
    totalRecords: state.totalRecords,
    setTotalRecords,
  };
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState);

  return <GlobalStateContext.Provider value={[state, dispatch]}>{children}</GlobalStateContext.Provider>;
};

export default useGlobalState;
