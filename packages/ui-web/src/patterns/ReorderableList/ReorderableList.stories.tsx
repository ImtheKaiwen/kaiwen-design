import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ReorderableList,
  type ReorderableListItem,
  type ReorderableListLabels,
} from './ReorderableList';

const defaultItems: readonly ReorderableListItem[] = [
  {
    id: 'research',
    label: 'Araştırma',
    accessibleLabel: 'Araştırma',
    description: 'Kullanıcı ihtiyaçlarını ve sınırları doğrulayın.',
    meta: '3 belge',
  },
  {
    id: 'design',
    label: 'Tasarım',
    accessibleLabel: 'Tasarım',
    description: 'Akışları ve ortak bileşenleri hazırlayın.',
    meta: '8 ekran',
  },
  {
    id: 'review',
    label: 'İnceleme',
    accessibleLabel: 'İnceleme',
    description: 'Erişilebilirlik ve görsel kaliteyi doğrulayın.',
    meta: 'Bekliyor',
  },
];

const labels: ReorderableListLabels = {
  list: 'Proje aşamaları',
  grab: (item) => `${item.accessibleLabel}: Sürükleme tutamacı`,
  moveUp: (item) => `${item.accessibleLabel}: Yukarı taşı`,
  moveDown: (item) => `${item.accessibleLabel}: Aşağı taşı`,
  pickedUp: (item, position, total) =>
    `${item.accessibleLabel} tutuldu. ${total} öğeden ${position}. sırada.`,
  moved: (item, position, total) =>
    `${item.accessibleLabel}, ${total} öğeden ${position}. sıraya taşındı.`,
  dropped: (item, position, total) =>
    `${item.accessibleLabel}, ${total} öğeden ${position}. sıraya bırakıldı.`,
  cancelled: (item) => `${item.accessibleLabel} taşıması iptal edildi.`,
};

function ReorderableStory({
  initialItems = defaultItems,
  disabled = false,
  motion,
}: {
  initialItems?: readonly ReorderableListItem[];
  disabled?: boolean;
  motion?: 'off' | 'subtle' | 'balanced' | 'expressive';
}) {
  const [items, setItems] = useState(initialItems);
  return (
    <ReorderableList
      items={items}
      onReorder={setItems}
      labels={labels}
      disabled={disabled}
      {...(motion === undefined ? {} : { motion })}
    />
  );
}

const meta = {
  title: 'Patterns/ReorderableList',
  component: ReorderableList,
  tags: ['autodocs'],
  args: {
    items: defaultItems,
    labels,
    onReorder: () => undefined,
  },
  render: () => <ReorderableStory />,
} satisfies Meta<typeof ReorderableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = {
  render: () => <ReorderableStory disabled />,
};
export const LongTurkishContent: Story = {
  render: () => (
    <ReorderableStory
      initialItems={[
        {
          id: 'long',
          label:
            'Kuruluş genelindeki araştırma çalışmalarının değerlendirilmesi',
          accessibleLabel: 'Kuruluş araştırmalarının değerlendirilmesi',
          description:
            'Uzun başlıklar ve açıklamalar, sürükleme kontrollerini veya trailing bilgiyi dışarı itmemelidir.',
          meta: 'Öncelikli',
        },
        ...defaultItems,
      ]}
    />
  ),
};
export const MotionOff: Story = {
  render: () => <ReorderableStory motion="off" />,
};
