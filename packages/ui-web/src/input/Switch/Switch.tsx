import * as React from "react";
import { cn } from "@kaiwen/utilities";

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: React.ReactNode;
  helperText?: string;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  "aria-label"?: string;
}

const switchSizes = {
  sm: {
    trackW: 32,
    trackH: 18,
    thumb: 14,
    pad: 2,
    font: "var(--kw-font-size-xs)",
  },
  md: {
    trackW: 40,
    trackH: 22,
    thumb: 18,
    pad: 2,
    font: "var(--kw-font-size-sm)",
  },
  lg: {
    trackW: 48,
    trackH: 26,
    thumb: 22,
    pad: 2,
    font: "var(--kw-font-size-base)",
  },
};

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      size = "md",
      label,
      helperText,
      className,
      style,
      name,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const switchId = id ?? generatedId;
    const [checked, setChecked] = React.useState<boolean>(
      controlledChecked ?? defaultChecked,
    );

    React.useEffect(() => {
      if (controlledChecked !== undefined) {
        setChecked(controlledChecked);
      }
    }, [controlledChecked]);

    const handleToggle = () => {
      if (disabled) return;
      const next = !checked;
      if (controlledChecked === undefined) {
        setChecked(next);
      }
      onChange?.(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleToggle();
      }
    };

    const dim = switchSizes[size];
    const translateX = checked ? dim.trackW - dim.thumb - dim.pad * 2 : 0;

    return (
      <div
        className={cn("kw-switch-wrapper", className)}
        style={{
          display: "inline-flex",
          alignItems: "flex-start",
          gap: "var(--kw-space-2-5)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          ...style,
        }}
        onClick={handleToggle}
      >
        <button
          ref={ref}
          type="button"
          role="switch"
          id={switchId}
          name={name}
          aria-checked={checked}
          aria-label={
            ariaLabel ?? (typeof label === "string" ? label : undefined)
          }
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          style={{
            position: "relative",
            width: `${dim.trackW}px`,
            height: `${dim.trackH}px`,
            borderRadius: "var(--kw-radius-full)",
            backgroundColor: checked
              ? "var(--kw-color-interactive-primary)"
              : "var(--kw-color-bg-subtle)",
            border: `1px solid ${
              checked
                ? "var(--kw-color-interactive-primary)"
                : "var(--kw-color-border-subtle)"
            }`,
            padding: `${dim.pad}px`,
            display: "inline-flex",
            alignItems: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            outline: "none",
            transition:
              "background-color var(--kw-motion-duration-fast) var(--kw-motion-ease-out), border-color var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
            boxSizing: "border-box",
            flexShrink: 0,
            marginTop: "2px",
          }}
          {...props}
        >
          <span
            style={{
              display: "block",
              width: `${dim.thumb}px`,
              height: `${dim.thumb}px`,
              borderRadius: "var(--kw-radius-full)",
              backgroundColor: "var(--kw-color-text-inverse)",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              transform: `translateX(${translateX}px)`,
              transition:
                "transform var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
            }}
          />
        </button>

        {(label || helperText) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              userSelect: "none",
            }}
          >
            {label && (
              <span
                style={{
                  fontSize: dim.font,
                  color: "var(--kw-color-text-primary)",
                  fontWeight: "var(--kw-font-weight-medium)",
                  lineHeight: "1.3",
                }}
              >
                {label}
              </span>
            )}
            {helperText && (
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
          </div>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";
