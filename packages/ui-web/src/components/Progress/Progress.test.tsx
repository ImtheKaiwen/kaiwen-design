import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('exposes a labelled measurable value', () => {
    render(
      <Progress
        label="Dosyalar yükleniyor"
        value={4}
        max={10}
        valueText="10 dosyadan 4 tanesi"
      />,
    );
    const progress = screen.getByRole('progressbar', {
      name: 'Dosyalar yükleniyor',
    });
    expect(progress).toHaveAttribute('aria-valuenow', '4');
    expect(progress).toHaveAttribute('aria-valuemax', '10');
    expect(progress).toHaveAttribute('aria-valuetext', '10 dosyadan 4 tanesi');
  });

  it('clamps invalid ranges and supports motion off', () => {
    render(
      <Progress
        label="İşleniyor"
        value={140}
        max={100}
        motion="off"
        showValue
      />,
    );
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
    expect(progress).toHaveAttribute('data-motion-level', 'off');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
