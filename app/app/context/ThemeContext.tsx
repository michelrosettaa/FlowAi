"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type Theme = "dark" | "light" | "green" | "pink";
type Ctx = { theme: Theme; toggleTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("flowai-theme") as Theme) || "dark";
  });

  const ctx = useMemo<Ctx>(
    () => ({
      theme,
      toggleTheme: (t: Theme) => {
        setTheme(t);
        if (typeof window !== "undefined") {
          localStorage.setItem("flowai-theme", t);
        }
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
