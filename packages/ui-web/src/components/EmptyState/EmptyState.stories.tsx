import { CircleHelp } from '@imthekaiwen/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    title: 'Henüz proje yok',
    description: 'İlk projenizi oluşturarak başlayın.',
    icon: <CircleHelp size={24} />,
    action: <Button>Proje oluştur</Button>,
  },
};
export const SearchResults: Story = {
  args: {
    title: 'Sonuç bulunamadı',
    description: 'Filtreleri temizleyin veya başka bir arama terimi deneyin.',
    secondaryAction: <Button variant="outline">Filtreleri temizle</Button>,
  },
};
export const LongTurkishContent: Story = {
  args: {
    title:
      'Bu çalışma alanında henüz paylaşılmış bir tasarım sistemi kaynağı bulunmuyor',
    description:
      'Ekibinizle paylaşılabilecek ilk kaynağı oluşturabilir veya kuruluş yöneticinizden mevcut kaynaklara erişim isteyebilirsiniz.',
    action: <Button>İlk kaynağı oluştur</Button>,
  },
};
