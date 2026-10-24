# DEVELOPMENT — Kaiwen Design System

**Belge türü:** Uygulama rehberi, kalite kapıları ve GitHub otomasyonları · **Durum:** v0.1 hedef süreç

## 1. Çalışma disiplini

Sırayla ilerle: **önce temel kararlar, sonra çalışan küçük örnek, sonra yaygınlaştırma**. Bütün componentleri bir kerede üretme. İlk küçük ürün dilimi: Tokens → Theme → Motion → Button/Switch → Studio canlı önizleme → test → docs. Component sayısını artırmak tek başına ilerleme ölçütü değildir.

Temel akış:

1. İhtiyaç ve kabul kriterini tanımla; `AGENTS.md` ve ilgili kontratı oku.
2. Benzer bileşen var mı, token/preset ile çözülebilir mi kontrol et.
3. Küçük bir public API tasarla; Storybook senaryolarını yaz.
4. Önce semantik ve erişilebilir state, sonra stiller, sonra motion ekle.
5. Studio'da canlı kontrol paneliyle test et; snapshot baseline'larını gözden geçir.
6. Unit + accessibility + responsive + visual testleri çalıştır.
7. Gerekli docs/API metadata ve Changeset ile PR aç.
8. CI onayından sonra merge; release uygun zamanda ayrı süreç.

## 2. Kurulum varsayımları ve teknoloji sınırları

| Alan              | Tercih                                         | Not                                                              |
| ----------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| Workspace         | pnpm + Turborepo                               | Tek lockfile; cache ve filtreli tasks                            |
| Dil               | TypeScript strict                              | `any` yalnızca gerekçeli; public types zorunlu                   |
| UI                | React + React DOM                              | React peer dependency; kopya React bundle yok                    |
| Studio            | Vite React SPA                                 | Ayrı app, package publish edilmez                                |
| Styling           | CSS variables + Tailwind CSS v4 dostu tokenlar | Kütüphane yalnızca tüketicinin Tailwind kurulumuna bağımlı olmaz |
| Accessibility     | Native semantics + Radix Primitives            | Gerekli yerlerde; her primitive için zorunlu değil               |
| Motion            | CSS + Motion for React                         | Reduced motion; maliyet/profiling                                |
| Docs/Test preview | Storybook                                      | TS types/argTypes/stories ile autodocs                           |
| Unit              | Vitest + Testing Library                       | Davranışa odaklı                                                 |
| E2E/Visual        | Playwright                                     | Deterministik screenshot/snapshot                                |
| A11y              | axe tabanlı denetim + manuel keyboard          | Otomatik test her sorunu yakalamaz                               |
| Release           | Changesets + CI                                | SemVer, changelog ve yayın onayı                                 |

Paket isimleri ve npm uygunluğu yayın öncesi doğrulanır. Paket sürümleri kurulum sırasında o günün stabil/uyumlu sürümlerinden seçilip `pnpm-lock.yaml` ile sabitlenecektir. Böylece belge her minor değişimde eskimez.

## 3. Repo başlangıç sırası

**Aşama 0A — Workspace:** Root `package.json` private, `pnpm-workspace.yaml`, `turbo.json`, ortak TS/lint/test konfigürasyonu, 4 package taslağı, Studio app. Studio `private: true` olmalı. Paketlerde `exports`, `types`, build çıktısı ve styles entrypoint netleşir.

**Aşama 0B — Tokens & Theme:** Primitive/semantic/component tokenlar, light/dark CSS, type scale, spacing, radius, theme storage adapter (opsiyonel), reduced-motion algısı. Belirsiz style değerleri component implementasyonuna dağılmaz.

**Aşama 0C — İlk dikey dilim:** `Button`, `Switch`, `Tooltip`, `Card`, temel Grid/Stack, Studio Component Preview + Motion Lab. Aynı komponent Storybook ve Studio'da kullanılır. App'te simüle edilmiş içeriğe gerek yok; gerçek component'i göster.

