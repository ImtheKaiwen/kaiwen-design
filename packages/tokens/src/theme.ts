import {
  darkColorTokens,
  lightColorTokens,
  type ColorTokens,
} from "./colors.js";
import { spacing } from "./spacing.js";
import { radius } from "./radius.js";
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
  typographyPresets,
} from "./typography.js";
import { duration, easing, transition } from "./motion.js";
import { darkShadows, lightShadows } from "./shadows.js";
import { zIndex } from "./zIndex.js";
import { breakpoints, breakpointNumbers } from "./breakpoints.js";
import { borders, opacity } from "./borders.js";

export type ThemeMode = "dark" | "light";

export interface Theme {
  mode: ThemeMode;
  colors: ColorTokens;
  shadows: typeof darkShadows | typeof lightShadows;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: {
    fontFamilies: typeof fontFamilies;
    fontSizes: typeof fontSizes;
    fontWeights: typeof fontWeights;
    lineHeights: typeof lineHeights;
    letterSpacings: typeof letterSpacings;
    presets: typeof typographyPresets;
  };
  motion: {
    duration: typeof duration;
    easing: typeof easing;
    transition: typeof transition;
  };
  zIndex: typeof zIndex;
  breakpoints: typeof breakpoints;
  breakpointNumbers: typeof breakpointNumbers;
  borders: typeof borders;
  opacity: typeof opacity;
}

export const sharedTokens = {
  spacing,
  radius,
  typography: {
    fontFamilies,
    fontSizes,
    fontWeights,
    lineHeights,
    letterSpacings,
    presets: typographyPresets,
  },
  motion: {
    duration,
    easing,
    transition,
  },
  zIndex,
  breakpoints,
  breakpointNumbers,
  borders,
  opacity,
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: darkColorTokens,
  shadows: darkShadows,
  ...sharedTokens,
};

export const lightTheme: Theme = {
  mode: "light",
  colors: lightColorTokens,
  shadows: lightShadows,
  ...sharedTokens,
};

export const themes: Record<ThemeMode, Theme> = {
  dark: darkTheme,
  light: lightTheme,
};
