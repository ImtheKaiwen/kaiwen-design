import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarItem } from '../../navigation/Sidebar/Sidebar';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders explicit landmarks and passes collapse state to Sidebar', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AppShell
        ref={ref}
        sidebar={
          <Sidebar label="Ana menü">
            <SidebarItem href="#main" label="Başlangıç" />
          </Sidebar>
        }
        topbar={<span>Araç çubuğu</span>}
        mobileHeader={<span>Mobil başlık</span>}
        sidebarCollapsed
        dismissSidebarLabel="Menüyü kapat"
        contentId="main"
        skipLinkLabel="İçeriğe geç"
      >
        <h1>Çalışma alanı</h1>
      </AppShell>,
    );

    expect(ref.current).toHaveAttribute('data-sidebar-collapsed', 'true');
    expect(screen.getByRole('complementary')).toHaveAttribute(
      'data-collapsed',
      'true',
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getByRole('link', { name: 'İçeriğe geç' })).toHaveAttribute(
      'href',
      '#main',
    );
    expect(screen.getByText('Araç çubuğu')).toBeInTheDocument();
  });

  it('requests controlled mobile drawer dismissal from Escape and the backdrop', async () => {
    const onOpenChange = vi.fn();
    render(
      <AppShell
        sidebar={<Sidebar label="Ana menü" />}
        sidebarOpen
        onSidebarOpenChange={onOpenChange}
        dismissSidebarLabel="Menüyü kapat"
      >
        İçerik
      </AppShell>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await userEvent.click(screen.getByRole('button', { name: 'Menüyü kapat' }));
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });
});
