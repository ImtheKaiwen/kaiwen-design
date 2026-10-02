import * as React from "react";
import { cn } from "@kaiwen/utilities";

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | number;
  color?: string;
  label?: string;
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 28,
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "currentColor",
  label = "Loading...",
  className,
  style,
  ...props
}) => {
  const pixelSize = typeof size === "number" ? size : sizeMap[size] || 20;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("kaiwen-spinner", className)}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        ...style,
      }}
      role="status"
      aria-label={label}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2.5"
        strokeOpacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

Spinner.displayName = "Spinner";
