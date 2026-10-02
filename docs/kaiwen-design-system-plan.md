# Kaiwen Design System — Teknik Mimari, Tasarım ve Uygulama Planı

> Bu doküman, Kaiwen Design System projesinin sıfırdan kurulması, geliştirilmesi, test edilmesi, dokümante edilmesi, yayınlanması ve uzun vadede sürdürülebilir şekilde büyütülmesi için hazırlanmış ana teknik şartnamedir.
>
> Hedef: Bir AI/Code Agent bu dosyayı okuyarak projeyi minimum belirsizlikle, adım adım ve üretim kalitesinde geliştirebilmelidir.

---

# 1. Proje Özeti

Kaiwen Design System; React Web ve React Native/Expo projelerinde kullanılacak, ortak tasarım dili taşıyan fakat platforma özel implementasyonlara sahip modüler bir UI/design system kütüphanesidir.

Bu sistemin amacı:

- Yeni projelerde tasarımı sıfırdan tekrar tekrar üretme ihtiyacını ortadan kaldırmak.
- Web ve mobil uygulamalarda aynı görsel dili korumak.
- Component API'lerini standartlaştırmak.
- Skeleton, loading, error, empty, success gibi durumları sistematik hale getirmek.
- Tasarım tokenlarını merkezi hale getirmek.
- Tema değişikliklerini tek noktadan yönetmek.
- AI agent/Codex gibi kod ajanlarının sistemi okuyup doğru componentleri otomatik kullanabilmesini sağlamak.
- NPM üzerinden versiyonlanabilir ve tekrar kullanılabilir paketler sunmak.
- Performans, erişilebilirlik, güvenlik, sürdürülebilirlik ve test edilebilirliği birinci sınıf gereksinimler olarak ele almak.

---

# 2. Temel Mimari Kararlar

## 2.1 Web ve Native Aynı Kod Olmayacak

Web ve React Native aynı tasarım sistemini kullanacak fakat aynı component implementasyonunu paylaşmayacak.

Yanlış yaklaşım:

```text
Tek Button component
 ├─ if web ...
 ├─ if native ...
 ├─ if ios ...
 └─ if android ...
```

Doğru yaklaşım:

```text
@kaiwen/tokens
      ↓
 ┌───────────────┐
 │               │
@kaiwen/ui-web   @kaiwen/ui-native
```

Web ve Native:

- Aynı tokenları kullanır.
- Aynı isimlendirme sistemini kullanır.
- Mümkün olduğunda benzer component API'leri kullanır.
- Aynı tasarım kurallarına uyar.
- Fakat platforma özgü detayları kendi paketinde uygular.

---

# 3. Monorepo Yapısı

Önerilen paket yöneticisi:

```text
pnpm
```

Önerilen monorepo:

```text
Turborepo
```

Alternatif:

```text
Nx
```

Varsayılan tercih: **pnpm + Turborepo**

Önerilen yapı:

```text
kaiwen-design-system/
│
├─ apps/
│  ├─ docs/
│  ├─ playground-web/
│  └─ playground-native/
│
├─ packages/
│  ├─ tokens/
│  ├─ ui-web/
│  ├─ ui-native/
│  ├─ icons/
│  ├─ brand/
│  ├─ utilities/
│  ├─ eslint-config/
│  └─ tsconfig/
│
├─ .changeset/
├─ .github/
│  └─ workflows/
│
├─ scripts/
│
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.json
├─ README.md
├─ CONTRIBUTING.md
├─ SECURITY.md
├─ COMPONENTS.md
├─ llms.txt
└─ LICENSE
```

---

# 4. Paketler

## 4.1 @kaiwen/tokens

Design system'in temelidir.

İçermesi gerekenler:

```text
colors
spacing
radius
typography
shadows
motion
zIndex
breakpoints
sizes
opacity
borders
```

Örnek:

```ts
export const colors = {
  background: {
    primary: "#000000",
    secondary: "#0A0A0A",
  },

  surface: {
    primary: "#111111",
    secondary: "#181818",
  },

  text: {
    primary: "#FFFFFF",
    secondary: "#A1A1AA",
    muted: "#71717A",
  },

  border: {
    default: "#27272A",
    subtle: "#18181B",
  },

  status: {
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
};
```

Ancak component içinde doğrudan renk kullanılmamalıdır.

Yanlış:

```ts
backgroundColor: "#111111";
```

Doğru:

```ts
backgroundColor: tokens.colors.surface.primary;
```

---

# 5. Semantic Token Sistemi

Renk sistemi sadece renk isimlerine göre tanımlanmamalıdır.

Yanlış:

```text
black
white
gray900
gray700
```

Doğru:

```text
backgroundPrimary
backgroundSecondary
surfacePrimary
surfaceElevated
textPrimary
textSecondary
textMuted
borderDefault
borderStrong
accentPrimary
danger
success
warning
```

Böylece gelecekte siyah/beyaz tasarım başka bir tasarıma dönüştürülebilir.

