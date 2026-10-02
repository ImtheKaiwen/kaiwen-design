/**
 * Kaiwen Spacing Tokens
 * Consistent 4px-based geometric progression.
 */

export const spacing = {
  0: "0px",
  1: "2px",
  2: "4px",
  3: "6px",
  4: "8px",
  5: "10px",
  6: "12px",
  8: "16px",
  10: "20px",
  12: "24px",
  16: "32px",
  20: "40px",
  24: "48px",
  32: "64px",
  40: "80px",
  48: "96px",

  // Semantic aliases
  none: "0px",
  "3xs": "2px",
  "2xs": "4px",
  xs: "6px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
} as const;

export type SpacingKey = keyof typeof spacing;
