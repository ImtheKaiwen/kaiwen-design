import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

const labels = {
  navigation: 'Proje sayfaları',
  previous: 'Önceki',
  next: 'Sonraki',
  pageStatus: (page: number, pageCount: number) =>
    `${page} / ${pageCount}. sayfa`,
};

describe('Pagination', () => {
  it('uses landmark and button semantics for keyboard navigation', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        page={2}
        pageCount={4}
        labels={labels}
        onPageChange={onPageChange}
      />,
    );

    expect(
      screen.getByRole('navigation', { name: labels.navigation }),
    ).toBeVisible();
    const next = screen.getByRole('button', { name: labels.next });
    next.focus();
    await user.keyboard('{Enter}');
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole('button', { name: labels.previous }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByText('2 / 4. sayfa')).toBeVisible();
  });

  it('clamps status and disables unavailable directions', () => {
    render(
      <Pagination
        page={9}
        pageCount={0}
        labels={labels}
        onPageChange={() => undefined}
      />,
    );
    expect(screen.getByText('1 / 1. sayfa')).toBeVisible();
    expect(
      screen.getByRole('button', { name: labels.previous }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: labels.next })).toBeDisabled();
  });
});
