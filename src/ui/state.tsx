import React, { createContext, useContext, useReducer } from "react";
import Cookies from "js-cookie";
import { ReactNode } from "react-markdown";

const GlobalStateContext = createContext<any[]>([]);

const THEME = Cookies.get("theme");

const initialState = {
  theme: THEME || null,
};

const GlobalStateReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_THEME":
      Cookies.set("theme", action.theme);
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return state;
  }
};

const useGlobalState = () => {
  const [state, dispatch] = useContext(GlobalStateContext);

  const setTheme = (theme: any) => {
    dispatch({ type: "SET_THEME", theme });
  };

  return {
    theme: state.theme,
    setTheme,
  };
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState);

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default useGlobalState;
