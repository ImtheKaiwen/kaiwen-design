import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('Studio', () => {
  it('renders real component demos and changes preferences', async () => {
    render(<App />);
    expect(
      screen.getByRole('heading', {
        name: 'Quiet surfaces. Thoughtful motion.',
      }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Koyu' }));
    expect(document.querySelector('.studio-root')).toHaveAttribute(
      'data-theme',
      'dark',
    );
    await userEvent.click(
      screen.getByRole('combobox', { name: 'Arayüz dili' }),
    );
    await userEvent.click(screen.getByRole('option', { name: 'English' }));
    expect(document.querySelector('.studio-root')).toHaveAttribute(
      'lang',
      'en',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Kenar çubuğunu daralt' }),
    );
    expect(document.querySelector('.studio-shell')).toHaveAttribute(
      'data-sidebar-collapsed',
      'true',
    );
    expect(
      screen.getByRole('button', { name: 'Kenar çubuğunu genişlet' }),
    ).toBeInTheDocument();
    const smartMotion = screen.getByRole('switch', { name: 'Akıllı hareket' });
    expect(smartMotion).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(smartMotion);
    expect(smartMotion).toHaveAttribute('aria-checked', 'false');
    const releaseNotes = screen.getByRole('checkbox', {
      name: 'Sürüm notlarını al',
    });
    expect(releaseNotes).toBeChecked();
    await userEvent.click(releaseNotes);
    expect(releaseNotes).not.toBeChecked();
    const projectName = screen.getByRole('textbox', { name: 'Proje adı' });
    await userEvent.clear(projectName);
    await userEvent.type(projectName, 'Yeni çalışma alanı');
    expect(projectName).toHaveValue('Yeni çalışma alanı');
    expect(
      screen.getByRole('status', { name: 'Örnek içerik yükleniyor' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Dosyalar yükleniyor' }),
    ).toHaveAttribute('aria-valuenow', '64');
    expect(
      screen.getByRole('region', { name: 'Boş durum örneği' }),
    ).toHaveTextContent('Henüz proje yok');
    expect(
      screen.getByRole('region', { name: 'Hata durumu örneği' }),
    ).toHaveTextContent('Projeler yüklenemedi');
    expect(
      screen.getByRole('region', { name: 'Container bileşeni' }),
    ).toHaveTextContent('Okunabilir ve güvenli içerik alanı');
    const dataTable = screen.getByRole('table', { name: 'Son projeler' });
    await userEvent.click(
      within(dataTable).getByRole('checkbox', {
        name: 'Kaiwen Workspace projesini seç',
      }),
    );
    expect(
      within(dataTable).getByRole('checkbox', {
        name: 'Tüm uygun projeleri seç',
      }),
    ).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(screen.getByRole('button', { name: 'Sonraki' }));
    expect(screen.getByText('2 / 2. sayfa')).toBeVisible();
    const barChart = screen.getByRole('region', {
      name: 'BarChart bileşeni',
    });
    expect(
      within(barChart).getByRole('figure', {
        name: /Haftalık aktif çalışma alanları/,
      }),
    ).toBeVisible();
    expect(
      within(barChart).getByRole('img', { name: 'Perşembe: 76 alan' }),
    ).toBeVisible();
    await userEvent.click(
      within(barChart).getByRole('button', { name: 'Dikey' }),
    );
    expect(within(barChart).getByRole('figure')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
    const pieChart = screen.getByRole('region', {
      name: 'PieChart bileşeni',
    });
    expect(
      within(pieChart).getByRole('img', { name: 'Tasarım: %38' }),
    ).toHaveAttribute('tabindex', '0');
    const wizard = screen.getByRole('region', {
      name: 'Wizard pattern örneği',
    });
    const wizardInput = screen.getByRole('textbox', {
      name: 'Çalışma alanı adı',
    });
    await userEvent.clear(wizardInput);
    await userEvent.type(wizardInput, 'Kalıcı çalışma alanı');
    await userEvent.click(
      within(wizard).getByRole('button', { name: 'Devam' }),
    );
    await userEvent.click(within(wizard).getByRole('button', { name: 'Geri' }));
    expect(
      screen.getByRole('textbox', { name: 'Çalışma alanı adı' }),
    ).toHaveValue('Kalıcı çalışma alanı');
    expect(
      screen.getByRole('region', { name: 'ConfirmationPage pattern örneği' }),
    ).toHaveTextContent('Çalışma alanını oluştur?');
    expect(
      screen.getByRole('region', { name: 'SuccessPage pattern örneği' }),
    ).toHaveTextContent('Çalışma alanı hazır');
    const templates = screen.getByRole('region', {
      name: 'Ekran şablonları',
    });
    expect(
      within(templates).getByRole('heading', { name: 'Çalışma alanı' }),
    ).toBeVisible();
    expect(
      within(templates).getByRole('heading', { name: 'Projeler' }),
    ).toBeVisible();
    const upload = screen.getByRole('region', {
      name: 'UploadProgress pattern örneği',
    });
    expect(
      within(upload).getByRole('progressbar', { name: 'Yükleniyor' }),
    ).toHaveAttribute('aria-valuenow', '64');
    expect(within(upload).getByRole('alert')).toHaveTextContent(
      'Dosya boyutu 10 MB sınırını aşıyor.',
    );
    await userEvent.click(
      within(upload).getByRole('button', {
        name: 'eski-arşiv.zip: Yeniden dene',
      }),
    );
    expect(
      within(upload).getAllByRole('progressbar', { name: 'Yükleniyor' }),
    ).toHaveLength(2);
    await userEvent.click(
      screen.getByRole('button', { name: 'Başarılıya güncelle' }),
    );
    expect(document.querySelector('.kw-toast__title')).toHaveTextContent(
      'Dosyalar yüklendi',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Loading bildirimi' }),
    );
    expect(document.querySelector('.kw-toast__title')).toHaveTextContent(
      'Dosyalar yükleniyor',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Başarılıya güncelle' }),
    );
    expect(document.querySelector('.kw-toast__title')).toHaveTextContent(
      'Dosyalar yüklendi',
    );
  }, 20_000);
});
