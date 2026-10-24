import type { Meta, StoryObj } from '@storybook/react-vite';
import { PieChart } from './PieChart';

const data = [
  { id: 'design', label: 'Tasarım', value: 38 },
  { id: 'research', label: 'Araştırma', value: 27 },
  { id: 'engineering', label: 'Mühendislik', value: 21 },
  { id: 'operations', label: 'Operasyon', value: 14 },
];

const meta = {
  title: 'Data/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  args: {
    title: 'Çalışma alanı dağılımı',
    description: 'Aktif projelerin disiplinlere göre payı',
    data,
    formatValue: (value: number) => `%${value}`,
    segmentsLabel: 'Proje dağılımı dilimleri',
    emptyState: 'Gösterilecek dağılım verisi yok.',
    loadingLabel: 'Dağılım grafiği yükleniyor',
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { data: [] } };
export const LongTurkishContent: Story = {
  args: {
    data: [
      {
        id: 'long',
        label: 'Kuruluş genelindeki erişilebilirlik araştırmaları',
        description: 'Bir önceki döneme göre artış gösteren alan',
        value: 64,
      },
      { id: 'product', label: 'Ürün keşfi', value: 36 },
    ],
  },
};
export const MotionOff: Story = { args: { motion: 'off' } };
