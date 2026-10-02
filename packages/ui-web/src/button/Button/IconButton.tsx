import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { Button, type ButtonProps } from "./Button.js";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "startIcon" | "endIcon" | "fullWidth"
> {
  "aria-label": string;
  icon?: React.ReactNode;
}

const iconSizeMap = {
  sm: "32px",
  md: "40px",
  lg: "48px",
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      size = "md",
      icon,
      "aria-label": ariaLabel,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const dimension = iconSizeMap[size];

    return (
      <Button
        ref={ref}
        size={size}
        aria-label={ariaLabel}
        className={cn("kaiwen-icon-button", className)}
        style={{
          width: dimension,
          height: dimension,
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
        {...props}
      >
        {icon || children}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
