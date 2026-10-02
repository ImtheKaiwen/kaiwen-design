import * as React from "react";
import { cn } from "@kaiwen/utilities";

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Divider = React.forwardRef<HTMLElement, DividerProps>(
  (
    {
      orientation = "horizontal",
      decorative = true,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={cn("kaiwen-divider", className)}
        style={{
          border: "none",
          backgroundColor: "var(--kaiwen-color-border-subtle, #18181B)",
          flexShrink: 0,
          ...(isHorizontal
            ? { width: "100%", height: "1px", margin: "8px 0" }
            : { width: "1px", height: "100%", margin: "0 8px" }),
          ...style,
        }}
        {...props}
      />
    );
  },
);

Divider.displayName = "Divider";
