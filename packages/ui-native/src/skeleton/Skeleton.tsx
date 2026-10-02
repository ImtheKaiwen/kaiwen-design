import * as React from "react";
import { View, Animated, type ViewProps, type ViewStyle } from "react-native";
import { radius } from "@kaiwen/tokens";
import { useTheme } from "../theme/useTheme.js";

export interface NativeSkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
}

export const SkeletonPrimitive: React.FC<NativeSkeletonProps> = ({
  width = "100%",
  height = 16,
  circle = false,
  style,
  ...props
}) => {
  const { themeObject } = useTheme();
  const opacityAnim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacityAnim]);

  const baseStyle: ViewStyle = {
    width: width as any,
    height: height as any,
    borderRadius: circle ? 9999 : parseFloat(radius.md),
    backgroundColor: themeObject.colors.surface.secondary,
  };

  return (
    <Animated.View
      style={[baseStyle, { opacity: opacityAnim }, style as any]}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; gap?: number }> = ({
  lines = 3,
  gap = 8,
}) => {
  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPrimitive
          key={i}
          width={i === lines - 1 && lines > 1 ? "60%" : "100%"}
          height={14}
        />
      ))}
    </View>
  );
};

export const SkeletonCircle: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return <SkeletonPrimitive width={size} height={size} circle />;
};

export const SkeletonCard: React.FC = () => {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <SkeletonCircle size={40} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonPrimitive width="50%" height={14} />
          <SkeletonPrimitive width="30%" height={12} />
        </View>
      </View>
      <SkeletonText lines={3} />
    </View>
  );
};

export const Skeleton = Object.assign(SkeletonPrimitive, {
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Card: SkeletonCard,
});
