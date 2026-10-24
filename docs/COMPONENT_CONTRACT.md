# COMPONENT CONTRACT — Kaiwen Design

**Belge türü:** Public UI davranış ve API sözleşmesi · **Durum:** v0.1 hedef spesifikasyon

> Bu belge, **yazılacak** bileşenlerin dışarıdan nasıl kullanılacağını ve hangi kaliteyi sağlayacağını tanımlar. Örnek import/props henüz yayımlanmış bir paket API'si değildir. Kod geliştirilince gerçek TypeScript tipleri ve Storybook hikâyeleri asıl teknik API referansı olur.

## 1. Tasarım ilkesi: tek kaynak, farklı kullanım

Bileşenler uygulama başına yeniden yazılmamalı. Her UI parçası `@imthekaiwen/ui-web` içinden gelmeli veya oradaki primitives ile birleştirilmeli. **Component** tek etkileşimli/görsel parça, **Pattern** birlikte çalışan bileşen düzeni, **Page Template** kompozisyon örneğidir. Ürün veri işleme ve navigasyon mantığı her zaman ürün uygulamasının sahipliğindedir.

```text
Foundation tokens
   ├── Motion / Icons
   └── Component primitives (Button, Input, Switch)
         ├── Composites (Toast, Tooltip, CommandPalette, DataTable)
         ├── Layout primitives (Stack, Grid, AppShell)
         └── Patterns (Wizard, SuccessPage, UploadFlow)
                  └── Product-specific screen
```

## 2. Ortak property ve naming standardı

Her bileşene her prop zorla eklenmez; **anlamlı olanlarda** aynı ad ve semantik kullanılır.

| Prop       | Önerilen değerler | Kural                                                 |
| ---------- | ----------------- | ----------------------------------------------------- | ----------- | --------- | ---------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| `size`     | `xs               | sm                                                    | md          | lg        | xl`                                                  | Etkileşimli kontroller için geçerli; default genelde `md`     |
| `variant`  | `primary          | secondary                                             | outline     | ghost`    | Uygun bileşende; eylem görsel hiyerarşisi            |
| `tone`     | `neutral          | success                                               | warning     | danger`   | Semantic feedback gereken yerde                      |
| `radius`   | `xs               | sm                                                    | md          | lg        | xl                                                   | full`                                                         | Default component tokenı; rastgele sayısal px yok |
| `motion`   | `inherit          | off                                                   | subtle      | balanced  | expressive`                                          | Default `inherit`; global policy ve reduced-motion geçerlidir |
| `density`  | `inherit          | compact                                               | comfortable | spacious` | Layout/yoğun formlarda; global default `comfortable` |
| `surface`  | `default          | subtle                                                | raised      | glass`    | Uygun panel/overlay'lerde; default `default`         |
| `loading`  | `boolean`         | Sadece aksiyon bileşenlerinde; semantik loading state |
| `disabled` | `boolean`         | Native disabled öncelikli; disabled ≠ loading         |
| `invalid`  | `boolean`         | Input/Form alanları; açıklayıcı error text ile        |

- HTML elementlerinin doğal prop'ları ve `ref` uygun biçimde forward edilir; `className`/`style` override kapısı kuralları baypas etmemeli.
- Prop isimlerinde `kind`, `type`, `intent` gibi aynı işi gören üç paralel kavram oluşturma.
- Dışarıdan gelen event handler çağrılmadan önce gerekli dahili semantik/iptal koşulları sağlanır; event zinciri belgelidir.
- Controlled: `value` + `onValueChange(value)`; uncontrolled: `defaultValue` sözleşmesi. Boolean kontrol için `checked` + `onCheckedChange(checked)`.
- `slot`/`asChild` gibi composition API gerekiyorsa erişilebilirliği bozmadan uygulanır.
- Design tokens CSS variables ile override edilebilir; kontrolsüz per-component theme fork'u oluşturulmaz.

## 3. Provider sözleşmesi

Hedef kullanım:

