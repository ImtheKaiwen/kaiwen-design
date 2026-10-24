import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Stack } from '../../primitives/Stack/Stack';
import { ToastProvider, useToast } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

function ToastPlayground() {
  const { toast, update } = useToast();
  const startUpload = () => {
    const id = toast({
      id: 'storybook-upload',
      tone: 'loading',
      title: 'Dosyalar yükleniyor',
      description: 'Pencereyi kapatmadan bekleyin.',
    });
    window.setTimeout(
      () =>
        update(id, {
          tone: 'success',
          title: 'Dosyalar yüklendi',
          description: 'Tüm dosyalar kullanıma hazır.',
          duration: 5000,
        }),
      1200,
    );
  };
  return (
    <Stack gap="12" align="start">
      <Button
        onClick={() =>
          toast({ tone: 'info', title: 'Yeni sürüm kullanılabilir' })
        }
      >
        Bilgi bildirimi
      </Button>
      <Button variant="outline" onClick={startUpload}>
        Loading → success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            tone: 'danger',
            title: 'Bağlantı kurulamadı',
            description: 'Ağ ayarlarınızı kontrol edin.',
            action: { label: 'Yeniden dene', onClick: () => undefined },
          })
        }
      >
        Hata ve eylem
      </Button>
    </Stack>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider label="Bildirimler" dismissLabel="Bildirimi kapat">
      <ToastPlayground />
    </ToastProvider>
  ),
};
export const SingleVisibleQueue: Story = {
  render: () => (
    <ToastProvider
      maxVisible={1}
      label="Bildirimler"
      dismissLabel="Bildirimi kapat"
    >
      <ToastPlayground />
    </ToastProvider>
  ),
};
