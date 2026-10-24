import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: {
    label: 'Dosyalar yükleniyor',
    value: 64,
    max: 100,
    showValue: true,
    motion: 'inherit',
  },
  argTypes: {
    motion: {
      control: 'select',
      options: ['inherit', 'off', 'subtle', 'balanced', 'expressive'],
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithValueText: Story = {
  args: { value: 4, max: 10, valueText: '10 dosyadan 4 tanesi' },
};
export const Complete: Story = { args: { value: 100 } };
export const MotionOff: Story = { args: { motion: 'off' } };
export const LongTurkishLabel: Story = {
  args: {
    label:
      'Kuruluş çalışma alanındaki yüksek çözünürlüklü belgeler güvenli biçimde yükleniyor',
  },
};