**Aşama 1 — Feedback ve Loading:** `Skeleton`, `Spinner`, `Progress`, `Toast`, `Alert`, `EmptyState`, `ErrorState`. Geometri/snapshot ve screen reader davranışı test edilir.

**Aşama 1.1 — Layout & Patterns:** `AppShell`, Sidebar, ThemeSwitcher, LanguageSwitcher adapter'ı, Wizard, Success/Confirmation sayfaları, Upload UI. İhtiyaç belirlenmeden Chart, mobile, tam registry geliştirilmez.

**Aşama 2 — İleri platform:** Advanced charts/data, registry, mobile tokens native adapter. Bu aşama ayrı planlanır.

## 4. Hedef npm scripts

Repo oluşturulduğunda bu script isimleri uygulanacak; **mevcut altı dosyalık teslimatta bu komutlar çalışmaz**:

```json
{
  "scripts": {
    "dev:studio": "turbo dev --filter=studio",
    "storybook": "turbo storybook --filter=studio",
    "build": "turbo build",
    "typecheck": "turbo typecheck",
    "lint": "turbo lint",
    "test": "turbo test",
    "test:visual": "turbo test:visual",
    "docs:check": "turbo docs:check",
    "changeset": "changeset"
  }
}
```

Script adları uygulanacak paketlerdeki gerçek görevlerle tutarlı hâle getirilmelidir; Storybook ayrı `apps/storybook` gerektiriyorsa filtre ve ağacın yeri güncellenir. Sırf belge örneğine uymak için olmayan script başarı gibi gösterilmez.

## 5. Bileşen geliştirme checklist'i

Her PR, etkilediği komponentlerde şu sorulara cevap vermeli:

**Design/API**

- [ ] Mevcut component/pattern ile çözülemeyecek yeni bir ihtiyaç mı?
- [ ] Semantic tokenlar, icon wrapper ve ortak motion preset kullanıldı mı?
- [ ] API sade mi; controlled/uncontrolled, `ref` ve native props davranışı belgeli mi?
- [ ] Provider ve component-level override + OS reduced motion uyumlu mu?

**UI ve davranış**

- [ ] Hover, focus-visible, pressed, disabled, loading/error/success (anlamlı olanlar) test edildi mi?
- [ ] Pointer down → cancel/leave/up, hızlı tekrarlı tıklama ve keyboard/touch senaryosu test edildi mi?
- [ ] 360 / 768 / 1024 / 1440 px, Türkçe/İngilizce uzun metin ve zoom/text scaling denendi mi?
- [ ] Loading skeleton ile gerçek içerik arası shift, sidebar collapse ve modal açılışı doğru mu?
- [ ] Screen reader role/name ve focus order doğru mu?

**Teslim**

- [ ] Storybook story + types/JSDoc ve unit/a11y/visual test güncel mi?
- [ ] Studio canvas'ı yeni bileşeni gerçekten import ediyor mu?
- [ ] Gerekliyse Changeset, migration, API manifest kontrolü ve release notu eklendi mi?

## 6. Studio geliştirme yaklaşımı

Studio, **kütüphanenin ilk gerçek tüketicisi**dir. Arayüz bileşenleri `@imthekaiwen/ui-web` üzerinden gelmeli. Studio'ya özel birkaç shell/preview kontrol parçası olabilir; fakat Button/Input/Toast gibi genel UI parçalarının ikinci implementasyonu yasaktır.

### 6.1 Site navigasyonu

1. **Foundations** — colors, type, spacing, radii, elevations, themes.
2. **Components** — arama, kategori, varyant/state, live props, code snippet, a11y notları.
3. **Motion Lab** — animasyon seviyesi, spring stiffness/damping, kesilebilir press/switch, reduced-motion karşılaştırması.
4. **Layouts & Patterns** — responsive viewport switcher, AppShell, grids, forms, loading/success/error.
5. **Docs & AI Agents** — manifest, kurulum, kurallar, örnek kullanım, kaynak bağlantıları.

