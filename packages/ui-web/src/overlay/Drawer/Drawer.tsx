import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { CloseIcon } from "@kaiwen/icons";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right" | "bottom" | "top";
  size?: "sm" | "md" | "lg" | "full";
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const sizeWidths = {
  sm: "360px",
  md: "480px",
  lg: "640px",
  full: "100vw",
};

const sizeHeights = {
  sm: "30vh",
  md: "50vh",
  lg: "80vh",
  full: "100vh",
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = "right",
  size = "md",
  title,
  description,
  children,
  footer,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  style,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const titleId = React.useId();
  const descId = React.useId();
  const drawerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const isHorizontal = position === "left" || position === "right";
  const dimensionStyle: React.CSSProperties = isHorizontal
    ? {
        width: sizeWidths[size],
        maxWidth: "100vw",
        height: "100vh",
        top: 0,
        bottom: 0,
        [position]: 0,
      }
    : {
        width: "100vw",
        height: sizeHeights[size],
        maxHeight: "100vh",
        left: 0,
        right: 0,
        [position]: 0,
      };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--kw-z-modal, 1000)" as unknown as number,
        display: "flex",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        onClick={closeOnBackdropClick ? onClose : undefined}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(6px)",
          animation:
            "kwFadeIn var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
        }}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={cn("kw-drawer-panel", className)}
        style={{
          position: "absolute",
          ...dimensionStyle,
          backgroundColor: "var(--kw-color-bg-elevated)",
          borderLeft:
            position === "right"
              ? "1px solid var(--kw-color-border-subtle)"
              : undefined,
          borderRight:
            position === "left"
              ? "1px solid var(--kw-color-border-subtle)"
              : undefined,
          borderTop:
            position === "bottom"
              ? "1px solid var(--kw-color-border-subtle)"
              : undefined,
          borderBottom:
            position === "top"
              ? "1px solid var(--kw-color-border-subtle)"
              : undefined,
          boxShadow: "var(--kw-shadow-2xl)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: `kwSlideIn${
            position.charAt(0).toUpperCase() + position.slice(1)
          } var(--kw-motion-duration-normal) var(--kw-motion-ease-out)`,
          ...style,
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            style={{
              padding: "var(--kw-space-4) var(--kw-space-5)",
              borderBottom: "1px solid var(--kw-color-border-subtle)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "var(--kw-space-4)",
            }}
          >
            <div>
              {title && (
                <h2
                  id={titleId}
                  style={{
                    margin: 0,
                    fontSize: "var(--kw-font-size-lg)",
                    fontWeight: "var(--kw-font-weight-semibold)",
                    color: "var(--kw-color-text-primary)",
                  }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descId}
                  style={{
                    margin: "var(--kw-space-1) 0 0 0",
                    fontSize: "var(--kw-font-size-sm)",
                    color: "var(--kw-color-text-tertiary)",
                  }}
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "var(--kw-space-1)",
                  cursor: "pointer",
                  color: "var(--kw-color-text-tertiary)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--kw-radius-md)",
                  transition:
                    "color var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
                }}
              >
                <CloseIcon size={18} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "var(--kw-space-5)",
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: "var(--kw-space-3-5) var(--kw-space-5)",
              borderTop: "1px solid var(--kw-color-border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "var(--kw-space-2)",
              backgroundColor: "var(--kw-color-bg-subtle)",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Drawer.displayName = "Drawer";
