import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function prepareFullPageBaseline(page: Page) {
  await page.addStyleTag({
    content: `
    .kw-app-shell__skip-link { display: none !important; }
    @media (min-width: 701px) {
      .kw-app-shell__sidebar-slot { position: absolute !important; inset: 0 auto auto 0 !important; height: 100vh; width: var(--kw-sidebar-width); }
      .kw-app-shell__topbar { position: relative !important; }
    }
  `,
  });
  await expect(page.locator('.kw-app-shell__skip-link')).toHaveCSS(
    'display',
    'none',
  );
}

test('renders without horizontal overflow and supports keyboard controls', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Quiet surfaces/ }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
  const toggle = page.getByRole('switch', { name: 'Akıllı hareket' });
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
});

test('switches to dark theme', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Koyu', exact: true }).click();
  await expect(page.locator('.studio-root')).toHaveAttribute(
    'data-theme',
    'dark',
  );
});

test('adapts the application locale without owning translations', async ({
  page,
}) => {
  await page.goto('/');
  const languageTrigger = page.getByRole('combobox', {
    name: 'Arayüz dili',
  });
  const triggerBox = await languageTrigger.boundingBox();
  await languageTrigger.click();
  const contentBox = await page.locator('.kw-select__content').boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(contentBox!.width).toBeGreaterThanOrEqual(triggerBox!.width - 1);
  expect(contentBox!.width).toBeLessThanOrEqual(triggerBox!.width + 48);
  await page.getByRole('option', { name: 'English' }).click();
  const updatedTriggerBox = await languageTrigger.boundingBox();
  expect(updatedTriggerBox).not.toBeNull();
  expect(Math.abs(updatedTriggerBox!.width - triggerBox!.width)).toBeLessThan(
    1,
  );
  await expect(page.locator('.studio-root')).toHaveAttribute('lang', 'en');
  await expect(
    page.getByRole('heading', { name: /Quiet surfaces/ }),
  ).toBeVisible();
});

