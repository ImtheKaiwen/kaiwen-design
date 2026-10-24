import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives/Stack/Stack';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { label: 'İçerik yükleniyor', size: 'md', motion: 'inherit' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    motion: {
      control: 'select',
      options: ['inherit', 'off', 'subtle', 'balanced', 'expressive'],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MotionOff: Story = { args: { motion: 'off' } };
export const Sizes: Story = {
  render: () => (
    <Stack gap="16" align="center">
      <Spinner label="Küçük yükleme göstergesi" size="sm" />
      <Spinner label="Orta yükleme göstergesi" />
      <Spinner label="Büyük yükleme göstergesi" size="lg" />
    </Stack>
  ),
};
