import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { radius as radiusTokens, type RadiusKey } from "@kaiwen/tokens";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  radius?: RadiusKey;
  circle?: boolean;
}

export const SkeletonPrimitive = React.forwardRef<
  HTMLDivElement,
  SkeletonProps
>(
  (
    {
      width,
      height,
      radius = "md",
      circle = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const borderRadius = circle
      ? "50%"
      : radiusTokens[radius] || radiusTokens.md;

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("kaiwen-skeleton", className)}
        style={{
          width: width !== undefined ? width : "100%",
          height: height !== undefined ? height : "1rem",
          borderRadius,
          display: "block",
          flexShrink: 0,
          ...style,
        }}
        {...props}
      />
    );
  },
);

SkeletonPrimitive.displayName = "Skeleton";

export interface SkeletonTextProps extends Omit<SkeletonProps, "circle"> {
  lines?: number;
  gap?: number | string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  gap = "8px",
  height = "0.875rem",
  radius = "sm",
  style,
  ...props
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        width: "100%",
        ...style,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: lines }).map((_, index) => {
        // Subtle realistic width variation for last line
        const isLast = index === lines - 1;
        const width = isLast && lines > 1 ? "60%" : "100%";
        return (
          <SkeletonPrimitive
            key={index}
            width={width}
            height={height}
            radius={radius}
            {...props}
          />
        );
      })}
    </div>
  );
};

export interface SkeletonCircleProps extends Omit<
  SkeletonProps,
  "circle" | "radius"
> {
  size?: number | string;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
  ...props
}) => {
  return <SkeletonPrimitive width={size} height={size} circle {...props} />;
};

export const SkeletonRect: React.FC<SkeletonProps> = (props) => {
  return <SkeletonPrimitive {...props} />;
};

export const SkeletonCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={cn("kaiwen-skeleton-card", className)}
      style={{
        padding: "20px",
        borderRadius: radiusTokens.lg,
        border: "1px solid var(--kaiwen-color-border-subtle, #18181B)",
        backgroundColor: "var(--kaiwen-color-surface-primary, #111113)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <SkeletonCircle size={40} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            flex: 1,
          }}
        >
          <SkeletonPrimitive width="40%" height="0.875rem" radius="sm" />
          <SkeletonPrimitive width="25%" height="0.75rem" radius="sm" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

export const Skeleton = Object.assign(SkeletonPrimitive, {
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Rect: SkeletonRect,
  Card: SkeletonCard,
});
