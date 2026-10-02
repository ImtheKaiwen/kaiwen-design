import * as React from "react";
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";
import {
  typographyPresets,
  type TypographyPresetKey,
  fontWeights,
} from "@kaiwen/tokens";
import { useTheme } from "../theme/useTheme.js";

export type NativeTextVariant = TypographyPresetKey;
export type NativeTextColor =
  | "primary"
  | "secondary"
  | "muted"
  | "subtle"
  | "inverse"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface NativeTextProps extends RNTextProps {
  variant?: NativeTextVariant;
  color?: NativeTextColor;
  weight?: keyof typeof fontWeights;
  align?: TextStyle["textAlign"];
  children?: React.ReactNode;
}

const fallbackPreset = {
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "1.5",
  letterSpacing: "0",
};

export const Text = React.forwardRef<RNText, NativeTextProps>(
  (
    {
      variant = "body",
      color = "primary",
      weight,
      align,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const { themeObject } = useTheme();
    const preset =
      typographyPresets[variant] ?? typographyPresets.body ?? fallbackPreset;

    const colorValue =
      color === "primary"
        ? themeObject.colors.text.primary
        : color === "secondary"
          ? themeObject.colors.text.secondary
          : color === "muted"
            ? themeObject.colors.text.muted
            : color === "subtle"
              ? themeObject.colors.text.subtle
              : color === "inverse"
                ? themeObject.colors.text.inverse
                : color === "success"
                  ? themeObject.colors.status.success
                  : color === "warning"
                    ? themeObject.colors.status.warning
                    : color === "error"
                      ? themeObject.colors.status.error
                      : themeObject.colors.status.info;

    const isHeading =
      variant === "display" ||
      variant === "h1" ||
      variant === "h2" ||
      variant === "h3";

    const textStyle: TextStyle = {
      fontSize: parseFloat(preset.fontSize),
      fontWeight: (weight
        ? fontWeights[weight]
        : preset.fontWeight) as TextStyle["fontWeight"],
      color: colorValue,
      textAlign: align,
    };

    return (
      <RNText
        ref={ref}
        accessibilityRole={isHeading ? "header" : "text"}
        style={[textStyle, style]}
        {...props}
      >
        {children}
      </RNText>
    );
  },
);

Text.displayName = "Text";
