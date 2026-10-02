import * as React from "react";
import { cn } from "@kaiwen/utilities";

export interface EmptyStateProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      action,
      secondaryAction,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("kw-empty-state", className)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "var(--kw-space-8) var(--kw-space-4)",
          borderRadius: "var(--kw-radius-xl)",
          border: "1px dashed var(--kw-color-border-subtle)",
          backgroundColor: "var(--kw-color-bg-subtle)",
          ...style,
        }}
        {...props}
      >
        {icon && (
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--kw-radius-full)",
              backgroundColor: "var(--kw-color-bg-elevated)",
              border: "1px solid var(--kw-color-border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--kw-color-text-secondary)",
              marginBottom: "var(--kw-space-3)",
            }}
          >
            {icon}
          </div>
        )}

        <h3
          style={{
            margin: 0,
            fontSize: "var(--kw-font-size-base)",
            fontWeight: "var(--kw-font-weight-semibold)",
            color: "var(--kw-color-text-primary)",
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            style={{
              margin: "var(--kw-space-1-5) 0 0 0",
              maxWidth: "380px",
              fontSize: "var(--kw-font-size-sm)",
              color: "var(--kw-color-text-tertiary)",
              lineHeight: "var(--kw-line-height-relaxed)",
            }}
          >
            {description}
          </p>
        )}

        {(action || secondaryAction) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--kw-space-2-5)",
              marginTop: "var(--kw-space-4)",
            }}
          >
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";
