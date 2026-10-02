import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { SearchIcon, CloseIcon } from "@kaiwen/icons";
import { Input, type InputProps } from "./Input.js";

export interface SearchInputProps extends Omit<
  InputProps,
  "startIcon" | "endIcon"
> {
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      showClearButton = true,
      placeholder = "Search...",
      ...props
    },
    ref,
  ) => {
    const hasValue = Boolean(value && String(value).length > 0);

    const handleClear = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClear) {
          onClear();
        } else if (onChange) {
          const syntheticEvent = {
            target: { value: "" },
            currentTarget: { value: "" },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      },
      [onClear, onChange],
    );

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        startIcon={<SearchIcon size={16} />}
        endIcon={
          showClearButton && hasValue ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              style={{
                background: "transparent",
                border: "none",
                padding: "2px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--kw-color-text-tertiary)",
                borderRadius: "var(--kw-radius-full)",
              }}
            >
              <CloseIcon size={14} />
            </button>
          ) : undefined
        }
        className={cn("kw-search-input", className)}
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";
