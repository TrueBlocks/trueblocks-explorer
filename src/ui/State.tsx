import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { ReactNode } from 'react-markdown';

import { address as Address, Name, Transaction } from '@sdk';
import Cookies from 'js-cookie';

import {
  getThemeByName, Theme, ThemeName,
} from '@modules/themes';
import { createEmptyMeta, Meta } from '@modules/type_fixes';

const THEME: ThemeName = Cookies.get('theme') as ThemeName || 'default';
const ADDRESS = Cookies.get('address');
const DENOM = Cookies.get('denom') || 'ether';

type NamesEditModalState = {
  address: string,
  name: string,
  description: string,
  source: string,
  tags: string
}

type State = {
  theme: Theme,
  denom: string,
  currentAddress?: string,
  namesMap: Map<Address, Name>
  namesArray?: Name[],
  namesEditModalVisible: boolean,
  namesEditModal: NamesEditModalState,
  transactions: Transaction[],
  meta: Meta
  totalRecords: number,
}

const getDefaultNamesEditModalValue = () => ({
  address: '',
  name: '',
  description: '',
  source: '',
  tags: '',
});

const initialState: State = {
  theme: getThemeByName(THEME),
  denom: DENOM,
  currentAddress: ADDRESS,
  namesMap: new Map(),
  namesArray: [],
  namesEditModalVisible: false,
  namesEditModal: getDefaultNamesEditModalValue(),
  transactions: [],
  meta: createEmptyMeta(),
  totalRecords: 0,
};

type SetTheme = {
  type: 'SET_THEME',
  theme: State['theme'],
};

type SetDenom = {
  type: 'SET_DENOM',
  denom: State['denom'],
}

type SetCurrentAddress = {
  type: 'SET_CURRENT_ADDRESS',
  address: State['currentAddress'],
};

type SetNamesMap = {
  type: 'SET_NAMES_MAP',
  namesMap: State['namesMap'],
};

type SetNamesArray = {
  type: 'SET_NAMES_ARRAY',
  namesArray: State['namesArray'],
};

type SetNamesEditModal = {
  type: 'SET_NAMES_EDIT_MODAL',
  val: State['namesEditModal'],
};

type SetNamesEditModalVisible = {
  type: 'SET_NAMES_EDIT_MODAL_VISIBLE',
  visible: State['namesEditModalVisible'],
};

type SetTransactions = {
  type: 'SET_TRANSACTIONS',
  transactions: State['transactions'],
};

type AddTransactions = {
  type: 'ADD_TRANSACTIONS',
  transactions: State['transactions'],
};

type SetMeta = {
  type: 'SET_META',
  meta: State['meta'],
};

type SetTotalRecords = {
  type: 'SET_TOTAL_RECORDS',
  records: State['totalRecords'],
};

type GlobalAction =
  | SetTheme
  | SetDenom
  | SetCurrentAddress
  | SetNamesMap
  | SetNamesArray
  | SetNamesEditModal
  | SetNamesEditModalVisible
  | SetTransactions
  | AddTransactions
  | SetMeta
  | SetTotalRecords;

const GlobalStateContext = createContext<[
  typeof initialState,
  React.Dispatch<GlobalAction>
]>([initialState, () => { }]);

const GlobalStateReducer = (state: State, action: GlobalAction) => {
  switch (action.type) {
    case 'SET_THEME':
      Cookies.set('theme', action.theme.name);
      return {
        ...state,
        theme: action.theme,
      };
    case 'SET_DENOM':
      // TODO(tjayrush): not sure why this doesn't work
      // Cookies.set('denom', action.denom);
      return {
        ...state,
        denom: action.denom,
      };
    case 'SET_CURRENT_ADDRESS':
      Cookies.set('address', action.address || '');

      if (action.address !== state.currentAddress) {
        return {
          ...state,
          currentAddress: action.address,
          transactions: [],
          totalRecords: 0,
        };
      }

      return state;
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
    case 'SET_NAMES_EDIT_MODAL_VISIBLE':
      return {
        ...state,
        namesEditModalVisible: action.visible,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.transactions,
      };
    case 'ADD_TRANSACTIONS': {
      return {
        ...state,
        transactions: [
          ...state.transactions,
          ...action.transactions,
        ],
      };
    }
    case 'SET_META':
      return {
        ...state,
        meta: action.meta,
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

  const setTheme = (theme: SetTheme['theme']) => {
    dispatch({ type: 'SET_THEME', theme });
  };

  const setDenom = (denom: SetDenom['denom']) => {
    dispatch({ type: 'SET_DENOM', denom });
  };

  const setCurrentAddress = (address: SetCurrentAddress['address']) => {
    dispatch({ type: 'SET_CURRENT_ADDRESS', address });
  };

  const setNamesMap = useCallback((namesMap: SetNamesMap['namesMap']) => {
    dispatch({ type: 'SET_NAMES_MAP', namesMap });
  }, [dispatch]);

  const setNamesArray = useCallback((namesArray: SetNamesArray['namesArray']) => {
    dispatch({ type: 'SET_NAMES_ARRAY', namesArray });
  }, [dispatch]);

  const setNamesEditModal = (val: SetNamesEditModal['val']) => {
    dispatch({ type: 'SET_NAMES_EDIT_MODAL', val });
  };

  const setNamesEditModalVisible = (visible: SetNamesEditModalVisible['visible']) => {
    dispatch({ type: 'SET_NAMES_EDIT_MODAL_VISIBLE', visible });
  };

  const setTransactions = useCallback((transactions: SetTransactions['transactions']) => {
    dispatch({ type: 'SET_TRANSACTIONS', transactions });
  }, [dispatch]);

  const addTransactions = useCallback((transactions: AddTransactions['transactions']) => {
    dispatch({ type: 'ADD_TRANSACTIONS', transactions });
  }, [dispatch]);

  const setMeta = useCallback((meta: SetMeta['meta']) => {
    dispatch({ type: 'SET_META', meta });
  }, [dispatch]);

  const setTotalRecords = useCallback((records: SetTotalRecords['records']) => {
    dispatch({ type: 'SET_TOTAL_RECORDS', records });
  }, [dispatch]);

  return {
    theme: state.theme,
    setTheme,
    denom: state.denom,
    setDenom,
    currentAddress: state.currentAddress,
    setCurrentAddress,
    namesMap: state.namesMap,
    setNamesMap,
    namesArray: state.namesArray,
    setNamesArray,
    namesEditModal: state.namesEditModal,
    setNamesEditModal,
    namesEditModalVisible: state.namesEditModalVisible,
    setNamesEditModalVisible,
    transactions: state.transactions,
    setTransactions,
    addTransactions,
    meta: state.meta,
    setMeta,
    totalRecords: state.totalRecords,
    setTotalRecords,
  };
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState);
  const value = useMemo((): [State, React.Dispatch<GlobalAction>] => [state, dispatch], [state]);

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
};

export const useGlobalNames = () => {
  const {
    namesMap, setNamesMap, namesArray, setNamesArray,
  } = useGlobalState();
  return {
    namesMap, setNamesMap, namesArray, setNamesArray,
  };
};
