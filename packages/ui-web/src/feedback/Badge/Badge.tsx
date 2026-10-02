import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { radius } from "@kaiwen/tokens";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "error"
  | "info";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    backgroundColor: "var(--kaiwen-color-surface-secondary, #18181B)",
    color: "var(--kaiwen-color-text-primary, #FFFFFF)",
    border: "1px solid var(--kaiwen-color-border-default, #27272A)",
  },
  secondary: {
    backgroundColor: "var(--kaiwen-color-surface-tertiary, #202023)",
    color: "var(--kaiwen-color-text-secondary, #A1A1AA)",
    border: "1px solid transparent",
  },
  outline: {
    backgroundColor: "transparent",
    color: "var(--kaiwen-color-text-secondary, #A1A1AA)",
    border: "1px solid var(--kaiwen-color-border-default, #27272A)",
  },
  success: {
    backgroundColor:
      "var(--kaiwen-color-status-success-subtle, rgba(34, 197, 94, 0.15))",
    color: "var(--kaiwen-color-status-success, #22C55E)",
    border: "1px solid rgba(34, 197, 94, 0.25)",
  },
  warning: {
    backgroundColor:
      "var(--kaiwen-color-status-warning-subtle, rgba(245, 158, 11, 0.15))",
    color: "var(--kaiwen-color-status-warning, #F59E0B)",
    border: "1px solid rgba(245, 158, 11, 0.25)",
  },
  error: {
    backgroundColor:
      "var(--kaiwen-color-status-error-subtle, rgba(239, 68, 68, 0.15))",
    color: "var(--kaiwen-color-status-error, #EF4444)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
  },
  info: {
    backgroundColor:
      "var(--kaiwen-color-status-info-subtle, rgba(59, 130, 246, 0.15))",
    color: "var(--kaiwen-color-status-info, #3B82F6)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
  },
};

const dotColors: Record<BadgeVariant, string> = {
  default: "var(--kaiwen-color-text-primary, #FFFFFF)",
  secondary: "var(--kaiwen-color-text-secondary, #A1A1AA)",
  outline: "var(--kaiwen-color-text-secondary, #A1A1AA)",
  success: "var(--kaiwen-color-status-success, #22C55E)",
  warning: "var(--kaiwen-color-status-warning, #F59E0B)",
  error: "var(--kaiwen-color-status-error, #EF4444)",
  info: "var(--kaiwen-color-status-info, #3B82F6)",
};

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: {
    padding: "2px 8px",
    fontSize: "11px",
    lineHeight: "14px",
  },
  md: {
    padding: "3px 10px",
    fontSize: "12px",
    lineHeight: "16px",
  },
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={cn("kaiwen-badge", `kaiwen-badge-${variant}`, className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: 500,
          fontFamily: "var(--kaiwen-font-sans, sans-serif)",
          borderRadius: radius.full,
          userSelect: "none",
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        {...props}
      >
        {dot && (
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: dotColors[variant],
              display: "inline-block",
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