```tsx
import { KaiwenProvider } from '@imthekaiwen/ui-web';
import '@imthekaiwen/ui-web/styles.css';

<KaiwenProvider
  theme="system"
  motion="balanced"
  density="comfortable"
  locale="tr"
>
  <App />
</KaiwenProvider>;
```

`KaiwenProvider`, tema/yoğunluk/motion/locale tercihlerinin tasarım bileşenlerine erişimini sağlar. Ürünün backend, global fetch, auth veya gerçek i18n sözlük sistemi değildir. Uygulama daha sonra tercihlerinin persistence mekanizmasını kendi yönetebilir. SSR/hydration-safe başlangıç değeri ve sistem tercihi senkronizasyonu gereklidir.

- Bileşen `motion="inherit"` ise provider seviyesini kullanır.
- Kullanıcı OS seviyesinde reduced motion istiyorsa animasyonlar azaltılır; `expressive` bu tercihi aşamaz.
- Tema ve density, `data-theme`/`data-density` ve CSS semantic variables üzerinden gerçek bileşenlere yansır.
- Locale metin sözlüğü değil, bileşen formatlayıcı/i18n adaptörüne bağlanan bir tercihtir.

## 4. Standart state modeli

Her bileşen uygulanabilen durumlardan sorumludur:

| Durum         | Görsel davranış               | Erişilebilirlik / mantık                                   |
| ------------- | ----------------------------- | ---------------------------------------------------------- |
| Default       | Dengeli temel yüzey           | Semantik rol/ad                                            |
| Hover         | Hafif surface/border tepkisi  | Tek bilgi taşıyıcısı olamaz                                |
| Focus-visible | Belirgin focus ring           | Klavye ile görünür; mouse-only için dayatılmaz             |
| Pressed       | Kesilebilir scale/transform   | Space/Enter, pointer cancel ve drag-out semantics          |
| Loading       | Mevcut yer/ölçü korunur       | `aria-busy` uygun yerde; yinelenen submission engeli       |
| Disabled      | Görsel soluk + eylem engeli   | Native `disabled` veya doğru ARIA semantiği                |
| Invalid/Error | İlgili error metni + state    | `aria-invalid`, `aria-describedby`, açık düzeltme talimatı |
| Success       | Kontrollü ikon/metin feedback | Sadece renk değişimi değil                                 |
| Empty         | Anlaşılır boş durum           | Uygulanabilir next step ve CTA                             |

Erişilebilirlik hedefi **WCAG 2.2 AA**; yeterli kontrast, focus, klavye dolaşımı, anlaşılır isimlendirme ve hareket alternatifleri gereklidir. Mobil/touch için rahat tıklanma alanları hedeflenir (tercihen 40–44 px ve üstü; görsel boyuttan bağımsız hit area sağlanabilir).

## 5. Motion davranış contract'ı

- Her seviyenin etkisi merkezi preset/engine tarafından hesaplanır; bileşen içerisinde rastgele duration/easing sabitleme.
- Press motion **state-driven ve interruptible**: pointer down'da scale/stiffness hedeflenir, pointer up/cancel/leave olduğunda o anki değerinden default'a gider. Başka işlev çalışmasa bile görsel state geri döner.
- Basılı tutma, click/tap ile aynı şey değildir: `pressed` gesture süresi boyunca gösterilir; uzun basma eylemi gerekiyorsa ayrı semantik API gerekir.
- CSS transform görsel olarak büyütür/küçültür; box width/height ani yeniden akıtılmaz. Tooltip/popover kendi layer'ında animasyon yapar.
- `switch-elastic`: thumb ölçeği/şekli esner → translate olur → settle. Track fill de yumuşak değişir. Controlled checked prop son kaynak; animasyon checked state ile senkronize edilir.
- Reduced motion: nonessential movement/fade azaltılır veya kaldırılır; focus/selected/error görünürlüğü korunur.
- Animasyonun bitiş callback'i iş mantığının güvenilir tek yürütme noktası olamaz; işlem sonucu state tarafından belirlenir.

## 6. V1 temel bileşen kataloğu

