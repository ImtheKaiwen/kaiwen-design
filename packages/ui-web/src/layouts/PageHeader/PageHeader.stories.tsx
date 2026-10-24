import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button/Button';
import { Inline } from '../../primitives/Inline/Inline';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: {
    eyebrow: 'Çalışma alanı',
    title: 'Proje ayarları',
    description:
      'Ekip görünürlüğünü, varsayılan tercihleri ve erişim sınırlarını yönetin.',
    metadata: <span>En son bugün güncellendi</span>,
    actions: (
      <Inline gap="8">
        <Button variant="outline">Vazgeç</Button>
        <Button>Değişiklikleri kaydet</Button>
      </Inline>
    ),
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs: (
      <nav aria-label="İçerik yolu">Çalışma alanları / Kaiwen / Ayarlar</nav>
    ),
  },
};
export const LongTurkishContent: Story = {
  args: {
    title:
      'Kuruluş genelindeki erişim, bildirim ve görünürlük tercihlerinin yapılandırılması',
    description:
      'Uzun Türkçe metin, geç yüklenen fontlar ve dar ekran koşullarında eylemler içerikle çakışmadan alt satıra yerleşir.',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
