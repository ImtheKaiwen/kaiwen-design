/**
 * Kaiwen z-Index Tokens
 * Strict centralized layering architecture.
 */

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  max: 9999,
} as const;

export type ZIndexKey = keyof typeof zIndex;
