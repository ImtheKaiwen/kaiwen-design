import * as React from "react";
import { View, type ViewStyle } from "react-native";
import type { SpacingKey } from "@kaiwen/tokens";
import { Box, type NativeBoxProps } from "./Box.js";
import { getSpacingValue } from "./spacingHelper.js";

export interface NativeStackProps extends NativeBoxProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  gap?: SpacingKey;
  align?: ViewStyle["alignItems"];
  justify?: ViewStyle["justifyContent"];
  wrap?: ViewStyle["flexWrap"];
}

export const Stack = React.forwardRef<View, NativeStackProps>(
  (
    {
      direction = "column",
      gap = "md",
      align,
      justify,
      wrap = "nowrap",
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const stackStyle: ViewStyle = {
      flexDirection: direction,
      gap: getSpacingValue(gap),
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap,
    };

    const combinedStyle = style
      ? Array.isArray(style)
        ? [stackStyle, ...style]
        : [stackStyle, style]
      : stackStyle;

    return (
      <Box ref={ref} style={combinedStyle} {...props}>
        {children}
      </Box>
    );
  },
);

Stack.displayName = "Stack";

export const HStack = React.forwardRef<
  View,
  Omit<NativeStackProps, "direction">
>(({ align = "center", ...props }, ref) => {
  return <Stack ref={ref} direction="row" align={align} {...props} />;
});

HStack.displayName = "HStack";

export const VStack = React.forwardRef<
  View,
  Omit<NativeStackProps, "direction">
>((props, ref) => {
  return <Stack ref={ref} direction="column" {...props} />;
});

VStack.displayName = "VStack";

export const Flex = React.forwardRef<View, NativeStackProps>(
  ({ direction = "row", ...props }, ref) => {
    return <Stack ref={ref} direction={direction} {...props} />;
  },
);

Flex.displayName = "Flex";
