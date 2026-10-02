import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { radius as radiusTokens } from "@kaiwen/tokens";

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  autoFocus = false,
  error = false,
  className,
  style,
}) => {
  const [internalDigits, setInternalDigits] = React.useState<string[]>(() => {
    const chars = value.split("").slice(0, length);
    while (chars.length < length) chars.push("");
    return chars;
  });

  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    const chars = value.split("").slice(0, length);
    while (chars.length < length) chars.push("");
    setInternalDigits(chars);
  }, [value, length]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    const lastChar = val[val.length - 1] || "";
    const next = [...internalDigits];
    next[index] = lastChar;
    setInternalDigits(next);
    onChange?.(next.join(""));

    // Advance focus
    if (index < length - 1 && lastChar) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!internalDigits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else {
        const next = [...internalDigits];
        next[index] = "";
        setInternalDigits(next);
        onChange?.(next.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;

    const next = [...internalDigits];
    for (let i = 0; i < length; i++) {
      next[i] = pasted[i] || "";
    }
    setInternalDigits(next);
    onChange?.(next.join(""));

    const focusIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  const borderColor = error
    ? "var(--kaiwen-color-status-error, #EF4444)"
    : "var(--kaiwen-color-border-default, #27272A)";

  return (
    <div
      className={cn("kaiwen-otp-group", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        ...style,
      }}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          value={internalDigits[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          aria-label={`Digit ${index + 1} of ${length}`}
          className="kaiwen-otp-box"
          style={{
            width: "44px",
            height: "52px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: 600,
            fontFamily: "var(--kaiwen-font-mono, monospace)",
            color: "var(--kaiwen-color-text-primary, #FFFFFF)",
            backgroundColor: "var(--kaiwen-color-surface-secondary, #18181B)",
            border: `1px solid ${borderColor}`,
            borderRadius: radiusTokens.md,
            outline: "none",
            transition: "border-color 120ms ease",
          }}
        />
      ))}
    </div>
  );
};

OTPInput.displayName = "OTPInput";
