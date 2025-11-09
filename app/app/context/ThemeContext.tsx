"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

type ThemeCtx = { theme: string; toggleTheme: (t: string) => void };
const Ctx = createContext<ThemeCtx>({ theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("flowai-theme") || "dark";
  });

  const toggleTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("flowai-theme", newTheme);
    }
  }, []);

  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
