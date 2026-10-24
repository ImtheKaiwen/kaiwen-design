import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast';

function Harness() {
  const { toast, update, dismissAll } = useToast();
  return (
    <>
      <button onClick={() => toast({ id: 'first', title: 'İlk bildirim' })}>
        İlkini ekle
      </button>
      <button onClick={() => toast({ id: 'second', title: 'İkinci bildirim' })}>
        İkinciyi ekle
      </button>
      <button
        onClick={() =>
          toast({ id: 'upload', tone: 'loading', title: 'Dosyalar yükleniyor' })
        }
      >
        Yüklemeyi başlat
      </button>
      <button
        onClick={() =>
          update('upload', {
            tone: 'success',
            title: 'Dosyalar yüklendi',
            duration: 5000,
          })
        }
      >
        Yüklemeyi tamamla
      </button>
      <button onClick={dismissAll}>Tümünü kapat</button>
    </>
  );
}

describe('Toast', () => {
  it('queues notifications beyond the visible limit', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider
        maxVisible={1}
        duration={60_000}
        dismissLabel="Bildirimi kapat"
      >
        <Harness />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'İlkini ekle' }));
    await user.click(screen.getByRole('button', { name: 'İkinciyi ekle' }));
    expect(screen.getByText('İlk bildirim')).toBeInTheDocument();
    expect(screen.queryByText('İkinci bildirim')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Bildirimi kapat' }));
    expect(await screen.findByText('İkinci bildirim')).toBeInTheDocument();
  });

  it('updates a loading notification in place and supports dismissing all', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider duration={60_000}>
        <Harness />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Yüklemeyi başlat' }));
    expect(screen.getByText('Dosyalar yükleniyor')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Yüklemeyi tamamla' }));
    expect(screen.queryByText('Dosyalar yükleniyor')).not.toBeInTheDocument();
    expect(screen.getByText('Dosyalar yüklendi')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tümünü kapat' }));
    expect(screen.queryByText('Dosyalar yüklendi')).not.toBeInTheDocument();
  });

  it('runs an action once and dismisses its notification', async () => {
    const action = vi.fn();
    function ActionHarness() {
      const { toast } = useToast();
      return (
        <button
          onClick={() =>
            toast({
              title: 'Bağlantı kurulamadı',
              tone: 'danger',
              action: { label: 'Yeniden dene', onClick: action },
            })
          }
        >
          Hata göster
        </button>
      );
    }
    const user = userEvent.setup();
    render(
      <ToastProvider duration={60_000}>
        <ActionHarness />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Hata göster' }));
    await user.click(screen.getByRole('button', { name: 'Yeniden dene' }));
    expect(action).toHaveBeenCalledOnce();
    expect(screen.queryByText('Bağlantı kurulamadı')).not.toBeInTheDocument();
  });
});
