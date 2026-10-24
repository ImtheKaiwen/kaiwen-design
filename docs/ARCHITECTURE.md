# ARCHITECTURE — Kaiwen Design System

**Belge türü:** Normatif mimari kararlar · **Durum:** v0.1 taslak · **Platform önceliği:** Web → Mobile

## 1. Amaç, kapsam ve kalite hedefleri

Kaiwen Design, yeni ürünlerin aynı görsel kimliği ve davranış kurallarını tekrar tasarlamadan tüketmesini sağlayan bir **tasarım altyapısıdır**. Tek bir görsel tema değildir: tokens → motion/icons → UI → layouts/patterns → uygulamalar şeklinde katmanlıdır.

Mimari şu gereksinimleri karşılamalı:

1. Bütün ürünlerde ortak semantic tokens, component API, animation levels ve icon yüzeyi.
2. React ve Electron gibi Web tabanlı tüketicilerde tek `@imthekaiwen/ui-web` kurulum akışı.
3. Studio uygulamasında gerçek kütüphane bileşenlerinin birebir canlı gösterimi; ikinci bir UI implementasyonu yok.
4. Skeleton–content, sidebar, responsive ve long-content geçişlerinde yerleşim kararlılığı.
5. Erişilebilir, kesilebilir, reduced-motion'a uyumlu mikro etkileşimler.
6. Küçük public API; paketler arası döngüsüz bağımlılık; ihtiyaç olmayan advanced modülleri zorunlu bundle'a taşımama.
7. Gerçek kod/types/stories kaynaklarından otomatik dokümantasyon ve agent keşfi.
8. Web bileşenlerini native'e zorla taşımadan platformlar arası **tasarım tokenlarının** tekrar kullanımı.

## 2. Mimari karar özeti (ADR-lite)

| Kod  | Karar                                                           | Sebep                                                                  |
| ---- | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| A-01 | Tek depo: pnpm workspaces + Turborepo                           | Tek versiyonlu geliştirme, ortak test/build, basit değişiklik yönetimi |
| A-02 | Başlangıçta 4 dağıtılabilir paket                               | Paketsel bağımsızlık ama aşırı parçalanma yok                          |
| A-03 | Studio `apps/studio`, publish edilmeyen app                     | Kütüphane derlemesinden ve kullanıcı bundle'ından izole                |
| A-04 | Semantic CSS custom properties = Web tema sözleşmesi            | Global Tailwind runtime'a gömülmeden tema değişimi                     |
| A-05 | Component source + TypeScript + Storybook = API/doküman kaynağı | Ayrı `.md` dosyalarının drift etmesini azaltır                         |
| A-06 | Motion merkezi; görsel seviye provider'dan                      | Tutarlı animasyon ve sistem düzeyi azaltılmış hareket                  |
| A-07 | React Native sonradan ayrı adapter                              | DOM ve native layout/gesture farklarını korur                          |
| A-08 | Charts/DataTable/registry bağımsızlaşmaya aday                  | Core bundle maliyetini büyütmez                                        |

## 3. Monorepo ve modül sahipliği

```text
kaiwen-design/
├── apps/
│   └── studio/
│       ├── src/
│       │   ├── app/                 # Routing, Studio shell, feature flags
│       │   ├── pages/               # Foundations/Components/Layouts/Patterns/Docs
│       │   ├── playground/          # Live props, theme, motion, viewport controls
│       │   └── documentation/       # Story/API metadata okuyucuları
│       └── package.json
├── packages/
│   ├── tokens/
│   │   └── src/
│   │       ├── primitives/          # Raw neutrals, typography scale, spacing scale
│   │       ├── semantic/            # surface/text/border/action/status names
│   │       ├── themes/              # Light/dark mappings
│   │       └── generated/           # Build çıktıları; elle değiştirilmez
│   ├── motion/
│   │   └── src/
│   │       ├── config/              # Levels and reduced-motion policy
│   │       ├── presets/             # Press, switch, tooltip, enter, exit, layout
│   │       ├── hooks/               # Interruptible spring/gesture helpers
│   │       └── adapters/            # CSS / Motion for React bindings
│   ├── icons/
│   │   └── src/                     # Public icon names, sizing, wrappers
│   └── ui-web/
│       └── src/
│           ├── primitives/          # Box, Stack, Grid, Container etc.
│           ├── components/          # Button, Input, Switch, Card etc.
│           ├── loading/             # Spinner, Skeleton, Progress
│           ├── feedback/            # Toast, Alert, Empty/Error states
│           ├── forms/               # Field contracts, validation presentation
│           ├── overlays/            # Tooltip, Dialog, Popover
│           ├── navigation/          # Tabs, Breadcrumb, Sidebar elements
│           ├── layouts/             # AppShell, Page, Grid presets
│           ├── patterns/            # Wizard/Confirmation/Loading patterns
│           ├── providers/           # KaiwenProvider/theme/preferences
│           └── styles/              # Style entrypoint; generated token import
├── tooling/
│   ├── eslint/                       # No hardcoded color, invalid import rules
│   ├── generators/                  # API/agent manifest extraction
│   └── testing/                     # Story fixtures, accessibility helpers
├── tests/visual/
├── docs/
├── .github/workflows/
├── README.md
├── AGENTS.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

**Kural:** `ui-web/src/patterns` bir _mantıksal modüldür_; varsayılan olarak ayrı npm paketi değildir. Sadece bağımsız sürüm/bundle/bağımlılık ihtiyacı kanıtlanırsa çıkarılır.

## 4. Bağımlılık grafiği

```text
@imthekaiwen/tokens  ─────────────────────────────┐
       │                                     │
       └──> @imthekaiwen/motion ───────────────┐   │
