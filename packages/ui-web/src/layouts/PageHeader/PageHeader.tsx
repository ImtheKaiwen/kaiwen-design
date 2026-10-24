import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';

export interface PageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Primary page title. */
  title: ReactNode;
  /** Supporting copy that explains the page purpose. */
  description?: ReactNode;
  /** Optional short context rendered above the title. */
  eyebrow?: ReactNode;
  /** Product-owned breadcrumb navigation or location context. */
  breadcrumbs?: ReactNode;
  /** Page-level controls; native buttons and links remain product-owned. */
  actions?: ReactNode;
  /** Secondary facts rendered below the description. */
  metadata?: ReactNode;
  /** Semantic heading level; page templates normally use level one. */
  headingLevel?: 1 | 2 | 3;
}

/** Responsive page heading with explicit slots for context, copy and actions. */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(
    {
      title,
      description,
      eyebrow,
      breadcrumbs,
      actions,
      metadata,
      headingLevel = 1,
      className,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) {
    const generatedTitleId = useId();
    const titleId = `kw-page-title-${generatedTitleId}`;
    const Heading = `h${headingLevel}` as const;

    return (
      <header
        {...props}
        ref={ref}
        className={['kw-page-header', className].filter(Boolean).join(' ')}
        aria-labelledby={ariaLabelledBy ?? titleId}
      >
        <div className="kw-page-header__leading">
          {breadcrumbs ? (
            <div className="kw-page-header__breadcrumbs">{breadcrumbs}</div>
          ) : null}
          {eyebrow ? (
            <div className="kw-page-header__eyebrow">{eyebrow}</div>
          ) : null}
          <Heading id={titleId} className="kw-page-header__title">
            {title}
          </Heading>
          {description ? (
            <div className="kw-page-header__description">{description}</div>
          ) : null}
          {metadata ? (
            <div className="kw-page-header__metadata">{metadata}</div>
          ) : null}
        </div>
        {actions ? (
          <div className="kw-page-header__actions">{actions}</div>
        ) : null}
      </header>
    );
  },
);
