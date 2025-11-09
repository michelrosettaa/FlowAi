"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type Theme = "dark" | "light" | "green" | "pink";

type ThemeCtx = {
  theme: Theme;
  toggleTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeCtx>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read localStorage once during initialisation (no useEffect setState)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("flowai-theme") as Theme | null;
    return stored ?? "dark";
  });

  const toggleTheme = (t: Theme) => {
    setTheme(t);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("flowai-theme", t);
    }
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
