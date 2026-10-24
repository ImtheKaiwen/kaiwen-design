import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('labels the header with its semantic title and renders optional slots', () => {
    render(
      <PageHeader
        eyebrow="Ayarlar"
        breadcrumbs={<nav aria-label="İçerik yolu">Ana sayfa / Takım</nav>}
        title="Çalışma alanı tercihleri"
        description="Takımınızın ortak tercihlerini yönetin."
        metadata={<span>Son güncelleme bugün</span>}
        actions={<button type="button">Kaydet</button>}
      />,
    );

    const title = screen.getByRole('heading', {
      level: 1,
      name: 'Çalışma alanı tercihleri',
    });
    const header = title.closest('header');
    expect(header).toHaveAttribute('aria-labelledby', title.id);
    expect(
      screen.getByRole('navigation', { name: 'İçerik yolu' }),
    ).toBeVisible();
    expect(header).toHaveTextContent('Son güncelleme bugün');
  });

  it('preserves heading hierarchy and native action behavior', async () => {
    const onClick = vi.fn();
    render(
      <PageHeader
        headingLevel={2}
        title="Bildirimler"
        actions={
          <button type="button" onClick={onClick}>
            Uygula
          </button>
        }
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Bildirimler' }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Uygula' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