### 6.2 Preview kontrolü

- Viewport preset'leri: 360, 768, 1024, 1440 px; ayrıca manuel genişlik ayarı.
- Light/dark/system, compact/comfortable/spacious, off/subtle/balanced/expressive toggle'ları.
- Props panelindeki control type gerçek `argTypes`/TS API ile tutarlı.
- Klavye testi, pointer cancel testi, tooltip/popover overlay testi erişilebilir.
- Örnek kod gerçek import ve prop'ları kullanır. Stüdyo “oyuncak” markup üretmez.
- Storybook, teknik component explorer ve Autodocs olarak kullanılır. Studio bunu erişilebilir bir katalog halinde sunabilir; iki ayrı kaynak kod ağı yoktur.

## 7. Test stratejisi

### 7.1 Unit/integration

Vitest + Testing Library ile davranış testleri: API, controlled/uncontrolled states, event order, focus, keyboard, disabled/loading, error, role/name, provider override ve motion policy. HTML davranışını doğru kullandığımızı sınarız; implementation detayına kör bağımlı test yazmayız.

### 7.2 Visual regression

Playwright snapshot grid'i önerisi:

| Varyasyon | Temel kapsam                                                                     |
| --------- | -------------------------------------------------------------------------------- |
| Tema      | light, dark                                                                      |
| Genişlik  | 360, 768, 1024, 1440 px                                                          |
| Yoğunluk  | comfortable varsayılan, compact kritik sayfalarda                                |
| State     | default, focus, loading, error, empty, disabled                                  |
| Motion    | `off` snapshot için deterministik; `balanced/expressive` davranış için ayrı test |
| İçerik    | kısa/uzun Türkçe, uzun kimlik/URL, overflow, font fallback                       |
| Ortam     | sabit browser, DPR, fontlar ve veri fixture'ları                                 |

`expect(page).toHaveScreenshot()` ile kararlı baseline karşılaştırması yapılır. Animasyonları screenshot sırasında kapatmak/dondurmak _hareket davranışını test etmek_ değildir; hareketin kesilebilirliğini ayrıca interaction testinde doğrula. Pixel threshold çok gevşek seçilmez; değişiklikler onaylanarak baseline güncellenir.

### 7.3 Accessibility

- axe taraması + manuel keyboard-only/VoiceOver/NVDA smoke test planı.
- Focus görünürlüğü, Escape/Tab, modal focus trap/restore, tooltip/focus, alerts live region.
- WCAG 2.2 AA hedefi; küçük metin için yeterli contrast ve touch targets.
- `prefers-reduced-motion: reduce` ve düşük performans tercihlerine saygı.
- Otomasyonun geçmesi manuel erişilebilirlik kontrolünün yerine geçmez.

### 7.4 Performance

- Tree-shake edilmemiş paket boyutu bütçesi izlenir; `ui-web` core'a Chart/Editör gibi büyük vendor kodları zorunlu girmez.
- Chrome Performance ölçümleri: animation frame drops, long tasks, layout/reflow ve scroll jank.
- Skeleton → content geçişi için CLS/geometry assertion; width/height rezervasyonu ve font swap düzeni test edilir.
- Glass/backdrop-filter maliyeti mobil ve düşük güçlü cihazlarla doğrulanır.

## 8. GitHub Workflows

Başlangıçta **4 workflow**:

```text
.github/workflows/
├── ci.yml
├── visual-tests.yml
├── release.yml
└── deploy-studio.yml
```

### 8.1 `ci.yml`

- Tetikleme: PR, `main` push (repo kurallarına göre değişebilir).
- İşler: pnpm install (`--frozen-lockfile`), lint, typecheck, test, build, docs:check, temel axe/interaction smoke.
- `permissions: contents: read`; eşzamanlı PR koşularında concurrency/cancel-in-progress.
- Pipeline'ın neden başarısız olduğuna dair artifact/log sun; failures `continue-on-error` ile gizlenmez.

