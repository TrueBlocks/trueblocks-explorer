import Cookies from 'js-cookie';
import React, { createContext, useContext, useReducer } from 'react';
import { ReactNode } from 'react-markdown';

const GlobalStateContext = createContext<any[]>([]);

const THEME = Cookies.get('theme');
const ADDRESS = Cookies.get('address');
const DENOM = Cookies.get('denom');

const initialState = {
  theme: THEME || null,
  currentAddress: ADDRESS || null,
  denom: DENOM || 'ether',
  namesMap: null,
  namesArray: null,
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
    case 'SET_CURRENT_ADDRESS':
      Cookies.set('address', action.address);
      if (action.address !== state.address) {
        return {
          ...state,
          currentAddress: action.address,
          transactions: null,
          totalRecords: null,
        };
      } else {
        return {
          ...state,
          currentAddress: action.address,
        };
      }
    case 'SET_DENOM':
      Cookies.set('denom', action.denom);
      return {
        ...state,
        denom: action.denom,
      };
    case 'SET_NAMES_MAP':
      return {
        ...state,
        namesMap: action.namesMap,
      };
    case 'SET_NAMES_ARRAY':
      return {
        ...state,
        namesArray: action.namesArray,
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

export const useGlobalState = () => {
  const [state, dispatch] = useContext(GlobalStateContext);

  const setTheme = (theme: any) => {
    dispatch({ type: 'SET_THEME', theme });
  };

  const setCurrentAddress = (address: string) => {
    dispatch({ type: 'SET_CURRENT_ADDRESS', address });
  };

  const setDenom = (denom: string) => {
    dispatch({ type: 'SET_DENOM', denom: denom });
  };

  const setNamesMap = (namesMap: any) => {
    dispatch({ type: 'SET_NAMES_MAP', namesMap: namesMap });
  };

  const setNamesArray = (namesArray: any) => {
    dispatch({ type: 'SET_NAMES_ARRAY', namesArray: namesArray });
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
    currentAddress: state.currentAddress,
    setCurrentAddress,
    denom: state.denom,
    setDenom,
    namesMap: state.namesMap,
    setNamesMap,
    namesArray: state.namesArray,
    setNamesArray,
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

export const useGlobalNames = () => {
  const { namesMap, setNamesMap, namesArray, setNamesArray } = useGlobalState();
  return { namesMap, setNamesMap, namesArray, setNamesArray };
};
