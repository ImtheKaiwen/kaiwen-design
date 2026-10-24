import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../components/Card/Card';
import { Grid } from './Grid';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: {
    columns: 3,
    gap: '16',
    children: (
      <>
        <Card>Tokenlar</Card>
        <Card>Motion</Card>
        <Card>Components</Card>
      </>
    ),
  },
} satisfies Meta<typeof Grid>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ThreeColumns: Story = {};
export const AutoResponsive: Story = { args: { columns: 'auto' } };
