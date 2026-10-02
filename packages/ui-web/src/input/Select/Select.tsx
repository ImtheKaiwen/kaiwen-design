import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { ChevronDownIcon } from "@kaiwen/icons";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
}

const selectSizes = {
  sm: {
    height: "32px",
    fontSize: "var(--kw-font-size-xs)",
    px: "var(--kw-space-2-5)",
  },
  md: {
    height: "40px",
    fontSize: "var(--kw-font-size-sm)",
    px: "var(--kw-space-3)",
  },
  lg: {
    height: "48px",
    fontSize: "var(--kw-font-size-base)",
    px: "var(--kw-space-4)",
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
    const dim = selectSizes[size];

    return (
      <div
        className={cn(
          "kw-select-container",
          hasError && "kw-has-error",
          disabled && "kw-is-disabled",
          className,
        )}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--kw-space-1)",
          width: "100%",
        }}
      >
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: "var(--kw-font-size-sm)",
              fontWeight: "var(--kw-font-weight-medium)",
              color: hasError
                ? "var(--kw-color-error-text)"
                : "var(--kw-color-text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {label}
            {required && (
              <span
                style={{ color: "var(--kw-color-error-text)" }}
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
            display: "flex",
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
              height: dim.height,
              paddingLeft: dim.px,
              paddingRight: "36px",
              fontSize: dim.fontSize,
              fontFamily: "inherit",
              color: "var(--kw-color-text-primary)",
              backgroundColor: "var(--kw-color-bg-subtle)",
              border: `1px solid ${
                hasError
                  ? "var(--kw-color-error-border)"
                  : "var(--kw-color-border-subtle)"
              }`,
              borderRadius: "var(--kw-radius-md)",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              cursor: disabled ? "not-allowed" : "pointer",
              transition:
                "border-color var(--kw-motion-duration-fast) var(--kw-motion-ease-out), box-shadow var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
              boxSizing: "border-box",
              opacity: disabled ? 0.6 : 1,
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = hasError
                ? "var(--kw-color-error-interactive)"
                : "var(--kw-color-border-focus)";
              e.currentTarget.style.boxShadow = hasError
                ? "0 0 0 1px var(--kw-color-error-interactive)"
                : "0 0 0 1px var(--kw-color-border-focus)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = hasError
                ? "var(--kw-color-error-border)"
                : "var(--kw-color-border-subtle)";
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
              color: "var(--kw-color-text-tertiary)",
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
              fontSize: "var(--kw-font-size-xs)",
              color: "var(--kw-color-error-text)",
            }}
          >
            {errorMessage}
          </span>
        )}

        {!errorMessage && helperText && (
          <span
            id={helperId}
            style={{
              fontSize: "var(--kw-font-size-xs)",
              color: "var(--kw-color-text-tertiary)",
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
