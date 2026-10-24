import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UploadProgress, type UploadProgressLabels } from './UploadProgress';

const labels: UploadProgressLabels = {
  fileList: 'Yüklenecek dosyalar',
  queued: 'Sırada',
  uploading: 'Yükleniyor',
  success: 'Tamamlandı',
  error: 'Yüklenemedi',
  cancel: 'İptal et',
  retry: 'Yeniden dene',
  remove: 'Kaldır',
};

const baseProps = {
  label: 'Dosyaları yükle',
  description: 'PDF veya PNG, en fazla 10 MB.',
  dropLabel: 'Dosyaları buraya bırakın',
  selectLabel: 'Dosya seç',
  labels,
};

describe('UploadProgress', () => {
  it('forwards native selections without starting an upload', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <UploadProgress
        {...baseProps}
        files={[]}
        onFilesSelected={onFilesSelected}
        accept=".pdf"
      />,
    );
    const file = new File(['report'], 'rapor.pdf', { type: 'application/pdf' });
    const input = container.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('accept', '.pdf');
    fireEvent.change(input!, { target: { files: [file] } });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('accepts a drop and clears visual drag state', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <UploadProgress
        {...baseProps}
        files={[]}
        onFilesSelected={onFilesSelected}
      />,
    );
    const dropzone = container.querySelector('.kw-upload-progress__dropzone')!;
    const file = new File(['image'], 'görsel.png', { type: 'image/png' });
    fireEvent.dragOver(dropzone, {
      dataTransfer: { files: [file], dropEffect: 'none' },
    });
    expect(dropzone).toHaveAttribute('data-drag-active', 'true');
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(dropzone).not.toHaveAttribute('data-drag-active');
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('renders measurable and indeterminate progress with contextual actions', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onRetry = vi.fn();
    const onRemove = vi.fn();
    render(
      <UploadProgress
        {...baseProps}
        onFilesSelected={vi.fn()}
        onCancel={onCancel}
        onRetry={onRetry}
        onRemove={onRemove}
        files={[
          {
            id: 'active',
            name: 'sunum.pdf',
            status: 'uploading',
            progress: 64,
            progressText: '3,2 MB / 5 MB',
          },
          { id: 'waiting', name: 'video.mp4', status: 'uploading' },
          {
            id: 'failed',
            name: 'bozuk.pdf',
            status: 'error',
            error: 'Bağlantı kesildi.',
          },
          { id: 'done', name: 'logo.png', status: 'success' },
        ]}
      />,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Yükleniyor' }),
    ).toHaveAttribute('aria-valuenow', '64');
    expect(
      screen.getByRole('status', { name: 'Yükleniyor' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Bağlantı kesildi.');
    await user.click(
      screen.getByRole('button', { name: 'sunum.pdf: İptal et' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'bozuk.pdf: Yeniden dene' }),
    );
    await user.click(screen.getByRole('button', { name: 'logo.png: Kaldır' }));
    expect(onCancel).toHaveBeenCalledWith('active');
    expect(onRetry).toHaveBeenCalledWith('failed');
    expect(onRemove).toHaveBeenCalledWith('done');
  });

  it('blocks picker, drop, and row actions while disabled', async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      <UploadProgress
        {...baseProps}
        disabled
        files={[{ id: 'queued', name: 'dosya.pdf', status: 'queued' }]}
        onFilesSelected={onFilesSelected}
        onRemove={onRemove}
      />,
    );
    const picker = screen.getByRole('button', { name: 'Dosya seç' });
    expect(picker).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'dosya.pdf: Kaldır' }),
    ).toBeDisabled();
    const file = new File(['x'], 'x.pdf');
    fireEvent.drop(container.querySelector('.kw-upload-progress__dropzone')!, {
      dataTransfer: { files: [file] },
    });
    await user.click(picker);
    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });
});
