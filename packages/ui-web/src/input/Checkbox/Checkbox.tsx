import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { CheckIcon, MinusIcon } from "@kaiwen/icons";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string | boolean;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { box: 16, icon: 12, font: "var(--kw-font-size-xs)" },
  md: { box: 18, icon: 14, font: "var(--kw-font-size-sm)" },
  lg: { box: 22, icon: 16, font: "var(--kw-font-size-base)" },
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
          "kw-checkbox-wrapper",
          disabled && "kw-is-disabled",
          hasError && "kw-has-error",
          className,
        )}
        style={{
          display: "inline-flex",
          alignItems: "flex-start",
          gap: "var(--kw-space-2)",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          opacity: disabled ? 0.6 : 1,
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
            }}
            {...props}
          />
          <span
            className="kw-checkbox-box"
            style={{
              width: `${cfg.box}px`,
              height: `${cfg.box}px`,
              borderRadius: "var(--kw-radius-xs)",
              border: `1.5px solid ${
                hasError
                  ? "var(--kw-color-error-border)"
                  : isChecked
                    ? "var(--kw-color-interactive-primary)"
                    : "var(--kw-color-border-subtle)"
              }`,
              backgroundColor: isChecked
                ? "var(--kw-color-interactive-primary)"
                : "transparent",
              color: "var(--kw-color-text-inverse)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "background-color var(--kw-motion-duration-fast) var(--kw-motion-ease-out), border-color var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
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
                  color: "var(--kw-color-text-primary)",
                  fontWeight: "var(--kw-font-weight-medium)",
                  lineHeight: "1.3",
                }}
              >
                {label}
              </span>
            )}
            {helperText && !hasError && (
              <span
                style={{
                  fontSize: "var(--kw-font-size-xs)",
                  color: "var(--kw-color-text-tertiary)",
                  lineHeight: "1.3",
                }}
              >
                {helperText}
              </span>
            )}
            {typeof error === "string" && (
              <span
                style={{
                  fontSize: "var(--kw-font-size-xs)",
                  color: "var(--kw-color-error-text)",
                  lineHeight: "1.3",
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
