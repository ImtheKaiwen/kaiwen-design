/**
 * Safe SSR and browser detection
 */
export const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";
export const isServer = !isBrowser;

let idCounter = 0;

/**
 * Generate a deterministic or fallback unique ID for accessible elements
 */
export function generateId(prefix = "kaiwen"): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
