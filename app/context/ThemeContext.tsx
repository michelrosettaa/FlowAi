"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "pink" | "green";

type Ctx = {
  theme: Theme;
  toggleTheme: (t: Theme) => void;
};

const ThemeContext = createContext<Ctx>({
  theme: "dark",
  // no-op default so consumers don’t crash before provider mounts
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // load saved theme once on mount
  useEffect(() => {
    const saved = (localStorage.getItem("flowai-theme") as Theme) || "dark";
    setTheme(saved);
  }, []);

  // apply theme class to <body> and persist
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.body;
    el.classList.remove("theme-dark", "theme-light", "theme-pink", "theme-green");
    el.classList.add(`theme-${theme}`);
    localStorage.setItem("flowai-theme", theme);
  }, [theme]);

  const toggleTheme = (t: Theme) => setTheme(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
