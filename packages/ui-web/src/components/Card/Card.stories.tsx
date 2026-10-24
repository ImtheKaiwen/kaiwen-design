import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: 'Sade yüzeyler içerik hiyerarşisini tipografi ve boşlukla korur.',
    surface: 'default',
    padding: 'md',
  },
  argTypes: {
    surface: { control: 'select', options: ['default', 'subtle', 'raised'] },
    padding: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Subtle: Story = { args: { surface: 'subtle' } };
export const Raised: Story = { args: { surface: 'raised' } };
export const LongTurkishContent: Story = {
  args: {
    children:
      'Çok uzun Türkçe içerik ve kesintisizkimlikdeğerleri1234567890 düzeni yatay olarak genişletmemeli; metin güvenli biçimde satıra yayılmalıdır.',
  },
};
