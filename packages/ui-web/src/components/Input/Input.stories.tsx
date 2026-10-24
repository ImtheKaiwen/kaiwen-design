import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Proje adı',
    description: 'Ekip içinde kolayca ayırt edilebilen bir ad kullanın.',
    placeholder: 'Örn. Kaiwen Workspace',
    size: 'md',
  },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = {
  args: {
    defaultValue: 'x',
    errorText: 'Proje adı en az üç karakter olmalıdır.',
  },
};
export const Disabled: Story = {
  args: { defaultValue: 'Arşivlenmiş proje', disabled: true },
};
export const Required: Story = { args: { required: true } };
export const LongTurkishContent: Story = {
  args: {
    label: 'Kuruluş içinde görünecek açıklayıcı çalışma alanı adı',
    description:
      'Uzun Türkçe yardım metni ve kesintisizkimlikdeğerleri1234567890 düzeni yatay olarak genişletmemelidir.',
  },
};

function ControlledExample(args: Story['args']) {
  const [value, setValue] = useState('Kaiwen');
  const { label = 'Proje adı', ...inputProps } = args ?? {};
  return (
    <Input
      {...inputProps}
      label={label}
      value={value}
      onValueChange={setValue}
    />
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};