test('contains expressive theme motion without page overflow', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page
    .locator('#foundations')
    .getByRole('button', { name: 'Expressive' })
    .click();
  const themes = page.getByRole('group', { name: 'Tema tercihi' });
  await themes.getByRole('button', { name: 'Koyu', exact: true }).click();
  await page.waitForTimeout(350);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test('opens Modal and four-direction Drawer surfaces accessibly', async ({
  page,
}) => {
  await page.goto('/');
  const showcase = page.getByRole('region', {
    name: 'Modal ve Drawer bileşenleri',
  });
  const modalTrigger = showcase.getByRole('button', { name: 'Modalı aç' });
  await modalTrigger.click();
  await expect(
    page.getByRole('dialog', { name: 'Değişiklikleri yayınla' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(modalTrigger).toBeFocused();

  for (const side of ['left', 'right', 'top', 'bottom']) {
    await showcase.getByRole('button', { name: side, exact: true }).click();
    const drawer = page.getByRole('dialog', { name: `${side} drawer` });
    await expect(drawer).toHaveAttribute('data-side', side);
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  }
});

test('searches and runs commands from the keyboard palette', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Control+K');
  const dialog = page.getByRole('dialog', { name: 'Studio komutları' });
  await expect(dialog).toBeVisible();
  const search = dialog.getByRole('combobox', { name: 'Komut ara' });
  await expect(search).toBeFocused();
  await search.fill('motion');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(page.locator('#motion')).toBeInViewport();

  await page.keyboard.press('Control+K');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('sorts dense data without leaking horizontal page overflow', async ({
  page,
}) => {
  await page.goto('/');
  const demo = page.getByRole('region', { name: 'DataTable bileşeni' });
  const scrollRegion = demo.getByRole('region', {
    name: 'Proje tablosu kaydırma alanı',
  });
  const table = scrollRegion.getByRole('table', { name: 'Son projeler' });
  await expect(table).toBeVisible();

  await table
    .getByRole('checkbox', { name: 'Kaiwen Workspace projesini seç' })
    .click();
  await expect(
    table.getByRole('checkbox', { name: 'Tüm uygun projeleri seç' }),
  ).toHaveAttribute('aria-checked', 'mixed');
  await table
    .getByRole('checkbox', { name: 'Tüm uygun projeleri seç' })
    .click();
  await expect(
    table.getByRole('checkbox', { name: 'Archive projesini seç' }),
  ).toBeDisabled();
  await expect(
    table.getByRole('checkbox', { name: 'Agent Lab projesini seç' }),
  ).toBeChecked();

  await table.getByRole('button', { name: 'Üye: Artan sırala' }).click();
  await expect(
    table.getByRole('columnheader', { name: /Üye/ }),
  ).toHaveAttribute('aria-sort', 'ascending');
  await expect(table.locator('tbody tr').first()).toContainText('Archive');

  await demo.getByRole('button', { name: 'Sonraki' }).click();
  await expect(demo.getByText('2 / 2. sayfa')).toBeVisible();
  await expect(table.locator('tbody tr')).toHaveCount(1);
  await expect(table.locator('tbody tr').first()).toContainText('Agent Lab');

  const pageOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(pageOverflow).toBe(false);
  const viewport = page.viewportSize();
  if (viewport && viewport.width <= 700) {
    expect(
      await scrollRegion.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      ),
    ).toBe(true);
  }
});

test('shows chart values without hover and adapts to narrow screens', async ({
  page,
}) => {
  await page.goto('/');
  const demo = page.getByRole('region', {
    name: 'BarChart bileşeni',
    exact: true,
  });
  await demo.scrollIntoViewIfNeeded();
  const chart = demo.getByRole('figure', {
    name: /Haftalık aktif çalışma alanları/,
  });
  await expect(chart).toBeVisible();
  await expect(chart).toHaveAttribute('data-motion-level', 'off');
  await expect(
    chart.getByRole('img', { name: 'Perşembe: 76 alan' }),
  ).toBeVisible();
  await expect(chart.getByText('76 alan')).toBeVisible();
  await demo.getByRole('button', { name: 'Dikey' }).click();
  await expect(chart).toHaveAttribute('data-orientation', 'vertical');
  await chart.getByRole('img', { name: 'Perşembe: 76 alan' }).focus();
  await expect(
    page.getByRole('tooltip', { name: 'Perşembe: 76 alan' }),
  ).toBeVisible();

  const pageOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(pageOverflow).toBe(false);
});

test('PieChart exposes values through its legend and interactive segments', async ({
  page,
}) => {
  await page.goto('/#advanced');
  const demo = page.getByRole('region', { name: 'PieChart bileşeni' });
  await expect(demo).toBeVisible();
  await expect(demo.getByText('%38')).toBeVisible();
  const segment = demo.getByRole('img', { name: 'Tasarım: %38' });
  await expect(segment).toHaveAttribute('tabindex', '0');
  await segment.dispatchEvent('pointermove', { pointerType: 'mouse' });
  await expect(
    page.getByRole('tooltip', { name: 'Tasarım: %38' }),
  ).toBeVisible();
});

test('GroupedBarChart compares multiple series without relying on color alone', async ({
  page,
}) => {
  await page.goto('/#advanced');
  const demo = page.getByRole('region', { name: 'GroupedBarChart bileşeni' });
  await expect(demo).toBeVisible();
  await expect(
    demo.getByRole('list', { name: 'Görev durumları' }),
  ).toContainText('Oluşturulan');
  const bar = demo.getByRole('img', {
    name: 'Perşembe, Tamamlanan: 27 görev',
  });
  await expect(bar).toHaveAttribute('tabindex', '0');
  await bar.dispatchEvent('pointermove', { pointerType: 'mouse' });
  await expect(
    page.getByRole('tooltip', {
      name: 'Perşembe, Tamamlanan: 27 görev',
    }),
  ).toBeVisible();
  await expect(demo.getByText('En yoğun inceleme günü')).toBeVisible();

  const pageOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(pageOverflow).toBe(false);
});

test('StackedBarChart exposes its axis, totals and hover tooltips', async ({
  page,
}) => {
  await page.goto('/#advanced');
  const demo = page.getByRole('region', { name: 'StackedBarChart bileşeni' });
  await expect(demo).toBeVisible();
  await expect(
    demo.getByRole('list', { name: 'Görev sayısı ekseni' }),
  ).toBeVisible();
  await expect(demo.getByText('70 görev')).toBeVisible();
  const segment = demo.getByRole('button', {
    name: 'Perşembe, Tamamlanan: 27 görev',
  });
  await segment.hover();
  await expect(
    page.getByRole('tooltip', {
      name: 'Perşembe, Tamamlanan: 27 görev',
    }),
  ).toBeVisible();
  await demo.getByRole('button', { name: 'Dikey' }).click();
  await expect(demo.getByRole('figure')).toHaveAttribute(
    'data-orientation',
    'vertical',
  );
});

test('ReorderableList supports explicit and keyboard reordering', async ({
  page,
}) => {
  await page.goto('/#advanced');
  const demo = page.getByRole('region', { name: 'ReorderableList bileşeni' });
  const list = demo.getByRole('list', { name: 'Öncelik sırası' });
  await expect(list).toBeVisible();
  await demo
    .getByRole('button', { name: 'Tasarım sistemi uyarlaması: Yukarı taşı' })
    .click();
  await expect(list.getByRole('listitem').first()).toContainText(
    'Tasarım sistemi uyarlaması',
  );

  const handle = demo.getByRole('button', {
    name: 'Tasarım sistemi uyarlaması: Sürükleme tutamacı',
  });
  await handle.focus();
  await page.keyboard.press('Space');
  await expect(handle).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  await expect(handle).toHaveAttribute('aria-pressed', 'false');
  await expect(list.getByRole('listitem').nth(1)).toContainText(
    'Tasarım sistemi uyarlaması',
  );

  const pointerHandle = demo.getByRole('button', {
    name: 'Araştırma bulguları: Sürükleme tutamacı',
  });
  const targetRow = list.getByRole('listitem').last();
  const [sourceBox, targetBox] = await Promise.all([
    pointerHandle.boundingBox(),
    targetRow.boundingBox(),
  ]);
  expect(sourceBox).not.toBeNull();
  expect(targetBox).not.toBeNull();
  if (sourceBox && targetBox) {
    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height - 2,
      { steps: 12 },
    );
    await page.mouse.up();
  }
  await expect(list.getByRole('listitem').last()).toContainText(
    'Araştırma bulguları',
  );

  const overflow = await demo.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );
  expect(overflow).toBe(false);
});

test('searches the generated component registry and exposes source metadata', async ({
  page,
}) => {
  await page.goto('/#docs');
  const registry = page.getByRole('region', { name: 'Component registry' });
  await expect(registry).toBeVisible();
  await expect(
    registry.getByText('12 / 37 bileşen gösteriliyor'),
  ).toBeVisible();
  await registry
    .getByRole('textbox', { name: 'Bileşen ara' })
    .fill('GroupedBarChart');
  await expect(registry.getByText('1 bileşen gösteriliyor')).toBeVisible();
  await registry.getByText('GroupedBarChart', { exact: true }).click();
  await expect(
    registry.getByText(
      "import { GroupedBarChart } from '@imthekaiwen/ui-web/data'",
    ),
  ).toBeVisible();
  await expect(registry.getByText('plotLabel', { exact: true })).toBeVisible();

  const pageOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(pageOverflow).toBe(false);
});

test('controls the responsive application shell without overflow', async ({
  page,
}) => {
  await page.goto('/');
  const shell = page.locator('.studio-shell');
  const viewport = page.viewportSize();

  if (viewport && viewport.width <= 700) {
    await page.getByRole('button', { name: 'Menüyü aç veya kapat' }).click();
    await expect(shell).toHaveAttribute('data-sidebar-open', 'true');
    await page.keyboard.press('Escape');
    await expect(shell).not.toHaveAttribute('data-sidebar-open');
  } else {
    await page.getByRole('button', { name: 'Kenar çubuğunu daralt' }).click();
    await expect(shell).toHaveAttribute('data-sidebar-collapsed', 'true');
    await expect(
      page.getByRole('button', { name: 'Kenar çubuğunu genişlet' }),
    ).toBeVisible();
    await page.getByRole('link', { name: 'Foundations' }).hover();
    await expect(page.getByRole('tooltip')).toHaveText('Foundations');
  }

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test('keeps selection and wizard geometry stable', async ({ page }) => {
  await page.goto('/');
  const themes = page.getByRole('group', { name: 'Tema tercihi' });
  await expect(themes.locator('.kw-theme-switcher__indicator')).toHaveCount(1);
  await themes.getByRole('button', { name: 'Koyu' }).click();
  await expect(
    themes
      .getByRole('button', { name: 'Koyu' })
      .locator('.kw-theme-switcher__indicator'),
  ).toHaveCount(1);

  const stepHeights = await page
    .locator('.kw-wizard__step')
    .evaluateAll((steps) =>
      steps.map((step) => Math.round(step.getBoundingClientRect().height)),
    );
  expect(new Set(stepHeights).size).toBe(1);
});

test('keeps screen templates readable and ordered at every target width', async ({
  page,
}) => {
  await page.goto('/');
  const templates = page.getByRole('region', { name: 'Ekran şablonları' });
  await expect(templates).toBeVisible();
  await expect(
    templates.getByRole('heading', { name: 'Çalışma alanı' }),
  ).toBeVisible();
  await expect(
    templates.getByRole('heading', { name: 'Projeler' }),
  ).toBeVisible();

  const overflow = await templates.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );
  expect(overflow).toBe(false);
});

test('preserves wizard form state and completes the guided flow', async ({
  page,
}) => {
  await page.goto('/');
  const wizard = page.getByRole('region', { name: 'Wizard pattern örneği' });
  const name = wizard.getByRole('textbox', { name: 'Çalışma alanı adı' });
  await name.fill('Kalıcı çalışma alanı');
  await wizard.getByRole('button', { name: 'Devam' }).click();
  await wizard.getByRole('button', { name: 'Geri' }).click();
  await expect(
    wizard.getByRole('textbox', { name: 'Çalışma alanı adı' }),
  ).toHaveValue('Kalıcı çalışma alanı');
  await wizard.getByRole('button', { name: 'Devam' }).click();
  await wizard.getByRole('button', { name: 'Devam' }).click();
  await wizard.getByRole('button', { name: 'Kurulumu tamamla' }).click();
  await expect(
    wizard.getByRole('region', { name: 'Çalışma alanı hazır' }),
  ).toContainText('Kalıcı çalışma alanı');
});

test('selects files and exposes recoverable upload states', async ({
  page,
}) => {
  await page.goto('/');
  const upload = page.getByRole('region', {
    name: 'UploadProgress pattern örneği',
  });
  await upload.locator('input[type="file"]').setInputFiles({
    name: 'yeni-belge.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('Kaiwen upload fixture'),
  });
  await expect(upload).toContainText('yeni-belge.pdf');
  await expect(upload.getByRole('alert')).toContainText(
    '10 MB sınırını aşıyor',
  );
  await upload
    .getByRole('button', { name: 'eski-arşiv.zip: Yeniden dene' })
    .click();
  await expect(
    upload.getByRole('button', { name: 'eski-arşiv.zip: İptal et' }),
  ).toBeVisible();
  await upload.getByRole('button', { name: 'yeni-belge.pdf: Kaldır' }).click();
  await expect(upload).not.toContainText('yeni-belge.pdf');
});

test('has no automatically detectable WCAG A or AA violations', async ({
  page,
}) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('exposes form errors and honors reduced motion for loading feedback', async ({
  page,
}) => {
  await page.goto('/');
  const projectName = page.getByRole('textbox', {
    name: 'Proje adı',
    exact: true,
  });
  await projectName.focus();
  await expect(projectName).toBeFocused();
  await projectName.fill('Uzun Türkçe çalışma alanı adı');
  await expect(projectName).toHaveValue('Uzun Türkçe çalışma alanı adı');
  const invalidInput = page.getByRole('textbox', { name: 'Takım kodu' });
  await expect(invalidInput).toHaveAttribute('aria-invalid', 'true');
  await expect(invalidInput).toHaveAccessibleDescription(
    'Takım kodu en az üç karakter olmalıdır.',
  );
  await expect(page.locator('.kw-skeleton').first()).toHaveAttribute(
    'data-motion-level',
    'off',
  );
  await expect(
    page.getByRole('status', { name: 'Örnek içerik yükleniyor' }),
  ).toHaveAttribute('data-motion-level', 'off');
  await expect(
    page.getByRole('progressbar', { name: 'Dosyalar yükleniyor' }),
  ).toHaveAttribute('data-motion-level', 'off');
});

test('updates and dismisses toast feedback with the keyboard', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Başarılıya güncelle' }).click();
  let toast = page.locator('.kw-toast');
  await expect(toast).toContainText('Dosyalar yüklendi');
  await page.getByRole('button', { name: 'Loading bildirimi' }).click();
  toast = page.locator('.kw-toast');
  await expect(toast).toContainText('Dosyalar yükleniyor');

  const results = await new AxeBuilder({ page })
    .include('.kw-toast')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);

  await page.getByRole('button', { name: 'Başarılıya güncelle' }).click();
  await expect(toast).toContainText('Dosyalar yüklendi');
  await page.getByRole('button', { name: 'Bildirimi kapat' }).focus();
  await page.keyboard.press('Escape');
  await expect(toast).toHaveCount(0);
});

test('matches the reviewed responsive baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.studio-root')).toHaveAttribute(
    'data-theme',
    'light',
  );
  await prepareFullPageBaseline(page);
  await expect(
    page.getByRole('region', { name: 'Component registry' }),
  ).toBeVisible({ timeout: 15_000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await expect(page).toHaveScreenshot('studio-home.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.005,
    timeout: 15_000,
  });
});

test('matches the reviewed dark-theme baseline', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('region', { name: 'Component registry' }),
  ).toBeVisible({ timeout: 15_000 });
  await page
    .locator('.quick-controls button')
    .evaluate((element) => (element as HTMLButtonElement).click());
  await expect(page.locator('.studio-root')).toHaveAttribute(
    'data-theme',
    'dark',
  );
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await expect(page.locator('.content')).toHaveScreenshot(
    'studio-home-dark.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.005,
      timeout: 15_000,
    },
  );
});
