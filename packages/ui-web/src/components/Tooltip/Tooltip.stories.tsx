import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleHelp } from '@imthekaiwen/icons';
import { Button } from '../Button/Button';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    content: 'Bu tercih işletim sistemi ayarını izler.',
    children: (
      <Button variant="outline">
        <CircleHelp size={16} aria-hidden />
        Sistem tercihi
      </Button>
    ),
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Bottom: Story = { args: { side: 'bottom' } };
export const LongTurkishContent: Story = {
  args: {
    content:
      'Hareket azaltma tercihi, bileşen düzeyindeki expressive seçimin her zaman üzerinde uygulanır.',
  },
};
