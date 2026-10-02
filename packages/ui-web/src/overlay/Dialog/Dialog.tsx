import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn, isBrowser } from "@kaiwen/utilities";
import { CloseIcon } from "@kaiwen/icons";
import { radius as radiusTokens, zIndex } from "@kaiwen/tokens";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const DialogRoot: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  className,
  style,
  children,
  ...props
}) => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("Dialog.Content must be used within a Dialog");

  const { open, onOpenChange } = context;

  // Handle Escape key
  React.useEffect(() => {
    if (!open || !isBrowser) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open || !isBrowser) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: zIndex.modal,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn("kaiwen-dialog-content", className)}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "var(--kaiwen-color-surface-primary, #171717)",
          border:
            "1px solid var(--kaiwen-color-border-default, rgba(255, 255, 255, 0.1))",
          borderRadius: radiusTokens.xl,
          padding: "24px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          outline: "none",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export interface DialogHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  showClose?: boolean;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  title,
  subtitle,
  showClose = true,
  className,
  style,
  children,
  ...props
}) => {
  const context = React.useContext(DialogContext);

  return (
    <div
      className={cn("kaiwen-dialog-header", className)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "16px",
        ...style,
      }}
      {...props}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {title && (
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--kaiwen-color-text-primary, #ECECEC)",
              margin: 0,
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            style={{
              fontSize: "14px",
              color: "var(--kaiwen-color-text-secondary, #B4B4B4)",
              margin: 0,
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {showClose && context && (
        <button
          type="button"
          aria-label="Close dialog"
          onClick={() => context.onOpenChange(false)}
          style={{
            background: "none",
            border: "none",
            padding: "4px",
            color: "var(--kaiwen-color-text-muted, #737373)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radiusTokens.sm,
          }}
        >
          <CloseIcon size={18} />
        </button>
      )}
    </div>
  );
};

export const DialogBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  style,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("kaiwen-dialog-body", className)}
      style={{
        fontSize: "14px",
        color: "var(--kaiwen-color-text-primary, #ECECEC)",
        marginBottom: "20px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  style,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("kaiwen-dialog-footer", className)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "10px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Dialog = Object.assign(DialogRoot, {
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
});
