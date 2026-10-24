import type { Meta, StoryObj } from '@storybook/react-vite';
import { GroupedBarChart } from './GroupedBarChart';

const series = [
  { id: 'created', label: 'Oluşturulan' },
  { id: 'completed', label: 'Tamamlanan' },
  { id: 'review', label: 'İncelemede' },
];

const data = [
  {
    id: 'mon',
    label: 'Pazartesi',
    values: { created: 18, completed: 12, review: 5 },
  },
  {
    id: 'tue',
    label: 'Salı',
    values: { created: 26, completed: 19, review: 8 },
  },
  {
    id: 'wed',
    label: 'Çarşamba',
    values: { created: 21, completed: 24, review: 7 },
  },
  {
    id: 'thu',
    label: 'Perşembe',
    values: { created: 32, completed: 27, review: 11 },
  },
];

const meta = {
  title: 'Data/GroupedBarChart',
  component: GroupedBarChart,
  tags: ['autodocs'],
  args: {
    title: 'Haftalık iş akışı',
    description: 'Durumlara göre günlük görev sayısı',
    series,
    data,
    formatValue: (value: number) => `${value} görev`,
    plotLabel: 'Günlere ve durumlara göre görev grafiği',
    legendLabel: 'Görev durumları',
    emptyState: 'Gösterilecek iş akışı verisi yok.',
    loadingLabel: 'İş akışı grafiği yükleniyor',
  },
} satisfies Meta<typeof GroupedBarChart>;

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
        label: 'Kuruluş genelindeki araştırma çalışmaları',
        description: 'Öncelikli erişilebilirlik incelemeleri',
        values: { created: 31, completed: 22, review: 13 },
      },
      ...data.slice(1),
    ],
  },
};
export const MotionOff: Story = { args: { motion: 'off' } };
