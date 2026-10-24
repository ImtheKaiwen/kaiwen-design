import { X } from '@imthekaiwen/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'Components/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    title: 'Projeler yüklenemedi',
    description: 'Bağlantınızı kontrol edip yeniden deneyin.',
    icon: <X size={24} />,
    action: <Button>Yeniden dene</Button>,
    secondaryAction: <Button variant="ghost">Destek</Button>,
  },
};
export const WithoutAction: Story = {
  args: {
    title: 'Bu içerik kullanılamıyor',
    description: 'İçerik kaldırılmış veya erişim izniniz değişmiş olabilir.',
  },
};
export const LongTurkishContent: Story = {
  args: {
    title: 'Kuruluş ayarları geçici bir bağlantı sorunu nedeniyle yüklenemedi',
    description:
      'Çalışmalarınız kaybolmadı. Bağlantınızı kontrol ettikten sonra yeniden deneyebilir veya sorun devam ederse destek ekibiyle iletişime geçebilirsiniz.',
    action: <Button>Yeniden dene</Button>,
  },
};
