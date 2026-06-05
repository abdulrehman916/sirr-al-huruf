import { useNavigate, useLocation } from "react-router-dom";

const BOTTOM_TABS = [
  { id: "home",             arabic: "الرئيسية", path: "/" },
  { id: "abjad-kabir",      arabic: "أبجد",     path: "/abjad" },
  { id: "hadim",            arabic: "خادم",     path: "/hadim" },
  { id: "basthul-huroof-2", arabic: "بسط",      path: "/basthul-huroof-2" },
  { id: "plants",           arabic: "نباتات",   path: "/plants" },
];

// Per-tab history stack: maps tab id → last visited path within that tab
const TAB_HISTORY = {
  "home": "/",
  "abjad-kabir": "/abjad",
  "hadim": "/hadim",
  "basthul-huroof-2": "/basthul-huroof-2",
  "plants": "/plants",
};

// Which path prefix belongs to which tab
const TAB_ROOT = {
  "/": "home",
  "/abjad": "abjad-kabir",
  "/hadim": "hadim",
  "/basthul-huroof-2": "basthul-huroof-2",
  "/plants": "plants",
};

function getTabForPath(pathname) {
  if (pathname.startsWith("/plants")) return "plants";
  if (pathname.startsWith("/abjad")) return "abjad-kabir";
  if (pathname.startsWith("/hadim")) return "hadim";
  if (pathname.startsWith("/basthul-huroof-2")) return "basthul-huroof-2";
  if (pathname === "/") return "home";
  return null;
}

export default function BottomTabBar({ activeId, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Keep TAB_HISTORY updated whenever the path changes
  const tabForCurrentPath = getTabForPath(location.pathname);
  if (tabForCurrentPath) {
    TAB_HISTORY[tabForCurrentPath] = location.pathname;
  }

  const handleTabPress = (tab) => {
    onNavigate?.();
    if (activeId === tab.id) return; // already on this tab — do nothing
    // Navigate to last visited path within the tab
    const target = TAB_HISTORY[tab.id] ?? tab.path;
    navigate(target);
  };

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch justify-around"
      style={{
        background: "rgba(2,6,16,0.97)",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -1px 0 rgba(212,175,55,0.06), 0 -8px 32px rgba(0,0,0,0.70)",
      }}
    >
      {BOTTOM_TABS.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabPress(tab)}
            className="flex flex-col items-center justify-center flex-1 py-2.5 gap-1"
            style={{
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
              WebkitUserSelect: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              minHeight: 52,
              position: "relative",
              outline: "none",
            }}
          >
            {isActive && (
              <div style={{
                position: "absolute",
                top: 0, left: "20%", right: "20%",
                height: 2,
                borderRadius: "0 0 4px 4px",
                background: "linear-gradient(90deg, transparent, #E8C84A, transparent)",
              }} />
            )}
            <span
              className="font-amiri font-bold leading-none"
              style={{
                fontSize: 15,
                color: isActive ? "#E8C84A" : "rgba(255,255,255,0.32)",
                textShadow: isActive ? "0 0 10px rgba(232,200,74,0.55)" : "none",
                pointerEvents: "none",
              }}
            >
              {tab.arabic}
            </span>
          </button>
        );
      })}
    </div>
  );
}