import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { breakpoints } from "@kaiwen/tokens";
import { Box, type BoxProps } from "../Box/Box.js";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends BoxProps {
  size?: ContainerSize;
  center?: boolean;
}

const sizeMap: Record<ContainerSize, string> = {
  sm: breakpoints.sm,
  md: breakpoints.md,
  lg: breakpoints.lg,
  xl: breakpoints.xl,
  "2xl": breakpoints["2xl"],
  full: "100%",
};

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  (
    {
      size = "lg",
      center = true,
      px = "md",
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const maxWidth = sizeMap[size];

    return (
      <Box
        ref={ref}
        px={px}
        className={cn("kaiwen-container", className)}
        style={{
          width: "100%",
          maxWidth,
          ...(center ? { marginLeft: "auto", marginRight: "auto" } : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

Container.displayName = "Container";
