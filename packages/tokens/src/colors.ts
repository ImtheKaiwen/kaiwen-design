/**
 * Kaiwen Primitive & Semantic Color Tokens
 *
 * Designed with a refined, quiet, high-contrast palette:
 * Black, White, Neutral Grays, and targeted Status tones.
 */

export const primitiveColors = {
  black: "#000000",
  white: "#FFFFFF",
  gray: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    850: "#202023",
    900: "#18181B",
    925: "#141416",
    950: "#0F0F11",
    975: "#0A0A0C",
  },
  status: {
    success: "#22C55E",
    successSubtle: "rgba(34, 197, 94, 0.15)",
    warning: "#F59E0B",
    warningSubtle: "rgba(245, 158, 11, 0.15)",
    error: "#EF4444",
    errorSubtle: "rgba(239, 68, 68, 0.15)",
    info: "#3B82F6",
    infoSubtle: "rgba(59, 130, 246, 0.15)",
  },
} as const;

export interface ColorTokens {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    hover: string;
    active: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    subtle: string;
    inverse: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };
  status: {
    success: string;
    successSubtle: string;
    warning: string;
    warningSubtle: string;
    error: string;
    errorSubtle: string;
    info: string;
    infoSubtle: string;
  };
  interactive: {
    primaryBg: string;
    primaryText: string;
    primaryHover: string;
    secondaryBg: string;
    secondaryText: string;
    secondaryHover: string;
    ghostHover: string;
    dangerBg: string;
    dangerText: string;
    dangerHover: string;
    focusRing: string;
    disabledBg: string;
    disabledText: string;
  };
}

export const darkColorTokens: ColorTokens = {
  background: {
    primary: "#000000",
    secondary: "#0A0A0C",
    tertiary: "#141416",
  },
  surface: {
    primary: "#111113",
    secondary: "#18181B",
    tertiary: "#202023",
    elevated: "#18181B",
    hover: "#1F1F23",
    active: "#27272A",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#A1A1AA",
    muted: "#71717A",
    subtle: "#52525B",
    inverse: "#000000",
  },
  border: {
    default: "#27272A",
    subtle: "#18181B",
    strong: "#3F3F46",
    focus: "#FFFFFF",
  },
  status: {
    success: "#22C55E",
    successSubtle: "rgba(34, 197, 94, 0.15)",
    warning: "#F59E0B",
    warningSubtle: "rgba(245, 158, 11, 0.15)",
    error: "#EF4444",
    errorSubtle: "rgba(239, 68, 68, 0.15)",
    info: "#3B82F6",
    infoSubtle: "rgba(59, 130, 246, 0.15)",
  },
  interactive: {
    primaryBg: "#FFFFFF",
    primaryText: "#000000",
    primaryHover: "#E4E4E7",
    secondaryBg: "#18181B",
    secondaryText: "#FFFFFF",
    secondaryHover: "#27272A",
    ghostHover: "rgba(255, 255, 255, 0.08)",
    dangerBg: "#EF4444",
    dangerText: "#FFFFFF",
    dangerHover: "#DC2626",
    focusRing: "#FFFFFF",
    disabledBg: "#18181B",
    disabledText: "#52525B",
  },
};

export const lightColorTokens: ColorTokens = {
  background: {
    primary: "#FFFFFF",
    secondary: "#FAFAFA",
    tertiary: "#F4F4F5",
  },
  surface: {
    primary: "#FFFFFF",
    secondary: "#F4F4F5",
    tertiary: "#E4E4E7",
    elevated: "#FFFFFF",
    hover: "#F4F4F5",
    active: "#E4E4E7",
  },
  text: {
    primary: "#09090B",
    secondary: "#52525B",
    muted: "#71717A",
    subtle: "#A1A1AA",
    inverse: "#FFFFFF",
  },
  border: {
    default: "#E4E4E7",
    subtle: "#F4F4F5",
    strong: "#D4D4D8",
    focus: "#09090B",
  },
  status: {
    success: "#16A34A",
    successSubtle: "rgba(22, 163, 74, 0.12)",
    warning: "#D97706",
    warningSubtle: "rgba(217, 119, 6, 0.12)",
    error: "#DC2626",
    errorSubtle: "rgba(220, 38, 38, 0.12)",
    info: "#2563EB",
    infoSubtle: "rgba(37, 99, 235, 0.12)",
  },
  interactive: {
    primaryBg: "#09090B",
    primaryText: "#FFFFFF",
    primaryHover: "#27272A",
    secondaryBg: "#F4F4F5",
    secondaryText: "#09090B",
    secondaryHover: "#E4E4E7",
    ghostHover: "rgba(0, 0, 0, 0.06)",
    dangerBg: "#DC2626",
    dangerText: "#FFFFFF",
    dangerHover: "#B91C1C",
    focusRing: "#09090B",
    disabledBg: "#F4F4F5",
    disabledText: "#A1A1AA",
  },
};
