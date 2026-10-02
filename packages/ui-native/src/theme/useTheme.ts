import * as React from "react";
import {
  NativeThemeContext,
  type NativeThemeContextValue,
} from "./ThemeProvider.js";

export function useTheme(): NativeThemeContextValue {
  return React.useContext(NativeThemeContext);
}
