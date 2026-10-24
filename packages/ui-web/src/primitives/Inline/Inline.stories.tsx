import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Inline } from './Inline';

const meta = {
  title: 'Layout/Inline',
  component: Inline,
  tags: ['autodocs'],
  args: {
    gap: '12',
    align: 'center',
    justify: 'start',
    wrap: true,
    children: (
      <>
        <Button>Kaydet</Button>
        <Button variant="outline">Vazgeç</Button>
      </>
    ),
  },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SpaceBetween: Story = {
  args: {
    justify: 'between',
    children: (
      <>
        <strong>Takım üyeleri</strong>
        <Button size="sm">Üye ekle</Button>
      </>
    ),
  },
};
export const LongTurkishContent: Story = {
  args: {
    children: (
      <>
        <Card surface="subtle">
          Çok uzun yerelleştirilmiş içerik dar görünümde güvenli biçimde yeni
          satıra geçer.
        </Card>
        <Button variant="outline">Ayrıntıları görüntüle</Button>
      </>
    ),
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
