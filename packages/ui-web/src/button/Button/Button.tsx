import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { radius as radiusTokens } from "@kaiwen/tokens";
import { Spinner } from "../../feedback/Spinner/Spinner.js";

export type ButtonVariant =
  "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<
  ButtonVariant,
  { base: React.CSSProperties; hoverClass: string }
> = {
  primary: {
    base: {
      backgroundColor: "var(--kaiwen-color-interactive-primary-bg, #FFFFFF)",
      color: "var(--kaiwen-color-interactive-primary-text, #000000)",
      border: "1px solid transparent",
    },
    hoverClass: "kaiwen-btn-primary",
  },
  secondary: {
    base: {
      backgroundColor: "var(--kaiwen-color-interactive-secondary-bg, #18181B)",
      color: "var(--kaiwen-color-interactive-secondary-text, #FFFFFF)",
      border: "1px solid var(--kaiwen-color-border-default, #27272A)",
    },
    hoverClass: "kaiwen-btn-secondary",
  },
  ghost: {
    base: {
      backgroundColor: "transparent",
      color: "var(--kaiwen-color-text-primary, #FFFFFF)",
      border: "1px solid transparent",
    },
    hoverClass: "kaiwen-btn-ghost",
  },
  outline: {
    base: {
      backgroundColor: "transparent",
      color: "var(--kaiwen-color-text-primary, #FFFFFF)",
      border: "1px solid var(--kaiwen-color-border-strong, #3F3F46)",
    },
    hoverClass: "kaiwen-btn-outline",
  },
  danger: {
    base: {
      backgroundColor: "var(--kaiwen-color-interactive-danger-bg, #EF4444)",
      color: "var(--kaiwen-color-interactive-danger-text, #FFFFFF)",
      border: "1px solid transparent",
    },
    hoverClass: "kaiwen-btn-danger",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    height: "32px",
    padding: "0 12px",
    fontSize: "13px",
    borderRadius: radiusTokens.md,
    gap: "6px",
  },
  md: {
    height: "40px",
    padding: "0 16px",
    fontSize: "14px",
    borderRadius: radiusTokens.md,
    gap: "8px",
  },
  lg: {
    height: "48px",
    padding: "0 24px",
    fontSize: "16px",
    borderRadius: radiusTokens.lg,
    gap: "10px",
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      startIcon,
      endIcon,
      className,
      style,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const variantConfig = variantStyles[variant] || variantStyles.primary;
    const sizeConfig = sizeStyles[size] || sizeStyles.md;

    const baseStyles: React.CSSProperties = {
      position: "relative",
      display: fullWidth ? "flex" : "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: fullWidth ? "100%" : "auto",
      fontFamily: "var(--kaiwen-font-sans, sans-serif)",
      fontWeight: 500,
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition:
        "var(--kaiwen-transition-fast, all 120ms cubic-bezier(0.2, 0, 0, 1))",
      outline: "none",
      userSelect: "none",
      whiteSpace: "nowrap",
      ...variantConfig.base,
      ...sizeConfig,
      ...style,
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={cn(
          "kaiwen-button",
          variantConfig.hoverClass,
          `kaiwen-button-${size}`,
          loading && "kaiwen-button-loading",
          className,
        )}
        style={baseStyles}
        onClick={isDisabled ? undefined : onClick}
        {...props}
      >
        {/* Loading Overlay spinner without layout shift */}
        {loading && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "inherit",
              borderRadius: "inherit",
            }}
            aria-hidden="true"
          >
            <Spinner size={size === "sm" ? 14 : size === "md" ? 18 : 22} />
          </span>
        )}

        {/* Content container; hidden from view when loading to preserve exact layout */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: sizeConfig.gap,
            visibility: loading ? "hidden" : "visible",
          }}
        >
          {startIcon && <span aria-hidden="true">{startIcon}</span>}
          {children}
          {endIcon && <span aria-hidden="true">{endIcon}</span>}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";
