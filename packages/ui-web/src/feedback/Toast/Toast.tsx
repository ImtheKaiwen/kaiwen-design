import * as React from "react";
import { cn } from "@kaiwen/utilities";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  CloseIcon,
} from "@kaiwen/icons";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  show: (toast: Omit<ToastItem, "id">) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
};

const variantConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; accentColor: string }
> = {
  default: {
    icon: null,
    accentColor: "var(--kw-color-border-default, rgba(255, 255, 255, 0.15))",
  },
  success: {
    icon: (
      <CheckCircleIcon
        size={18}
        color="var(--kw-color-success-interactive, #10A37F)"
      />
    ),
    accentColor: "var(--kw-color-success-interactive, #10A37F)",
  },
  error: {
    icon: (
      <AlertCircleIcon
        size={18}
        color="var(--kw-color-error-interactive, #EF4444)"
      />
    ),
    accentColor: "var(--kw-color-error-interactive, #EF4444)",
  },
  warning: {
    icon: (
      <AlertCircleIcon
        size={18}
        color="var(--kw-color-warning-interactive, #F59E0B)"
      />
    ),
    accentColor: "var(--kw-color-warning-interactive, #F59E0B)",
  },
  info: {
    icon: (
      <InfoIcon
        size={18}
        color="var(--kw-color-interactive-primary, #3B82F6)"
      />
    ),
    accentColor: "var(--kw-color-interactive-primary, #3B82F6)",
  },
};

export const ToastCard: React.FC<{
  toast: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const {
    id,
    title,
    description,
    variant = "default",
    duration = 4000,
  } = toast;

  React.useEffect(() => {
    if (duration <= 0) return undefined;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const cfg = variantConfig[variant];
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={cn("kaiwen-toast-card", `kaiwen-toast-${variant}`)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px",
        backgroundColor:
          "var(--kw-color-bg-elevated, var(--kaiwen-color-surface-elevated, #212121))",
        color: "var(--kw-color-text-primary, #ECECEC)",
        border:
          "1px solid var(--kw-color-border-default, rgba(255, 255, 255, 0.12))",
        borderLeft: `4px solid ${cfg.accentColor}`,
        borderRadius: "10px",
        boxShadow:
          "0 12px 32px -4px rgba(0, 0, 0, 0.35), 0 4px 8px -2px rgba(0, 0, 0, 0.15)",
        minWidth: "320px",
        maxWidth: "420px",
        pointerEvents: "auto",
        backdropFilter: "blur(16px)",
        boxSizing: "border-box",
        fontFamily: "var(--kaiwen-font-sans, sans-serif)",
        animation: "kaiwenToastSlideIn 240ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {cfg.icon && (
        <span
          style={{ display: "inline-flex", marginTop: "1px", flexShrink: 0 }}
        >
          {cfg.icon}
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--kw-color-text-primary, #ECECEC)",
              lineHeight: "1.35",
            }}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            style={{
              fontSize: "13px",
              color: "var(--kw-color-text-secondary, #B4B4B4)",
              lineHeight: "1.4",
              marginTop: title ? "3px" : 0,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        style={{
          background: "transparent",
          border: "none",
          padding: "4px",
          cursor: "pointer",
          color: "var(--kw-color-text-tertiary, #737373)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          marginLeft: "4px",
          flexShrink: 0,
          transition: "color 120ms ease, background-color 120ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--kw-color-text-primary, #FFFFFF)";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color =
            "var(--kw-color-text-tertiary, #737373)";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
};

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "bottom-right",
}) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const show = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...item, id }]);
    return id;
  }, []);

  const success = React.useCallback(
    (title: string, description?: string) => {
      return show({ title, description, variant: "success" });
    },
    [show],
  );

  const error = React.useCallback(
    (title: string, description?: string) => {
      return show({ title, description, variant: "error" });
    },
    [show],
  );

  const warning = React.useCallback(
    (title: string, description?: string) => {
      return show({ title, description, variant: "warning" });
    },
    [show],
  );

  const info = React.useCallback(
    (title: string, description?: string) => {
      return show({ title, description, variant: "info" });
    },
    [show],
  );

  const positionStyles: Record<string, React.CSSProperties> = {
    "top-right": { top: "24px", right: "24px" },
    "top-left": { top: "24px", left: "24px" },
    "bottom-right": { bottom: "24px", right: "24px" },
    "bottom-left": { bottom: "24px", left: "24px" },
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        show,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll,
      }}
    >
      {children}
      <div
        className="kaiwen-toast-container"
        style={{
          position: "fixed",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
          ...positionStyles[position],
        }}
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = "ToastProvider";