| Kategori | Bileşen                                              | Sözleşme/önemli davranış                                              |
| -------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| Action   | `Button`, `IconButton`                               | size, variant, tone, loading, focus-visible, press; icon-only için ad |
| Input    | `Input`, `Select`, `Textarea`, `Checkbox`, `Switch`  | label, help/error, controlled/uncontrolled; switch binary             |
| Surface  | `Card`, `Divider`, `Badge`                           | surface/radius; hover sadece etkileşimliyse                           |
| Overlay  | `Tooltip`                                            | Hover+focus, kontrollü delay, Esc/dismiss, portal ve placement        |
| Loading  | `Spinner`, `Skeleton`, `Progress`                    | İçerik geometrisi, reduced-motion, ölçülebilir progress               |
| Feedback | `Toast`, `Alert`, `EmptyState`, `ErrorState`         | Anlamlı mesajlar, eylem/undo/retry, a11y live region                  |
| Overlay  | `Tooltip`, `CommandPalette`, `Modal`, `Drawer`       | Focus trap/restoration, Escape, backdrop ve reduced-motion            |
| Layout   | `Container`, `Stack`, `Inline`, `Grid`, `PageHeader` | Responsive, min-width, gap tokens, wrapping/overflow                  |
| Themes   | `ThemeSwitcher`                                      | light/dark/system, doğru ad/focus, state adapter                      |

`LanguageSwitcher`, `AppShell`, `Sidebar`, `Wizard`, `SuccessPage`, `UploadProgress` v1.1 hedefidir. Phase 2 `ReorderableList`, kontrollü sıralama gereksinimi doğrulandığında eklenir; bileşenler sahte/placeholder implementasyon olarak yayımlanmaz.

### 6.1 Button / IconButton

Örnek hedef:

```tsx
<Button variant="primary" size="md" motion="expressive" loading={saving} onClick={save}>
  Save changes
</Button>
<IconButton icon={<Icon name="settings" />} aria-label="Open settings" />
```

- Loading'de label ölçüsünün çökmesi ve buton genişliğinin zıplaması engellenir.
- Submit tipi native form semantiğini izler; varsayılan `type="button"` seçimi ve form senaryoları açıkça belgelenir.
- Loading iken tekrar eden tetiklemeler önlenebilir; `disabled` vs `aria-disabled` davranışları test edilir.
- Hover/press transform kart/grid genişliğini etkilemez.

### 6.2 Switch ve Checkbox

- `Switch` ikili ayar içindir; hemen etkisi olan on/off durumu. Çok seçenekli kullanımda Radio/Select.
- Native input veya WAI-ARIA switch semantiği; klavye Space; label click hedefi; focus-visible.
- Controlled `checked`, `onCheckedChange`; `defaultChecked` uncontrolled yol.
- `Checkbox` görünür label'ı varsayılan kabul eder; form grupları ve DataTable gibi bağlamlarda label yalnızca görsel olarak gizlenebilir. `indeterminate`, native input özelliği ve `aria-checked="mixed"` ile birlikte sunulur.
- `switch-elastic` yalnızca görsel thumb etkisidir: state kesinlikle başarıyla tamamlanmadan UI'ya yanlış sonuç göstermemelidir. Ağ işlemi başarısızsa checked state geri alımı anlaşılır feedback ile yapılır.

### 6.3 Tooltip / Popover / Overlay

- Tooltip kısa açıklama içindir; zorunlu form yardımını tooltip içine saklama.
- Hover gecikmesi ve klavye focus etkileşimi ayrı ele alınır; Esc ile kapanış ve scroll/viewport collision desteklenir.
- Popover/Menu/Dialogs için Radix gibi erişilebilir davranış primitive'leri tercih edilir.
- Portal stacking, focus restore, scroll locking ve screen reader semantics test edilir.
- `CommandPalette` ürün komutlarını veya router davranışını sahiplenmez; aranabilir item verisi ve seçim callback'i tüketiciye aittir.
- Command Palette açıldığında arama alanı odaklanır; Arrow Up/Down, Home/End, Enter ve Escape çalışır. Kapanışta odak tetikleyiciye döner; disabled komutlar gezinme ve seçimden çıkarılır.
- Global `Control/Command + K` kısayolu isteğe bağlıdır; bir ekranda tek etkin palette bulunması uygulama sorumluluğundadır.

