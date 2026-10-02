import * as React from "react";
import { cn } from "@kaiwen/utilities";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  showValue?: boolean;
  color?: string;
}

const progressHeights = {
  sm: "4px",
  md: "8px",
  lg: "12px",
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      size = "md",
      label,
      showValue = false,
      color = "var(--kw-color-interactive-primary)",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        className={cn("kw-progress-wrapper", className)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--kw-space-1-5)",
          width: "100%",
          ...style,
        }}
        {...props}
      >
        {(label || showValue) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "var(--kw-font-size-xs)",
              color: "var(--kw-color-text-secondary)",
              fontWeight: "var(--kw-font-weight-medium)",
            }}
          >
            {label && <span>{label}</span>}
            {showValue && !indeterminate && (
              <span>{Math.round(percentage)}%</span>
            )}
          </div>
        )}

        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
          style={{
            position: "relative",
            width: "100%",
            height: progressHeights[size],
            backgroundColor: "var(--kw-color-bg-subtle)",
            borderRadius: "var(--kw-radius-full)",
            overflow: "hidden",
          }}
        >
          {indeterminate ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "40%",
                backgroundColor: color,
                borderRadius: "var(--kw-radius-full)",
                animation:
                  "kwIndeterminate 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite",
              }}
            />
          ) : (
            <div
              style={{
                width: `${percentage}%`,
                height: "100%",
                backgroundColor: color,
                borderRadius: "var(--kw-radius-full)",
                transition:
                  "width var(--kw-motion-duration-normal) var(--kw-motion-ease-out)",
              }}
            />
          )}
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";

export interface CircularProgressProps extends React.SVGAttributes<SVGSVGElement> {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  indeterminate?: boolean;
  showValue?: boolean;
  color?: string;
  trackColor?: string;
}

export const CircularProgress = React.forwardRef<
  SVGSVGElement,
  CircularProgressProps
>(
  (
    {
      value = 0,
      max = 100,
      size = 48,
      strokeWidth = 4,
      indeterminate = false,
      showValue = false,
      color = "var(--kw-color-interactive-primary)",
      trackColor = "var(--kw-color-bg-subtle)",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div
        className={cn("kw-circular-progress-wrapper", className)}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
        }}
      >
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            transform: indeterminate ? undefined : "rotate(-90deg)",
            animation: indeterminate
              ? "kwSpin 1.4s linear infinite"
              : undefined,
            ...style,
          }}
          {...props}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
            strokeLinecap="round"
            style={{
              transition: indeterminate
                ? undefined
                : "stroke-dashoffset var(--kw-motion-duration-normal) var(--kw-motion-ease-out)",
            }}
          />
        </svg>

        {showValue && !indeterminate && (
          <span
            style={{
              position: "absolute",
              fontSize: `${Math.round(size * 0.25)}px`,
              fontWeight: "var(--kw-font-weight-semibold)",
              color: "var(--kw-color-text-primary)",
            }}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  },
);

CircularProgress.displayName = "CircularProgress";
