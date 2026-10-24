import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives/Stack/Stack';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    variant: 'rectangular',
    width: '18rem',
    height: '8rem',
    motion: 'inherit',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'rectangular', 'circular'],
    },
    motion: {
      control: 'select',
      options: ['inherit', 'off', 'subtle', 'balanced', 'expressive'],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Text: Story = {
  args: { variant: 'text', width: '16rem', height: undefined },
};
export const Avatar: Story = {
  args: { variant: 'circular', width: '3rem', height: '3rem' },
};
export const MotionOff: Story = { args: { motion: 'off' } };
export const CardGeometry: Story = {
  render: () => (
    <div aria-busy="true" aria-label="İçerik yükleniyor">
      <Stack gap="12">
        <Skeleton variant="rectangular" height="8rem" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="90%" />
      </Stack>
    </div>
  ),
};
