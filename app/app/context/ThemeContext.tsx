"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

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

  // persist only when theme changes (no setState inside effect init)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("flowai-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
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
