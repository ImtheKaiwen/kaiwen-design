# DESIGN LANGUAGE — Kaiwen Design

**Tasarım yönü:** **Minimal Surface · Expressive Motion** · **Durum:** v0.1 tasarım sözleşmesi

## 1. Kimlik ve yaklaşım

Kaiwen Design'ın görsel referansı OpenAI'ın sade, rafine, neredeyse monokrom arayüz yaklaşımıdır. Ürünün kendi kimliği ise daha fiziksel ve özenli **mikro hareket** ile oluşur. Başarılı tasarımın ölçütü gösterişli olmak değil, belirsizliği ve bilişsel yükü azaltırken kontrol hissini güçlendirmektir.

**Beş ilke**

1. **Sadelik:** Aynı hiyerarşi renk ve gölge olmadan tipografi, hizalama ve boşlukla anlaşılmalı.
2. **Tutarlılık:** Bütün uygulamalar aynı semantic token, ikon ölçüsü, durum ve motion sözlüğünü kullanmalı.
3. **Kesintisiz his:** Hareket mevcut yerinden başlayıp yeni hedefe gitmeli; son kareye ışınlanma yok.
4. **Yerleşim sabitliği:** Süreç değiştiğinde içerik oynamamalı; state değişimi görsel bir olay, yeniden layout dağılımı değil.
5. **Erişilebilirlik:** Kontrast, keyboard, pointer ve azaltılmış hareket seçenekleri tasarımın parçası; sonradan eklenen düzeltme değil.

OpenAI logoları, özel fontları veya tescilli grafik/marka varlıkları kopyalanmaz. Sadelik, renk sistemi, görsel oranlar ve kullanım prensipleri esin kaynağıdır. Kaiwen'a ait özgün bir dil geliştirilir.

## 2. Renk sistemi

**Varsayılan:** Light/Dark, neredeyse tamamen nötr gri tonları. Ürün genelindeki accent renk zorunlu değildir; vurgu **semantik anlam** (başarı, hata, uyarı, seçili durum) için kontrollü kullanılır.

### 2.1 Referans nötr palet (tasarım başlangıcı)

| Rol                 | Light     | Dark      | Amaç                     |
| ------------------- | --------- | --------- | ------------------------ |
| `surface.canvas`    | `#FAFAF9` | `#111111` | Ana zemin                |
| `surface.default`   | `#FFFFFF` | `#1A1A1A` | Kart, panel              |
| `surface.subtle`    | `#F3F3F1` | `#222222` | Hafif ayrım              |
| `surface.hover`     | `#ECECE9` | `#292929` | Hover yüzeyi             |
| `text.primary`      | `#191919` | `#F5F5F4` | Ana metin                |
| `text.secondary`    | `#5F5F5D` | `#B8B8B5` | Yardımcı metin           |
| `text.tertiary`     | `#767674` | `#A4A4A1` | Meta (kontrastı doğrula) |
| `border.subtle`     | `#E8E8E6` | `#363636` | Hafif çerçeve            |
| `border.strong`     | `#C8C8C5` | `#656565` | Vurgu/focus eşlik        |
| `action.primary.bg` | `#191919` | `#F5F5F4` | Ana CTA                  |
| `action.primary.fg` | `#FFFFFF` | `#191919` | Ana CTA metni            |

**Önemli:** Bunlar nihai contrast-verified palet değil, **ilk görsel referans değerleri**. Her kullanımda foreground/background eşleşmesi WCAG 2.2 AA kontrollerinden geçirilmeden production kabul edilmez. Özellikle `text.tertiary` küçük metinlerde yetersiz kalabilir; tokenın amacı düşük kontrastı meşrulaştırmak değildir. Gerekirse erişilebilir ton kullanılır.

- Durum tokenları `status.success.*`, `status.warning.*`, `status.error.*`, `status.info.*` olarak ayrılır; bunlar tek başına renk üzerinden anlam iletmez, metin/ikonla desteklenir.
- Çizgi/legend/grafikler için `chart.series.*`, `chart.grid`, `chart.tooltip.*` tanımlanır. Siyah-beyaz grafiklerde seri ayrımı stroke pattern, marker ve açıklamalarla korunur.
- Gradient ve neon varsayılan değil; dekoratif vurgu istisnaları ayrıca değerlendirilir.
- `glass` ayrı bir **surface variant**, light/dark'tan bağımsız bir görsel özellik. Glass her karta uygulanmaz.

### 2.2 Token kullanım ilkesi

