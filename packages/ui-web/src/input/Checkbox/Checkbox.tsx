import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { CheckIcon, MinusIcon } from "@kaiwen/icons";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string | boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
}

const sizeConfig: Record<
  CheckboxSize,
  { box: number; icon: number; font: string; radius: string }
> = {
  sm: { box: 16, icon: 12, font: "13px", radius: "4px" },
  md: { box: 20, icon: 14, font: "14px", radius: "5px" },
  lg: { box: 24, icon: 16, font: "16px", radius: "6px" },
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      indeterminate = false,
      size = "md",
      checked: controlledChecked,
      defaultChecked,
      disabled,
      onChange,
      id,
      style,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const innerRef = React.useRef<HTMLInputElement | null>(null);

    const [checked, setChecked] = React.useState<boolean>(
      controlledChecked ?? defaultChecked ?? false,
    );

    React.useEffect(() => {
      if (controlledChecked !== undefined) {
        setChecked(controlledChecked);
      }
    }, [controlledChecked]);

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (controlledChecked === undefined) {
        setChecked(e.target.checked);
      }
      onChange?.(e);
    };

    const cfg = sizeConfig[size];
    const isChecked = checked || indeterminate;
    const hasError = Boolean(error);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "kaiwen-checkbox-wrapper",
          disabled && "kaiwen-is-disabled",
          hasError && "kaiwen-has-error",
          className,
        )}
        style={{
          display: "inline-flex",
          alignItems: "flex-start",
          gap: "10px",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          opacity: disabled ? 0.5 : 1,
          fontFamily: "var(--kaiwen-font-sans, sans-serif)",
          ...style,
        }}
      >
        <span
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2px",
            flexShrink: 0,
          }}
        >
          <input
            ref={(node) => {
              innerRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (
                  ref as React.MutableRefObject<HTMLInputElement | null>
                ).current = node;
              }
            }}
            type="checkbox"
            id={inputId}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            style={{
              position: "absolute",
              opacity: 0,
              width: "100%",
              height: "100%",
              margin: 0,
              cursor: disabled ? "not-allowed" : "pointer",
              zIndex: 1,
            }}
            {...props}
          />
          <span
            className="kaiwen-checkbox-box"
            style={{
              width: `${cfg.box}px`,
              height: `${cfg.box}px`,
              borderRadius: cfg.radius,
              border: `1.5px solid ${
                hasError
                  ? "var(--kw-color-error-text, #EF4444)"
                  : isChecked
                    ? "var(--kw-color-interactive-primary, #FFFFFF)"
                    : "var(--kw-color-border-default, rgba(255, 255, 255, 0.2))"
              }`,
              backgroundColor: isChecked
                ? "var(--kw-color-interactive-primary, #FFFFFF)"
                : "var(--kw-color-bg-subtle, transparent)",
              color: isChecked
                ? "var(--kw-color-text-inverse, #0D0D0D)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "background-color var(--kaiwen-duration-fast, 120ms) ease, border-color var(--kaiwen-duration-fast, 120ms) ease, box-shadow var(--kaiwen-duration-fast, 120ms) ease",
              boxSizing: "border-box",
            }}
          >
            {indeterminate ? (
              <MinusIcon size={cfg.icon} />
            ) : isChecked ? (
              <CheckIcon size={cfg.icon} />
            ) : null}
          </span>
        </span>

        {(label || helperText || error) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {label && (
              <span
                style={{
                  fontSize: cfg.font,
                  color: "var(--kw-color-text-primary, #ECECEC)",
                  fontWeight: 500,
                  lineHeight: "1.4",
                }}
              >
                {label}
              </span>
            )}
            {helperText && !hasError && (
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--kw-color-text-secondary, #B4B4B4)",
                  lineHeight: "1.4",
                }}
              >
                {helperText}
              </span>
            )}
            {typeof error === "string" && (
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--kw-color-error-text, #EF4444)",
                  lineHeight: "1.4",
                }}
              >
                {error}
              </span>
            )}
          </div>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