### 6.4 DataTable

- `DataTable` semantik `table`, `caption`, `thead`, `tbody`, `th scope="col"` yapısını korur; görsel grid rolüyle native tablo navigasyonunu taklit etmez.
- Sıralanabilir kolonlar primitive `sortValue` sağlar. Controlled/uncontrolled sort state, `aria-sort`, klavye ile çalışan header button ve stabilize edilmiş eşit değer sırası desteklenir.
- Loading satırları gerçek kolon geometrisini koruyan Skeleton hücreleri kullanır. Empty state tablo gövdesinde kalıcı ve okunabilir içerik olarak görünür.
- Dar ekranda kolonları ezmek veya veriyi gizlemek yerine isimlendirilmiş, klavyeyle odaklanabilir yatay scroll region sağlanır.
- Satır seçimi isteğe bağlıdır; controlled/uncontrolled kimlik koleksiyonu, satır bazında accessible label, seçilemeyen satırlar ve `indeterminate` toplu seçim desteklenir. Toplu işlem yalnızca seçilebilir mevcut satırları etkiler.
- Pagination 1-tabanlı controlled/uncontrolled sayfa durumu sunar. `client` modu sıralanmış bütün satırları dilimler; `manual` modu dışarıdan yüklenen sayfayı `totalRows` ile temsil eder. Sayfa kontrolü ayrı `Pagination` bileşeni olarak da kullanılabilir ve tablo toplu seçimi yalnızca görünür sayfadaki seçilebilir satırları etkiler.
- Sanallaştırma ürün ihtiyacı doğrulanana kadar uygulanmaz. DataTable ve Pagination `@imthekaiwen/ui-web/data` alt girişinde kalır; ağır chart/data bağımlılıkları core export'a eklenmez.

### 6.5 BarChart, PieChart, GroupedBarChart ve StackedBarChart

- `BarChart`, tek serili kategorik karşılaştırmalar için `horizontal | vertical` yön, görünür başlık, açıklama, kategori etiketi ve formatlanmış değer sunar; bilgi yalnızca renk, hover veya tooltip ile iletilmez.
- Negatif değerler sıfıra sıkıştırılır. Ölçek veri içindeki en büyük pozitif değerden veya tüketicinin verdiği daha yüksek `maxValue` değerinden türetilir; çubuklar geometri dışına taşmaz.
- Loading iskeletleri gerçek etiket/iz geometrisini korur; empty state aynı figure bağlamında kalıcı ve okunabilir içerik olarak görünür.
- Dar ekranda etiket ve değer birlikte okunur, iz ayrı satıra geçer. Uzun Türkçe etiketler sayfa seviyesinde yatay taşma üretmez.
- Çubuk ölçüsü geçişi merkezi motion policy'yi kullanır; `motion="off"` ve `prefers-reduced-motion` hareketi kapatır. Veri her render'da yeniden başlatılan keyframe animasyonuna bağlı değildir.
- Her iz pointer hover ve klavye focus ile ortak Tooltip bileşenini açar; tooltip görünür etiket/değerin erişilebilir alternatifi değil, ikincil doğrulamasıdır.
- `PieChart`, ortak `ChartDatum` üzerinden tek-seri parça-bütün karşılaştırması; kalıcı legend, focus/hover segment Tooltip'i, loading/empty ve reduced-motion davranışı sunar.
- `GroupedBarChart`, kategorileri ortak bir dikey tabanda birden fazla seriyle karşılaştırır. `ChartSeries` sırası legend ve çubuk sırasını belirler; eksik veya negatif seri değeri sıfır kabul edilir. Görünür değerler, seri adları, farklı marker biçimleri ve çubuk desenleri ayrımı yalnızca renge bırakmaz.
- `StackedBarChart`, aynı `ChartSeries` ve `GroupedChartDatum` verisini kategori toplamlarını karşılaştırmak için yığar. `horizontal | vertical` yönü, görünür ve yerelleştirilebilir değer ekseni, sabitlenebilir maksimum değer ve 2–8 eşit eksen aralığı sağlar. Her segment klavye ile odaklanabilir; tooltip kategori, seri ve formatlanmış değeri birlikte açıklar. Kategori toplamı tooltip dışında kalıcı olarak görünür.
- Dar ekrandaki çok-serili plot, sayfayı taşırmak yerine adlandırılmış ve klavyeyle odaklanabilir kendi yatay scroll region'ını sağlar. Her çubuk focus/hover Tooltip'i sunar; loading ve empty geometrileri figure içinde kalır.
- Dört temel grafik ağır bir grafik motoru eklemez ve `@imthekaiwen/ui-web/data` altında kalır. PieChart, GroupedBarChart ve StackedBarChart ayrı bileşenlerdir; BarChart içine biçim değiştiren bir `type` prop'u eklenmez. SVG/canvas motorları ayrı ihtiyaç doğrulaması gerektirir.

