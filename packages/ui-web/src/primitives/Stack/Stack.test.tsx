import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('maps layout props to constrained token attributes', () => {
    render(
      <Stack gap="24" align="center" aria-label="Dikey grup">
        <span>Bir</span>
      </Stack>,
    );
    const stack = screen.getByLabelText('Dikey grup');
    expect(stack).toHaveAttribute('data-gap', '24');
    expect(stack).toHaveAttribute('data-align', 'center');
  });
});
