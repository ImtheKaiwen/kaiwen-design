import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('forwards native attributes and exposes token variants', () => {
    render(
      <Card surface="raised" padding="lg" aria-label="Proje özeti">
        İçerik
      </Card>,
    );
    const card = screen.getByLabelText('Proje özeti');
    expect(card).toHaveAttribute('data-surface', 'raised');
    expect(card).toHaveAttribute('data-padding', 'lg');
    expect(card).toHaveTextContent('İçerik');
  });
});
