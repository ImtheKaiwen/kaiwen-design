import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Short summary of the feedback. */
  title: ReactNode;
  /** Supporting explanation or recovery guidance. */
  children?: ReactNode;
  /** Semantic urgency and token treatment. */
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  /** Optional decorative icon from the shared icon package. */
  icon?: ReactNode;
  /** Optional contextual action, commonly a Button or link. */
  action?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    title,
    children,
    tone = 'neutral',
    icon,
    action,
    className,
    role,
    ...props
  },
  ref,
) {
  const semanticRole = role ?? (tone === 'danger' ? 'alert' : 'status');
  return (
    <div
      {...props}
      ref={ref}
      role={semanticRole}
      data-tone={tone}
      data-has-icon={Boolean(icon) || undefined}
      data-has-action={Boolean(action) || undefined}
      className={['kw-alert', className].filter(Boolean).join(' ')}
    >
      {icon ? (
        <span className="kw-alert__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="kw-alert__content">
        <strong>{title}</strong>
        {children ? (
          <div className="kw-alert__description">{children}</div>
        ) : null}
      </div>
      {action ? <div className="kw-alert__action">{action}</div> : null}
    </div>
  );
});
