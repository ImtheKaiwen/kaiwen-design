import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: 'Haftalık ürün güncellemelerini al' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { checked: 'indeterminate' } };
export const Disabled: Story = { args: { disabled: true } };
export const WithDescription: Story = {
  args: {
    label: 'Araştırma davetlerini kabul et',
    description:
      'Yeni çalışmalar uygun olduğunda e-posta ile bilgilendirilirsiniz.',
  },
};
export const LongTurkishContent: Story = {
  args: {
    label:
      'Kuruluş genelindeki yeni proje, güvenlik ve erişilebilirlik güncellemeleri hakkında ayrıntılı bildirimleri al',
  },
};
