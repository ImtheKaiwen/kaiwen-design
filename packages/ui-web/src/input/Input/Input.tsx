import * as React from "react";
import { cn, generateId } from "@kaiwen/utilities";
import { radius as radiusTokens } from "@kaiwen/tokens";
import { Spinner } from "../../feedback/Spinner/Spinner.js";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: string | boolean;
  success?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeConfig: Record<
  InputSize,
  { height: string; fontSize: string; paddingX: string }
> = {
  sm: { height: "32px", fontSize: "13px", paddingX: "10px" },
  md: { height: "40px", fontSize: "14px", paddingX: "12px" },
  lg: { height: "48px", fontSize: "16px", paddingX: "16px" },
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      label,
      helperText,
      error,
      success = false,
      startIcon,
      endIcon,
      loading = false,
      fullWidth = false,
      disabled = false,
      required = false,
      id,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const inputId = React.useMemo(() => id || generateId("kaiwen-input"), [id]);
    const helperId = `${inputId}-helper`;
    const isError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    const currentSize = sizeConfig[size] || sizeConfig.md;

    const borderColor = isError
      ? "var(--kaiwen-color-status-error, #EF4444)"
      : success
        ? "var(--kaiwen-color-status-success, #22C55E)"
        : "var(--kaiwen-color-border-default, #27272A)";

    return (
      <div
        className={cn("kaiwen-input-wrapper", fullWidth && "kaiwen-full-width")}
        style={{
          display: fullWidth ? "flex" : "inline-flex",
          flexDirection: "column",
          gap: "6px",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: isError
                ? "var(--kaiwen-color-status-error, #EF4444)"
                : "var(--kaiwen-color-text-secondary, #A1A1AA)",
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {label}
            {required && (
              <span
                style={{
                  color: "var(--kaiwen-color-status-error, #EF4444)",
                  marginLeft: "4px",
                }}
              >
                *
              </span>
            )}
          </label>
        )}

        <div
          className={cn(
            "kaiwen-input-container",
            isError && "kaiwen-input-error",
            disabled && "kaiwen-input-disabled",
          )}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: currentSize.height,
            backgroundColor: "var(--kaiwen-color-surface-secondary, #18181B)",
            border: `1px solid ${borderColor}`,
            borderRadius: radiusTokens.md,
            paddingLeft: startIcon ? "36px" : currentSize.paddingX,
            paddingRight: endIcon || loading ? "36px" : currentSize.paddingX,
            transition:
              "var(--kaiwen-transition-fast, all 120ms cubic-bezier(0.2, 0, 0, 1))",
            opacity: disabled ? 0.45 : 1,
            ...style,
          }}
        >
          {startIcon && (
            <span
              style={{
                position: "absolute",
                left: "12px",
                display: "flex",
                alignItems: "center",
                color: "var(--kaiwen-color-text-muted, #71717A)",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              {startIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={isError}
            aria-describedby={helperText || errorMessage ? helperId : undefined}
            aria-required={required}
            className={cn("kaiwen-input", className)}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--kaiwen-color-text-primary, #FFFFFF)",
              fontSize: currentSize.fontSize,
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
            {...props}
          />

          {(endIcon || loading) && (
            <span
              style={{
                position: "absolute",
                right: "12px",
                display: "flex",
                alignItems: "center",
                color: "var(--kaiwen-color-text-muted, #71717A)",
              }}
            >
              {loading ? <Spinner size={16} /> : endIcon}
            </span>
          )}
        </div>

        {(errorMessage || helperText) && (
          <span
            id={helperId}
            style={{
              fontSize: "12px",
              color: isError
                ? "var(--kaiwen-color-status-error, #EF4444)"
                : "var(--kaiwen-color-text-muted, #71717A)",
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {errorMessage || helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
