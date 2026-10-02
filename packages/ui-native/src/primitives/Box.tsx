import * as React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import type { SpacingKey } from "@kaiwen/tokens";
import { getSpacingValue } from "./spacingHelper.js";

export interface NativeBoxProps extends ViewProps {
  p?: SpacingKey;
  px?: SpacingKey;
  py?: SpacingKey;
  pt?: SpacingKey;
  pb?: SpacingKey;
  pl?: SpacingKey;
  pr?: SpacingKey;
  m?: SpacingKey;
  mx?: SpacingKey;
  my?: SpacingKey;
  mt?: SpacingKey;
  mb?: SpacingKey;
  ml?: SpacingKey;
  mr?: SpacingKey;
  style?: ViewStyle | ViewStyle[];
}

export const Box = React.forwardRef<View, NativeBoxProps>(
  (
    {
      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const spacingStyle: ViewStyle = {
      padding: getSpacingValue(p),
      paddingHorizontal: getSpacingValue(px),
      paddingVertical: getSpacingValue(py),
      paddingTop: getSpacingValue(pt),
      paddingBottom: getSpacingValue(pb),
      paddingLeft: getSpacingValue(pl),
      paddingRight: getSpacingValue(pr),
      margin: getSpacingValue(m),
      marginHorizontal: getSpacingValue(mx),
      marginVertical: getSpacingValue(my),
      marginTop: getSpacingValue(mt),
      marginBottom: getSpacingValue(mb),
      marginLeft: getSpacingValue(ml),
      marginRight: getSpacingValue(mr),
    };

    return (
      <View ref={ref} style={[spacingStyle, style]} {...props}>
        {children}
      </View>
    );
  },
);

Box.displayName = "Box";
