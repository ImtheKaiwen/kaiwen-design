import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { KaiwenProvider } from '../../providers/KaiwenProvider';
import { StackedBarChart } from './StackedBarChart';

const series = [
  { id: 'completed', label: 'Tamamlanan' },
  { id: 'review', label: 'İncelemede' },
] as const;
const data = [
  {
    id: 'monday',
    label: 'Pazartesi',
    description: 'Haftanın başlangıcı',
    values: { completed: 12, review: 6 },
  },
] as const;
const baseProps = {
  title: 'Haftalık kapasite',
  data,
  series,
  formatValue: (value: number) => `${value} görev`,
  formatAxisValue: (value: number) => String(Math.round(value)),
  plotLabel: 'Kapasite grafiği',
  legendLabel: 'Görev durumları',
  axisLabel: 'Görev sayısı ekseni',
  emptyState: 'Gösterilecek veri yok',
  loadingLabel: 'Grafik yükleniyor',
};

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

describe('StackedBarChart', () => {
  it('renders a visible axis, totals and keyboard-focusable segments', () => {
    render(<StackedBarChart {...baseProps} />);
    expect(
      screen.getByRole('figure', { name: 'Haftalık kapasite' }),
    ).toBeVisible();
    expect(screen.getByRole('list', { name: 'Görev durumları' })).toBeVisible();
    expect(
      screen.getByRole('list', { name: 'Görev sayısı ekseni' }),
    ).toBeVisible();
    expect(screen.getByText('18 görev')).toBeVisible();
    expect(
      screen.getByRole('button', {
        name: 'Pazartesi, İncelemede: 6 görev',
      }),
    ).toBeVisible();
  });

  it('supports horizontal layout without changing the data contract', () => {
    render(<StackedBarChart {...baseProps} orientation="horizontal" />);
    expect(screen.getByRole('figure')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
    expect(screen.getByText('Haftanın başlangıcı')).toBeVisible();
  });

  it('opens segment details from keyboard focus', async () => {
    const user = userEvent.setup();
    render(<StackedBarChart {...baseProps} />);
    await user.tab();
    await user.tab();
    expect(
      await screen.findByRole('tooltip', {
        name: 'Pazartesi, Tamamlanan: 12 görev',
      }),
    ).toBeVisible();
  });

  it('renders stable loading and empty states', () => {
    const { rerender } = render(<StackedBarChart {...baseProps} loading />);
    expect(
      screen.getByRole('status', { name: 'Grafik yükleniyor' }),
    ).toBeVisible();
    rerender(<StackedBarChart {...baseProps} data={[]} />);
    expect(screen.getByText('Gösterilecek veri yok')).toBeVisible();
    expect(screen.getByRole('figure')).not.toHaveAttribute('aria-busy');
  });

  it('honors the reduced-motion-compatible provider policy', () => {
    render(
      <KaiwenProvider motion="off">
        <StackedBarChart {...baseProps} />
      </KaiwenProvider>,
    );
    expect(screen.getByRole('figure')).toHaveAttribute(
      'data-motion-level',
      'off',
    );
    expect(screen.getByRole('figure')).toHaveStyle({
      '--kw-chart-motion-duration': '0ms',
    });
  });
});