---

# 6. Tema Sistemi

İlk sürüm:

```text
Dark
Light
```

Ancak mimari ileride şu temaları destekleyebilmelidir:

```text
Kaiwen Dark
Kaiwen Light
High Contrast
Custom Theme
Brand Theme
```

ThemeProvider tasarlanmalıdır.

Web:

```tsx
<KaiwenThemeProvider theme="dark">
  <App />
</KaiwenThemeProvider>
```

Native:

```tsx
<KaiwenThemeProvider theme="dark">
  <App />
</KaiwenThemeProvider>
```

---

# 7. Typography Sistemi

Tipografi component bazlı olmamalı, token bazlı olmalıdır.

Örnek ölçek:

```text
display
h1
h2
h3
title
body
bodySmall
label
caption
mono
```

Her typography tokenı şunları tanımlamalıdır:

```text
fontFamily
fontSize
fontWeight
lineHeight
letterSpacing
```

---

# 8. Spacing Sistemi

Keyfi pixel kullanımı minimize edilmelidir.

Önerilen ölçek:

```text
0
2
4
6
8
12
16
20
24
32
40
48
64
80
96
```

Örnek:

```ts
spacing.sm;
spacing.md;
spacing.lg;
```

---

# 9. Radius Sistemi

Örnek:

```text
none
xs
sm
md
lg
xl
2xl
full
```

Componentler doğrudan radius değeri tanımlamamalıdır.

---

# 10. Motion Sistemi

Animasyonlar gösterişli değil; sade, hızlı ve yumuşak olmalıdır.

Hedef:

```text
smooth
subtle
fast
predictable
consistent
```

Motion tokenları:

```text
duration.fast
duration.normal
duration.slow

easing.standard
easing.enter
easing.exit
easing.spring
```

Örnek:

```ts
duration.fast = 120ms
duration.normal = 180ms
duration.slow = 280ms
```

Animasyonların amacı:

- Kullanıcıyı yönlendirmek.
- UI durum değişimini anlaşılır yapmak.
- Arayüzü doğal hissettirmek.

Animasyonların amacı değildir:

- Gösteriş yapmak.
- Kullanıcıyı bekletmek.
- UI gecikmesini gizlemek.

---

# 11. Reduced Motion

Sistem kullanıcının hareket azaltma tercihini desteklemelidir.

Web:

```text
prefers-reduced-motion
```

Native:

```text
AccessibilityInfo
```

Reduced motion açıkken:

- Skeleton shimmer sadeleştirilebilir.
- Büyük scale animasyonları kaldırılabilir.
- Transition süreleri azaltılabilir.

---

# 12. Core Layout Primitives

Her layout componenti basit kalmalıdır.

Bulunması gereken temel primitive'ler:

```text
Box
Stack
HStack
VStack
Row
Column
Flex
Grid
Container
Spacer
Divider
Center
ScrollArea
AspectRatio
```

Bu componentler iş mantığı taşımamalıdır.

Örnek:

```tsx
<Stack gap="md">
  <Card />
  <Card />
</Stack>
```

---

# 13. Component Sistemi

İlk aşamada bulunması gereken componentler:

## Inputs

```text
Input
TextArea
SearchInput
PasswordInput
NumberInput
PhoneInput
EmailInput
OTPInput
PinInput
Checkbox
Radio
Switch
Select
Combobox
Slider
DatePicker
TimePicker
FileUpload
```

## Actions

```text
Button
IconButton
Link
FAB
SegmentedControl
```

## Containers

```text
Card
Panel
Surface
Accordion
Collapsible
```

## Navigation

```text
Tabs
Breadcrumb
Pagination
Sidebar
Navbar
BottomNavigation
Menu
DropdownMenu
ContextMenu
```

## Feedback

```text
Toast
Alert
Banner
Badge
StatusIndicator
Progress
Spinner
Skeleton
EmptyState
ErrorState
SuccessState
LoadingState
```

## Overlays

```text
Modal
Dialog
Drawer
Sheet
BottomSheet
Popover
Tooltip
Dropdown
CommandPalette
```

## Data Display

```text
Avatar
Chip
Tag
Table
DataTable
List
ListItem
Stat
Timeline
CodeBlock
KeyValue
```

---

# 14. Component API Standardı

Component API'leri aynı isimlendirme dilini kullanmalıdır.

Örnek:

```tsx
<Button variant="primary" size="md" loading={false} disabled={false} />
```

Standart prop isimleri:

```text
variant
size
loading
disabled
required
error
success
helperText
label
icon
iconPosition
fullWidth
```

Aynı kavram farklı componentlerde farklı isimlerle kullanılmamalıdır.

Örneğin:

Yanlış:

```text
Button: variant
Card: appearance
Input: typeStyle
```

Doğru:

```text
variant
```

---

# 15. Component State Standardı

Her etkileşimli component aşağıdaki durumları değerlendirmelidir:

