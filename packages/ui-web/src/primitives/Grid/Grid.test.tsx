import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  it('uses min-width-safe tokenized layout attributes', () => {
    render(
      <Grid columns={3} gap="24" aria-label="Kart ızgarası">
        <div>İçerik</div>
      </Grid>,
    );
    const grid = screen.getByLabelText('Kart ızgarası');
    expect(grid).toHaveAttribute('data-columns', '3');
    expect(grid).toHaveAttribute('data-gap', '24');
  });
});
