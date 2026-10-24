import { forwardRef, type HTMLAttributes } from 'react';
import type { SpaceToken } from '../Stack/Stack';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Requested desktop columns; auto uses tokenized minimum card width. */
  columns?: 1 | 2 | 3 | 4 | 'auto';
  /** Grid gap from the shared spacing scale. */
  gap?: SpaceToken;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 'auto', gap = '16', className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={['kw-grid', className].filter(Boolean).join(' ')}
      data-columns={columns}
      data-gap={gap}
    />
  );
});