### 6.6 ReorderableList

- Sıra controlled `items` ve `onReorder` ile uygulamaya aittir; bileşen kaydetme, optimistic mutation veya sunucu senkronizasyonu yapmaz.
- Pointer ve touch sürükleme yalnızca görünür tutamaçtan başlar. Layout hareketi transform tabanlı, kesilebilir ve global `off | subtle | balanced | expressive` politikasıyla reduced-motion tercihine bağlıdır.
- Klavye kullanıcısı Space/Enter ile öğeyi yakalar, Arrow Up/Down veya Home/End ile taşır, Space/Enter ile bırakır ve Escape ile başlangıç sırasına döner. Değişiklikler polite live region üzerinden duyurulur.
- Her satırda görünür yukarı/aşağı düğmeleri bulunur; bu yol touch, switch-control ve sürükleme kullanmak istemeyen kullanıcılar için aynı controlled sonucu üretir.
- Disabled liste veya öğe; pointer, klavye ve açık taşıma eylemlerinin tamamından çıkarılır. Uzun Türkçe içerik ve trailing metadata tutamacı ya da eylemleri dışarı itemez.
- Pattern `@imthekaiwen/ui-web` ve `@imthekaiwen/ui-web/patterns` girişlerinde yaşar; kanban, çok kolonlu transfer ve sanallaştırma ayrı doğrulanmış ihtiyaçlardır.

## 7. Asenkron durumlar: Loading, Skeleton, Progress

Aynı şeyi göstermemeliler:

| İşlem                        | Öneri                                         | Kaçınılacak durum                      |
| ---------------------------- | --------------------------------------------- | -------------------------------------- |
| Sayfa/kart verisi bekleniyor | Geometri eşleşmeli Skeleton                   | Tüm sayfayı sürekli spinner'a çevirmek |
| Kısa buton işlemi            | Inline spinner + stabil label/width           | Düğmenin kaybolması                    |
| Yüzde biliniyor              | `Progress` + açıklayıcı metin                 | Sahte yüzde uydurmak                   |
| Belirsiz uzun işlem          | Loading state + açıklama ve gerekiyorsa iptal | Kullanıcıyı belirsiz bırakmak          |
| Veri yok                     | `EmptyState`                                  | Sonsuz loading göstermek               |
| Hata var                     | `ErrorState` + Retry                          | Hata yerine boş ekran                  |

Hedef API:

```tsx
<AsyncBoundary
  status={status} // 'idle' | 'loading' | 'success' | 'empty' | 'error'
  loading={<ProjectCardSkeleton />}
  empty={<EmptyState title="No projects yet" />}
  error={<ErrorState onRetry={retry} />}
>
  <ProjectList projects={projects} />
</AsyncBoundary>
```

`AsyncBoundary` **opsiyonel v1.1 yardımcı**; veri getirme veya cache işlemi içermez. Skeleton hazır varyantları: `Text`, `Avatar`, `Card`, `Table`, `Chart`, `Chat`, `Page` (tam kapsam aşamalı). Shimmer/pulse reduced-motion'da kapatılır; gerçek içerik geldiğinde zıplama olasılığı snapshot/CLS testiyle izlenir.

