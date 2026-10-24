import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { KaiwenProvider } from '../../providers/KaiwenProvider';
import { PieChart } from './PieChart';

const baseProps = {
  title: 'Proje dağılımı',
  description: 'Takımlara göre pay',
  data: [
    { id: 'design', label: 'Tasarım', value: 60 },
    { id: 'research', label: 'Araştırma', value: 40 },
  ],
  formatValue: (value: number) => `%${value}`,
  segmentsLabel: 'Proje dağılımı dilimleri',
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

describe('PieChart', () => {
  it('keeps every segment available through visible and focusable content', () => {
    render(<PieChart {...baseProps} />);
    expect(
      screen.getByRole('figure', { name: /Proje dağılımı/ }),
    ).toBeVisible();
    expect(screen.getByText('%60')).toBeVisible();
    expect(
      screen.getByRole('group', { name: 'Proje dağılımı dilimleri' }),
    ).toBeVisible();
    expect(screen.getByRole('img', { name: 'Tasarım: %60' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('renders stable loading and empty states', () => {
    const { rerender } = render(<PieChart {...baseProps} loading />);
    expect(
      screen.getByRole('status', { name: 'Grafik yükleniyor' }),
    ).toBeVisible();
    rerender(<PieChart {...baseProps} data={[]} />);
    expect(screen.getByText('Gösterilecek veri yok')).toBeVisible();
  });

  it('honors the reduced-motion-compatible policy', () => {
    render(
      <KaiwenProvider motion="off">
        <PieChart {...baseProps} />
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
