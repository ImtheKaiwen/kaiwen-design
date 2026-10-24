import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';

const data = [
  { id: 'mon', label: 'Pazartesi', value: 42 },
  { id: 'tue', label: 'Salı', value: 68 },
  { id: 'wed', label: 'Çarşamba', value: 51 },
  { id: 'thu', label: 'Perşembe', value: 84 },
  { id: 'fri', label: 'Cuma', value: 73 },
];

const meta = {
  title: 'Data/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: {
    title: 'Haftalık aktif kullanım',
    description: 'Son beş iş günündeki aktif çalışma alanları',
    data,
    formatValue: (value: number) => `${value} aktif`,
    emptyState: 'Gösterilecek kullanım verisi yok.',
    loadingLabel: 'Kullanım grafiği yükleniyor',
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Loading: Story = { args: { loading: true } };
export const VerticalLoading: Story = {
  args: { loading: true, orientation: 'vertical' },
};
export const Empty: Story = { args: { data: [] } };
export const LongTurkishContent: Story = {
  args: {
    data: [
      {
        id: 'long',
        label: 'Kuruluş genelindeki araştırma ve erişilebilirlik çalışmaları',
        description: 'Bir önceki döneme göre yüzde on iki artış',
        value: 78,
      },
      { id: 'short', label: 'Ürün keşfi', value: 46 },
    ],
  },
};
export const MotionOff: Story = { args: { motion: 'off' } };
