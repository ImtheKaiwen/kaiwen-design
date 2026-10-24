import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is decorative and reserves the requested geometry', () => {
    const { container } = render(<Skeleton width="12rem" height="3rem" />);
    const skeleton = container.firstElementChild;
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveStyle({ width: '12rem', height: '3rem' });
  });

  it('supports disabling its optional motion', () => {
    const { container } = render(<Skeleton motion="off" />);
    expect(container.firstElementChild).toHaveAttribute(
      'data-motion-level',
      'off',
    );
  });
});
