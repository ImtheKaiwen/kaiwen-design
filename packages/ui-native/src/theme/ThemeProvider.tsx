import * as React from "react";
import { useColorScheme } from "react-native";
import { type ThemeMode, type Theme, darkTheme, themes } from "@kaiwen/tokens";

export interface NativeThemeContextValue {
  theme: ThemeMode;
  themeObject: Theme;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

export const NativeThemeContext = React.createContext<NativeThemeContextValue>({
  theme: "dark",
  themeObject: darkTheme,
  setTheme: () => {},
  isDark: true,
});

export interface NativeThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
  followSystem?: boolean;
}

export const KaiwenThemeProvider: React.FC<NativeThemeProviderProps> = ({
  children,
  initialTheme = "dark",
  followSystem = false,
}) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    if (followSystem && (systemScheme === "light" || systemScheme === "dark")) {
      return systemScheme;
    }
    return initialTheme;
  });

  React.useEffect(() => {
    if (followSystem && systemScheme) {
      setTheme(systemScheme === "light" ? "light" : "dark");
    }
  }, [followSystem, systemScheme]);

  const themeObject = themes[theme] || darkTheme;

  const value = React.useMemo<NativeThemeContextValue>(
    () => ({
      theme,
      themeObject,
      setTheme,
      isDark: theme === "dark",
    }),
    [theme, themeObject],
  );

  return (
    <NativeThemeContext.Provider value={value}>
      {children}
    </NativeThemeContext.Provider>
  );
};
