"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeName = "dark" | "light" | "green" | "pink";

type ThemeContextValue = {
  theme: ThemeName;
  toggleTheme: (t: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("flowai-theme") as ThemeName | null;
    return stored ?? "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("flowai-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: (t: ThemeName) => setTheme(t),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