## 8. Toast ve bildirim sistemi

Hedef API taslağı:

```tsx
const id = toast.loading('Uploading files');
// Asenkron işin sonucunu uygulama belirler:
toast.success('Files uploaded', { id });
// Alternatif: toast.error('Upload failed', { id, action: { label: 'Retry', onClick: retry } });
```

- Tek bir `ToastProvider`, uygulama kökünde; responsive placement, queue/stack, dedupe ve dismiss yönetimi.
- Türler: `info`, `success`, `warning`, `error`, `loading`, `action`.
- Bir işlem için loading toast aynı kimlikle success/error olarak güncellenebilir; aynı işi iki kez bildirme.
- **Kritik/kalıcı hata** sadece kısa sürede kaybolan toast ile temsil edilmez; Alert/ErrorState gerekir.
- Toast süresi içerik uzunluğu ve kullanıcı eylemi gereksinimine uygun olur; hover/focus sırasında kapanmayı durdurma gibi kurallar test edilir.
- Undo yalnızca gerçekte geri alınabilir işlem için gösterilir; callback state ve expiration tutarlı.
- `aria-live`/`role=status|alert` kararları tür ve aciliyetle uyumlu, gereksiz tekrar anons yok.
- Toast görünümü nötr, küçük ikon/metin ve çok hafif motion; kategoriye özel baştan aşağı renkli kartlardan kaçınılır.

## 9. Success, Error, Empty ve Confirmation Pattern'ları

**Pattern ile component arasındaki ayrım:**

- `Alert`: sayfa içinde kısa, bağlamsal uyarı.
- `Toast`: geçici işlem geri bildirimi.
- `EmptyState`: henüz veri yok / arama sonuçsuz.
- `ErrorState`: hata, sebep ve uygulanabilir Retry/Support action.
- `ConfirmationPage` / `SuccessPage`: tamamlanmış **önemli ve yönlendirici** akışlar. Basit kayıtta kullanılmaz.

Pattern hedef props: `title`, `description`, `icon`, `primaryAction`, `secondaryAction`, gerektiğinde `details`. Metin/içerik ürün tarafından sağlanır; başarı yönlendirmesi varsayılan olarak otomatik yapılmaz. `celebratory` efekt ayrı opt-in variant olur; normal/default minimaldir.

## 10. Step-by-Step Forms / Wizard (v1.1)

İlke: Kullanıcının zihinsel modelinde gerçek bir çok aşamalı süreç yoksa formu parçalama.

Gereken davranışlar:

1. Adımların açık adı ve mevcut konumu; sadece renkli ilerleme çizgisine bel bağlama.
2. Bir sonraki adıma geçmeden bulunduğu adımın doğrulanması; hata durumunda doğru alana focus.
3. Geri dönüşte form değerlerinin korunması; giriş sıfırlanmaz.
4. `next`, `back`, `goTo` veya controlled step API'si; atlanabilir/koşullu adımlar.
5. Opsiyonel taslak kalıcılığı uygulama adapter'ında; gizli form verilerini tasarım paketi otomatik saklamaz.
6. Son adımda gözden geçirme, explicit submit, double submit koruması, hata durumunda recovery.
7. Dar ekranda stepper'ın taşmaması, uzun başlık, klavye ve screen-reader anonsları.

Hedef örnek:

```tsx
<FormWizard
  steps={steps}
  activeStep={activeStep}
  onStepChange={setActiveStep}
  onComplete={submit}
/>
```

Hedef API; gerçek step şeması (`id`, `label`, `render`, `validate`) implementasyon öncesinde TS contract olarak sabitlenir. Form çözümü React Hook Form veya başka form kütüphanesine zorunlu bağlı kalmamalı; adapter en az karmaşık seçenek olarak tasarlanır.

## 11. Layout sözleşmesi