@imthekaiwen/icons (bağımsız) ───────────────┐ │   │
                                       v v   v
                                 @imthekaiwen/ui-web
                                        │
                                        v
                                  apps/studio
                                        │
                                        v
                         Kaiwen ürünleri (tüketici)
```

- `tokens`: React bağımlılığı taşımaz; CSS/JS/token export eder.
- `motion`: token/preset tipleri ve React adapter'ları sağlayabilir; `ui-web`'e bağlı **olamaz**.
- `icons`: React peer dependency ve ikon kütüphanesi; `ui-web`'i import etmez.
- `ui-web`: React peer dependency; tokens/motion/icons tüketir; Radix yalnızca gerekli primitive'lerde kullanılır.
- `studio`: `ui-web` paketini ve metadata'yı tüketir; bir UI library dependency'si tarafından import edilmez.
- `tooling`: sadece geliştirme zamanı bağımlılığı; son kullanıcı bundle'ına giremez.
- Cyclic import veya studio → package ters import yasaktır.

`react`, `react-dom` ve Motion/Radix gibi kütüphanelerin peer/dependency politikası build aşamasında doğrulanmalıdır: React tek kopya olacak; paket içe gömülü React bundle etmeyecek; tüketicide varsayımsal framework sürümü dayatılmayacak.

## 5. Tasarım tokenlarının kaynağı

Üç seviye:

1. **Primitive:** `neutral.0`, `neutral.50`, `space.4`, `radius.2`, `font.size.2` gibi ham değerler.
2. **Semantic:** `surface.canvas`, `surface.raised`, `text.primary`, `text.muted`, `border.subtle`, `action.primary`, `focus.ring` gibi temaya göre değişen roller.
3. **Component:** `button.height.md`, `tooltip.padding`, `sidebar.width.expanded`, `switch.thumb.size` gibi bileşene özgü varsayılanlar.

Tasarımcı/geliştirici tüketiciler component/semantic token kullanır; ham primitive kullanımına yalnızca token tanımlarında ve kontrollü özel grafiklerde izin verilir.

- Kaynak biçim: platform bağımsız JSON/TypeScript token şeması (Style Dictionary/DTCG uyumlu yaklaşım).
- Web çıktısı: `tokens.css`, `themes.css` + gerekli JS metadata.
- Native çıktısı (gelecekte): JS/TS tema objeleri, ihtiyaç olursa iOS/Android hedefleri.
- CSS teması: `data-theme="light|dark"`; sistem modu kullanıcı tercihini çözen provider tarafından uygulanır.
- Mod ayrımı: tema (light/dark), yoğunluk (compact/comfortable/spacious), motion seviyesi ve glass surface **birbirinden bağımsız** eksenlerdir.
- Sürüm değişimi: token adı silinirse/sözleşmesi değişirse breaking change. Eşdeğer semantic ad varken yeni varyasyon ekleme.

## 6. UI Web API yüzeyi

Önerilen public giriş noktaları:

```text
@imthekaiwen/ui-web              # Minimal, ağaç sarsılabilir temel export'lar
@imthekaiwen/ui-web/styles.css   # Token ve base component stilleri
@imthekaiwen/ui-web/feedback     # Toast, Alert, States
@imthekaiwen/ui-web/layouts      # Container, Stack, Inline, Grid, AppShell, PageHeader
@imthekaiwen/ui-web/patterns     # Wizard, Confirmation, Upload flows (1.1)
@imthekaiwen/ui-web/data         # DataTable, Pagination, BarChart, PieChart, GroupedBarChart, StackedBarChart (2)
@imthekaiwen/icons               # Icon wrappers
@imthekaiwen/motion              # Config, hooks, presets
@imthekaiwen/tokens              # Typed token helpers / CSS entry
```

Bu giriş noktaları hedef contract'tır. Uygulanana kadar **varmış gibi import edilmez**. Package `exports` haritası `types`, `import`, `default` ve `sideEffects`/CSS davranışına uygun hazırlanır. CSS yükleme tüketici tarafından açık ve belgeli olmalıdır.

### Tasarım ve uygulama sınırları

- `ToastProvider` görünüm, sıra ve erişilebilirlik davranışlarını yönetir; dosya yükleme/sunucu işlem mantığı uygulamanındır.
- `Modal` ve `Drawer`, ortak Radix Dialog primitive'i üzerinde focus trap, Escape, scroll lock ve focus restoration sözleşmesini paylaşır; ürün içeriğini veya iş mantığını sahiplenmez.
- `AsyncBoundary` durumları (`idle/loading/success/empty/error`) görselleştirir; veri getirme kütüphanesine bağlanmaz.
- `ThemeSwitcher` tema API'sinin hazır UI'si; `LanguageSwitcher` UI + `locale`/`onLocaleChange` adapter sözleşmesi; çeviri dosyası uygulamada.
- `Wizard` adım görünümü, geçiş ve doğrulama API'si sağlar; ürünün hesap/kayıt/ödeme iş mantığını üstlenmez.
- `ReorderableList`, kontrollü öğe sırasını pointer/touch, klavye ve açık taşıma eylemleriyle düzenler; ürün verisini kalıcılaştırmaz ve tek başına kanban/virtualization motoruna dönüşmez.
- `BarChart` yatay/dikey temel tek-seri data/config sözleşmesini ağır bağımlılık olmadan sağlar. `PieChart` ayrı geometri ve legend/segment etkileşimini kendi modülünde tutarken ortak `ChartDatum` sözleşmesini paylaşır. `GroupedBarChart` ve `StackedBarChart`, `ChartSeries`/`GroupedChartDatum` sözleşmesini paylaşır; biri serileri yan yana karşılaştırır, diğeri yatay veya dikey yığınları görünür bir değer eksenine yerleştirir. Renk dışındaki desen/işaret ayrımları korunur ve grafik türleri tek bileşenin `type` varyantlarına dönüşmez. SVG/canvas tabanlı gelişmiş grafik motorları core UI bundle'ına bağlanmaz ve ihtiyaç halinde ayrı/lazy girişte kalır.
- `Provider` tema/motion/density tercihini Context/CSS üzerinden sağlar; karmaşık bir global state yönetim sistemi değildir.
- Component registry ayrı bir runtime bağımlılığı değildir. Build/docs üreticisi public TypeScript props, Storybook exportları ve bileşen CSS token referanslarından schema sürümlü `component-manifest.json` üretir; Studio aynı üretilmiş veriyi arama ve API keşfi için tüketir.

### React kullanım hedefi (uygulanacak sözleşme)

```tsx
import { KaiwenProvider, Button, ThemeSwitcher } from '@imthekaiwen/ui-web';
import '@imthekaiwen/ui-web/styles.css';