```css
/* Token paketi tarafından üretilecek sözleşme örneği */
.kaiwen-scope {
  color: var(--kw-text-primary);
  background: var(--kw-surface-canvas);
}
.kw-card {
  background: var(--kw-surface-default);
  border: 1px solid var(--kw-border-subtle);
}
```

- Bileşen stillerinde raw hex ve local `rgba(...)` ile yeni tema rolü yaratma.
- Tüketen uygulama özel accent isterse sadece açıkça expose edilen semantic token override'ları kullanabilir.
- CSS variable adları tek bir token builder tarafından üretilir; birden fazla el yapımı tema tablosu tutulmaz.

## 3. Tipografi

**Önerilen sans-serif:** lisansı doğrulanmış ve self-host edilen **Inter** veya benzer okunabilir aile; system font fallback zorunlu. Nihai font kararı visual review sonrasında sabitlenir. OpenAI'ın kendine özel fontu kopyalanmaz.

| Stil tokenı         | Öneri         | Kullanım                                   |
| ------------------- | ------------- | ------------------------------------------ |
| `type.display`      | 40 / 48, 600  | Büyük ürün/landing başlığı; sık değil      |
| `type.heading.1`    | 30 / 38, 600  | Sayfa başlığı                              |
| `type.heading.2`    | 24 / 32, 600  | Bölüm                                      |
| `type.heading.3`    | 20 / 28, 600  | Panel                                      |
| `type.body`         | 16 / 24, 400  | Uzun metin                                 |
| `type.body.compact` | 14 / 20, 400  | Yoğun araç arayüzü                         |
| `type.label`        | 13 / 18, 500  | Kontroller                                 |
| `type.caption`      | 12 / 16, 400  | Yardımcı bilgi; erişilebilir kontrast şart |
| `type.code`         | 13 / 20, mono | Kod/ID/veri                                |

Bunlar tasarım testine girecek başlangıç önerileridir; ölçek dışı istisnalar token revizyonu gerektirir.

- Başlık/bileşen/body hiyerarşisi boyut + weight + spacing ile verilir; her bölüme farklı renk atama.
- Gövde metnini bilerek fazla ince yapma; normal 400, vurgu 500/600 çoğunlukla yeterli.
- Sayısal panellerde `font-variant-numeric: tabular-nums`.
- Türkçe karakterler ve uzun birleşik kelimeler; fallback ve otomatik font yükleme durumları test edilir.
- Font swap kaynaklı layout shift için uygun fallback metrikleri ve tutarlı line-height kullan.

## 4. Spacing, radius, borders ve elevation

**Temel spacing adımı:** 4 px; token seti örneği: `0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64` px. 2/6 px optik düzeltme, istisna olarak tokenlaştırılabilir. Arbitrary utility ve rasgele boşluk yok.

**Density:**

- `compact`: desktop veri yoğun ekran, küçük ama erişilebilir etkileşim mesafesi.
- `comfortable` (**varsayılan**): genel ürün deneyimi.
- `spacious`: landing, onboarding ve yüksek okunabilirlik.

**Radius:** `xs=4`, `sm=6`, `md=10`, `lg=14`, `xl=20`, `full=9999` px başlangıç değerleri; bir bileşen içinde alt parçaların radius'u hiyerarşik olmalı. Rastgele 11/13/17 px kullanılmaz.

**Border:** 1 px düz ve düşük kontrastlı; zemin ayrımı yeterliyse border zorunlu değil. **Shadow/elevation:** çok seyrek; popover, modal, floating toolbar gibi katmanlarda. Varsayılan her karta yaygın gölge yok. Overlay düzeyi `zIndex` tokenlarıyla merkezi tanımlanır (`base`, `sticky`, `dropdown`, `popover`, `modal`, `toast`); ayrı stacking context gerekebileceği test edilir.

## 5. Motion Language

Hareket, ürünün karakteristik farkıdır; görsel sadeliği bozmamalıdır.

### 5.1 Seviyeler

| Seviye                   | Davranış                                                           | Yaklaşık süre |
| ------------------------ | ------------------------------------------------------------------ | ------------- |
| `off`                    | Gereksiz hareket kaldırılır; durum değişikliği doğrudan gösterilir | 0 ms          |
| `subtle`                 | Opacity/renk odaklı; transform çok sınırlı                         | 100–180 ms    |
| `balanced` (**default**) | Kısa hareket + hafif spring; günlük kullanım                       | 160–300 ms    |
| `expressive`             | Stretch, settle, kontrollü bounce; seçili komponentlerde           | 200–450 ms    |

