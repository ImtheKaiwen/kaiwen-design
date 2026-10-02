/**
 * Kaiwen Typography Tokens
 * Clean, high-legibility typographic hierarchy.
 */

export const fontFamilies = {
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const;

export const fontSizes = {
  "2xs": "11px",
  xs: "12px",
  sm: "13px",
  md: "14px",
  lg: "16px",
  xl: "18px",
  "2xl": "20px",
  "3xl": "24px",
  "4xl": "30px",
  "5xl": "36px",
  "6xl": "48px",
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeights = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
} as const;

export const letterSpacings = {
  tighter: "-0.03em",
  tight: "-0.02em",
  snug: "-0.01em",
  normal: "0em",
  wide: "0.015em",
  wider: "0.03em",
} as const;

export interface TypographyPreset {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export const typographyPresets: Record<string, TypographyPreset> = {
  display: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes["6xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tighter,
  },
  h1: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes["4xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  h2: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes["3xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.tight,
  },
  h3: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.snug,
  },
  title: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.snug,
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  label: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  caption: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  mono: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
};

export type TypographyPresetKey = keyof typeof typographyPresets;
