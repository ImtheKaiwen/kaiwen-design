import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Component, Menu, Palette, Sparkles } from '@imthekaiwen/icons';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Sidebar, SidebarItem } from '../../navigation/Sidebar/Sidebar';
import { Container } from '../../primitives/Container/Container';
import { Stack } from '../../primitives/Stack/Stack';
import { AppShell } from './AppShell';

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    sidebar: null,
    dismissSidebarLabel: 'Menüyü kapat',
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function ShellDemo({ initiallyCollapsed = false, initiallyOpen = false }) {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const [open, setOpen] = useState(initiallyOpen);
  const sidebar = (
    <Sidebar
      label="Ürün bölümleri"
      header={<strong>Kaiwen Workspace</strong>}
      footer={<small>Çevrimiçi</small>}
    >
      <SidebarItem
        href="#overview"
        label="Genel bakış"
        icon={<Palette size={18} />}
        active
      />
      <SidebarItem
        href="#components"
        label="Bileşenler"
        icon={<Component size={18} />}
      />
      <SidebarItem
        href="#motion"
        label="Hareket ve erişilebilirlik tercihleri"
        icon={<Sparkles size={18} />}
      />
    </Sidebar>
  );

  return (
    <AppShell
      sidebar={sidebar}
      sidebarCollapsed={collapsed}
      sidebarOpen={open}
      onSidebarOpenChange={setOpen}
      dismissSidebarLabel="Menüyü kapat"
      skipLinkLabel="İçeriğe geç"
      mobileHeader={
        <>
          <strong>Kaiwen</strong>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Menüyü aç"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </Button>
        </>
      }
      topbar={
        <>
          <span>Çalışma alanı</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? 'Genişlet' : 'Daralt'}
          </Button>
        </>
      }
    >
      <Container maxWidth="content">
        <Stack gap="24">
          <h1 id="overview">Genel bakış</h1>
          <Card>
            <strong>Kararlı uygulama kabuğu</strong>
            <p>
              Sidebar, topbar ve içerik kendi scroll ve overflow sınırlarını
              korur.
            </p>
          </Card>
        </Stack>
      </Container>
    </AppShell>
  );
}

export const Default: Story = { render: () => <ShellDemo /> };
export const Collapsed: Story = {
  render: () => <ShellDemo initiallyCollapsed />,
};
export const MobileDrawerOpen: Story = {
  render: () => <ShellDemo initiallyOpen />,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
