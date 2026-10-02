import * as React from "react";
import { cn } from "@kaiwen/utilities";

export type RadioSize = "sm" | "md" | "lg";

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: RadioSize;
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
  size?: RadioSize;
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
  size = "md",
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
      value={{ name, value, onChange: handleChange, disabled, size }}
    >
      <div
        role="radiogroup"
        aria-label={label}
        className={cn("kaiwen-radio-group", className)}
        style={{
          display: "flex",
          flexDirection: orientation === "horizontal" ? "row" : "column",
          gap: orientation === "horizontal" ? "20px" : "10px",
          alignItems: orientation === "horizontal" ? "center" : "flex-start",
          ...style,
        }}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = "RadioGroup";

export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange"
  > {
  value: string;
  label?: React.ReactNode;
  helperText?: string;
  size?: RadioSize;
  onChange?: (value: string) => void;
}

const radioSizeConfig: Record<
  RadioSize,
  { circle: number; dot: number; font: string }
> = {
  sm: { circle: 16, dot: 6, font: "13px" },
  md: { circle: 20, dot: 8, font: "14px" },
  lg: { circle: 24, dot: 10, font: "16px" },
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      label,
      helperText,
      disabled: explicitDisabled,
      size: explicitSize,
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
    const size = explicitSize ?? group?.size ?? "md";
    const cfg = radioSizeConfig[size];

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
          "kaiwen-radio-wrapper",
          disabled && "kaiwen-is-disabled",
          isChecked && "kaiwen-is-checked",
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
              zIndex: 1,
            }}
            {...props}
          />
          <span
            className="kaiwen-radio-circle"
            style={{
              width: `${cfg.circle}px`,
              height: `${cfg.circle}px`,
              borderRadius: "50%",
              border: `1.5px solid ${
                isChecked
                  ? "var(--kw-color-interactive-primary, #FFFFFF)"
                  : "var(--kw-color-border-default, rgba(255, 255, 255, 0.2))"
              }`,
              backgroundColor: "var(--kw-color-bg-subtle, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "border-color var(--kaiwen-duration-fast, 120ms) ease, box-shadow var(--kaiwen-duration-fast, 120ms) ease",
              boxSizing: "border-box",
            }}
          >
            {isChecked && (
              <span
                style={{
                  width: `${cfg.dot}px`,
                  height: `${cfg.dot}px`,
                  borderRadius: "50%",
                  backgroundColor:
                    "var(--kw-color-interactive-primary, #FFFFFF)",
                  display: "block",
                  transition: "transform 120ms cubic-bezier(0.2, 0, 0, 1)",
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
                  fontSize: cfg.font,
                  color: "var(--kw-color-text-primary, #ECECEC)",
                  fontWeight: 500,
                  lineHeight: "1.4",
                }}
              >
                {label}
              </span>
            )}
            {helperText && (
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
          </div>
        )}
      </label>
    );
  },
);

Radio.displayName = "Radio";
