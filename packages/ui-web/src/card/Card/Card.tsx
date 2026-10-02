import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { radius as radiusTokens, spacing } from "@kaiwen/tokens";
import { SkeletonCard } from "../../skeleton/Skeleton/Skeleton.js";

export type CardVariant = "default" | "elevated" | "outlined";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    backgroundColor:
      "var(--kw-color-bg-subtle, var(--kaiwen-color-surface-primary, #171717))",
    border:
      "1px solid var(--kw-color-border-subtle, var(--kaiwen-color-border-subtle, rgba(255, 255, 255, 0.08)))",
    color: "var(--kw-color-text-primary, var(--kaiwen-color-text-primary, #ECECEC))",
  },
  elevated: {
    backgroundColor:
      "var(--kw-color-bg-elevated, var(--kaiwen-color-surface-elevated, #212121))",
    border:
      "1px solid var(--kw-color-border-subtle, var(--kaiwen-color-border-subtle, rgba(255, 255, 255, 0.08)))",
    color: "var(--kw-color-text-primary, var(--kaiwen-color-text-primary, #ECECEC))",
    boxShadow: "var(--kaiwen-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.5))",
  },
  outlined: {
    backgroundColor: "transparent",
    border:
      "1px solid var(--kw-color-border-default, var(--kaiwen-color-border-default, #27272A))",
    color: "var(--kw-color-text-primary, var(--kaiwen-color-text-primary, #ECECEC))",
  },
};

const paddingStyles: Record<CardPadding, string> = {
  none: "0",
  sm: `${spacing[4]}`,
  md: `${spacing[6]}`,
  lg: `${spacing[8]}`,
};

export const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      interactive = false,
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
        className={cn(
          "kaiwen-card",
          `kaiwen-card-${variant}`,
          interactive && "kaiwen-card-interactive",
          className,
        )}
        style={{
          borderRadius: radiusTokens.lg,
          padding: paddingStyles[padding],
          transition:
            "var(--kaiwen-transition-fast, all 120ms cubic-bezier(0.2, 0, 0, 1))",
          position: "relative",
          cursor: interactive ? "pointer" : "default",
          ...variantStyles[variant],
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardRoot.displayName = "Card";

export interface CardHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
  style,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("kaiwen-card-header", className)}
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
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--kaiwen-color-text-primary, #FFFFFF)",
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {title}
          </div>
        )}
        {subtitle && (
          <div
            style={{
              fontSize: "13px",
              color: "var(--kaiwen-color-text-secondary, #A1A1AA)",
              fontFamily: "var(--kaiwen-font-sans, sans-serif)",
            }}
          >
            {subtitle}
          </div>
        )}
        {children}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  style,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("kaiwen-card-body", className)}
      style={{
        fontSize: "14px",
        color: "var(--kaiwen-color-text-primary, #FFFFFF)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  style,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("kaiwen-card-footer", className)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "16px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Skeleton: SkeletonCard,
});