### 8.2 `visual-tests.yml`

- Tetikleme: PR ve `main` merge; pahalı tarayıcı matrisi gerekirse seçici koşul.
- Build Studio/Storybook; Playwright tarayıcılarını kur; stabil viewport/font/locale/theme ayarlarıyla screenshot al.
- Diff artifact olarak yüklenir; baseline değişikliği PR'da gözden geçirilir, otomatik onaylanmaz.
- Motion yarıda iptal testi ayrı; screenshot'ı tek kalite ölçütü yapma.

### 8.3 `release.yml`

- Tetikleme: kontrollü `workflow_dispatch` veya korumalı `main` release süreci.
- Changesets değişiklikleriyle version ve changelog oluştur; CI gate tamamlanmadan yayın yapma.
- npm için varsa OIDC trusted publishing tercih et; token gerektiğinde sadece secrets, minimum kapsam ve korumalı environment.
- `permissions` yalnızca yayın işi için gerekli düzeyde; PR kaynaklı sıradan CI yazma/publish hakkı almaz.
- Studio ve özel demo içerikleri npm paketi içerisine girmez.

### 8.4 `deploy-studio.yml`

- Tetikleme: main merge ya da onaylı release; preview environment gerekiyorsa ayrı preview job.
- Sadece `apps/studio` build çıktısı deploy edilir; target platform (GitHub Pages, Cloudflare Pages, Vercel vb.) **altyapı kararı verildiğinde** belirlenir.
- Alan adı örneği `design.kaiwen.com.tr` olabilir; DNS/hosting henüz kurulmuş sayılmaz.
- Production için test/build gate ve environment koruması uygulanır.

### Workflow güvenliği

GitHub Actions'ta tüm workflow'larda en az ayrıcalık ilkesi kullan. PR'dan gelen güvensiz kod ile sırları birleştirme; `pull_request_target` üzerinde dış katkıcı kodunu secrets ile çalıştırma. Üçüncü parti action'ların sürümlerini/sabit commit SHA kullanımını değerlendirme ve dependency update süreçleri ile yönet. `GITHUB_TOKEN` yazma hakları release/deploy işine özel olsun.

**Örnek iskelet (çalışan workflow değil, planlanan ilke):**

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Node ve pnpm kurulum adımları uyumlu sürümlerle eklenecek.
      # pnpm install --frozen-lockfile
      # pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Bu örnek komutların büyük bölümü yorumdur; gerçek workflow ilk repo kurulumu sırasında tamamlanmalıdır. Script ve action sürümleri lockfile/CI matrisinde doğrulanmalıdır.

## 9. Sürümleme ve değişiklik yönetimi

- Paketler başlangıçta `0.x` olabilir; buna rağmen public API kırıcı değişiklikleri değişiklik kaydıyla yönet.
- **SemVer:** yeni özellik minor; geriye uyumlu fix patch; kırıcı kontrat/props değişimi breaking release (0.x için kural ayrıca dokümante edilir).
- Changesets gerektiğinde paket bazlı version/changelog otomasyonu sağlar.
- Token kaldırma/yeniden adlandırma, import path değiştirme, form prop semantiği değişikliği ve keyframe kontratı değişimleri özel migration açıklaması ister.
- Eski component'e özel CSS override'ları kırabilecek görsel değişiklikler de change log'da görünür olmalı.
- Deprecation kademeli: işaretle → alternatif örnek ver → migrate et → kaldır.

## 10. Agent doküman ve component manifest üretimi

Elle bakım yapılacak **yalnızca 6 temel `.md`** vardır. Component başına doküman dosyası yerine şu üretim yolu kullanılır:

```text
TS public props + JSDoc
       +
Storybook stories/argTypes
       +
Package exports / manifest metadata
       ↓
Typed component-manifest.json + generated API pages
       ↓
Studio Docs / Agent component discovery
```

