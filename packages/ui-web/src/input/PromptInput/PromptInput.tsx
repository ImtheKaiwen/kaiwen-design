import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { ArrowRightIcon } from "@kaiwen/icons";
import { Spinner } from "../../feedback/Spinner/Spinner.js";

export interface PromptInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  startAction?: React.ReactNode;
  endActions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * OpenAI-style Prompt Composer Bar
 * Multi-line auto-growing input with bottom-anchored actions and circle submit button.
 */
export const PromptInput: React.FC<PromptInputProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSubmit,
  placeholder = "Message Kaiwen...",
  loading = false,
  disabled = false,
  startAction,
  endActions,
  className,
  style,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const val = isControlled ? controlledValue : internalValue;

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 200);
    el.style.height = `${Math.max(nextHeight, 24)}px`;
  };

  React.useEffect(() => {
    adjustHeight();
  }, [val]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (val.trim() && !loading && !disabled) {
        onSubmit?.(val);
        if (!isControlled) setInternalValue("");
      }
    }
  };

  const handleSubmitClick = () => {
    if (val.trim() && !loading && !disabled) {
      onSubmit?.(val);
      if (!isControlled) setInternalValue("");
    }
  };

  const hasContent = val.trim().length > 0;

  return (
    <div
      className={cn("kaiwen-prompt-bar", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--kaiwen-color-surface-secondary, #212121)",
        border:
          "1px solid var(--kaiwen-color-border-default, rgba(255, 255, 255, 0.1))",
        borderRadius: "20px",
        padding: "10px 14px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        width: "100%",
        ...style,
      }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={val}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        style={{
          width: "100%",
          minHeight: "24px",
          maxHeight: "200px",
          resize: "none",
          border: "none",
          background: "transparent",
          color: "var(--kaiwen-color-text-primary, #ECECEC)",
          fontSize: "15px",
          lineHeight: "1.5",
          fontFamily: "var(--kaiwen-font-sans, sans-serif)",
          outline: "none",
          padding: "4px 0",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {startAction}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {endActions}

          <button
            type="button"
            disabled={!hasContent || loading || disabled}
            onClick={handleSubmitClick}
            aria-label="Send prompt"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: hasContent
                ? "var(--kaiwen-color-text-primary, #FFFFFF)"
                : "rgba(255, 255, 255, 0.1)",
              color: hasContent
                ? "var(--kaiwen-color-bg-primary, #0D0D0D)"
                : "var(--kaiwen-color-text-muted, #737373)",
              cursor:
                hasContent && !loading && !disabled ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 120ms ease",
              padding: 0,
            }}
          >
            {loading ? (
              <Spinner size={14} color="currentColor" />
            ) : (
              <ArrowRightIcon size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

PromptInput.displayName = "PromptInput";
