import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedBarChart } from './StackedBarChart';

const series = [
  { id: 'completed', label: 'Tamamlanan' },
  { id: 'review', label: 'İncelemede' },
  { id: 'blocked', label: 'Engellenen' },
];

const data = [
  {
    id: 'mon',
    label: 'Pazartesi',
    values: { completed: 18, review: 7, blocked: 3 },
  },
  {
    id: 'tue',
    label: 'Salı',
    values: { completed: 24, review: 9, blocked: 5 },
  },
  {
    id: 'wed',
    label: 'Çarşamba',
    values: { completed: 21, review: 12, blocked: 4 },
  },
  {
    id: 'thu',
    label: 'Perşembe',
    values: { completed: 29, review: 8, blocked: 2 },
  },
];

const meta = {
  title: 'Data/StackedBarChart',
  component: StackedBarChart,
  tags: ['autodocs'],
  args: {
    title: 'Haftalık kapasite dağılımı',
    description: 'Görev durumlarının günlük toplam içindeki payı',
    series,
    data,
    formatValue: (value: number) => `${value} görev`,
    formatAxisValue: (value: number) => String(Math.round(value)),
    plotLabel: 'Günlere göre yığılmış görev grafiği',
    legendLabel: 'Görev durumları',
    axisLabel: 'Görev sayısı ekseni',
    emptyState: 'Gösterilecek kapasite verisi yok.',
    loadingLabel: 'Kapasite grafiği yükleniyor',
  },
} satisfies Meta<typeof StackedBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const FixedAxisCeiling: Story = { args: { maxValue: 60 } };
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { data: [] } };
export const LongTurkishContent: Story = {
  args: {
    data: [
      {
        id: 'long',
        label: 'Kuruluş genelindeki araştırma çalışmaları',
        description: 'Öncelikli erişilebilirlik incelemeleri',
        values: { completed: 31, review: 13, blocked: 6 },
      },
      ...data.slice(1),
    ],
  },
};
export const MotionOff: Story = { args: { motion: 'off' } };
