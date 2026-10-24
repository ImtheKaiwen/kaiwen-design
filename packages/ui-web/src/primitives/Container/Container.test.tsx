import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('maps readable width and safe padding to constrained attributes', () => {
    render(
      <Container maxWidth="content" padding="24" aria-label="İçerik alanı">
        İçerik
      </Container>,
    );
    const container = screen.getByLabelText('İçerik alanı');

    expect(container).toHaveAttribute('data-max-width', 'content');
    expect(container).toHaveAttribute('data-padding', '24');
    expect(container).toHaveAttribute('data-centered', 'true');
  });

  it('forwards native props, class names and refs', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Container
        ref={ref}
        centered={false}
        className="consumer-layout"
        data-testid="container"
      />,
    );
    const container = screen.getByTestId('container');

    expect(ref.current).toBe(container);
    expect(container).toHaveClass('kw-container', 'consumer-layout');
    expect(container).not.toHaveAttribute('data-centered');
  });
});
