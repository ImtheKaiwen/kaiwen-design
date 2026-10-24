import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { CircleHelp } from '@imthekaiwen/icons';

export interface ConfirmationPageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Clear description of the decision being confirmed. */
  title: ReactNode;
  /** Product-supplied consequences or supporting context. */
  description?: ReactNode;
  /** Optional icon override. Defaults to the shared CircleHelp icon. */
  icon?: ReactNode;
  /** Explicit confirmation action supplied by the product. */
  primaryAction: ReactNode;
  /** Optional cancel or back action supplied by the product. */
  secondaryAction?: ReactNode;
  /** Optional persistent review details. */
  details?: ReactNode;
}

export const ConfirmationPage = forwardRef<
  HTMLDivElement,
  ConfirmationPageProps
>(function ConfirmationPage(
  {
    title,
    description,
    icon,
    primaryAction,
    secondaryAction,
    details,
    className,
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
      role="region"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : titleId)}
      className={['kw-flow-page', 'kw-confirmation-page', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="kw-flow-page__icon" aria-hidden="true">
        {icon ?? <CircleHelp size={24} />}
      </div>
      <div className="kw-flow-page__content">
        <h2 id={titleId}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {details ? <div className="kw-flow-page__details">{details}</div> : null}
      <div className="kw-flow-page__actions">
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  );
});
