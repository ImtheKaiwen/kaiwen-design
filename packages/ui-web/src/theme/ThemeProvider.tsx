import * as React from "react";
import {
  type ThemeMode,
  themes,
  themeToCssVariables,
  generateTokensCss,
} from "@kaiwen/tokens";
import {
  applyThemeToDocument,
  getSystemPreferredTheme,
  isBrowser,
} from "@kaiwen/utilities";

export type ThemePreference = ThemeMode | "system";

export interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  resolvedTheme: ThemeMode;
  isDark: boolean;
}

export const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
  enableSystem?: boolean;
  storageKey?: string;
  scopeToElement?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "dark",
  enableSystem = true,
  storageKey = "kaiwen-theme",
  scopeToElement = false,
}) => {
  const [theme, setThemeState] = React.useState<ThemePreference>(() => {
    if (!isBrowser) return defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "dark" || stored === "light" || stored === "system") {
        return stored;
      }
    } catch {
      // Ignore localStorage access failures
    }
    return defaultTheme;
  });

  const [systemTheme, setSystemTheme] = React.useState<ThemeMode>(() =>
    isBrowser ? getSystemPreferredTheme() : "dark",
  );

  // Listen to system preference changes
  React.useEffect(() => {
    if (!isBrowser || !enableSystem) return;

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "light" : "dark");
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [enableSystem]);

  const resolvedTheme: ThemeMode =
    theme === "system" && enableSystem ? systemTheme : (theme as ThemeMode);

  // Apply data-theme to documentElement and inject base tokens
  React.useEffect(() => {
    if (!isBrowser || scopeToElement) return;

    applyThemeToDocument(resolvedTheme);

    // Ensure CSS variables stylesheet exists in document head
    let styleTag = document.getElementById("kaiwen-tokens-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "kaiwen-tokens-style";
      styleTag.textContent = generateTokensCss();
      document.head.appendChild(styleTag);
    }
  }, [resolvedTheme, scopeToElement]);

  const setTheme = React.useCallback(
    (newTheme: ThemePreference) => {
      setThemeState(newTheme);
      if (isBrowser) {
        try {
          localStorage.setItem(storageKey, newTheme);
        } catch {
          // Ignore
        }
      }
    },
    [storageKey],
  );

  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
    }),
    [theme, setTheme, resolvedTheme],
  );

  if (scopeToElement) {
    const currentThemeObject = themes[resolvedTheme];
    const cssVars = themeToCssVariables(currentThemeObject);

    return (
      <ThemeContext.Provider value={contextValue}>
        <div data-theme={resolvedTheme} style={cssVars as React.CSSProperties}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