```text
default
hover
focus
focus-visible
active
pressed
selected
disabled
loading
error
success
warning
readOnly
```

Platforma göre gerekli olanlar uygulanmalıdır.

---

# 16. Skeleton Sistemi

Skeleton sistemin ana parçalarından biri olacaktır.

Her büyük component mümkün olduğunda skeleton versiyonuna sahip olmalıdır.

Örnek:

```tsx
<Card.Skeleton />
```

veya:

```tsx
<Card loading />
```

Tercih edilen yaklaşım:

```tsx
<Card.Skeleton />
```

Sebep:

- Component sorumlulukları ayrılır.
- Skeleton bağımsız kullanılabilir.
- Gereksiz runtime condition azalır.

---

# 17. Ortak Skeleton Engine

Skeleton componentleri farklı görünse bile animasyon altyapısı ortak olmalıdır.

Örnek:

```text
SkeletonPrimitive
SkeletonText
SkeletonCircle
SkeletonRect
SkeletonAvatar
SkeletonCard
```

Ortak ayarlar:

```text
duration
easing
opacity
gradient
radius
motionPreference
```

Skeleton tüm uygulamada aynı hız ve hissi vermelidir.

---

# 18. Loading Standardı

Loading için üç seviye kullanılmalıdır:

## Component Loading

Örnek:

```text
Button loading
```

## Content Loading

Örnek:

```text
Card Skeleton
```

## Page Loading

Örnek:

```text
PageSkeleton
```

---

# 19. Empty, Error ve Success State

Her uygulama kendi tasarımını tekrar üretmemelidir.

Standart componentler:

```tsx
<EmptyState />
<ErrorState />
<SuccessState />
<LoadingState />
```

Desteklenecek alanlar:

```text
title
description
icon
action
secondaryAction
```

---

# 20. Mobil Form Davranışları

Native componentler mobil kullanıcı deneyimine özel davranışlar sağlamalıdır.

## NumberInput

Otomatik:

```text
numeric keyboard
```

## PhoneInput

Otomatik:

```text
phone-pad
```

## EmailInput

Otomatik:

```text
email-address keyboard
autoCapitalize="none"
```

## PasswordInput

Destek:

```text
secureTextEntry
password manager
autocomplete
```

## OTPInput

Destek:

```text
oneTimeCode
SMS autofill
clipboard detection
auto focus
auto advance
```

Platform izin verdiği ölçüde OTP otomatik doldurma uygulanmalıdır.

---

# 21. Web Form Davranışları

Web inputlarda doğru HTML semantics kullanılmalıdır.

Örnek:

```html
<input type="email" />
<input type="tel" />
<input inputmode="numeric" />
```

Destek:

```text
autocomplete
aria-invalid
aria-describedby
aria-required
```

---

# 22. Güvenlik İlkeleri

Design system backend güvenliği sağlamaz.

Fakat yanlış veya riskli UI kullanımlarını azaltmalıdır.

Temel güvenlik prensipleri:

- Raw HTML varsayılan olarak render edilmemeli.
- dangerouslySetInnerHTML gibi API'ler doğrudan expose edilmemeli.
- External link component güvenli davranmalıdır.
- FileUpload client-side validation sağlamalıdır.
- Password input güvenli defaultlarla gelmelidir.
- Secret alanlarında varsayılan mask uygulanmalıdır.
- Kullanıcı girdileri UI katmanında kod olarak çalıştırılmamalıdır.

---

# 23. Link Güvenliği

External link:

```text
target="_blank"
```

kullanılıyorsa:

```text
rel="noopener noreferrer"
```

otomatik uygulanmalıdır.

---

# 24. File Upload Güvenliği

FileUpload componenti desteklemelidir:

```text
acceptedMimeTypes
maxFileSize
maxFiles
multiple
disabled
```

Önemli:

Client-side validation güvenlik sınırı değildir.

Backend tarafında yeniden doğrulama yapılması gerektiği dokümantasyonda açıkça belirtilmelidir.

---

# 25. Rich Text

İlk sürümde zorunlu değildir.

Eklenirse HTML sanitization zorunlu olacaktır.

Raw HTML render eden component design system'in ana paketine eklenmemelidir.

---

# 26. Accessibility

Accessibility bir opsiyon değil core gereksinimdir.

Web:

```text
WCAG
ARIA
keyboard navigation
focus-visible
semantic HTML
```

Native:

```text
accessibilityLabel
accessibilityHint
accessibilityRole
accessibilityState
```

---

# 27. Keyboard Navigation

Web componentlerinde desteklenmelidir:

```text
Tab
Shift + Tab
Enter
Space
Escape
Arrow Keys
Home
End
```

Component tipine göre.

---

# 28. Focus Management

Modal açıldığında focus modal içine geçmelidir.

Modal kapatıldığında focus tetikleyen elemente dönmelidir.

Focus trap uygulanmalıdır.

---

# 29. Contrast

Renk kombinasyonları yeterli kontrast sağlamalıdır.

CI pipeline'a kontrast kontrolü eklenebilir.

