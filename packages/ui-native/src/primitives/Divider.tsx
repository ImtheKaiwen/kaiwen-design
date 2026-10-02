import * as React from "react";
import { View, type ViewStyle } from "react-native";
import { useTheme } from "../theme/useTheme.js";

export interface NativeDividerProps {
  orientation?: "horizontal" | "vertical";
  style?: ViewStyle;
}

export const Divider: React.FC<NativeDividerProps> = ({
  orientation = "horizontal",
  style,
}) => {
  const { themeObject } = useTheme();
  const isHorizontal = orientation === "horizontal";

  const dividerStyle: ViewStyle = {
    backgroundColor: themeObject.colors.border.subtle,
    ...(isHorizontal
      ? { width: "100%", height: 1, marginVertical: 8 }
      : { width: 1, height: "100%", marginHorizontal: 8 }),
    ...style,
  };

  return <View style={dividerStyle} />;
};

Divider.displayName = "Divider";
