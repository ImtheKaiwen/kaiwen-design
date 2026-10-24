import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('uses button semantics and defaults to type button', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Kaydet</Button>);
    const button = screen.getByRole('button', { name: 'Kaydet' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('prevents activation and reports busy while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Kaydet
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Kaydet' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('clears pressed state on pointer cancellation and keyboard release', () => {
    render(<Button>Basılı tut</Button>);
    const button = screen.getByRole('button');
    fireEvent.pointerDown(button, { button: 0 });
    expect(button).toHaveAttribute('data-pressed', 'true');
    fireEvent.pointerCancel(button);
    expect(button).not.toHaveAttribute('data-pressed');
    fireEvent.keyDown(button, { key: ' ' });
    expect(button).toHaveAttribute('data-pressed', 'true');
    fireEvent.keyUp(button, { key: ' ' });
    expect(button).not.toHaveAttribute('data-pressed');
  });
});
