import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  {
    value: 'standard',
    label: 'Standard',
    description: 'Dengeli işlem süresi ve maliyet.',
  },
  {
    value: 'fast',
    label: 'Fast',
    description: 'Öncelikli ve daha hızlı işlem.',
  },
  { value: 'flex', label: 'Flex', description: 'Esnek kapasite kullanımı.' },
] as const;

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Varsayılan servis katmanı',
    options,
    defaultValue: 'standard',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { disabled: true } };
export const LongTurkishContent: Story = {
  args: {
    label: 'Kuruluş genelinde kullanılacak varsayılan servis katmanı',
    options: [
      {
        value: 'long',
        label: 'Standart işlem katmanı',
        description:
          'Uzun Türkçe açıklamalar dar ekranda yatay taşma oluşturmadan okunur.',
      },
      ...options,
    ],
    defaultValue: 'long',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
