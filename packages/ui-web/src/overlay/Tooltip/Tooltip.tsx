import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { radius as radiusTokens, zIndex } from "@kaiwen/tokens";

export interface TooltipProps {
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  children: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  delay = 200,
  children,
  className,
  style,
}) => {
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const show = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    top: {
      bottom: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)",
    },
    bottom: {
      top: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)",
    },
    left: {
      right: "calc(100% + 8px)",
      top: "50%",
      transform: "translateY(-50%)",
    },
    right: {
      left: "calc(100% + 8px)",
      top: "50%",
      transform: "translateY(-50%)",
    },
  };

  return (
    <div
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn("kaiwen-tooltip", className)}
          style={{
            position: "absolute",
            zIndex: zIndex.toast,
            backgroundColor: "var(--kaiwen-color-surface-tertiary, #2A2A2A)",
            color: "var(--kaiwen-color-text-primary, #ECECEC)",
            border:
              "1px solid var(--kaiwen-color-border-subtle, rgba(255, 255, 255, 0.08))",
            borderRadius: radiusTokens.md,
            padding: "4px 8px",
            fontSize: "12px",
            lineHeight: "1.4",
            fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            ...positionStyles[position],
            ...style,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = "Tooltip";