---

# 30. Overlay Architecture

Modal, tooltip, dropdown ve drawer birbirinden bağımsız rastgele z-index kullanmamalıdır.

Token:

```ts
zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
};
```

---

# 31. Portal Sistemi

Web:

```text
React Portal
```

Native:

```text
Portal Host
```

Overlay componentleri ortak portal sistemi kullanmalıdır.

---

# 32. Responsive Tasarım

Web için breakpoints:

```text
xs
sm
md
lg
xl
2xl
```

Örnek:

```ts
breakpoints.md;
```

Keyfi breakpoint kullanımından kaçınılmalıdır.

---

# 33. Container

Container componenti standart sayfa genişliğini belirlemelidir.

Örnek:

```tsx
<Container size="lg">...</Container>
```

---

# 34. Icon Sistemi

Icon paketi ayrı olmalıdır:

```text
@kaiwen/icons
```

SVG tercih edilmelidir.

Iconlar tek bundle içinde zorunlu import edilmemelidir.

Tree-shakable olmalıdır.

Doğru:

```ts
import { SearchIcon } from "@kaiwen/icons";
```

Yanlış:

```ts
import Icons from "@kaiwen/icons";
```

---

# 35. Brand Paketi

Marka assetleri UI core'dan ayrılmalıdır.

```text
@kaiwen/brand
```

İçerik:

```text
KaiwenLogo
KaiwenWordmark
KaiwenMark
AppIcon
BrandAssets
```

Böylece UI kütüphanesi başka projelerde de kullanılabilir.

---

# 36. Performans İlkeleri

Design system performansı uygulamanın performansını bozmamalıdır.

Ana prensipler:

- Tree shaking
- ESM
- Side-effect free modules
- Lazy loading
- Minimum dependency
- Memoization sadece gerektiğinde
- Gereksiz Context kullanımından kaçınma
- Gereksiz re-render önleme
- Büyük icon bundle yüklememe
- Platform paketlerini ayırma

---

# 37. Build Formatı

Paketler mümkün olduğunca:

```text
ESM
```

olarak yayınlanmalıdır.

Gerekirse CJS compatibility ayrıca sağlanabilir.

Package exports kullanılmalıdır.

---

# 38. Tree Shaking

package.json:

```json
{
  "sideEffects": false
}
```

Ancak CSS veya side-effect içeren dosyalar dikkatli işaretlenmelidir.

---

# 39. Component Importları

Destek:

```ts
import { Button } from "@kaiwen/ui-web";
```

İsteğe bağlı deep import:

```ts
import { Button } from "@kaiwen/ui-web/button";
```

Bundle analizleriyle karar verilmelidir.

---

# 40. React Render Performansı

Componentler gereksiz re-render üretmemelidir.

Özellikle:

```text
Theme Context
Toast Context
Overlay Context
Form Context
```

çok geniş tutulmamalıdır.

State mümkün olduğunca ilgili scope'ta tutulmalıdır.

---

# 41. Context Bölme

Yanlış:

```text
GlobalKaiwenContext
```

Doğru:

```text
ThemeProvider
ToastProvider
OverlayProvider
DirectionProvider
```

---

# 42. Dependency Politikası

Ağır dependency eklemekten kaçınılmalıdır.

Yeni dependency eklenmeden önce değerlendirilmelidir:

```text
bundle size
maintenance
security
tree shaking
platform support
license
```

---

# 43. Bundle Budget

CI bundle boyutunu kontrol etmelidir.

Örnek başlangıç hedefleri:

```text
single primitive component: mümkün olduğunca < 5 KB gzip
core runtime: minimum
icons: per-icon import
```

Kesin limitler gerçek build ölçümlerine göre ayarlanmalıdır.

---

# 44. Performance Benchmark

Playground üzerinde benchmarklar oluşturulmalıdır.

Örneğin:

```text
100 Button render
1000 ListItem render
500 Card render
```

Amaç:

Regresyon tespit etmek.

---

# 45. Web Styling Yaklaşımı

Tercih sırası:

1. CSS Variables
2. CSS Modules / scoped styling
3. build-time styling

Runtime-heavy styling çözümünden kaçınılmalıdır.

Design tokenlar CSS variable olarak expose edilebilir.

Örnek:

```css
--kaiwen-color-bg-primary
--kaiwen-space-md
--kaiwen-radius-lg
```

---

# 46. React Native Styling

Token tabanlı StyleSheet veya optimize edilmiş styling kullanılmalıdır.

Her render'da inline style object oluşturmak minimize edilmelidir.

---

# 47. Testing Stratejisi

Testler dört seviyede olmalıdır:

```text
Unit
Component
Accessibility
Visual Regression
```

---

# 48. Unit Tests

Utility fonksiyonları test edilmelidir.

Örnek:

```text
token resolver
theme resolver
variant resolver
platform utilities
```

---

# 49. Component Tests

Her component için:

