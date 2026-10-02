import * as React from "react";
import { cn } from "@kaiwen/utilities";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  autoResize?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      autoResize = false,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      disabled,
      required,
      id,
      rows = 3,
      style,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const [currentLength, setCurrentLength] = React.useState<number>(() => {
      if (value !== undefined) return String(value).length;
      if (defaultValue !== undefined) return String(defaultValue).length;
      return 0;
    });

    React.useEffect(() => {
      if (value !== undefined) {
        setCurrentLength(String(value).length);
      }
    }, [value]);

    const adjustHeight = React.useCallback(() => {
      if (!autoResize) return;
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    }, [autoResize]);

    React.useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentLength(e.target.value.length);
      adjustHeight();
      onChange?.(e);
    };

    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    return (
      <div
        className={cn(
          "kw-textarea-container",
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
            htmlFor={inputId}
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
            width: "100%",
          }}
        >
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (
                  ref as React.MutableRefObject<HTMLTextAreaElement | null>
                ).current = node;
              }
            }}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            rows={rows}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            style={{
              width: "100%",
              padding: "var(--kw-space-2-5) var(--kw-space-3)",
              fontSize: "var(--kw-font-size-sm)",
              lineHeight: "var(--kw-line-height-relaxed)",
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
              resize: autoResize ? "none" : "vertical",
              transition:
                "border-color var(--kw-motion-duration-fast) var(--kw-motion-ease-out), box-shadow var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
              boxSizing: "border-box",
              opacity: disabled ? 0.6 : 1,
              cursor: disabled ? "not-allowed" : "text",
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
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "18px",
          }}
        >
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

          {showCount && (
            <span
              style={{
                fontSize: "var(--kw-font-size-xs)",
                color: "var(--kw-color-text-tertiary)",
                marginLeft: "auto",
              }}
            >
              {currentLength}
              {maxLength !== undefined ? ` / ${maxLength}` : ""}
            </span>
          )}
        </div>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
