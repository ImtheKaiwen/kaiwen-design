import * as React from "react";
import { cn } from "@kaiwen/utilities";
import {
  typographyPresets,
  type TypographyPresetKey,
  type TypographyPreset,
  fontWeights,
} from "@kaiwen/tokens";

export type TextVariant = TypographyPresetKey;
export type TextColor =
  | "primary"
  | "secondary"
  | "muted"
  | "subtle"
  | "inverse"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "inherit";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TextVariant;
  color?: TextColor;
  weight?: keyof typeof fontWeights;
  align?: React.CSSProperties["textAlign"];
  truncate?: boolean;
  children?: React.ReactNode;
}

const defaultElementMap: Record<TextVariant, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  title: "h4",
  body: "p",
  bodySmall: "p",
  label: "label",
  caption: "span",
  mono: "code",
};

const colorMap: Record<TextColor, string> = {
  primary: "var(--kaiwen-color-text-primary, #FFFFFF)",
  secondary: "var(--kaiwen-color-text-secondary, #A1A1AA)",
  muted: "var(--kaiwen-color-text-muted, #71717A)",
  subtle: "var(--kaiwen-color-text-subtle, #52525B)",
  inverse: "var(--kaiwen-color-text-inverse, #000000)",
  success: "var(--kaiwen-color-status-success, #22C55E)",
  warning: "var(--kaiwen-color-status-warning, #F59E0B)",
  error: "var(--kaiwen-color-status-error, #EF4444)",
  info: "var(--kaiwen-color-status-info, #3B82F6)",
  inherit: "inherit",
};

const fallbackPreset: TypographyPreset = {
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "1.5",
  letterSpacing: "0",
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as,
      variant = "body",
      color = "primary",
      weight,
      align,
      truncate = false,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = as || defaultElementMap[variant] || "span";
    const preset =
      typographyPresets[variant] ?? typographyPresets.body ?? fallbackPreset;

    const truncateStyles: React.CSSProperties = truncate
      ? {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }
      : {};

    const textStyles: React.CSSProperties = {
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      fontWeight: weight ? fontWeights[weight] : preset.fontWeight,
      lineHeight: preset.lineHeight,
      letterSpacing: preset.letterSpacing,
      color: colorMap[color],
      textAlign: align,
      margin: 0,
      ...truncateStyles,
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={cn("kaiwen-text", `kaiwen-text-${variant}`, className)}
        style={textStyles}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
