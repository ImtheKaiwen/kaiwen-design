import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    motion: {
      control: 'select',
      options: ['inherit', 'off', 'subtle', 'balanced', 'expressive'],
    },
  },
  args: { children: 'Projeyi oluştur', variant: 'primary', size: 'md' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Loading: Story = {
  args: { loading: true, children: 'Kaydediliyor' },
};
export const Disabled: Story = { args: { disabled: true } };
export const LongTurkishLabel: Story = {
  args: {
    children: 'Değişiklikleri kaydet ve çalışma alanına güvenli biçimde dön',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const Expressive: Story = { args: { motion: 'expressive' } };
