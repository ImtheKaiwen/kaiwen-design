import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Sidebar, SidebarItem } from './Sidebar';

describe('Sidebar', () => {
  it('exposes a labelled navigation landmark and current destination', () => {
    render(
      <Sidebar
        label="Proje bölümleri"
        header={<strong>Kaiwen</strong>}
        footer={<span>Yardım</span>}
      >
        <SidebarItem
          href="/overview"
          label="Genel bakış"
          active
          icon={<svg data-testid="icon" />}
        />
        <SidebarItem href="/settings" label="Çok uzun çalışma alanı ayarları" />
      </Sidebar>,
    );

    expect(
      screen.getByRole('navigation', { name: 'Proje bölümleri' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Genel bakış' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByText('Yardım')).toBeInTheDocument();
  });

  it('supports a standalone collapsed state and forwards refs', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Sidebar
        ref={ref}
        label="Ana menü"
        collapsed
        className="consumer-sidebar"
      />,
    );

    expect(ref.current).toHaveClass('kw-sidebar', 'consumer-sidebar');
    expect(ref.current).toHaveAttribute('data-collapsed', 'true');
  });

  it('explains icon-only destinations with a tooltip when collapsed', async () => {
    const user = userEvent.setup();
    render(
      <Sidebar label="Ana menü" collapsed>
        <SidebarItem
          href="/settings"
          label="Ayarlar"
          icon={<svg aria-hidden />}
        />
      </Sidebar>,
    );

    await user.hover(screen.getByRole('link', { name: 'Ayarlar' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Ayarlar');
  });
});
