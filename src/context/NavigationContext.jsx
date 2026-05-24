import { createContext, useContext, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

const NavCtx = createContext({ isNavigating: false });

export function NavigationProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);

  const startNav = useCallback(() => {
    setIsNavigating(true);
    // Auto-clear after transition completes
    setTimeout(() => setIsNavigating(false), 350);
  }, []);

  return (
    <NavCtx.Provider value={{ isNavigating, startNav }}>
      {children}
    </NavCtx.Provider>
  );
}

export function useNavigation() {
  return useContext(NavCtx);
}