import * as React from "react";
import {
  Pressable,
  ActivityIndicator,
  View,
  type PressableProps,
  type ViewStyle,
} from "react-native";
import { radius } from "@kaiwen/tokens";
import { useTheme } from "../theme/useTheme.js";
import { Text } from "../typography/Text.js";

export type NativeButtonVariant =
  "primary" | "secondary" | "ghost" | "danger" | "outline";
export type NativeButtonSize = "sm" | "md" | "lg";

export interface NativeButtonProps extends Omit<PressableProps, "style"> {
  variant?: NativeButtonVariant;
  size?: NativeButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const sizeConfig = {
  sm: {
    height: 32,
    paddingHorizontal: 12,
    fontSize: 13,
    radius: parseFloat(radius.md),
  },
  md: {
    height: 40,
    paddingHorizontal: 16,
    fontSize: 14,
    radius: parseFloat(radius.md),
  },
  lg: {
    height: 48,
    paddingHorizontal: 24,
    fontSize: 16,
    radius: parseFloat(radius.lg),
  },
};

export const Button = React.forwardRef<View, NativeButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      startIcon,
      endIcon,
      children,
      style,
      onPress,
      ...props
    },
    ref,
  ) => {
    const { themeObject } = useTheme();
    const isDisabled = disabled || loading;
    const currentSize = sizeConfig[size] || sizeConfig.md;

    let bg = themeObject.colors.interactive.primaryBg;
    let textColor = themeObject.colors.interactive.primaryText;
    let borderColor = "transparent";

    if (variant === "secondary") {
      bg = themeObject.colors.interactive.secondaryBg;
      textColor = themeObject.colors.interactive.secondaryText;
      borderColor = themeObject.colors.border.default;
    } else if (variant === "ghost") {
      bg = "transparent";
      textColor = themeObject.colors.text.primary;
    } else if (variant === "outline") {
      bg = "transparent";
      textColor = themeObject.colors.text.primary;
      borderColor = themeObject.colors.border.strong;
    } else if (variant === "danger") {
      bg = themeObject.colors.interactive.dangerBg;
      textColor = themeObject.colors.interactive.dangerText;
    }

    const baseContainerStyle: ViewStyle = {
      height: currentSize.height,
      paddingHorizontal: currentSize.paddingHorizontal,
      borderRadius: currentSize.radius,
      backgroundColor: bg,
      borderWidth: borderColor !== "transparent" ? 1 : 0,
      borderColor,
      opacity: disabled ? 0.45 : 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      alignSelf: fullWidth ? "stretch" : "flex-start",
      ...style,
    };

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        onPress={isDisabled ? undefined : onPress}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={({ pressed }) => [
          baseContainerStyle,
          pressed && !isDisabled ? { opacity: 0.8 } : undefined,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {startIcon}
            {typeof children === "string" ? (
              <Text
                style={{
                  color: textColor,
                  fontSize: currentSize.fontSize,
                  fontWeight: "500",
                }}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {endIcon}
          </View>
        )}
      </Pressable>
    );
  },
);

Button.displayName = "Button";

export interface NativeIconButtonProps extends Omit<
  NativeButtonProps,
  "startIcon" | "endIcon" | "fullWidth"
> {
  accessibilityLabel: string;
  icon?: React.ReactNode;
}

export const IconButton = React.forwardRef<View, NativeIconButtonProps>(
  ({ size = "md", icon, children, style, ...props }, ref) => {
    const currentSize = sizeConfig[size] || sizeConfig.md;

    return (
      <Button
        ref={ref}
        size={size}
        style={{
          width: currentSize.height,
          paddingHorizontal: 0,
          ...style,
        }}
        {...props}
      >
        {icon || children}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
