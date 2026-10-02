/**
 * Kaiwen Motion Tokens
 * Fast, subtle, calm, and predictable transitions.
 */

export const duration = {
  instant: "0ms",
  fast: "120ms",
  normal: "180ms",
  slow: "280ms",
  skeleton: "1500ms",
} as const;

export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  linear: "linear",
} as const;

export const transition = {
  fast: `all ${duration.fast} ${easing.standard}`,
  normal: `all ${duration.normal} ${easing.standard}`,
  slow: `all ${duration.slow} ${easing.standard}`,
  colors: `color ${duration.normal} ${easing.standard}, background-color ${duration.normal} ${easing.standard}, border-color ${duration.normal} ${easing.standard}`,
  transform: `transform ${duration.normal} ${easing.spring}`,
  opacity: `opacity ${duration.fast} ${easing.standard}`,
} as const;

export type DurationKey = keyof typeof duration;
export type EasingKey = keyof typeof easing;
