import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button/Button';
import { SuccessPage } from './SuccessPage';

const meta = {
  title: 'Patterns/SuccessPage',
  component: SuccessPage,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    title: 'Çalışma alanınız hazır',
    description: 'Davetler gönderildi ve takımınız çalışmaya başlayabilir.',
    details: <span>Çalışma alanı kimliği: KW-1042</span>,
    primaryAction: <Button>Çalışma alanını aç</Button>,
    secondaryAction: <Button variant="ghost">Ana sayfaya dön</Button>,
  },
} satisfies Meta<typeof SuccessPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongTurkishContent: Story = {
  args: {
    title: 'Çalışma alanınız ve bütün davet süreçleri başarıyla tamamlandı',
    description:
      'Uzun açıklamalar küçük ekranlarda taşmadan okunabilir kalır ve eylemler gerektiğinde yeni satıra geçer.',
  },
};
