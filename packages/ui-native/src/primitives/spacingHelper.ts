import { spacing, type SpacingKey } from "@kaiwen/tokens";

export function getSpacingValue(key?: SpacingKey): number | undefined {
  if (key === undefined) return undefined;
  const val = spacing[key];
  if (!val) return undefined;
  return parseFloat(val);
}
