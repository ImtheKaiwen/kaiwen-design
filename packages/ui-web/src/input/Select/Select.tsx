import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { ChevronDownIcon } from "@kaiwen/icons";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  size?: SelectSize;
  fullWidth?: boolean;
}

const sizeConfig: Record<
  SelectSize,
  { height: string; fontSize: string; paddingX: string; radius: string }
> = {
  sm: {
    height: "32px",
    fontSize: "13px",
    paddingX: "10px",
    radius: "var(--kaiwen-radius-sm, 6px)",
  },
  md: {
    height: "40px",
    fontSize: "14px",
    paddingX: "12px",
    radius: "var(--kaiwen-radius-md, 8px)",
  },
  lg: {
    height: "48px",
    fontSize: "16px",
    paddingX: "16px",
    radius: "var(--kaiwen-radius-lg, 10px)",
  },
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      size = "md",
      fullWidth = true,
      disabled,
      required,
      id,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;
    const cfg = sizeConfig[size];

    return (
      <div
        className={cn(
          "kaiwen-select-container",
          hasError && "kaiwen-has-error",
          disabled && "kaiwen-is-disabled",
          className,
        )}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: hasError
                ? "var(--kw-color-error-text, #EF4444)"
                : "var(--kw-color-text-secondary, #B4B4B4)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {label}
            {required && (
              <span
                style={{ color: "var(--kw-color-error-text, #EF4444)" }}
                aria-hidden="true"
              >
                *
              </span>
            )}
          </label>
        )}

        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            style={{
              width: "100%",
              height: cfg.height,
              paddingLeft: cfg.paddingX,
              paddingRight: "36px",
              fontSize: cfg.fontSize,
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
              color: "var(--kw-color-text-primary, #ECECEC)",
              backgroundColor:
                "var(--kw-color-bg-subtle, var(--kaiwen-color-surface-secondary, #212121))",
              border: `1px solid ${
                hasError
                  ? "var(--kw-color-error-text, #EF4444)"
                  : "var(--kw-color-border-default, rgba(255, 255, 255, 0.12))"
              }`,
              borderRadius: cfg.radius,
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              cursor: disabled ? "not-allowed" : "pointer",
              transition:
                "border-color var(--kaiwen-duration-fast, 120ms) ease, box-shadow var(--kaiwen-duration-fast, 120ms) ease",
              boxSizing: "border-box",
              opacity: disabled ? 0.6 : 1,
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = hasError
                ? "var(--kw-color-error-text, #EF4444)"
                : "var(--kw-color-border-focus, #FFFFFF)";
              e.currentTarget.style.boxShadow = hasError
                ? "0 0 0 1px var(--kw-color-error-text, #EF4444)"
                : "0 0 0 1px var(--kw-color-border-focus, #FFFFFF)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = hasError
                ? "var(--kw-color-error-text, #EF4444)"
                : "var(--kw-color-border-default, rgba(255, 255, 255, 0.12))";
              e.currentTarget.style.boxShadow = "none";
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    style={{
                      backgroundColor:
                        "var(--kw-color-bg-elevated, var(--kaiwen-color-surface-elevated, #212121))",
                      color: "var(--kw-color-text-primary, #ECECEC)",
                    }}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <span
            style={{
              position: "absolute",
              right: "12px",
              pointerEvents: "none",
              color: "var(--kw-color-text-tertiary, #737373)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronDownIcon size={16} />
          </span>
        </div>

        {errorMessage && (
          <span
            id={errorId}
            role="alert"
            style={{
              fontSize: "12px",
              color: "var(--kw-color-error-text, #EF4444)",
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {errorMessage}
          </span>
        )}

        {!errorMessage && helperText && (
          <span
            id={helperId}
            style={{
              fontSize: "12px",
              color: "var(--kw-color-text-tertiary, #737373)",
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
