import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('supports uncontrolled pointer and keyboard changes', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Bildirimler" />);
    const control = screen.getByRole('switch', { name: 'Bildirimler' });
    expect(control).toHaveAttribute('aria-checked', 'false');
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    control.focus();
    await user.keyboard(' ');
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('uses the controlled state as source of truth', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        checked={false}
        onCheckedChange={onCheckedChange}
        aria-label="Tema"
      />,
    );
    const control = screen.getByRole('switch');
    await userEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('does not change while disabled', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch disabled onCheckedChange={onCheckedChange} aria-label="Kapalı" />,
    );
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
