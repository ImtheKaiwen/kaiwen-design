import { forwardRef, type HTMLAttributes } from 'react';
import type { SpaceToken } from '../Stack/Stack';

export interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  /** Horizontal and wrapped-row space from the shared spacing scale. */
  gap?: SpaceToken;
  /** Cross-axis alignment for children. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main-axis distribution for children. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Allows children to continue on a new row when horizontal space is limited. */
  wrap?: boolean;
}

/** Horizontal layout primitive that remains safe for long and localized content. */
export const Inline = forwardRef<HTMLDivElement, InlineProps>(function Inline(
  {
    gap = '12',
    align = 'center',
    justify = 'start',
    wrap = true,
    className,
    ...props
  },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={['kw-inline', className].filter(Boolean).join(' ')}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap}
    />
  );
});
