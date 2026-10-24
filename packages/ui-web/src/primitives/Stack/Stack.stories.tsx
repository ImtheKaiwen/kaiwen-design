import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../components/Card/Card';
import { Stack } from './Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    gap: '16',
    children: (
      <>
        <Card>Birinci öğe</Card>
        <Card>İkinci öğe</Card>
        <Card>Üçüncü öğe</Card>
      </>
    ),
  },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Spacious: Story = { args: { gap: '32' } };
