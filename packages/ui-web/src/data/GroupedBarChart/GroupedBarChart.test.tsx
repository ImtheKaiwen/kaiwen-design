import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { KaiwenProvider } from '../../providers/KaiwenProvider';
import { GroupedBarChart } from './GroupedBarChart';

const series = [
  { id: 'created', label: 'Oluşturulan' },
  { id: 'completed', label: 'Tamamlanan' },
] as const;
const data = [
  {
    id: 'monday',
    label: 'Pazartesi',
    description: 'Haftanın başlangıcı',
    values: { created: 18, completed: 12 },
  },
] as const;
const baseProps = {
  title: 'Haftalık iş akışı',
  data,
  series,
  formatValue: (value: number) => `${value} görev`,
  plotLabel: 'İş akışı karşılaştırması',
  legendLabel: 'Görev durumları',
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

describe('GroupedBarChart', () => {
  it('keeps series, category labels, values and keyboard tooltips visible', () => {
    render(<GroupedBarChart {...baseProps} />);
    expect(
      screen.getByRole('figure', { name: 'Haftalık iş akışı' }),
    ).toBeVisible();
    expect(screen.getByRole('list', { name: 'Görev durumları' })).toBeVisible();
    expect(screen.getByText('Haftanın başlangıcı')).toBeVisible();
    expect(
      screen.getByRole('img', { name: 'Pazartesi, Oluşturulan: 18 görev' }),
    ).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('12 görev')).toBeVisible();
  });

  it('renders stable loading and empty states', () => {
    const { rerender } = render(<GroupedBarChart {...baseProps} loading />);
    expect(
      screen.getByRole('status', { name: 'Grafik yükleniyor' }),
    ).toBeVisible();
    rerender(<GroupedBarChart {...baseProps} data={[]} />);
    expect(screen.getByText('Gösterilecek veri yok')).toBeVisible();
    expect(screen.getByRole('figure')).not.toHaveAttribute('aria-busy');
  });

  it('honors the reduced-motion-compatible provider policy', () => {
    render(
      <KaiwenProvider motion="off">
        <GroupedBarChart {...baseProps} />
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