```text
renders
disabled
loading
interaction
keyboard
error
accessibility
```

testleri değerlendirilmelidir.

---

# 50. Visual Regression Tests

Design system için kritik önemdedir.

Amaç:

- Radius değişiklikleri
- spacing değişiklikleri
- renk regresyonları
- yanlış alignment
- typography bozulmaları

gibi hataları tespit etmek.

Playwright veya Chromatic kullanılabilir.

---

# 51. Storybook / Docs

Web componentleri Storybook veya eşdeğer bir docs uygulamasında gösterilmelidir.

Her component için:

```text
Overview
Usage
Examples
Props
Variants
States
Accessibility
Do
Don't
Loading
Skeleton
```

sayfaları bulunmalıdır.

---

# 52. Playground

İki playground önerilir:

```text
playground-web
playground-native
```

Amaç:

Componentleri gerçek uygulama ortamında test etmek.

---

# 53. AI Agent Documentation

Bu proje AI agent kullanımına optimize edilmelidir.

Repository kökünde:

```text
llms.txt
COMPONENTS.md
AGENTS.md
```

bulunmalıdır.

---

# 54. llms.txt

Şunları içermelidir:

```text
package list
design philosophy
import rules
component rules
forbidden patterns
theme rules
example usage
```

---

# 55. COMPONENTS.md

Makine tarafından kolay okunabilir olmalıdır.

Örnek:

```md
## Button

Package:
@kaiwen/ui-web

Props:

- variant
- size
- loading
- disabled

Use when:
Primary or secondary action.

Do not use when:
Navigation. Use Link instead.
```

---

# 56. Component Manifest

Ek olarak JSON manifest üretilebilir:

```json
{
  "Button": {
    "package": "@kaiwen/ui-web",
    "variants": ["primary", "secondary", "ghost", "danger"],
    "sizes": ["sm", "md", "lg"]
  }
}
```

Bu manifest CI sırasında otomatik üretilebilir.

---

# 57. Component Dosya Yapısı

Örnek:

```text
Button/
├─ Button.tsx
├─ Button.types.ts
├─ Button.styles.ts
├─ Button.test.tsx
├─ Button.stories.tsx
├─ Button.docs.mdx
├─ ButtonSkeleton.tsx
└─ index.ts
```

---

# 58. Component Responsibility

Design system componentleri business logic içermemelidir.

Uygun:

```text
Card
Avatar
OTPInput
Modal
Toast
```

Uygun değil:

```text
CustomerInvoiceCard
KaiwenAdminTodoPanel
BillingCustomerList
```

Business componentler uygulama repository'sinde kalmalıdır.

---

# 59. Composition

Büyük componentler composition desteklemelidir.

Örnek:

```tsx
<Card>
  <Card.Header />
  <Card.Body />
  <Card.Footer />
</Card>
```

Ancak gereksiz compound API oluşturulmamalıdır.

---

# 60. Error Handling

Componentler sessizce crash etmemelidir.

Development ortamında anlamlı warning üretilebilir.

Örnek:

```text
Kaiwen UI: Modal requires ModalProvider.
```

Production'da gereksiz console output olmamalıdır.

---

# 61. SSR Uyumluluğu

Web paketi SSR uyumlu olmalıdır.

Destek hedefleri:

```text
Next.js
Vite
React SPA
Remix benzeri ortamlar
```

Module load sırasında window/document kullanılmamalıdır.

---

# 62. Hydration

SSR componentleri hydration mismatch üretmemelidir.

Theme sistemi SSR uyumlu tasarlanmalıdır.

---

# 63. Localization

Componentler metinleri hard-code etmemelidir.

Yanlış:

```text
"Close"
"Loading"
"Cancel"
```

Doğru:

Consumer tarafından label verilebilir.

Default metin gerekiyorsa i18n sistemi düşünülmelidir.

---

# 64. RTL

İleride RTL desteği mümkün olmalıdır.

Bu nedenle:

Yanlış:

```text
marginLeft
```

Mümkünse semantic:

```text
marginInlineStart
```

kullanılmalıdır.

---

# 65. Versioning

Semantic Versioning kullanılmalıdır.

```text
PATCH
MINOR
MAJOR
```

Örnek:

```text
1.2.3
```

---

# 66. Changesets

Version ve changelog yönetimi için:

```text
Changesets
```

önerilir.

Developer değişiklik sırasında:

```bash
pnpm changeset
```

çalıştırır.

---

# 67. Release Stratejisi

Her commit npm publish olmamalıdır.

Önerilen süreç:

```text
commit
↓
PR
↓
CI
↓
merge
↓
changesets release PR
↓
release merge
↓
npm publish
↓
GitHub release
```

---

# 68. CI Pipeline

Her PR'da:

```text
install
lint
format check
typecheck
unit tests
component tests
build
bundle size
accessibility
visual regression
```

çalışmalıdır.

---

# 69. NPM Publish

Publish GitHub Actions üzerinden yapılmalıdır.

NPM token:

