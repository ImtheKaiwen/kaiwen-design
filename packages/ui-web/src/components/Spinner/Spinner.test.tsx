import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('announces its localized loading label', () => {
    render(<Spinner label="Projeler yükleniyor" />);
    expect(
      screen.getByRole('status', { name: 'Projeler yükleniyor' }),
    ).toBeInTheDocument();
  });

  it('supports size and motion policies', () => {
    render(<Spinner label="Yükleniyor" size="lg" motion="off" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('data-size', 'lg');
    expect(spinner).toHaveAttribute('data-motion-level', 'off');
  });
});
