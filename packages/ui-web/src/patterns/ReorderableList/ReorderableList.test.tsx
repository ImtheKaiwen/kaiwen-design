import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { KaiwenProvider } from '../../providers/KaiwenProvider';
import {
  ReorderableList,
  type ReorderableListItem,
  type ReorderableListLabels,
} from './ReorderableList';

const initialItems: readonly ReorderableListItem[] = [
  { id: 'research', label: 'Araştırma', accessibleLabel: 'Araştırma' },
  { id: 'design', label: 'Tasarım', accessibleLabel: 'Tasarım' },
  { id: 'review', label: 'İnceleme', accessibleLabel: 'İnceleme' },
];

const labels: ReorderableListLabels = {
  list: 'Proje aşamaları',
  grab: (item) => `${item.accessibleLabel}: Sürükleme tutamacı`,
  moveUp: (item) => `${item.accessibleLabel}: Yukarı taşı`,
  moveDown: (item) => `${item.accessibleLabel}: Aşağı taşı`,
  pickedUp: (item, position, total) =>
    `${item.accessibleLabel} tutuldu. ${total} öğeden ${position}. sırada.`,
  moved: (item, position, total) =>
    `${item.accessibleLabel}, ${total} öğeden ${position}. sıraya taşındı.`,
  dropped: (item, position, total) =>
    `${item.accessibleLabel}, ${total} öğeden ${position}. sıraya bırakıldı.`,
  cancelled: (item) => `${item.accessibleLabel} taşıması iptal edildi.`,
};

function ControlledList({ disabled = false }: { disabled?: boolean }) {
  const [items, setItems] = useState(initialItems);
  return (
    <ReorderableList
      items={items}
      onReorder={setItems}
      labels={labels}
      disabled={disabled}
    />
  );
}

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});

describe('ReorderableList', () => {
  it('reorders with explicit touch-friendly actions', async () => {
    const user = userEvent.setup();
    render(<ControlledList />);
    await user.click(
      screen.getByRole('button', { name: 'Araştırma: Aşağı taşı' }),
    );
    const rows = within(
      screen.getByRole('list', { name: 'Proje aşamaları' }),
    ).getAllByRole('listitem');
    expect(rows.map((row) => row.textContent)).toEqual([
      'Tasarım',
      'Araştırma',
      'İnceleme',
    ]);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Araştırma, 3 öğeden 2. sıraya taşındı.',
    );
  });

  it('supports keyboard grab, reorder, drop and cancel', async () => {
    const user = userEvent.setup();
    render(<ControlledList />);
    const handle = screen.getByRole('button', {
      name: 'Araştırma: Sürükleme tutamacı',
    });
    handle.focus();
    await user.keyboard('{Space}');
    expect(
      screen.getByRole('button', {
        name: 'Araştırma: Sürükleme tutamacı',
      }),
    ).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Space}');
    expect(
      screen.getByRole('button', {
        name: 'Araştırma: Sürükleme tutamacı',
      }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Araştırma, 3 öğeden 2. sıraya bırakıldı.',
    );

    await user.keyboard('{Space}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Escape}');
    const rows = screen.getAllByRole('listitem');
    expect(rows[1]).toHaveTextContent('Araştırma');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Araştırma taşıması iptal edildi.',
    );
  });

  it('clears pointer state when a gesture is cancelled', () => {
    render(<ControlledList />);
    const handle = screen.getByRole('button', {
      name: 'Araştırma: Sürükleme tutamacı',
    });
    const row = handle.closest('li');
    fireEvent.pointerDown(handle, { pointerType: 'mouse', button: 0 });
    expect(row).toHaveAttribute('data-dragging', 'true');
    fireEvent.pointerCancel(handle);
    expect(row).not.toHaveAttribute('data-dragging');
  });

  it('disables every movement path and honors motion off', () => {
    render(
      <KaiwenProvider motion="off">
        <ControlledList disabled />
      </KaiwenProvider>,
    );
    expect(screen.getByRole('list')).toHaveAttribute(
      'data-motion-level',
      'off',
    );
    expect(
      screen
        .getAllByRole('button')
        .every((button) => button.hasAttribute('disabled')),
    ).toBe(true);
  });
});
