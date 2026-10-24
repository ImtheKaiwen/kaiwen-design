import { forwardRef, type HTMLAttributes } from 'react';

export type SpaceToken =
  | '0'
  | '4'
  | '8'
  | '12'
  | '16'
  | '20'
  | '24'
  | '32'
  | '40'
  | '48'
  | '64';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Vertical space between children, mapped to the shared spacing scale. */
  gap?: SpaceToken;
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { gap = '16', align = 'stretch', className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={['kw-stack', className].filter(Boolean).join(' ')}
      data-gap={gap}
      data-align={align}
    />
  );
});
