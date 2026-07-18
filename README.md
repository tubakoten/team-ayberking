# Team Ayberking

Ayberk Özay'a adanmış resmi olmayan hayran sitesi. React + Vite + Tailwind + Supabase.
Tasarım dili Google Stitch ile prototiplenip buraya uyarlandı (koyu lacivert + elektrik
mavisi + yıldız/sparkle motifleri).

## Özellikler

- **Hakkında** — biyografi (şimdilik placeholder, arkadaş grubuyla güncellenecek), fotoğraf,
  sosyal linkler (Instagram, TikTok, X, Spotify)
- **Müzik** — Ayberk'in gerçek Spotify çıkışlarından favoriler + şarkı isteği formu
- **Bugün Hangi Ayberk Şarkısısın?** — rastgele şarkı öneren eğlence quiz'i
- **Mini Oyun** — "Ayberk Koşuyor", dino-oyunu tarzı canvas oyunu
- **Mektuplar** — herkes mektup yazabilir; **önce admin onayından geçer**, onaylanmadan
  sayaçta görünmez / herkese açık listede çıkmaz. Şifresi olan (sen + Ayberk) mektupları
  onaylayabilir ve silebilir

## Moderasyon akışı (yeni)

Bir mektup gönderildiğinde `approved = false` ile veritabanına düşer. Herkese açık mektup
sayacı (`letter_count()`) SADECE `approved = true` olan mektupları sayar — yani bir mektup
onaylanana kadar hiçbir yerde görünmez. Admin şifreyle girip mektupları görür, her biri için
**✓ Onayla** ya da **✕ Sil** seçebilir. Onaylanan mektup "Yayında" listesine taşınır ve
herkese açık sayaca dahil olur.

## Güvenlik yaklaşımı

Mektup okuma/onaylama/silme şifresi **frontend koduna hiçbir zaman gömülmüyor**. Bunun yerine
bir Supabase **Edge Function** (`supabase/functions/admin-letters`) kullanıyoruz:

1. Site sadece şifreyi bu fonksiyona gönderir.
2. Fonksiyon şifreyi, Supabase'in sunucu tarafında sakladığı bir "secret" ile karşılaştırır.
3. Şifre doğruysa, fonksiyon `service role key` ile veritabanına erişip mektupları döner /
   onaylar / siler. Bu key de yalnızca Supabase'in sunucusunda yaşar, tarayıcıya hiç inmez.

Veritabanı tarafında da mektuplar tablosunda **anon (herkese açık) SELECT/UPDATE/DELETE
policy'si yok** — yani biri "view source" yapsa ya da tarayıcı konsolundan doğrudan
Supabase'e istek atsa bile mektupları okuyamaz, onaylayamaz ya da silemez. Tek yol
admin-letters fonksiyonundan doğru şifreyle geçmek. Ayrıca insert policy'si,
`approved = false` şartını zorunlu kılıyor — biri isteğine `approved: true` eklemeye
çalışsa bile veritabanı bunu reddediyor.

## Kurulum

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. Supabase projesi oluştur

1. [supabase.com](https://supabase.com) üzerinden ücretsiz bir proje aç.
2. **Project Settings > API** kısmından `Project URL` ve `anon public` key'i al.
3. `.env.example` dosyasını `.env` olarak kopyala ve bu değerleri doldur:

```bash
cp .env.example .env
```

### 3. Veritabanı şemasını çalıştır

Supabase Dashboard'da **SQL Editor**'e git, `supabase/schema.sql` dosyasının tüm içeriğini
yapıştır ve çalıştır. Bu, `letters` (moderasyonlu), `song_requests` ve `game_scores`
tablolarını, RLS policy'lerini ve güvenli mektup sayacı fonksiyonunu oluşturur.

### 4. Admin şifresini ve Edge Function'ı kur

```bash
npm install -g supabase
supabase login
supabase link --project-ref <proje-ref-kodun>
supabase secrets set ADMIN_PASSWORD=buraya-gercek-sifre
supabase functions deploy admin-letters
```

Bu şifreyi sen ve Ayberk paylaşacaksınız.

### 5. Geliştirme sunucusunu çalıştır

```bash
npm run dev
```

### 6. Deploy (Netlify)

```bash
npm run build
```

`dist/` klasörünü Netlify'a sürükle-bırak yapabilir ya da GitHub reponla bağlayıp otomatik
deploy kurabilirsin (build command: `npm run build`, publish directory: `dist`).
Netlify'da **Environment variables** kısmına `VITE_SUPABASE_URL` ve
`VITE_SUPABASE_ANON_KEY` değerlerini eklemeyi unutma.

## Fotoğrafı / bio'yu değiştirmek istersen

- Fotoğraf: `public/ayberk.jpg` dosyasını değiştir (dosya adı aynı kalmalı).
- Bio: `src/components/Hakkinda.jsx` içindeki paragraf metnini düzenle, altındaki
  "bu metin geçici" notunu da kaldırmayı unutma.

## Dosya yapısı

```
src/
  components/
    Hero.jsx          — açılış bölümü
    Hakkinda.jsx       — biyografi + fotoğraf + sosyal linkler
    Muzik.jsx          — favoriler + şarkı isteği formu
    SarkiQuiz.jsx      — "Bugün Hangi Şarkısın?" quiz'i
    MiniOyun.jsx       — canvas oyunu
    Mektuplar.jsx      — mektup listesi + admin onay/silme
    MektupYaz.jsx      — mektup gönderme formu
    Nav.jsx / Footer.jsx
  supabaseClient.js    — Supabase bağlantısı
  App.jsx
supabase/
  schema.sql                — veritabanı tabloları + RLS + moderasyon
  functions/admin-letters   — şifre kontrolü + listeleme/onaylama/silme
```
