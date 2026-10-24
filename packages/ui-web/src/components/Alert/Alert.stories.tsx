import { Check, CircleHelp, X } from '@imthekaiwen/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: 'Değişiklikleriniz otomatik olarak kaydedildi.',
    children: 'Bu sayfadan güvenle ayrılabilirsiniz.',
    tone: 'neutral',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Info: Story = {
  args: {
    tone: 'info',
    title: 'Yeni sürüm kullanılabilir',
    icon: <CircleHelp size={18} />,
  },
};
export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Dosyalar yüklendi',
    icon: <Check size={18} />,
  },
};
export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'Oturum sona ermek üzere',
    action: <Button size="sm">Oturumu uzat</Button>,
  },
};
export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'Yükleme başarısız',
    icon: <X size={18} />,
    action: (
      <Button size="sm" variant="outline">
        Yeniden dene
      </Button>
    ),
  },
};
export const LongTurkishContent: Story = {
  args: {
    title: 'Bu değişiklik kuruluşunuzdaki tüm çalışma alanlarını etkileyebilir',
    children:
      'Devam etmeden önce erişim politikalarını ve uzun süreli saklama kurallarını dikkatle gözden geçirin.',
    tone: 'warning',
  },
};
