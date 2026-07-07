import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ViewMode = "edit" | "final";

const Ctx = createContext<{ mode: ViewMode; setMode: (m: ViewMode) => void }>({
  mode: "edit",
  setMode: () => {},
});

const KEY = "ve:viewMode";

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "edit";
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === "final" || raw === "edit") return raw;
    } catch {}
    return "edit";
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, mode); } catch {}
  }, [mode]);
  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}

export function useViewMode() {
  return useContext(Ctx);
}
