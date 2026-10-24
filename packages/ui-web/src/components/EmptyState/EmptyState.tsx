import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Clear description of the empty condition. */
  title: ReactNode;
  /** Optional explanation and suggested next step. */
  description?: ReactNode;
  /** Optional decorative icon from the shared icon package. */
  icon?: ReactNode;
  /** Primary action supplied by the product. */
  action?: ReactNode;
  /** Less prominent secondary action supplied by the product. */
  secondaryAction?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      title,
      description,
      icon,
      action,
      secondaryAction,
      className,
      role = 'region',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) {
    const titleId = useId();
    return (
      <div
        {...props}
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : titleId)}
        className={['kw-state-message', 'kw-empty-state', className]
          .filter(Boolean)
          .join(' ')}
      >
        {icon ? (
          <div className="kw-state-message__icon" aria-hidden="true">
            {icon}
          </div>
        ) : null}
        <div className="kw-state-message__content">
          <h3 id={titleId}>{title}</h3>
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
