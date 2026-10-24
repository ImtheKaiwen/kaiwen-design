import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('supports uncontrolled pointer and keyboard changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox label="Bildirimleri al" onCheckedChange={onCheckedChange} />,
    );
    const checkbox = screen.getByRole('checkbox', {
      name: 'Bildirimleri al',
    });

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    checkbox.focus();
    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, false);
  });

  it('exposes a controlled indeterminate state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        checked="indeterminate"
        label="Tüm projeleri seç"
        onCheckedChange={onCheckedChange}
      />,
    );
    const checkbox = screen.getByRole('checkbox', {
      name: 'Tüm projeleri seç',
    }) as HTMLInputElement;

    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox.indeterminate).toBe(true);
    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('preserves native disabled behavior', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        disabled
        label="Kilitli seçenek"
        onCheckedChange={onCheckedChange}
      />,
    );
    const checkbox = screen.getByRole('checkbox', {
      name: 'Kilitli seçenek',
    });
    await user.click(checkbox);
    expect(checkbox).toBeDisabled();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
