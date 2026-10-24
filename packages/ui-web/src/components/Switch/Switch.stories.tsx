import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'Hareketli önizlemeyi etkinleştir' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;
function ControlledExample(args: Story['args']) {
  const [checked, setChecked] = useState(false);
  return <Switch {...args} checked={checked} onCheckedChange={setChecked} />;
}
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Expressive: Story = {
  args: { defaultChecked: true, motion: 'expressive' },
};
export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};
