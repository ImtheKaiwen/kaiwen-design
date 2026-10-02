import { isBrowser } from "./ssr.js";

export type ThemeName = "dark" | "light";

/**
 * Apply theme to document root attribute data-theme
 */
export function applyThemeToDocument(theme: ThemeName): void {
  if (!isBrowser) return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
}

/**
 * Detect system color scheme preference
 */
export function getSystemPreferredTheme(): ThemeName {
  if (!isBrowser) return "dark";
  const media = window.matchMedia("(prefers-color-scheme: light)");
  return media.matches ? "light" : "dark";
}
