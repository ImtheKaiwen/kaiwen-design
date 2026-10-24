import { forwardRef, type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Semantic surface treatment. Raised is reserved for meaningful elevation. */
  surface?: 'default' | 'subtle' | 'raised';
  /** Token-based internal spacing. */
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { surface = 'default', padding = 'md', className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={['kw-card', className].filter(Boolean).join(' ')}
      data-surface={surface}
      data-padding={padding}
    />
  );
});
