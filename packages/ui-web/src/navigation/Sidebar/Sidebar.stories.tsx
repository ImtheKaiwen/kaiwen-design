import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code2, Component, Palette, Sparkles } from '@imthekaiwen/icons';
import { Sidebar, SidebarItem } from './Sidebar';

const items = [
  {
    label: 'Foundations',
    href: '#foundations',
    icon: <Palette size={18} />,
    active: true,
  },
  { label: 'Components', href: '#components', icon: <Component size={18} /> },
  { label: 'Motion Lab', href: '#motion', icon: <Sparkles size={18} /> },
  {
    label: 'Çok uzun dokümantasyon ve agent sözleşmeleri',
    href: '#docs',
    icon: <Code2 size={18} />,
  },
];

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    label: 'Studio bölümleri',
    header: <strong>Kaiwen Design</strong>,
    footer: <small>Phase 1.1</small>,
    children: items.map((item) => <SidebarItem key={item.href} {...item} />),
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ width: 'var(--kw-sidebar-width)', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {};
export const Collapsed: Story = {
  args: { collapsed: true },
  decorators: [
    (Story) => (
      <div
        style={{ width: 'var(--kw-sidebar-width-collapsed)', height: '100vh' }}
      >
        <Story />
      </div>
    ),
  ],
};
