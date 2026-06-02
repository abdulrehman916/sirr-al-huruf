import { createContext, useContext, useState, useCallback, useEffect } from "react";

const NavCtx = createContext({ isNavigating: false });

export function NavigationProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  // Also pause all animations when the tab is hidden to prevent background memory growth
  const [isHidden, setIsHidden] = useState(false);

  const startNav = useCallback(() => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 350);
  }, []);

  useEffect(() => {
    const onVisibility = () => setIsHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const paused = isNavigating || isHidden;

  return (
    <NavCtx.Provider value={{ isNavigating: paused, startNav }}>
      {children}
    </NavCtx.Provider>
  );
}

export function useNavigation() {
  return useContext(NavCtx);
}