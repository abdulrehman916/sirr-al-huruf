import { createContext, useContext, useState } from "react";

const PageStateContext = createContext(null);

export function PageStateProvider({ children }) {
  const [pageStates, setPageStates] = useState({});

  const getPageState = (pageKey, initialState) => {
    if (pageStates[pageKey] === undefined) {
      return initialState;
    }
    return pageStates[pageKey];
  };

  const setPageState = (pageKey, state) => {
    setPageStates(prev => ({ ...prev, [pageKey]: state }));
  };

  const clearPageState = (pageKey) => {
    setPageStates(prev => {
      const newState = { ...prev };
      delete newState[pageKey];
      return newState;
    });
  };

  return (
    <PageStateContext.Provider value={{ getPageState, setPageState, clearPageState }}>
      {children}
    </PageStateContext.Provider>
  );
}

export function usePageState() {
  const context = useContext(PageStateContext);
  if (!context) {
    throw new Error("usePageState must be used within PageStateProvider");
  }
  return context;
}