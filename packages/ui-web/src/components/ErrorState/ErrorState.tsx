import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface ErrorStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Clear summary of the failure. */
  title: ReactNode;
  /** Recovery guidance or a safe diagnostic explanation. */
  description?: ReactNode;
  /** Optional decorative icon from the shared icon package. */
  icon?: ReactNode;
  /** Recovery action supplied by the product, commonly Retry. */
  action?: ReactNode;
  /** Optional secondary support or navigation action. */
  secondaryAction?: ReactNode;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  function ErrorState(
    {
      title,
      description,
      icon,
      action,
      secondaryAction,
      className,
      role = 'alert',
      ...props
    },
    ref,
  ) {
    return (
      <div
        {...props}
        ref={ref}
        role={role}
        className={['kw-state-message', 'kw-error-state', className]
          .filter(Boolean)
          .join(' ')}
      >
        {icon ? (
          <div className="kw-state-message__icon" aria-hidden="true">
            {icon}
          </div>
        ) : null}
        <div className="kw-state-message__content">
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        {action || secondaryAction ? (
          <div className="kw-state-message__actions">
            {action}
            {secondaryAction}
          </div>
        ) : null}
      </div>
    );
  },
);
