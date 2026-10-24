import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';
import { CommandPalette } from './CommandPalette';

const items = [
  { id: 'foundations', label: 'Foundations', keywords: ['token'] },
  { id: 'components', label: 'Components', description: 'Bileşen kataloğu' },
  { id: 'disabled', label: 'Yönetici ayarları', disabled: true },
];

function renderPalette(onSelect = vi.fn()) {
  return {
    onSelect,
    ...render(
      <CommandPalette
        title="Hızlı komutlar"
        description="Bir bölüme gidin veya işlem başlatın."
        searchLabel="Komut ara"
        placeholder="Ara"
        emptyLabel="Sonuç yok"
        closeLabel="Kapat"
        items={items}
        onSelect={onSelect}
        trigger={<Button>Komutları aç</Button>}
        enableShortcut
      />,
    ),
  };
}

describe('CommandPalette', () => {
  it('filters commands, navigates with the keyboard and restores trigger focus', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderPalette();
    const trigger = screen.getByRole('button', { name: 'Komutları aç' });
    await user.click(trigger);

    expect(screen.getByText('Hızlı komutlar')).toBeVisible();
    expect(
      screen.getByText('Bir bölüme gidin veya işlem başlatın.'),
    ).toBeVisible();

    const input = screen.getByRole('combobox', { name: 'Komut ara' });
    expect(input).toHaveFocus();
    await user.type(input, 'bileşen');
    expect(screen.getByRole('option', { name: /Components/ })).toBeVisible();
    expect(screen.queryByRole('option', { name: /Foundations/ })).toBeNull();
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'components' }),
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('supports the global shortcut, skips disabled commands and closes with Escape', async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard('{Control>}k{/Control}');
    expect(
      screen.getByRole('dialog', { name: 'Hızlı komutlar' }),
    ).toBeVisible();

    const input = screen.getByRole('combobox', { name: 'Komut ara' });
    await user.keyboard('{End}');
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      expect.stringContaining('components'),
    );
    expect(
      screen.getByRole('option', { name: 'Yönetici ayarları' }),
    ).toBeDisabled();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
