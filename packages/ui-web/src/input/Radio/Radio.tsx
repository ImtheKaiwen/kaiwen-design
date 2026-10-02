import * as React from "react";
import { cn } from "@kaiwen/utilities";

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export interface RadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name: explicitName,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  label,
  orientation = "vertical",
  children,
  className,
  style,
}) => {
  const generatedName = React.useId();
  const name = explicitName ?? generatedName;

  const [value, setValue] = React.useState<string | undefined>(
    controlledValue ?? defaultValue,
  );

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = (val: string) => {
    if (disabled) return;
    if (controlledValue === undefined) {
      setValue(val);
    }
    onChange?.(val);
  };

  return (
    <RadioGroupContext.Provider
      value={{ name, value, onChange: handleChange, disabled }}
    >
      <div
        role="radiogroup"
        aria-label={label}
        className={cn("kw-radio-group", className)}
        style={{
          display: "flex",
          flexDirection: orientation === "horizontal" ? "row" : "column",
          gap:
            orientation === "horizontal"
              ? "var(--kw-space-4)"
              : "var(--kw-space-2-5)",
          ...style,
        }}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = "RadioGroup";

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange"
> {
  value: string;
  label?: React.ReactNode;
  helperText?: string;
  onChange?: (value: string) => void;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      label,
      helperText,
      disabled: explicitDisabled,
      className,
      style,
      id,
      onChange,
      ...props
    },
    ref,
  ) => {
    const group = React.useContext(RadioGroupContext);
    const generatedId = React.useId();
    const radioId = id ?? generatedId;

    const disabled = explicitDisabled ?? group?.disabled ?? false;
    const isChecked = group ? group.value === value : props.checked;
    const name = props.name ?? group?.name;

    const handleChange = () => {
      if (disabled) return;
      if (group?.onChange) {
        group.onChange(value);
      }
      onChange?.(value);
    };

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "kw-radio-wrapper",
          disabled && "kw-is-disabled",
          isChecked && "kw-is-checked",
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
            ref={ref}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={isChecked}
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
            className="kw-radio-circle"
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "var(--kw-radius-full)",
              border: `1.5px solid ${
                isChecked
                  ? "var(--kw-color-interactive-primary)"
                  : "var(--kw-color-border-subtle)"
              }`,
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "border-color var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
            }}
          >
            {isChecked && (
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "var(--kw-radius-full)",
                  backgroundColor: "var(--kw-color-interactive-primary)",
                  display: "block",
                }}
              />
            )}
          </span>
        </span>

        {(label || helperText) && (
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
                  fontSize: "var(--kw-font-size-sm)",
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
      </label>
    );
  },
);

Radio.displayName = "Radio";
