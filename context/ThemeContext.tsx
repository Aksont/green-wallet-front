// explanation of useContext and ThemeContext: https://react.dev/reference/react/useContext

"use client";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeMode(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  const toggleMode = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ mode: themeMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext not found");
  return context;
};