```text
GitHub Secret
```

olarak saklanmalıdır.

Token repository içine yazılmamalıdır.

---

# 70. Provenance

Mümkünse npm provenance kullanılmalıdır.

Amaç:

Paketin GitHub Actions üzerinden üretildiğinin doğrulanabilmesi.

---

# 71. Branch Politikası

Önerilen:

```text
main
```

protected branch.

Direct push kapatılabilir.

Tüm değişiklikler PR ile merge edilir.

Solo development durumunda daha hafif süreç kullanılabilir.

---

# 72. Code Quality

Zorunlu:

```text
ESLint
Prettier
TypeScript strict
```

TypeScript:

```json
{
  "strict": true
}
```

---

# 73. Public API Kontrolü

Her paket yalnızca gerekli API'leri export etmelidir.

Internal helperlar dışarı açılmamalıdır.

---

# 74. Deprecation Sistemi

Bir API kaldırılacaksa direkt silinmemelidir.

Örnek:

```text
v1.4 deprecated
v2 removed
```

Development warning kullanılabilir.

---

# 75. Security Pipeline

CI içinde:

```text
dependency audit
secret scanning
CodeQL
Dependabot
```

kullanılabilir.

---

# 76. Repository Security

Aktif edilmesi önerilir:

```text
Dependabot
GitHub secret scanning
CodeQL
branch protection
required CI
```

---

# 77. Package Security

Her dependency minimize edilmelidir.

Özellikle UI kit içine rastgele npm package eklenmemelidir.

---

# 78. Browser Desteği

Başlangıç hedefi:

```text
modern evergreen browsers
```

Örneğin:

```text
Chrome
Safari
Firefox
Edge
```

Legacy browser desteği varsayılan hedef değildir.

---

# 79. React Native Hedefi

Öncelik:

```text
Expo
React Native
iOS
Android
```

Platform-specific file yapısı kullanılabilir:

```text
Component.ios.tsx
Component.android.tsx
```

yalnızca gerekli olduğunda.

---

# 80. Native Gestures

Swipe, long press gibi davranışlarda native beklentiler korunmalıdır.

Web davranışı mobilde zorla taklit edilmemelidir.

---

# 81. Haptics

Haptic feedback UI core için opsiyonel olmalıdır.

Default olarak zorunlu olmamalıdır.

Consumer etkinleştirebilmelidir.

---

# 82. Toast Sistemi

Toast manager merkezi olabilir.

Örnek:

```ts
toast.success("Saved");
toast.error("Something went wrong");
```

Ancak UI layer business mesajlarını hard-code etmemelidir.

---

# 83. Modal API

