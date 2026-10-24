import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  UploadProgress,
  type UploadFileItem,
  type UploadProgressLabels,
} from './UploadProgress';

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

const sampleFiles: UploadFileItem[] = [
  { id: 'brief', name: 'proje-özeti.pdf', meta: '2,4 MB', status: 'success' },
  {
    id: 'research',
    name: 'araştırma-notları.pdf',
    meta: '5 MB',
    status: 'uploading',
    progress: 64,
    progressText: '3,2 MB / 5 MB',
  },
  {
    id: 'archive',
    name: 'eski-arşiv.zip',
    meta: '18 MB',
    status: 'error',
    error: 'Dosya boyutu 10 MB sınırını aşıyor.',
  },
];

function ControlledUpload({
  initialFiles = sampleFiles,
}: {
  initialFiles?: UploadFileItem[];
}) {
  const [files, setFiles] = useState(initialFiles);
  return (
    <UploadProgress
      label="Proje dosyaları"
      description="PDF, PNG veya ZIP; dosya başına en fazla 10 MB."
      dropLabel="Dosyaları buraya bırakın veya bilgisayarınızdan seçin"
      selectLabel="Dosya seç"
      accept=".pdf,.png,.zip"
      files={files}
      labels={labels}
      onFilesSelected={(selected) =>
        setFiles((current) => [
          ...current,
          ...selected.map((file) => ({
            id: `${file.name}-${file.lastModified}`,
            name: file.name,
            meta: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            status: 'queued' as const,
          })),
        ])
      }
      onCancel={(id) =>
        setFiles((current) => current.filter((file) => file.id !== id))
      }
      onRetry={(id) =>
        setFiles((current) =>
          current.map((file) =>
            file.id === id
              ? { ...file, status: 'uploading', progress: 0, error: undefined }
              : file,
          ),
        )
      }
      onRemove={(id) =>
        setFiles((current) => current.filter((file) => file.id !== id))
      }
    />
  );
}

const meta = {
  title: 'Patterns/UploadProgress',
  component: UploadProgress,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    label: 'Proje dosyaları',
    description: 'PDF veya PNG, en fazla 10 MB.',
    dropLabel: 'Dosyaları buraya bırakın',
    selectLabel: 'Dosya seç',
    files: sampleFiles,
    labels,
    onFilesSelected: () => undefined,
  },
} satisfies Meta<typeof UploadProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <ControlledUpload /> };
export const Empty: Story = {
  render: () => <ControlledUpload initialFiles={[]} />,
};
export const Disabled: Story = { args: { disabled: true } };
export const LongTurkishContent: Story = {
  args: {
    label: 'Kuruluş çalışma alanının kaynak ve araştırma dosyaları',
    description:
      'Çok uzun dosya adları ve ayrıntılı hata açıklamaları dar ekranlarda yatay taşma oluşturmadan okunabilir kalmalıdır.',
    files: [
      {
        id: 'long',
        name: 'çok-uzun-türkçe-proje-dokümantasyonu-ve-araştırma-sonuçları-2026.pdf',
        status: 'error',
        error:
          'Dosya güvenlik taramasından geçemedi. İçeriği kontrol edip yeniden deneyin.',
      },
    ],
  },
};
