import * as React from "react";
import { EyeIcon, EyeOffIcon } from "@kaiwen/icons";
import { Input, type InputProps } from "./Input.js";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ showToggle = true, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  const toggleButton = showToggle ? (
    <button
      type="button"
      tabIndex={-1}
      aria-label={visible ? "Hide password" : "Show password"}
      onClick={() => setVisible((prev) => !prev)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        color: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
    </button>
  ) : undefined;

  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      endIcon={toggleButton}
      {...props}
    />
  );
});

PasswordInput.displayName = "PasswordInput";