Süreler katı limit değil, ilk motion bütçesidir. Motion seviyesi sistem genelinde provider üzerinden, gereken komponentte `motion` override ile belirlenir. Kullanıcının **reduced motion** tercihi, yerel seviyeden daha yüksek önceliklidir. Hareket azaltılsa bile durum/başarı bilgisi kaybolmaz.

### 5.2 Motion preset sözlüğü

| Preset           | Uygulandığı yer            | Önemli detay                                                      |
| ---------------- | -------------------------- | ----------------------------------------------------------------- |
| `press`          | Button, icon button, cards | Pointer basılıyken hafif scale; bırakınca mevcut değerinden dönüş |
| `switch-elastic` | Switch                     | Thumb önce esner → karşıya kayar → hafif settle/bounce            |
| `tooltip-enter`  | Tooltip                    | Opacity + 4–6 px float; focus ile de görünür                      |
| `popover-enter`  | Dropdown, popover          | Küçük scale+translation; transform origin tetikleyiciye yakın     |
| `dialog-enter`   | Dialog                     | Backdrop fade + içerik settle; odak yönetimi zorunlu              |
| `toast-enter`    | Toast                      | Kenardan az hareket + fade; dismiss kontrollü                     |
| `skeleton-pulse` | Skeleton                   | Çok düşük kontrastlı pulse; reduced-motion'da statik              |
| `number-update`  | Metrikler                  | Şartlı sayısal geçiş; her render'da tekrar etmez                  |
| `layout-change`  | Sidebar/tab selection      | Yerleşim değişimi kontrollü; komşu içerik atlamaz                 |

### 5.3 Fiziksel mikro etkileşim kuralları

- **Kesilebilir:** Hareket bitmeden pointer bırakılırsa/sürükleme iptal edilirse animasyon, güncel pozisyondan hedefe dönmelidir. Bitiş zamanına bağlı `setTimeout` reset'leri tercih edilmez.
- **Transform öncelikli:** Button press/hover sırasında `transform: scale(...)`; komşu grid/flex alanlarının geometrisi değişmemeli.
- **Abartısız:** Günlük Button'da `1.01–1.04` gibi hafif scale hissi; geniş bounce sadece belirli switch/özel eylemlerde. Değerler canlı prototiple kalibre edilir.
- **Doğru gesture semantics:** Pointer aşağı, yukarı, dışarı sürükle, cancel, keyboard Space/Enter, touch ve focus-via-keyboard durumu test edilir.
- **Başlangıç durumu:** Animasyon başlangıçta devasa pop-in yapmaz; gerektiğinde ilk render motion olmadan yapılır (SSR/hydration).
- **Ölçülebilir performans:** `transform`/`opacity` öncelikli; layout, paint ve blur maliyeti profil edilir. Animasyon sadece performansı kaldıran cihazlarda zenginleşir.

Motion tokenlarının hedef biçimi:

```ts
export type MotionLevel = 'off' | 'subtle' | 'balanced' | 'expressive';

export const motionPresets = {
  balanced: {
    press: { scale: 1.02, stiffness: 440, damping: 32 },
    tooltip: { y: 4, durationMs: 180 },
  },
  expressive: {
    press: { scale: 1.035, stiffness: 520, damping: 22 },
    switch: { stretch: 1.2, stiffness: 520, damping: 22 },
  },
} as const;
```

> İlk tasarım değerleridir; her değer uygulama testlerinde revize edilebilir. Runtime API'nin ve birim/parametre dönüşümlerinin sorumlusu `@imthekaiwen/motion` paketidir.

## 6. Liquid Glass ve yüzey politikası

Varsayılan UI cam efekti içermez. `surface="glass"` gibi açık seçilen bir variant şu alanlarda değerlendirilebilir: floating toolbar, media controls, görsel üstü kontroller. **Tercih edilmeyen:** veri tabloları, uzun metin kartları, form alanlarının tamamı, app shell'in bütün yüzeyleri.

- Glass, şeffaflık + arka plan blur + hafif border ile uygulanabilir; browser/device için opak fallback sağlanır.
- Metin kontrastı, görsel arka plan değiştiğinde korunmalı (gerekirse glass yüzey opaklaştırılır).
- Glass olan her alanın reduced-transparency / performans fallback stratejisi vardır.
- Aynı ekranda glass ve solid yüzeyler hiyerarşi için kullanılır; iki farklı dekoratif tasarım dili birbirine rastgele karıştırılmaz.

## 7. Layout dili ve layout shift engelleme

Layout: `Container`, `Stack`, `Inline`, `Grid`, `SplitView`, `AppShell`, `Sidebar`, `PageHeader`, `Section`, `ScrollArea`. Primitiveler tekrar kullanılabilir, ürün ekranları yine de kendi içeriklerini tanımlayabilir.

