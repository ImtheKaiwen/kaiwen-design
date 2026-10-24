# AGENTS.md — Kaiwen Design System

> **Kapsam:** Depoda çalışan Codex, Claude Code, Cursor ve diğer kodlama ajanları. Bu belge operatif talimatları içerir. Tasarım değerlerini veya bütün API'leri burada kopyalama; aşağıdaki kaynaklara başvur.

## 1. Göreve başlama protokolü

1. `README.md` dosyasını oku; hedeflenen mevcut aşamayı öğren.
2. Değişikliğin konusuna göre `docs/ARCHITECTURE.md`, `docs/DESIGN_LANGUAGE.md`, `docs/COMPONENT_CONTRACT.md` ve `docs/DEVELOPMENT.md` içinden ilgili bölümleri oku.
3. Mevcut bileşenleri, export'ları, tokenları ve Storybook story'lerini ara. **Mevcut çözüm varken eşdeğer bir bileşen üretme.**
4. Hedef dosyaları, etkilenen API'leri, testleri ve görsel doğrulamayı belirle. Karmaşık değişikliklerde kısa plan yap.
5. Uygula, test et, ilgili story/API açıklamasını güncelle, sonucu kanıtlarıyla raporla.

## 2. Normatif kurallar

- **Tek tasarım kaynağı:** Bütün renk, spacing, font, radius, border, elevation ve motion değerleri token sisteminden gelir. Rastgele hex, keyfî spacing veya kontrolsüz inline style ekleme. İstisna gerekiyorsa semantik token öner, gerekçelendir, test et.
- **Tek bileşen kaynağı:** Kamuya açık React bileşenleri `@imthekaiwen/ui-web` kaynağında yaşar. Studio yalnızca onları tüketir; görsel olarak kopyalayıp yeniden uygulamaz.
- **Motion contract:** `off | subtle | balanced | expressive` desteklenir. Varsayılan `balanced`; `prefers-reduced-motion` kullanıcının tercihini uygular. Bileşen seviyesindeki override sistemin erişilebilirlik önceliğini aşamaz.
- **Kesilebilir hareket:** Pointer/keyboard press, hover, gesture iptali ve yarıda bırakma animasyonu mevcut değerinden yeni hedefe dönebilmelidir. Press sonucu elementin normal layout ölçüsünü değiştiren hareketlerden kaçın; `transform`/opacity önceliklidir.
- **Layout korunur:** `min-width: 0`, overflow, uzun Türkçe metin, focus ring, görüntü/font geç yüklenmesi ve scrollbar durumlarını test et. Skeleton ile gerçek içerik geometrisini yakın tut.
- **Önce semantik HTML:** Etkileşimli elementleri gerçek `button`, `input`, `a` olarak kullan. Klavye, focus, screen reader, disabled, contrast ve Escape/Tab davranışlarını sağla. Sadece hover'a dayalı anlam iletme.
- **Yüzey disiplini:** Nötr, sade yüzeyler varsayılan; `glass` yalnızca açıkça seçilen uygun overlay/floating kontrollerinde, okunabilir fallback ile. Genel yüzeylerde rastgele blur/glow/gradient ekleme.
- **Ikon disiplini:** Görsel ikonları `@imthekaiwen/icons` üzerinden al; aynı işlev için tutarlı sembol/stroke/size kullan. Label gerektiren ikon-only butonlara accessible name ekle.
- **i18n sınırı:** ThemeSwitcher tema durumunu yönetebilir; LanguageSwitcher dil seçimi API'sini sağlar, uygulamanın çeviri sözlüğünü kendisi icat etmez.
- **Sunucu/istemci sınırı:** Ortak paket import edilirken `window`/`document` erişimi yapma. Client-only özellikler effect/adapter içinde başlatılır. Hydration-safe varsayılanlar tasarla.
- **Dış bağımlılık:** Yeni bağımlılık eklemeden mevcut çözümün yeterli olup olmadığını ve bundle, lisans, bakım maliyetini değerlendir.
- **API disiplini:** Bileşenlere anlamsız ortak prop zorlaması yapma. Controlled/uncontrolled kullanım, ref, event, default değer ve export stabilitesi tanımlı olmalı.

## 3. Bileşen için asgari teslim standardı

Bir kamuya açık bileşen tamamlandı sayılmaz, ta ki şunlar sağlanana kadar:

