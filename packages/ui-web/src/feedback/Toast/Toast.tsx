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

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: (
    <CheckCircleIcon size={18} color="var(--kw-color-success-interactive)" />
  ),
  error: (
    <AlertCircleIcon size={18} color="var(--kw-color-error-interactive)" />
  ),
  warning: (
    <AlertCircleIcon size={18} color="var(--kw-color-warning-interactive)" />
  ),
  info: <InfoIcon size={18} color="var(--kw-color-interactive-primary)" />,
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

  const icon = variantIcons[variant];
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={cn("kw-toast-card", `kw-toast-${variant}`)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--kw-space-3)",
        padding: "var(--kw-space-3-5) var(--kw-space-4)",
        backgroundColor: "var(--kw-color-bg-elevated)",
        color: "var(--kw-color-text-primary)",
        border: "1px solid var(--kw-color-border-subtle)",
        borderRadius: "var(--kw-radius-lg)",
        boxShadow: "var(--kw-shadow-xl)",
        minWidth: "300px",
        maxWidth: "420px",
        pointerEvents: "auto",
        animation:
          "kwFadeIn var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
        boxSizing: "border-box",
      }}
    >
      {icon && (
        <span
          style={{ display: "inline-flex", marginTop: "2px", flexShrink: 0 }}
        >
          {icon}
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontSize: "var(--kw-font-size-sm)",
              fontWeight: "var(--kw-font-weight-medium)",
              color: "var(--kw-color-text-primary)",
              lineHeight: "1.4",
            }}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            style={{
              fontSize: "var(--kw-font-size-xs)",
              color: "var(--kw-color-text-secondary)",
              lineHeight: "1.4",
              marginTop: title ? "2px" : 0,
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
          padding: "2px",
          cursor: "pointer",
          color: "var(--kw-color-text-tertiary)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--kw-radius-sm)",
          marginLeft: "var(--kw-space-1)",
          flexShrink: 0,
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
    "top-right": { top: "var(--kw-space-5)", right: "var(--kw-space-5)" },
    "top-left": { top: "var(--kw-space-5)", left: "var(--kw-space-5)" },
    "bottom-right": { bottom: "var(--kw-space-5)", right: "var(--kw-space-5)" },
    "bottom-left": { bottom: "var(--kw-space-5)", left: "var(--kw-space-5)" },
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
        className="kw-toast-container"
        style={{
          position: "fixed",
          zIndex: "var(--kw-z-toast, 1200)" as unknown as number,
          display: "flex",
          flexDirection: "column",
          gap: "var(--kw-space-2-5)",
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
