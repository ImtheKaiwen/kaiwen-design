import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { KaiwenProvider } from '../../providers/KaiwenProvider';
import { BarChart } from './BarChart';

const data = [
  { id: 'design', label: 'Tasarım', value: 24 },
  {
    id: 'research',
    label: 'Uzun Türkçe araştırma alanı',
    value: 12,
    description: 'Son yedi gün',
  },
] as const;

const baseProps = {
  title: 'Aktif projeler',
  description: 'Takımlara göre dağılım',
  data,
  formatValue: (value: number) => `${value} proje`,
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

describe('BarChart', () => {
  it('exposes every visible label and formatted value semantically', () => {
    render(<BarChart {...baseProps} />);
    expect(
      screen.getByRole('figure', { name: /Aktif projeler/ }),
    ).toBeVisible();
    expect(
      screen.getByRole('img', { name: 'Tasarım: 24 proje' }),
    ).toBeVisible();
    expect(screen.getByText('12 proje')).toBeVisible();
    expect(screen.getByText('Son yedi gün')).toBeVisible();
  });

  it('renders stable loading and empty states', () => {
    const { rerender } = render(<BarChart {...baseProps} loading />);
    expect(
      screen.getByRole('status', { name: 'Grafik yükleniyor' }),
    ).toBeVisible();

    rerender(<BarChart {...baseProps} data={[]} />);
    expect(screen.getByText('Gösterilecek veri yok')).toBeVisible();
    expect(screen.getByRole('figure')).not.toHaveAttribute('aria-busy');
  });

  it('honors the global reduced-motion-compatible policy', () => {
    render(
      <KaiwenProvider motion="off">
        <BarChart {...baseProps} />
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

  it('supports vertical comparison and keyboard tooltip access', () => {
    render(<BarChart {...baseProps} orientation="vertical" />);
    expect(screen.getByRole('figure')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
    expect(
      screen.getByRole('img', { name: 'Tasarım: 24 proje' }),
    ).toHaveAttribute('tabindex', '0');
  });
});