export function App() {
  return (
    <KaiwenProvider
      theme="system"
      motion="balanced"
      density="comfortable"
      locale="tr"
    >
      <ThemeSwitcher />
      <Button variant="primary" motion="expressive">
        Create project
      </Button>
    </KaiwenProvider>
  );
}
```

Kod örneği **nihai uygulanmış API garantisi değildir**; ilk implementation bu davranışı sağlayacak veya değişikliği belgede açıkça kaydedecektir.

## 7. Studio mimarisi

Studio tek bir React web uygulamasıdır; **tasarım sisteminin kontrol ve test yüzeyi**, dağıtım paketinin parçası değildir.

Sabit ana navigasyon:

- **Foundations:** color palette, typography, spacing, elevation, surface, themes.
- **Components:** her bileşen için canlı canvas, variants, states, props, code, accessibility açıklaması.
- **Motion Lab:** `off/subtle/balanced/expressive`, spring preset'leri, interruptible press, switch stretch/slide/bounce, reduced motion.
- **Layouts & Patterns:** responsive grid, AppShell, sidebar, settings, loading, success, error, multi-step form.
- **Docs & Agents:** kurulum, kontratlar, aranabilir katalog/agent manifest'i.

Studio, Storybook'un bütün yeteneklerini sıfırdan yeniden yazmaz. Storybook `*.stories.tsx` dosyalarından API ve örnek belgelerinin doğrulanmış kaynağını sağlar. Studio katalog/önizleme arayüzünü kendisi sunar; Storybook iframe/metadata entegrasyonu en az bakımlı seçenek olarak değerlendirilir. Aynı bileşenin tekrar implemente edilmesi yasaktır.

Studio'nun canlı kontrolleri yalnızca **gerçek** tüketilebilir prop'ları kullanır. Anında motion/theme değişikliği, viewport önizlemesi, kod snippet kopyalama ve `prefers-reduced-motion` testi beklenir. Bir kontrol henüz desteklenmiyorsa disabled/roadmap olarak belirtilir.

## 8. Agent dokümantasyonu ve keşif

Manuel dosya sayısını düşük tutmak için:

- **Normatif tasarım ve mimari:** altı `.md` dosyası.
- **API:** public TS props/JSDoc/types.
- **Varyant ve örnek:** Storybook stories.
- **Davranışın gerçekliği:** unit/e2e/a11y testleri.
- **Makine kataloğu:** CI/build sırasında oluşturulan ör. `component-manifest.json` (kaynağı **otomatik**; elle düzenlenmez).

Manifest öğelerinin minimum şeması: `name`, `package`, `subpath`, `exportName`, `status`, `description`, `platform`, `category`, `propsReference`, `storyReference`, `tokensUsed`, `a11yNotes`, `since`. Schema version yönetilir; bozuk kayıtta build fail eder.

`AGENTS.md` bir gezinti/operasyon sözleşmesidir, her component için tekrar yazılan rehber değildir. Kodlama ajanları önce catalog, sonra yalnızca ilgili bileşen ve kontrat belgelerine başvurur.

## 9. Mobil genişleme planı

İlk sürümde native component **yok**. İleride:

```text
packages/ui-native/
├── src/components/
├── src/interactions/
├── src/layouts/
├── src/providers/
└── package.json
```

- Ortak paylaşım: semantic token adları, ikon anlamları, motion seviyelerinin **niyeti**, component isimlendirme ve durum modeli.
- Ayrı implementation: React Native layout, touch target, focus/gesture, native font rendering, navigasyon davranışı.
- `@imthekaiwen/motion` web motorunu native'e zorla taşımaz; native adapter eklenir veya platformun uygun motion runtime'ı kullanılır.
- Web'deki blur/glass ve hover davranışları Native'e birebir taşınmaz; erişilebilir platform karşılıkları sağlanır.
- Doğrulama: iOS/Android text scaling, safe area, reduced motion ve cihaz performansı.

## 10. Performans, SSR ve güvenlik

- Paketler ES module ve tree-shaking dostu üretilecek. Ağırlığı yüksek Chart/Editor bağımlılıkları core export'ta eager import edilmeyecek.
- CSS, dış uygulamaların global reset'lerini sınırsız biçimde değiştirmeyecek; token scope ve kütüphane base styles net olacak.
- Tarayıcı global'lerine render/import sırasında erişilmeyecek. Theme hydration flash sorunu için uygulama uyumlu başlangıç stratejisi belgelenecek.
- Toast mesajları ve rich-text API'si varsayılan olarak plain text ve React escaped content kullanacak; HTML injection'a açık `dangerouslySetInnerHTML` yapılmayacak.
- Bileşenler yönetilmeyen harici font, ikon CDN veya tracking script zorunluluğu getirmeyecek.
- Tasarım görselleri ve ikonlarda lisans kontrolü; OpenAI'a ait marka varlıkları alınmayacak.

## 11. Kabul kriterleri ve gelişme sınırları

Başlangıç başarı koşulları:

- Studio açıldığında `@imthekaiwen/ui-web` içindeki aynı Button/Switch render edilir.
- Light/dark, density ve motion değişimi aynı anda uygulanır ve yan etki üretmez.
- En az 360 / 768 / 1024 / 1440 px ekranlarda grid/overflow kontrolleri başarılıdır.
- Long Turkish text, dark mode, keyboard-only ve reduced motion senaryoları geçer.
- CI public API + visual snapshots + unit testleri doğrular.
- Ürün tüketicisinde paket import'u Studio, Storybook veya development tooling'e bağımlı olmaz.

Ayrıntılı kullanım kuralları `DESIGN_LANGUAGE.md`, bileşen sözleşmesi `COMPONENT_CONTRACT.md`, iş akışı `DEVELOPMENT.md` içindedir.