| Primitive           | Temel sorumluluk                     | Zorunlu davranış                              |
| ------------------- | ------------------------------------ | --------------------------------------------- |
| `Container`         | Okunabilir max-width                 | Fluid width, safe padding                     |
| `Stack`             | Dikey yerleşim                       | Token gap, align, wrap edilmemiş içerik       |
| `Inline`            | Yatay yerleşim                       | Wrap, alignment, dar ekranda taşmayı önleme   |
| `Grid`              | Responsive kolonsal kompozisyon      | `minmax(0,1fr)`, dynamic spans, gaps          |
| `PageHeader`        | Başlık/aksiyon düzeni                | Uzun metin, mobilde alt alta düzen            |
| `AppShell` (1.1)    | Sidebar + content + topbar           | Collapse, resize, sticky, scroll ownership    |
| `SplitView` (ileri) | Yeniden boyutlandırılabilir paneller | Klavye kontrolü, min/max, persistence adapter |

- Layout props `gap`, `padding`, `columns`, `span`, `align`, `justify`, `maxWidth` standardına yakın olmalı; implementasyon TypeScript ile sınırlandırılır.
- Raw responsive CSS gerektiğinde kendi component veya theme tokenı eklenir; müşterinin `grid-template-columns` kodu her projede yeniden kopyalanmaz.
- `overflow: hidden` her taşmayı gizlemek için kullanılmaz; veri kesiliyorsa tooltip/scroll/expand alternatifi düşünülür.
- Hover press scale ve popover açılışı layout reflow'a neden olmamalı.

## 12. ThemeSwitcher / LanguageSwitcher / Icons

- `ThemeSwitcher`: sun/dark/system modlarını gösterir; görünür/erişilebilir durum; tema provider ile entegre veya controlled `value`/`onValueChange`.
- `LanguageSwitcher`: `value`, `options: {value,label}[]`, `onValueChange`; i18n provider ve router uygulama sorumluluğunda. UI varsayılan sözlük dayatmaz.
- `Modal` controlled/uncontrolled açılma, boyut ve Header/Content/Footer kompozisyonu sağlar. `Drawer` aynı erişilebilir overlay sözleşmesini `left | right | top | bottom` yönleriyle uygular.
- İkon adı, optik boyut ve stroke'lar `@imthekaiwen/icons` kontrolünde; `aria-hidden` dekoratif ikonlarda, icon-only etkileşimlerde görünür/a11y isim zorunlu.

## 13. Bileşenin klasör ve doküman teslim şekli

```text
src/components/Button/
├── Button.tsx
├── Button.styles.css (gerekirse)
├── Button.stories.tsx
├── Button.test.tsx
└── index.ts
```

Her bileşenin story'leri kapsamına uygun olarak: default, variants, sizes, theme modes, motion levels, press interruption, keyboard/focus, loading/disabled, long Turkish copy, mobile viewport örnekleri içerir. Geçerli olmayan durumlar zorlama şekilde gösterilmez.

Bileşen manifest'i şunları sunmalı: `name`, `category`, `package`, `importPath`, `props`, `states`, `tokens`, `stories`, `platform`, `since`. TypeScript ve stories'ten **üretilir**; manuel `.md` kopyalama yok.

## 14. Done kriteri

Bir bileşen **tamamlandı** sayılabilmesi için:

- [ ] Semantik HTML, klavye ve focus davranışı var.
- [ ] Token/theme/density ve mevcut motion preset'lerini kullanıyor.
- [ ] Kesilebilir animasyon ve reduced-motion geçiyor (hareket varsa).
- [ ] 360 / 768 / 1024 / 1440 px ve Türkçe uzun metinler taşmıyor.
- [ ] Light/dark kontrast denetimi yapıldı.
- [ ] Storybook interaktif örnekleri, TypeScript API, unit/a11y/visual test mevcut.
- [ ] Studio aynı gerçek component'i gösterebiliyor.
- [ ] Dışa aktarma ve bundle bağımlılıkları kontrol edildi.
- [ ] Breaking change varsa Changeset + migration planı oluşturuldu.

Kıyaslama: `DESIGN_LANGUAGE.md` görsel kuralları, `ARCHITECTURE.md` modül sahipliğini, `DEVELOPMENT.md` CI/doğrulama yöntemini tanımlar.
