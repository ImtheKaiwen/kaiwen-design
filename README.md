# Kaiwen Design System

> **Durum:** Web V1 release candidate. Core Web, Layout & Patterns ve seçili Advanced bileşenler; erişilebilir Modal/Drawer; test, Storybook, Studio ve paketleme altyapısı tamamlandı. Public paketler `0.2.0` için hazırlanmıştır; npm yayını doğrulanmış bir npm oturumu gerektirir.

**Kaiwen Design**, OpenAI tarzı sakin ve tipografik olarak güçlü bir görsel yaklaşımı; kontrollü, fiziksel hissi olan mikro etkileşimlerle birleştiren, önce **Web**, sonra **mobil** için geliştirilecek tasarım sistemidir. Amaç, her yeni Kaiwen uygulamasında tasarımı sıfırdan yapmak yerine aynı token, bileşen, hareket, ikon ve yerleşim kurallarını kullanmaktır. Markaya özgü görsel kimlik korunur; OpenAI'ın logoları, özel fontları ve birebir marka varlıkları kopyalanmaz.

## Ürünler ve sınırlar

| Parça                    | Görev                                                              | Dağıtım                                        |
| ------------------------ | ------------------------------------------------------------------ | ---------------------------------------------- |
| **Kaiwen UI**            | Token, motion, ikon ve React bileşenleri                           | Sürümlü paketler                               |
| **Kaiwen Design Studio** | Canlı önizleme, motion lab, layout/pattern galerisi, dokümantasyon | `apps/studio` web uygulaması; npm paketi değil |
| **Agent erişimi**        | Kurallar, örnekler, bileşen keşif manifest'i ve API bilgileri      | `AGENTS.md`, belgeler, koddan üretilen içerik  |

## Kurulum ve React entegrasyonu

Yayınlanan Web paketi React ve React DOM'u peer dependency olarak kullanır. Uygulamada temel paket ve stil girişini kurun:

```bash
pnpm add @imthekaiwen/ui-web react react-dom
```

```tsx
import { useState } from 'react';
import {
  Button,
  Card,
  KaiwenProvider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ToastProvider,
  useToast,
  type MotionLevel,
  type ThemePreference,
} from '@imthekaiwen/ui-web';
import '@imthekaiwen/ui-web/styles.css';

function Example() {
  const { toast } = useToast();
  return (
    <Card>
      <Button
        onClick={() =>
          toast({ tone: 'success', title: 'Değişiklikler kaydedildi' })
        }
      >
        Kaydet
      </Button>
      <Modal trigger={<Button variant="outline">Ayrıntılar</Button>}>
        <ModalHeader
          title="Sürüm ayrıntıları"
          description="Yayın öncesi kontrol"
        />
        <ModalContent>İçerik uygulamanın sahipliğinde kalır.</ModalContent>
        <ModalFooter>
          <Button>Onayla</Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
}

export default function App() {
  const [theme] = useState<ThemePreference>('system');
  const [motion] = useState<MotionLevel>('balanced');
  return (
    <KaiwenProvider
      theme={theme}
      motion={motion}
      density="comfortable"
      locale="tr"
    >
      <ToastProvider label="Bildirimler" dismissLabel="Bildirimi kapat">
        <Example />
      </ToastProvider>
    </KaiwenProvider>
  );
}
```

`theme`, `motion`, `density` ve `locale` uygulama tarafından kontrol edilebilir. `system` tema tercihi işletim sistemini izler; `prefers-reduced-motion` her zaman motion seviyesinin önüne geçer. Bileşenler `className`, `style`, `ref` ve semantik `--kw-*` CSS custom property'leriyle ürün katmanında özelleştirilebilir:

```css
.product-card {
  --kw-chart-series-primary: #2563eb;
  max-width: 42rem;
}
```

Alt girişler veri ve pattern bileşenlerini açıkça ayırır:

```tsx
import { DataTable, PieChart } from '@imthekaiwen/ui-web/data';
import { Wizard } from '@imthekaiwen/ui-web/patterns';
```

Public paketler: `@imthekaiwen/tokens`, `@imthekaiwen/motion`, `@imthekaiwen/icons` ve `@imthekaiwen/ui-web`. Repository: [github.com/ImtheKaiwen/kaiwen-design](https://github.com/ImtheKaiwen/kaiwen-design).

İlk fiziksel paketler: `@imthekaiwen/tokens`, `@imthekaiwen/motion`, `@imthekaiwen/icons`, `@imthekaiwen/ui-web`. `@imthekaiwen/ui-native` ve SVG/canvas tabanlı gelişmiş chart motorları henüz oluşturulmamıştır. Hafif `StackedBarChart`, görünür değer ekseniyle birlikte mevcut HTML/CSS veri girişinde yaşar. Registry ayrı bir runtime paketi değildir; `@imthekaiwen/ui-web/component-manifest.json` ve Studio kataloğu olarak üretilir.

## Kaynak belgeler (toplam 6 elle yönetilen Markdown)

1. [`README.md`](README.md): ürünün kapsamı, başlangıç sırası, giriş noktası.
2. [`AGENTS.md`](AGENTS.md): AI kodlama ajanları için operasyonel kurallar.
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): monorepo, modüller ve bağımlılıklar.
4. [`docs/DESIGN_LANGUAGE.md`](docs/DESIGN_LANGUAGE.md): görsel dil, tema, token ve motion ilkeleri.
5. [`docs/COMPONENT_CONTRACT.md`](docs/COMPONENT_CONTRACT.md): bileşen arayüzleri, etkileşim ve durum sözleşmesi.
6. [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md): geliştirme, test, CI, sürüm ve yayınlama.

Her bileşen için manuel `.md` zorunlu değildir. API gerçekliği TypeScript tiplerinden, örnekler Storybook `*.stories.tsx` dosyalarından, davranış testlerden gelir. Studio ve makinece okunabilir bileşen manifest'i bu kaynaklardan üretilecektir. Tasarım niyeti ise bu altı belgede tanımlanır.

## Hedef depo yapısı