Örnek:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Content>...</Dialog.Content>
</Dialog>
```

---

# 84. Loading Button

Button loading durumunda:

- Layout zıplamamalıdır.
- Label genişliği korunmalıdır.
- Spinner standart olmalıdır.
- Tıklama devre dışı kalmalıdır.
- Accessibility state güncellenmelidir.

---

# 85. Disabled vs Loading

Loading ve disabled aynı şey değildir.

API ikisini ayrı tutmalıdır.

---

# 86. Form Error Standardı

Input:

```tsx
<Input label="Email" error="Invalid email" />
```

Error varsa:

- border değişir
- helper text gösterilir
- accessibility error state uygulanır

---

# 87. Form Composition

Form kontrolü mümkün olduğunca form library bağımsız olmalıdır.

React Hook Form adapter ayrıca yapılabilir.

Örnek paket:

```text
@kaiwen/form-react-hook-form
```

İlk sürüm için şart değildir.

---

# 88. Dark / Light Mode

Theme değişimi:

```text
data-theme
```

veya provider üzerinden yapılmalıdır.

CSS variables kullanılması önerilir.

---

# 89. Brand Independence

Kaiwen logo çekirdek Button componentine gömülmemelidir.

Örnek yanlış:

```tsx
<LoginButtonWithKaiwenLogo />
```

Brand ayrı package'ta kalmalıdır.

---

# 90. Documentation Design

Docs uygulaması da Kaiwen design system kullanmalıdır.

Böylece sistem kendi kendisini test etmiş olur.

---

# 91. Design Principles

Kaiwen Design System görsel dili:

```text
minimal
clean
high contrast
modern
calm
precise
fast
smooth
```

İlk tema ağırlıklı olarak:

```text
black
white
neutral gray
```

kullanır.

Status renkleri gerektiğinde kullanılabilir.

---

# 92. Anti-Patterns

Kaçınılması gerekenler:

```text
inline random colors
random spacing
random radius
component içinde business logic
platform if'leriyle dolu tek package
hardcoded copy
global mega-context
huge icon imports
unnecessary animation
dependency-heavy components
unsafe raw HTML
```

---

# 93. Development Workflow

Yeni component geliştirme:

```text
1. Requirement
2. API design
3. Token mapping
4. Accessibility
5. Web implementation
6. Native implementation
7. Skeleton
8. Tests
9. Docs
10. Story
11. Bundle check
12. Changeset
```

---

# 94. Definition of Done

Bir component tamamlanmış sayılmaz eğer:

- TypeScript types yoksa
- Docs yoksa
- Test yoksa
- Accessibility kontrol edilmediyse
- Loading state değerlendirilmediyse
- Skeleton gerekip gerekmediği değerlendirilmediyse
- Web/native parity kontrol edilmediyse
- Bundle etkisi ölçülmediyse

---

# 95. Agent Implementation Rules

Bu repository üzerinde çalışan AI agent aşağıdaki kurallara uymalıdır.

## Kural 1

Yeni component oluşturmadan önce mevcut componentleri kontrol et.

## Kural 2

Yeni renk üretme.

Token kullan.

## Kural 3

Yeni spacing değeri üretme.

Token kullan.

## Kural 4

Web componenti içinde React Native API kullanma.

## Kural 5

Native component içinde DOM elementleri kullanma.

## Kural 6

Business logic design system'e ekleme.

## Kural 7

Component API'lerini mevcut naming convention ile uyumlu tut.

## Kural 8

Her yeni public API için docs ekle.

## Kural 9

Her kırıcı değişiklik için MAJOR changeset oluştur.

## Kural 10

Her component için accessibility kontrolü yap.

---

# 96. Agent Task Execution Order

AI agent projeyi sıfırdan kuruyorsa aşağıdaki sırayı takip etmelidir.

## Phase 1 — Foundation

```text
monorepo
pnpm
turbo
typescript
eslint
prettier
changesets
CI
```

## Phase 2 — Tokens

```text
colors
spacing
typography
radius
motion
z-index
breakpoints
theme
```

## Phase 3 — Utilities

```text
theme resolver
variant utilities
platform utilities
accessibility helpers
```

## Phase 4 — Web Primitives

```text
Box
Stack
Flex
Container
Text
Button
Input
Card
Skeleton
```

## Phase 5 — Native Primitives

```text
Box
Stack
Flex
Container
Text
Button
Input
Card
Skeleton
```

## Phase 6 — Forms

```text
NumberInput
EmailInput
PhoneInput
PasswordInput
OTPInput
Checkbox
Radio
Switch
Select
```

## Phase 7 — Overlays

```text
Dialog
Modal
Drawer
BottomSheet
Popover
Tooltip
```

## Phase 8 — Feedback

```text
Toast
Alert
EmptyState
ErrorState
SuccessState
Progress
Spinner
```

## Phase 9 — Navigation

```text
Tabs
Menu
Sidebar
Pagination
Breadcrumb
BottomNavigation
```

## Phase 10 — Docs

```text
Storybook/docs
component pages
llms.txt
COMPONENTS.md
manifest
```

## Phase 11 — Quality

```text
visual regression
bundle budgets
accessibility tests
performance tests
security scanning
```

## Phase 12 — Release

```text
npm org/package setup
GitHub Actions
changesets
release automation
provenance
```

---

# 97. İlk Sürüm MVP Componentleri

v0.1 için:

```text
tokens
theme
Text
Box
Stack
Flex
Container
Button
IconButton
Input
PasswordInput
NumberInput
OTPInput
Card
Divider
Avatar
Badge
Skeleton
Spinner
Alert
Toast
Modal/Dialog
Tabs
Tooltip
```

Bunlar tamamlanmadan yüzlerce component eklenmemelidir.

---

# 98. v0.2

```text
Select
Checkbox
Radio
Switch
SearchInput
TextArea
Drawer
BottomSheet
Popover
Menu
EmptyState
ErrorState
FileUpload
```

---

# 99. v0.3

```text
Table
DataTable
DatePicker
TimePicker
CommandPalette
Pagination
Breadcrumb
Sidebar
Navigation
```

---

# 100. Paket İsimleri

Öneri:

```text
@kaiwen/tokens
@kaiwen/ui-web
@kaiwen/ui-native
@kaiwen/icons
@kaiwen/brand
@kaiwen/utilities
```

---

# 101. Örnek Kullanım — Web

```tsx
import { Button, Card, Stack, Input } from "@kaiwen/ui-web";

export function Login() {
  return (
    <Card>
      <Stack gap="md">
        <Input label="Email" type="email" />

        <Button variant="primary">Continue</Button>
      </Stack>
    </Card>
  );
}
```

---

# 102. Örnek Kullanım — Native

```tsx
import { Button, Card, Stack, Input } from "@kaiwen/ui-native";

