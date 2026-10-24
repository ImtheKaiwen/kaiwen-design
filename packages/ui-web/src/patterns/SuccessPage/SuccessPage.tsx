import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Check } from '@imthekaiwen/icons';

export interface SuccessPageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Clear outcome heading. */
  title: ReactNode;
  /** Product-supplied explanation of what completed. */
  description?: ReactNode;
  /** Optional icon override. Defaults to the shared Check icon. */
  icon?: ReactNode;
  /** Primary next action supplied by the product. */
  primaryAction: ReactNode;
  /** Optional less prominent action supplied by the product. */
  secondaryAction?: ReactNode;
  /** Optional persistent completion details such as an identifier or summary. */
  details?: ReactNode;
}

export const SuccessPage = forwardRef<HTMLDivElement, SuccessPageProps>(
  function SuccessPage(
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
        className={['kw-flow-page', 'kw-success-page', className]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="kw-flow-page__icon" aria-hidden="true">
          {icon ?? <Check size={24} />}
        </div>
        <div className="kw-flow-page__content">
          <h2 id={titleId}>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {details ? (
          <div className="kw-flow-page__details">{details}</div>
        ) : null}
        <div className="kw-flow-page__actions">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
    );
  },
);
