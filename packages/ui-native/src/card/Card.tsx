import * as React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { radius, spacing } from "@kaiwen/tokens";
import { useTheme } from "../theme/useTheme.js";
import { Text } from "../typography/Text.js";

export interface NativeCardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
  style?: ViewStyle;
}

export const CardRoot = React.forwardRef<View, NativeCardProps>(
  ({ variant = "default", style, children, ...props }, ref) => {
    const { themeObject } = useTheme();

    const baseStyle: ViewStyle = {
      borderRadius: parseFloat(radius.lg),
      padding: parseFloat(spacing[6]),
      backgroundColor:
        variant === "elevated"
          ? themeObject.colors.surface.elevated
          : variant === "outlined"
            ? "transparent"
            : themeObject.colors.surface.primary,
      borderWidth: 1,
      borderColor:
        variant === "outlined"
          ? themeObject.colors.border.default
          : themeObject.colors.border.subtle,
    };

    return (
      <View ref={ref} style={[baseStyle, style]} {...props}>
        {children}
      </View>
    );
  },
);

CardRoot.displayName = "Card";

export interface NativeCardHeaderProps extends ViewProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<NativeCardHeaderProps> = ({
  title,
  subtitle,
  action,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ gap: 4 }}>
        {title && <Text variant="title">{title}</Text>}
        {subtitle && (
          <Text variant="caption" color="secondary">
            {subtitle}
          </Text>
        )}
        {children}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
};

export const CardBody: React.FC<ViewProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<ViewProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          marginTop: 16,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