export function Login() {
  return (
    <Card>
      <Stack gap="md">
        <Input label="Email" keyboardType="email-address" />

        <Button variant="primary">Continue</Button>
      </Stack>
    </Card>
  );
}
```

---

# 103. API Parity

Web ve Native component API'leri mümkün olduğunda aynı olmalıdır.

Ancak platform farkları zorla gizlenmemelidir.

Örneğin:

Web:

```text
href
target
rel
```

Native:

```text
onPress
haptics
```

Platform-specific props desteklenebilir.

---

# 104. Tasarım Değişikliğinde Hedef

Örneğin ileride:

```text
border radius
```

global olarak değiştirilecekse mümkün olduğunca yalnızca token değişmelidir.

Bu değişikliğin yüzlerce component dosyasına dokunması mimari hatadır.

---

# 105. Uzun Vadeli Hedef

Kaiwen Design System'in hedefi:

Yeni bir projede geliştiricinin veya AI agentın şu talimatla başlayabilmesi:

```text
Use @kaiwen/ui-web.
Follow Kaiwen Design System.
Use existing components before creating new ones.
```

ve agentın:

- componentleri
- kullanım kurallarını
- skeletonları
- spacing sistemini
- motion sistemini
- accessibility kurallarını

repository'den otomatik öğrenebilmesidir.

---

# 106. Son Mimari

```text
                          ┌───────────────────┐
                          │   @kaiwen/tokens  │
                          └─────────┬─────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               │                                         │
      ┌────────▼─────────┐                      ┌────────▼──────────┐
      │ @kaiwen/ui-web   │                      │ @kaiwen/ui-native│
      └────────┬─────────┘                      └────────┬──────────┘
               │                                         │
      ┌────────▼─────────┐                      ┌────────▼──────────┐
      │ Web Applications │                      │ Mobile Apps       │
      └──────────────────┘                      └───────────────────┘

               ┌───────────────────────┐
               │    @kaiwen/icons      │
               └───────────────────────┘

               ┌───────────────────────┐
               │    @kaiwen/brand      │
               └───────────────────────┘

               ┌───────────────────────┐
               │  @kaiwen/utilities    │
               └───────────────────────┘
```

---

# 107. Nihai Kabul Kriterleri

Proje üretime hazır kabul edilmeden önce:

- [ ] Monorepo çalışıyor.
- [ ] Web ve Native paketleri ayrılmış.
- [ ] Shared token sistemi tamamlanmış.
- [ ] Dark ve Light tema destekleniyor.
- [ ] Semantic color tokens kullanılıyor.
- [ ] Core layout primitive'leri tamamlanmış.
- [ ] Core form componentleri tamamlanmış.
- [ ] OTP autofill platforma uygun şekilde destekleniyor.
- [ ] Input keyboard davranışları doğru.
- [ ] Skeleton sistemi ortak motion engine kullanıyor.
- [ ] Component loading/error/disabled state standartları uygulanmış.
- [ ] Accessibility testleri mevcut.
- [ ] Keyboard navigation mevcut.
- [ ] Reduced motion destekleniyor.
- [ ] Overlay z-index sistemi merkezi.
- [ ] Brand paketi UI core'dan ayrılmış.
- [ ] Icon paketi tree-shakable.
- [ ] Bundle size kontrolü CI'da çalışıyor.
- [ ] Unit tests mevcut.
- [ ] Component tests mevcut.
- [ ] Visual regression çalışıyor.
- [ ] Storybook/docs mevcut.
- [ ] llms.txt mevcut.
- [ ] COMPONENTS.md mevcut.
- [ ] AI agent kullanım kuralları mevcut.
- [ ] Changesets aktif.
- [ ] NPM publish CI üzerinden çalışıyor.
- [ ] GitHub release otomatik üretiliyor.
- [ ] Secret scanning aktif.
- [ ] Dependency scanning aktif.
- [ ] TypeScript strict mode aktif.
- [ ] ESLint/Prettier CI kontrolünde.
- [ ] Public API kontrollü.
- [ ] Business logic design system dışında tutuluyor.

---

# 108. AI Agent İçin Son Talimat

Bu projeyi geliştirirken hız uğruna mimari kuralları ihlal etme.

Öncelik sırası:

```text
1. Consistency
2. Accessibility
3. Correctness
4. Performance
5. Developer Experience
6. Visual polish
```

Her yeni component için önce mevcut tasarım sistemi kurallarını oku.

Yeni bir pattern üretmeden önce mevcut token, primitive veya component ile çözülebilip çözülemeyeceğini kontrol et.

Bir componenti sadece görsel olarak çalıştığı için tamamlanmış kabul etme.

Her public component:

```text
typed
documented
tested
accessible
performant
theme-aware
platform-correct
```

olmalıdır.

---

# 109. Nihai Proje Vizyonu

Kaiwen Design System sıradan bir component koleksiyonu olmayacaktır.

Sistem:

- Tasarım dilini tanımlar.
- UI davranışlarını tanımlar.
- Loading deneyimini tanımlar.
- Accessibility standartlarını tanımlar.
- Motion dilini tanımlar.
- Platform davranışlarını tanımlar.
- AI agentların nasıl UI üretmesi gerektiğini tanımlar.

Amaç şudur:

```text
Yeni bir proje = yeni bir tasarım sistemi oluşturmak
```

değil,

```text
Yeni bir proje = Kaiwen Design System'i kullanmak
```

olmalıdır.