- **Ölçüler:** ekran kırılımı değil önce içerik davranışı; responsive tasarım 360/768/1024/1440 px temsili genişliklerde kontrol edilir.
- **Grid:** 12-column desktop yardımcı şema; mobilde otomatik azalan kolon sayısı. CSS Grid `minmax(0, 1fr)` ve çocuklarda `min-width: 0` doğru kullanılır.
- **Container:** ürün panelinde okunabilir max-width; tüm genişliği körü körüne kullanma.
- **Overflow:** uzun isim, URL, kod, Türkçe metin, hata mesajı ve locale değişiminde sayfayı yatay genişletmez.
- **Skeleton eşleşmesi:** İçerik, loading ve empty state alanları aynı veya yakın yükseklik/yerleşim rezervini kullanır. Beklenmedik zıplama kritik hatadır.
- **Sidebar:** Collapse durumunda ikon/text transitions yönetilir; içerik yeniden akarken stabil grid/panel boyutları hedeflenir.
- **Responsive:** Hover asla tek erişim yolu değildir; touch target'lar mobilde yeterli büyüklükte olur.

## 8. Icons ve tema/dil kontrolleri

- `@imthekaiwen/icons`: Lucide ikonlarının tek bir public wrapper/manifest katmanından sunulması hedeflenir.
- Genel outline stroke/optical size standarttır; icon-only butonlarda `aria-label` ve gerektiğinde tooltip.
- Aynı kavram iki farklı ikonla temsil edilmez. İkon kullanım tablosu Studio'da görünür.
- `ThemeSwitcher`: `light`, `dark`, `system`. Tema geçişleri göz yoran toplu animasyon yaratmaz; prefers-reduced-motion'a saygı gösterir.
- `LanguageSwitcher`: bileşen UI'si, `locale/options/onLocaleChange` sözleşmesi; uygulamanın çeviri metnini/dil routing'ini kendi içinde çözer. Bayraklar dillerin yerine kullanılmaz.

## 9. Charts ve bilgi yoğun ekranlar (ileri aşama)

Grafikler sade ve okunaklı olmalı: az gridline, net eksen hiyerarşisi, tabular numbers, tooltip/legend standartları. Renk skalası tek ayırıcı değildir; marker, stroke ve etiket kullanılır. Data update sırasında değerler yumuşakça geçer ama her render'da baştan animasyon olmaz. Büyük veride hareket azaltılır/devre dışı bırakılır. Tooltip odak/touch alternatifine sahip olmalıdır.

## 10. Copy, feedback ve içerik tonu

- Başlıklar kısa, somut; butonlar fiil odaklı: “Kaydet”, “Projeyi oluştur”, “Tekrar dene”.
- Hata mesajı yalnızca “Bir şeyler ters gitti” deme; ne olduğunu ve kullanıcı ne yapabileceğini açıkla.
- Toast kısa süreli, geri dönülebilir geri bildirim içindir; kritik uyarı alert/dialog/kalıcı state ile sunulur.
- Success Page yalnızca tamamlanmış **büyük iş akışlarında** (hesap/kayıt/ödeme/onboarding) kullanılır. Basit ayar kaydında modal veya yeni sayfa açılmaz.
- Skeleton, içeriğin geleceği yeri temsil eder; sonsuz loading durumunda kullanıcıya takılı kalmış gibi hissettirme.
- Dil değişimiyle metin genişliği artabilir; sabit pixel width'li etiketler kullanma.

## 11. Kabul kontrol listesi

- [ ] Light/dark text–surface ve status kontrastları test edildi.
- [ ] Tasarım tokenı dışında rastgele değer yok veya belgelenmiş istisna var.
- [ ] Bileşen states görsel olarak ayırt edilebilir (hover/focus/pressed/loading/disabled/error).
- [ ] Press ve switch motion yarıda kesilip iptal edildiğinde sıçramıyor.
- [ ] System reduced-motion ve keyboard-only yolları doğru.
- [ ] Overlay/glass okunabilir, konumu ve blur fallback'i kabul edilebilir.
- [ ] 360/768/1024/1440 px ve uzun Türkçe örneklerinde yatay taşma/CLS yok.
- [ ] Studio örneği gerçek üretim bileşenini kullanıyor.

**Teknik sınırlar:** `ARCHITECTURE.md` · **Props ve bileşen davranışları:** `COMPONENT_CONTRACT.md` · **Test/CI:** `DEVELOPMENT.md`.