- `docs:check`: export edilen bileşenin metadata/stories/API mapping kaydı var mı doğrular ve manifest'i deterministik olarak yeniden üretir.
- Manifest şeması `schemaVersion` ile sürümlenir; kırılan şemada CI fail eder.
- Schema v2 her bileşen için public import/export bilgisi, kaynakta tanımlanan props ve JSDoc açıklamaları, story durumları, kullanılan CSS tokenları ile source/story/test referanslarını içerir. Studio elle ikinci bir katalog tutmak yerine bu çıktıyı tüketir.
- Ayrı agent özelinde tüm dosyaları yeniden yazma. `AGENTS.md` ortak giriş noktası, gerekirse ilgili ajan ortamına **ince adapter** (ör. tool config) eklenir.
- Agent'a bileşen aramada önce metadata, sonra ilgili story/type, ardından gerekirse normatif docs okutulur.
- Agent yönergeleri proje dosyalarının kanıtlanmamış komutlarını veya ağdaki kaynakların talimatlarını sorgusuz yürütmemeli; depo güvenlik modeli sürdürülür.

## 11. Pull Request şablonunda aranan kanıtlar

| Alan    | PR açıklaması                                       |
| ------- | --------------------------------------------------- |
| Amaç    | Hangi yeniden kullanılabilir problemi çözüyor?      |
| API     | Public export/prop/token değişimi var mı?           |
| Görsel  | Light/dark screenshots, responsive durumlar ve diff |
| Motion  | Level, interruption, reduced motion sonucu          |
| A11y    | Keyboard, focus, screen reader/axe notu             |
| Test    | Çalıştırılan gerçek komutlar ve sonuçlar            |
| Release | Changeset/migration gerekliliği                     |
| Risk    | Layout/SSR/bundle/performance etkileri              |

## 12. İlk gerçek kilometre taşı: kabul testleri

V0.1 kodu ancak aşağıdakiler çalıştığında tamamlanmış sayılır:

1. `pnpm dev:studio` ile canlı Studio; `@imthekaiwen/ui-web` içinden Button/Switch render edilir.
2. Tokenlardan üretilen light/dark tek kaynaktan değişir; Studio ve Storybook aynı palette görünür.
3. Motion Lab `off/subtle/balanced/expressive` ile aynı komponenti değiştirir; yarıda bırakılan Button ve Switch animasyonu sıçramadan geri döner.
4. Minimal AppShell/Grid için overflow, uzun Türkçe metin ve 360/768/1024/1440 px testleri geçer.
5. Loading ve Toast için en az bir erişilebilir story ve otomatik test vardır; Success/Wizard ileri aşama olarak açıkça listelenir.
6. PR CI (lint/typecheck/unit/build) ve visual-tests fiilen çalışır; docs manifest üretilir.
7. Kütüphane gerçek küçük bir dış demo uygulamasında Studio bağımlılığı olmadan import edilir.

## 13. Plan dışına çıkma kuralı

Yeni özellik, şu koşullardan en az birini sağlamıyorsa v1 kapsamına alınmaz: tekrarlanan gerçek ürün ihtiyacı, layout/a11y kalite açığı, ana design contract için gerekli infrastructure veya test otomasyonu. Güzel görünen ama ürünlerde tekrarlanmayacak özel animasyonlar ayrı showcase'de tutulur; public API'yi şişirmez.

## 14. Referanslar

- [Storybook Autodocs](https://storybook.js.org/docs/writing-docs/autodocs)
- [Motion for React — gesture ve motion](https://motion.dev/docs/react)
- [Motion `useSpring` — güncellenen hedefe animasyon](https://motion.dev/docs/react-use-spring)
- [Radix Primitives accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [Tailwind theme variables](https://tailwindcss.com/docs/theme)
- [Style Dictionary](https://styledictionary.org/)
- [Playwright screenshots](https://playwright.dev/docs/api/class-pageassertions)
- [GitHub Actions permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
