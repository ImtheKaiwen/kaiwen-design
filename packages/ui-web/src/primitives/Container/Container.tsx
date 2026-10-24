import { forwardRef, type HTMLAttributes } from 'react';
import type { SpaceToken } from '../Stack/Stack';

export type ContainerMaxWidth = 'narrow' | 'content' | 'wide' | 'full';
export type ContainerPadding = SpaceToken | 'responsive';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum readable width. Full keeps the container fluid without a width cap. */
  maxWidth?: ContainerMaxWidth;
  /** Inline safe-area spacing, constrained to the shared spacing scale. */
  padding?: ContainerPadding;
  /** Centers a width-constrained container in its available space. */
  centered?: boolean;
}

/** Constrains page content to a readable, overflow-safe horizontal region. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container(
    {
      maxWidth = 'wide',
      padding = 'responsive',
      centered = true,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <div
        {...props}
        ref={ref}
        className={['kw-container', className].filter(Boolean).join(' ')}
        data-max-width={maxWidth}
        data-padding={padding}
        data-centered={centered || undefined}
      />
    );
  },
);