```text
kaiwen-design/
├── apps/
│   └── studio/                  # Görsel katalog ve playground; yayınlanmaz
├── packages/
│   ├── tokens/                 # Primitive + semantic + component tokens, CSS çıktıları
│   ├── motion/                 # Seviyeler, preset'ler, gesture/interruptible motion
│   ├── icons/                  # Lucide tabanlı kontrollü ikon API'si
│   └── ui-web/                 # Primitives, feedback, forms, overlays, layouts, patterns
├── tooling/
│   ├── eslint/                 # Kural ihlallerini engelleme
│   ├── generators/             # Manifest ve doküman üretimi
│   └── testing/                # Ortak test yardımcıları
├── tests/visual/              # Kararlı ekran görüntüsü testleri
├── docs/                      # Dört temel teknik/tasarım belgesi
├── .github/workflows/         # CI, visual tests, release, deploy-studio
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

> Klasör ağacı hedef yönü gösterir. Phase 0 kapsamında dört paket, Studio, Storybook, test ve CI temeli uygulanmıştır; ileri aşama klasörleri ihtiyaç doğdukça eklenir.

## Önerilen teknoloji kararları

- **Monorepo:** pnpm workspaces + Turborepo.
- **Web:** React + TypeScript; Studio için Vite tabanlı SPA (gerekirse ileride değiştirilebilir).
- **Stil:** CSS custom properties ile semantic tokenlar; Tailwind CSS v4 uygulama katmanında desteklenir; kütüphane tek başına Tailwind utility derlemesine bağımlı olmamalıdır.
- **Davranış:** Mümkün olduğunda semantik HTML; karmaşık etkileşimlerde Radix Primitives.
- **Motion:** CSS transitions + Motion for React; bütün süre/preset değerleri merkezi API'den.
- **İkonlar:** Lucide tabanlı `@imthekaiwen/icons` yüzeyi; doğrudan proje içi tutarsız ikon seçimleri yok.
- **Kalite:** Storybook, Vitest, Testing Library, Playwright, axe tabanlı denetimler, Changesets.

Sabit major/minor sürüm pin'leri bu belgelerde yer almaz. Uygulama aşamasında uyumlu sürümler seçilir ve lockfile'a sabitlenir. Paket isimleri hedef API'dir; npm'de sahiplik/uygunluk yayınlamadan önce kontrol edilmelidir.

## İlk sürüm ve sonraki aşamalar

| Aşama              | Teslim kriteri                                                                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 — Foundation** | Tokenlar, light/dark, tipografi, spacing, motion preset'leri, ikon kuralları ve Studio iskeleti                                                                                                                                    |
| **1 — Core Web**   | Button, Checkbox, Switch, Input, Select, Card, Tooltip, Skeleton, Spinner, Toast, Alert, Empty/Error State, Grid, Stack, Container; durumları ve testleri                                                                          |
| **1.1 — Patterns** | AppShell, Sidebar, ThemeSwitcher, LanguageSwitcher bağlantı noktası, Wizard, Success/Confirmation, Upload/Progress, ekran şablonları                                                                                               |
| **2 — Advanced**   | Command Palette, DataTable sıralama/seçim/pagination, erişilebilir temel ve stacked/eksenli HTML/CSS grafikler, ReorderableList ve schema v2 component registry tamamlandı; gelişmiş SVG/canvas charts ve mobil uyarlama sıradadır |

**İlk başarı ölçütü:** Kaiwen Agent ve Kaiwen Workspace gibi görünümü farklı iki projede ortak tasarım kurallarının yeni bileşen yazılmadan kullanılabilmesi. Uzun Türkçe metin, farklı ekran genişlikleri, dark mode, loading ve hata durumlarında düzen bozulmamalı.

## Çalışma biçimi

Node.js 22.12+ ve pnpm 11 ile aşağıdaki komutlar kullanılabilir:

```bash
pnpm install
pnpm dev:studio
pnpm storybook
pnpm lint
pnpm typecheck
pnpm test
pnpm test:visual
pnpm build
```

Studio'nun npm yayımlanmasına dahil edilmemesi; UI paketi derlemesinin Studio'dan bağımsız olması zorunludur. Yeni bileşenler kütüphane içerisinde geliştirilir, Studio bu gerçek bileşenleri içe aktararak gösterir. Studio'ya özel sahte bir ikinci Button/Switch ailesi yazılmaz.

## Kaynak ve yönetişim

- **Neye benzeyecek?** `docs/DESIGN_LANGUAGE.md`.
- **Bileşen nasıl davranacak?** `docs/COMPONENT_CONTRACT.md`.
- **Dosya nereye konacak / neye bağımlı olacak?** `docs/ARCHITECTURE.md`.
- **Nasıl doğrulanacak ve yayınlanacak?** `docs/DEVELOPMENT.md`.
- **Agent hangi sırayla çalışacak?** `AGENTS.md`.
- Uygulama başladıktan sonra **gerçek dışa aktarım API'si için kaynak TypeScript kodu** nihai kaynaktır; bu belgelerdeki kod parçaları aksi söylenmedikçe hedef sözleşme örnekleridir.

## Resmi teknik başvuru kaynakları

- [Storybook Autodocs](https://storybook.js.org/docs/writing-docs/autodocs)
- [Tailwind tema değişkenleri](https://tailwindcss.com/docs/theme)
- [Motion for React](https://motion.dev/docs/react)
- [Radix erişilebilirlik yaklaşımı](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [Playwright screenshot assertions](https://playwright.dev/docs/api/class-pageassertions)
- [GitHub Actions workflow permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
