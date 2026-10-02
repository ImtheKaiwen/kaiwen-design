/**
 * Kaiwen Primitive & Semantic Color Tokens
 *
 * Refined, OpenAI-inspired high-contrast palette:
 * Obsidian darks (#0D0D0D, #171717, #212121), crisp whites,
 * subtle neutral borders, and refined status accents.
 */

export const primitiveColors = {
  black: "#000000",
  white: "#FFFFFF",
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    150: "#ECECEC",
    200: "#E5E5E5",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#2F2F2F",
    850: "#262626",
    900: "#212121",
    925: "#1A1A1A",
    950: "#171717",
    975: "#0D0D0D",
  },
  status: {
    success: "#10A37F", // OpenAI iconic green
    successSubtle: "rgba(16, 163, 127, 0.15)",
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
    primary: "#0D0D0D",
    secondary: "#171717",
    tertiary: "#212121",
  },
  surface: {
    primary: "#171717",
    secondary: "#212121",
    tertiary: "#2A2A2A",
    elevated: "#212121",
    hover: "#2F2F2F",
    active: "#383838",
  },
  text: {
    primary: "#ECECEC",
    secondary: "#B4B4B4",
    muted: "#737373",
    subtle: "#525252",
    inverse: "#0D0D0D",
  },
  border: {
    default: "rgba(255, 255, 255, 0.1)",
    subtle: "rgba(255, 255, 255, 0.06)",
    strong: "rgba(255, 255, 255, 0.18)",
    focus: "#ECECEC",
  },
  status: {
    success: "#10A37F",
    successSubtle: "rgba(16, 163, 127, 0.15)",
    warning: "#F59E0B",
    warningSubtle: "rgba(245, 158, 11, 0.15)",
    error: "#EF4444",
    errorSubtle: "rgba(239, 68, 68, 0.15)",
    info: "#3B82F6",
    infoSubtle: "rgba(59, 130, 246, 0.15)",
  },
  interactive: {
    primaryBg: "#FFFFFF",
    primaryText: "#0D0D0D",
    primaryHover: "#E5E5E5",
    secondaryBg: "#212121",
    secondaryText: "#ECECEC",
    secondaryHover: "#2F2F2F",
    ghostHover: "rgba(255, 255, 255, 0.07)",
    dangerBg: "#DC2626",
    dangerText: "#FFFFFF",
    dangerHover: "#B91C1C",
    focusRing: "#FFFFFF",
    disabledBg: "#212121",
    disabledText: "#525252",
  },
};

export const lightColorTokens: ColorTokens = {
  background: {
    primary: "#F8F9FA",
    secondary: "#F1F3F5",
    tertiary: "#E9ECEF",
  },
  surface: {
    primary: "#FFFFFF",
    secondary: "#F8F9FA",
    tertiary: "#F1F3F5",
    elevated: "#FFFFFF",
    hover: "#F1F3F5",
    active: "#E9ECEF",
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    muted: "#64748B",
    subtle: "#94A3B8",
    inverse: "#FFFFFF",
  },
  border: {
    default: "rgba(0, 0, 0, 0.14)",
    subtle: "rgba(0, 0, 0, 0.08)",
    strong: "rgba(0, 0, 0, 0.24)",
    focus: "#0F172A",
  },
  status: {
    success: "#10A37F",
    successSubtle: "rgba(16, 163, 127, 0.12)",
    warning: "#D97706",
    warningSubtle: "rgba(217, 119, 6, 0.12)",
    error: "#DC2626",
    errorSubtle: "rgba(220, 38, 38, 0.12)",
    info: "#2563EB",
    infoSubtle: "rgba(37, 99, 235, 0.12)",
  },
  interactive: {
    primaryBg: "#0F172A",
    primaryText: "#FFFFFF",
    primaryHover: "#1E293B",
    secondaryBg: "#F1F3F5",
    secondaryText: "#0F172A",
    secondaryHover: "#E2E8F0",
    ghostHover: "rgba(0, 0, 0, 0.06)",
    dangerBg: "#DC2626",
    dangerText: "#FFFFFF",
    dangerHover: "#B91C1C",
    focusRing: "#0F172A",
    disabledBg: "#F1F3F5",
    disabledText: "#94A3B8",
  },
};
