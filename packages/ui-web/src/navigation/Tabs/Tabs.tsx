import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { radius as radiusTokens } from "@kaiwen/tokens";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant?: "pill" | "line";
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "pill" | "line";
  children: React.ReactNode;
}

export const TabsRoot: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  variant = "pill",
  className,
  style,
  children,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentVal = isControlled ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onValueChange?.(val);
    },
    [isControlled, onValueChange],
  );

  const contextValue = React.useMemo(
    () => ({
      value: currentVal,
      onValueChange: handleValueChange,
      variant,
    }),
    [currentVal, handleValueChange, variant],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("kaiwen-tabs", className)} style={style} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  style,
  children,
  ...props
}) => {
  const context = React.useContext(TabsContext);
  const isPill = context?.variant !== "line";
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const [indicator, setIndicator] = React.useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    visible: boolean;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const updateIndicator = React.useCallback(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLButtonElement>(
      '[role="tab"][aria-selected="true"]',
    );
    if (!activeEl) return;

    const listRect = listRef.current.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    if (activeRect.width === 0) return;

    setIndicator({
      left: activeRect.left - listRect.left,
      top: isPill ? activeRect.top - listRect.top : listRect.height - 2,
      width: activeRect.width,
      height: isPill ? activeRect.height : 2,
      visible: true,
    });
  }, [isPill]);

  React.useEffect(() => {
    updateIndicator();
  }, [context?.value, updateIndicator]);

  React.useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn("kaiwen-tabs-list", className)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: isPill ? "4px" : "16px",
        padding: isPill ? "4px" : "0",
        backgroundColor: isPill
          ? "var(--kw-color-bg-subtle, var(--kaiwen-color-surface-secondary, #212121))"
          : "transparent",
        borderRadius: isPill ? radiusTokens.lg : "0",
        border: isPill
          ? "1px solid var(--kw-color-border-subtle, rgba(255, 255, 255, 0.08))"
          : "none",
        borderBottom: isPill
          ? "1px solid var(--kw-color-border-subtle, rgba(255, 255, 255, 0.08))"
          : "1px solid var(--kw-color-border-subtle, rgba(255, 255, 255, 0.08))",
        ...style,
      }}
      {...props}
    >
      {/* Sliding Active Pill Indicator */}
      {indicator.visible && (
        <span
          className="kaiwen-tabs-sliding-indicator"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${indicator.left}px, ${indicator.top}px)`,
            width: `${indicator.width}px`,
            height: `${indicator.height}px`,
            backgroundColor: isPill
              ? "var(--kw-color-bg-elevated, var(--kaiwen-color-surface-tertiary, #2F2F2F))"
              : "var(--kw-color-interactive-primary, var(--kaiwen-color-text-primary, #ECECEC))",
            borderRadius: isPill ? radiusTokens.md : "0",
            boxShadow: isPill
              ? "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)"
              : "none",
            transition:
              "transform 220ms cubic-bezier(0.2, 0, 0, 1), width 220ms cubic-bezier(0.2, 0, 0, 1), height 220ms cubic-bezier(0.2, 0, 0, 1)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {children}
    </div>
  );
};

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  style,
  children,
  ...props
}) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("Tabs.Trigger must be inside Tabs");

  const isSelected = context.value === value;
  const isPill = context.variant !== "line";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "kaiwen-tabs-trigger",
        isSelected && "kaiwen-tabs-trigger-selected",
        className,
      )}
      style={{
        position: "relative",
        zIndex: 2,
        padding: isPill ? "6px 16px" : "10px 4px",
        fontSize: "13px",
        fontWeight: isSelected ? 600 : 500,
        fontFamily: "var(--kaiwen-font-sans, sans-serif)",
        borderRadius: isPill ? radiusTokens.md : "0",
        border: "none",
        backgroundColor:
          isPill && isSelected
            ? "var(--kw-color-bg-elevated, var(--kaiwen-color-surface-tertiary, #2F2F2F))"
            : "transparent",
        color: isSelected
          ? "var(--kw-color-text-primary, #ECECEC)"
          : "var(--kw-color-text-tertiary, #737373)",
        cursor: "pointer",
        transition:
          "color 160ms ease, font-weight 160ms ease, opacity 160ms ease",
        outline: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  style,
  children,
  ...props
}) => {
  const context = React.useContext(TabsContext);
  if (!context || context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("kaiwen-tabs-content", className)}
      style={{ marginTop: "16px", ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