- TypeScript props tanımı ve anlamlı JSDoc açıklamaları.
- Public export + gerekiyorsa alt giriş noktası (package `exports` haritasında).
- Storybook hikâyeleri: varsayılan, anlamlı varyantlar, loading/error/disabled/empty vb. uygulanabilen durumlar, light/dark, motion ve uzun metin.
- Unit/interaction testleri: mouse, touch/pointer cancel, klavye, focus ve controlled state (geçerliyse).
- Erişilebilirlik denetimi, responsive/overflow testi, reduced-motion testi.
- Görsel snapshot veya gerekçelendirilmiş istisna; baseline değişimi ayrı inceleme.
- API değişiminde Changeset; gerekiyorsa migration notu.

## 4. Kaynak/üretim önceliği

| Konu                                     | Asıl kaynak                                       |
| ---------------------------------------- | ------------------------------------------------- |
| Görsel kimlik, token anlamları           | `docs/DESIGN_LANGUAGE.md`                         |
| Bileşen sözleşmesi                       | `docs/COMPONENT_CONTRACT.md`                      |
| Dependency katmanları ve modül sahipliği | `docs/ARCHITECTURE.md`                            |
| Kod yazma, test/CI/yayın                 | `docs/DEVELOPMENT.md`                             |
| Uygulandıktan sonra kesin props/exports  | TypeScript public API                             |
| Canlı örnekler, durum matrisi            | Storybook stories                                 |
| Agent'ın aranabilir katalog girişi       | Tipler ve story metadata'sından üretilen manifest |

**Çelişki çözümü:** Kod ile doküman çelişirse mevcut davranışı incele; tasarım niyetini ihlal ediyorsa sessizce kabul etme. Uygun düzeltme, test ve belge güncellemesini aynı değişiklikte yap. Kontrat değiştirecek kararları açıkça raporla.

## 5. Yasak anti-pattern'ler

- Uygulama özelinde `CustomButton2`, `NewSidebar` gibi parçalar oluşturarak ortak bileşeni baypas etmek.
- `setTimeout` ile son animasyon durumunu zorla sıfırlayıp kesilebilirliği bozmak.
- Press/hover sırasında gerçek grid/flex boyutunu keyfî değiştirmek; komşu alanların sıçramasına neden olmak.
- Loading tamamlanınca skeleton'dan çok farklı geometrik yapıya geçmek.
- Temaya göre doğrudan siyah/beyaz sabit renk basmak; semantic text/surface/border tokenlarını kullanmamak.
- Ürün ekranına rastgele Liquid Glass uygulamak.
- Her asenkron işlemde başarı sayfasına yönlendirmek veya kolay gözden kaçan kısa toast ile kritik hata sunmak.
- Dil değiştirme kontrolüne ürün özel sözlük veya router mantığı gömmek.
- Sadece ekran görüntüsü güzel diye erişilebilirliği, veri bütünlüğünü veya performansı göz ardı etmek.
- CI testlerini geçmek için snapshot'ları onaysız topluca güncellemek.

## 6. Uygulama sırası

1. Token + theme + Studio kabuğu.
2. Button, Switch, Input, Card, Tooltip ve temel layout primitive'leri.
3. Motion states, Skeleton, Spinner, Toast, Alert, Empty/Error State.
4. AppShell, Sidebar, ThemeSwitcher, LanguageSwitcher adapter'ı.
5. Wizard, Confirmation/Success, Upload/Progress ve diğer patterns.
6. Charts, veri yoğun bileşenler, registry, mobil.

**Kapsam koruması:** Kullanıcı belirli bir aşama istiyorsa onaylanmamış sonraki aşama özelliklerini geliştirip projeyi şişirme. Kullanıcı talebi açıkça daha genişse mevcut mimari ve kalite kapılarını koruyarak kapsamı genişlet.

## 7. Tamamlama raporu formatı

Kısa ve doğrulanabilir bilgi ver:

- Yapılan işler / değişen dosyalar.
- Kullanılan ortak bileşenler ve tokenlar.
- Çalıştırılan kontroller; başarılı/başarısız olanlar.
- Görsel/reduced-motion/responsive değerlendirmesi.
- Bilinen eksikler ve bir sonraki mantıklı adım.

**Gerçekte çalıştırmadığın testi çalıştırıldı diye belirtme.** Bu belgeler şu anda bir başlangıç sözleşmesidir; kurulum komutları ve bileşen import örnekleri, ilgili kod yazılana kadar uygulanmış sayılmaz.
