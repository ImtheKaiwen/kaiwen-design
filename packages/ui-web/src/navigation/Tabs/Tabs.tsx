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

  const handleValueChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider
      value={{ value: currentVal, onValueChange: handleValueChange, variant }}
    >
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

  return (
    <div
      role="tablist"
      className={cn("kaiwen-tabs-list", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isPill ? "4px" : "16px",
        padding: isPill ? "4px" : "0",
        backgroundColor: isPill
          ? "var(--kaiwen-color-surface-secondary, #212121)"
          : "transparent",
        borderRadius: isPill ? radiusTokens.lg : "0",
        borderBottom: isPill
          ? "none"
          : "1px solid var(--kaiwen-color-border-subtle, rgba(255, 255, 255, 0.08))",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
        padding: isPill ? "6px 14px" : "8px 4px",
        fontSize: "13px",
        fontWeight: 500,
        fontFamily: "var(--kaiwen-font-sans, sans-serif)",
        borderRadius: isPill ? radiusTokens.md : "0",
        border: "none",
        borderBottom:
          !isPill && isSelected
            ? "2px solid var(--kaiwen-color-text-primary, #ECECEC)"
            : "2px solid transparent",
        backgroundColor:
          isPill && isSelected
            ? "var(--kaiwen-color-surface-tertiary, #2F2F2F)"
            : "transparent",
        color: isSelected
          ? "var(--kaiwen-color-text-primary, #ECECEC)"
          : "var(--kaiwen-color-text-muted, #737373)",
        cursor: "pointer",
        transition: "all 120ms ease",
        outline: "none",
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
