import * as React from "react";
import { ThemeContext, type ThemeContextValue } from "./ThemeProvider.js";

/**
 * Hook to access current Kaiwen theme and switcher
 */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Graceful fallback if used outside ThemeProvider
    return {
      theme: "dark",
      setTheme: () => {},
      resolvedTheme: "dark",
      isDark: true,
    };
  }
  return context;
}
