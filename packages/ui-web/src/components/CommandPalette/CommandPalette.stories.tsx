import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code2, Component, Palette, Settings2 } from '@imthekaiwen/icons';
import { Button } from '../Button/Button';
import { CommandPalette, type CommandPaletteItem } from './CommandPalette';

const items: CommandPaletteItem[] = [
  {
    id: 'foundations',
    label: 'Foundations bölümüne git',
    description: 'Renk, tipografi ve spacing tokenlarını incele',
    keywords: ['tema', 'token'],
    icon: <Palette size={17} aria-hidden />,
    shortcut: 'G F',
  },
  {
    id: 'components',
    label: 'Components bölümüne git',
    description: 'Kamuya açık bileşen durumlarını incele',
    icon: <Component size={17} aria-hidden />,
    shortcut: 'G C',
  },
  {
    id: 'docs',
    label: 'Agent sözleşmesini aç',
    description: 'API ve geliştirme kurallarını görüntüle',
    icon: <Code2 size={17} aria-hidden />,
  },
  {
    id: 'admin',
    label: 'Kuruluş ayarlarını değiştir',
    description: 'Bu örnekte gerekli yetki bulunmuyor',
    icon: <Settings2 size={17} aria-hidden />,
    disabled: true,
  },
];

function Preview() {
  const [selection, setSelection] = useState('Henüz seçim yapılmadı.');
  return (
    <div>
      <CommandPalette
        title="Hızlı komutlar"
        description="Bir bölüme gidin veya işlem başlatın."
        searchLabel="Komut ara"
        placeholder="Komut veya bölüm ara…"
        emptyLabel="Eşleşen komut bulunamadı."
        closeLabel="Komut menüsünü kapat"
        items={items}
        onSelect={(item) => setSelection(item.label)}
        trigger={<Button variant="outline">Komutları aç</Button>}
        enableShortcut
      />
      <p aria-live="polite">{selection}</p>
    </div>
  );
}

const meta = {
  title: 'Overlays/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  render: () => <Preview />,
  args: {
    title: 'Hızlı komutlar',
    searchLabel: 'Komut ara',
    emptyLabel: 'Eşleşen komut bulunamadı.',
    closeLabel: 'Komut menüsünü kapat',
    items,
    onSelect: () => undefined,
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = {
  render: (args) => <CommandPalette {...args} defaultOpen />,
};
