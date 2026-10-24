import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ThemePreference } from '@imthekaiwen/tokens';
import { ThemeSwitcher } from './ThemeSwitcher';

const labels = { light: 'Açık', dark: 'Koyu', system: 'Sistem' };

describe('ThemeSwitcher', () => {
  it('updates an uncontrolled preference with accessible pressed state', async () => {
    render(
      <ThemeSwitcher label="Tema" labels={labels} defaultValue="system" />,
    );

    expect(screen.getByRole('button', { name: 'Sistem' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Koyu' }));
    expect(screen.getByRole('button', { name: 'Koyu' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('supports controlled state and reports the requested value', async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState<ThemePreference>('light');
      return (
        <ThemeSwitcher
          label="Tema tercihi"
          labels={labels}
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
        />
      );
    }
    render(<Controlled />);

    await userEvent.click(screen.getByRole('button', { name: 'Koyu' }));
    expect(onValueChange).toHaveBeenCalledWith('dark');
    expect(screen.getByRole('button', { name: 'Koyu' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('prevents changes while disabled', async () => {
    const onValueChange = vi.fn();
    render(
      <ThemeSwitcher
        label="Tema"
        labels={labels}
        disabled
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Açık' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
