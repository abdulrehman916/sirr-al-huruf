import { createContext, useContext, useState, useEffect } from "react";

const VefkSessionContext = createContext();

export function VefkSessionProvider({ children }) {
  const [session, setSession] = useState({
    mode: "ana",
    anaData: null,
    tanzimData: null,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vefk_session");
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load session:", e);
      }
    }
  }, []);

  // Save to localStorage whenever session changes
  useEffect(() => {
    localStorage.setItem("vefk_session", JSON.stringify(session));
  }, [session]);

  const updateAnaData = (data) => {
    setSession(prev => ({ ...prev, anaData: data, mode: "ana" }));
  };

  const updateTanzimData = (data) => {
    setSession(prev => ({ ...prev, tanzimData: data, mode: "tanzim" }));
  };

  const clearSession = () => {
    setSession({ mode: "ana", anaData: null, tanzimData: null });
    localStorage.removeItem("vefk_session");
  };

  return (
    <VefkSessionContext.Provider value={{ session, updateAnaData, updateTanzimData, clearSession }}>
      {children}
    </VefkSessionContext.Provider>
  );
}

export function useVefkSession() {
  return useContext(VefkSessionContext);
}