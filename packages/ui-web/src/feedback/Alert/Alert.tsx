import * as React from "react";
import { cn } from "@kaiwen/utilities";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  CloseIcon,
} from "@kaiwen/icons";
import { radius as radiusTokens } from "@kaiwen/tokens";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<AlertVariant, React.CSSProperties> = {
  info: {
    backgroundColor:
      "var(--kaiwen-color-status-info-subtle, rgba(59, 130, 246, 0.15))",
    borderColor: "rgba(59, 130, 246, 0.3)",
    color: "var(--kaiwen-color-text-primary, #ECECEC)",
  },
  success: {
    backgroundColor:
      "var(--kaiwen-color-status-success-subtle, rgba(16, 163, 127, 0.15))",
    borderColor: "rgba(16, 163, 127, 0.3)",
    color: "var(--kaiwen-color-text-primary, #ECECEC)",
  },
  warning: {
    backgroundColor:
      "var(--kaiwen-color-status-warning-subtle, rgba(245, 158, 11, 0.15))",
    borderColor: "rgba(245, 158, 11, 0.3)",
    color: "var(--kaiwen-color-text-primary, #ECECEC)",
  },
  error: {
    backgroundColor:
      "var(--kaiwen-color-status-error-subtle, rgba(239, 68, 68, 0.15))",
    borderColor: "rgba(239, 68, 68, 0.3)",
    color: "var(--kaiwen-color-text-primary, #ECECEC)",
  },
};

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
  info: <InfoIcon size={18} color="var(--kaiwen-color-status-info, #3B82F6)" />,
  success: (
    <CheckCircleIcon
      size={18}
      color="var(--kaiwen-color-status-success, #10A37F)"
    />
  ),
  warning: (
    <AlertCircleIcon
      size={18}
      color="var(--kaiwen-color-status-warning, #F59E0B)"
    />
  ),
  error: (
    <AlertCircleIcon
      size={18}
      color="var(--kaiwen-color-status-error, #EF4444)"
    />
  ),
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      title,
      icon,
      onClose,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn("kaiwen-alert", `kaiwen-alert-${variant}`, className)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: radiusTokens.lg,
          border: "1px solid",
          fontFamily: "var(--kaiwen-font-sans, sans-serif)",
          ...variantStyles[variant],
          ...style,
        }}
        {...props}
      >
        <div style={{ flexShrink: 0, marginTop: "2px" }}>
          {icon || defaultIcons[variant]}
        </div>

        <div style={{ flex: 1, fontSize: "14px", lineHeight: "1.5" }}>
          {title && (
            <div
              style={{ fontWeight: 600, marginBottom: children ? "2px" : 0 }}
            >
              {title}
            </div>
          )}
          {children && <div>{children}</div>}
        </div>

        {onClose && (
          <button
            type="button"
            aria-label="Dismiss alert"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              padding: "2px",
              cursor: "pointer",
              color: "inherit",
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
