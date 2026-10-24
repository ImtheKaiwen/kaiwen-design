import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ComponentRegistry } from './ComponentRegistry';

describe('ComponentRegistry', () => {
  it('filters generated component metadata and exposes API details', async () => {
    const user = userEvent.setup();
    render(<ComponentRegistry />);
    expect(screen.getByText('12 / 37 bileşen gösteriliyor')).toBeVisible();

    await user.type(
      screen.getByRole('textbox', { name: 'Bileşen ara' }),
      'GroupedBarChart',
    );
    expect(screen.getByText('1 bileşen gösteriliyor')).toBeVisible();
    const entry = screen.getByText('GroupedBarChart').closest('details');
    expect(entry).not.toBeNull();
    await user.click(within(entry as HTMLElement).getByText('GroupedBarChart'));
    expect(
      within(entry as HTMLElement).getByText(
        "import { GroupedBarChart } from '@imthekaiwen/ui-web/data'",
      ),
    ).toBeVisible();
    expect(within(entry as HTMLElement).getByText('plotLabel')).toBeVisible();
  });
});
