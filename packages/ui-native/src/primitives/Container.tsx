import * as React from "react";
import { View, type ViewStyle } from "react-native";
import { Box, type NativeBoxProps } from "./Box.js";

export interface NativeContainerProps extends NativeBoxProps {
  maxWidth?: number;
  center?: boolean;
}

export const Container = React.forwardRef<View, NativeContainerProps>(
  (
    { maxWidth = 1024, center = true, px = "md", style, children, ...props },
    ref,
  ) => {
    const containerStyle: ViewStyle = {
      width: "100%",
      maxWidth,
      ...(center ? { alignSelf: "center" } : {}),
    };

    const combinedStyle = style
      ? Array.isArray(style)
        ? [containerStyle, ...style]
        : [containerStyle, style]
      : containerStyle;

    return (
      <Box ref={ref} px={px} style={combinedStyle} {...props}>
        {children}
      </Box>
    );
  },
);

Container.displayName = "Container";
