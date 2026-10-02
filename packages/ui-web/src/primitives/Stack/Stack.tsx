import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { spacing, type SpacingKey } from "@kaiwen/tokens";
import { Box, type BoxProps } from "../Box/Box.js";

export interface StackProps extends BoxProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  gap?: SpacingKey;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: React.CSSProperties["flexWrap"];
  inline?: boolean;
}

export const Stack = React.forwardRef<HTMLElement, StackProps>(
  (
    {
      direction = "column",
      gap = "md",
      align,
      justify,
      wrap = "nowrap",
      inline = false,
      style,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const stackStyles: React.CSSProperties = {
      display: inline ? "inline-flex" : "flex",
      flexDirection: direction,
      gap: gap ? spacing[gap] : undefined,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap,
      ...style,
    };

    return (
      <Box
        ref={ref}
        className={cn("kaiwen-stack", className)}
        style={stackStyles}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

Stack.displayName = "Stack";

export const HStack = React.forwardRef<
  HTMLElement,
  Omit<StackProps, "direction">
>(({ align = "center", ...props }, ref) => {
  return <Stack ref={ref} direction="row" align={align} {...props} />;
});

HStack.displayName = "HStack";

export const VStack = React.forwardRef<
  HTMLElement,
  Omit<StackProps, "direction">
>((props, ref) => {
  return <Stack ref={ref} direction="column" {...props} />;
});

VStack.displayName = "VStack";
