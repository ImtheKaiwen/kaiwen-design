import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Inline } from './Inline';

describe('Inline', () => {
  it('maps layout choices to stable data attributes', () => {
    render(
      <Inline
        data-testid="inline"
        gap="24"
        align="baseline"
        justify="between"
        wrap={false}
      >
        <span>Birinci</span>
        <span>İkinci</span>
      </Inline>,
    );

    expect(screen.getByTestId('inline')).toHaveAttribute('data-gap', '24');
    expect(screen.getByTestId('inline')).toHaveAttribute(
      'data-align',
      'baseline',
    );
    expect(screen.getByTestId('inline')).toHaveAttribute(
      'data-justify',
      'between',
    );
    expect(screen.getByTestId('inline')).toHaveAttribute('data-wrap', 'false');
  });

  it('forwards native attributes and its ref', () => {
    let element: HTMLDivElement | null = null;
    render(
      <Inline
        ref={(node) => {
          element = node;
        }}
        aria-label="Hızlı eylemler"
      >
        İçerik
      </Inline>,
    );

    expect(screen.getByLabelText('Hızlı eylemler')).toBe(element);
  });
});
