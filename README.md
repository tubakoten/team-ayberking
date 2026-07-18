# Team Ayberking 💙

Ayberk Özay'a adanmış resmi olmayan hayran sitesi. React + Vite + Tailwind + Supabase.
Tasarım dili Google Stitch ile prototiplenip buraya uyarlandı (koyu lacivert + elektrik
mavisi + yıldız/sparkle motifleri).

**Canlı site:** 🌐 https://teamayberking.netlify.app

## Özellikler

- **Hakkında** — gerçek biyografi, birden fazla fotoğraflı galeri (ok butonlarıyla gezilen),
  sosyal linkler (Instagram, TikTok, X, Spotify) + X Ayberking topluluğu linki
- **Müzik**
  - *Favoriler* — YouTube performansları (gerçek video kapak görselleriyle) ve Instagram
    reels'leri, tek liste halinde
  - *İstek Şarkılar* — Spotify'dan şarkı önerme formu; gönderilen istekler altında gerçek
    şarkı adı + kapak resmiyle listeleniyor (Spotify'ın oEmbed servisinden çekiliyor)
- **Magic Ball 🎱** — "Bugün Hangi Ayberk Şarkısısın?" — tıklayınca sallanıp dönen bir 8-ball,
  arkasında rastgele bir şarkı + gömülü Spotify çalar çıkıyor
- **Zıplayan Kurbağa 🐸 (Mini Oyun)** — sürekli akan bir gölette kurbağayı yaprak/nilüfer/lotus
  üzerinde ilerleten canvas oyunu. Tek dokun = tek zıplama, basılı tut ya da çift
  dokun/tıkla = çift zıplama. Ara sıra timsah çıkıyor (tehlike). Skor 8'de bir kerelik
  "mate çayı kalkanı" kazanılıyor. Skor arttıkça gece atmosferi ve hız artıyor.
  - Yanında **canlı liderlik tablosu** (`Liderlik.jsx`) — masaüstünde kalıcı panel, 12
    saniyede bir kendiliğinden yenileniyor; mobilde açılır/kapanır buton
- **Mektuplar** — herkes mektup yazabilir; **önce admin onayından geçer**, onaylanmadan
  sayaçta görünmez / herkese açık listede çıkmaz. Şifresi olan (sen + Ayberk) mektupları
  onaylayabilir ve silebilir

## Moderasyon akışı

Bir mektup gönderildiğinde `approved = false` ile veritabanına düşer. Herkese açık mektup
sayacı (`letter_count()`) SADECE `approved = true` olan mektupları sayar — yani bir mektup
onaylanana kadar hiçbir yerde görünmez. Admin şifreyle girip mektupları görür, her biri için
**✓ Onayla** ya da **✕ Sil** seçebilir.

## Güvenlik yaklaşımı

Mektup okuma/onaylama/silme şifresi **frontend koduna hiçbir zaman gömülmüyor**. Bunun yerine
bir Supabase **Edge Function** (`supabase/functions/admin-letters`) kullanıyoruz:

1. Site sadece şifreyi bu fonksiyona gönderir.
2. Fonksiyon şifreyi, Supabase'in sunucu tarafında sakladığı bir "secret" (`ADMIN_PASSWORD`)
   ile karşılaştırır.
3. Şifre doğruysa, fonksiyon `service role key` ile veritabanına erişip mektupları döner /
   onaylar / siler. Bu key de yalnızca Supabase'in sunucusunda yaşar, tarayıcıya hiç inmez.

Veritabanı tarafında da mektuplar tablosunda **anon (herkese açık) SELECT/UPDATE/DELETE
policy'si yok** — tek yol admin-letters fonksiyonundan doğru şifreyle geçmek. Ayrıca insert
policy'si `approved = false` şartını zorunlu kılıyor.

`game_scores` ve `song_requests` tabloları ise (liderlik tablosu ve istek listesi herkese
açık olduğu için) anon SELECT'e izin veriyor — burada gizlenecek bir şey yok.

## Kurulum (sıfırdan)

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. Supabase projesi oluştur

1. [supabase.com](https://supabase.com) üzerinden ücretsiz bir proje aç.
2. **Project Settings > API** kısmından `Project URL` ve **Publishable key** (eski adıyla
   "anon key") değerlerini al.
3. `.env.example` dosyasını `.env` olarak kopyala ve doldur:

```bash
cp .env.example .env
```

### 3. Veritabanı şemasını çalıştır

Supabase Dashboard'da **SQL Editor** → `supabase/schema.sql` dosyasının tüm içeriğini
yapıştır ve çalıştır. Bu, `letters`, `song_requests`, `game_scores` tablolarını, RLS
policy'lerini ve güvenli mektup sayacı fonksiyonunu oluşturur.

### 4. Admin şifresini ve Edge Function'ı kur

```bash
brew install supabase/tap/supabase   # Mac — npm ile global kurulum artık desteklenmiyor
supabase login
supabase link --project-ref <proje-ref-kodun>
supabase secrets set ADMIN_PASSWORD=buraya-gercek-sifre
supabase functions deploy admin-letters
```

### 5. Geliştirme sunucusunu çalıştır

```bash
npm run dev
```

### 6. Deploy (GitHub + Netlify, otomatik)

Proje GitHub'a bağlı (`tubakoten/team-ayberking`) ve Netlify oradan otomatik deploy alıyor.
Yani bir değişiklik yaptıktan sonra tek yapman gereken:

```bash
git add .
git commit -m "değişiklik açıklaması"
git push
```

Netlify bunu görüp birkaç dakika içinde siteyi otomatik günceller. **Netlify'da
Environment variables** kısmına `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY`'in
girili olduğundan emin ol (bunlar olmadan build alınır ama site Supabase'e bağlanamaz).

## Fotoğrafı / bio'yu değiştirmek istersen

- Fotoğraflar: `public/ayberk.jpg`, `ayberk-2.jpg` ... `ayberk-6.jpg` — `Hakkinda.jsx`
  içindeki `fotograflar` dizisine ekleyip/çıkararak galeriyi düzenleyebilirsin.
- Bio: `src/components/Hakkinda.jsx` içindeki paragrafları düzenle.

## Dosya yapısı 🐸💙🎱

```
src/
  components/
    Hero.jsx          — açılış bölümü
    Hakkinda.jsx       — biyografi + fotoğraf galerisi + sosyal linkler
    Muzik.jsx          — favoriler (YouTube/Instagram) + şarkı isteği formu + istek listesi
    SarkiQuiz.jsx      — Magic Ball ("Bugün Hangi Şarkısın?")
    MiniOyun.jsx       — Zıplayan Kurbağa oyunu
    Liderlik.jsx       — canlı liderlik tablosu (yan panel / mobil buton)
    Mektuplar.jsx      — mektup listesi + admin onay/silme
    MektupYaz.jsx      — mektup gönderme formu
    Nav.jsx / Footer.jsx
  supabaseClient.js    — Supabase bağlantısı
  App.jsx
supabase/
  schema.sql                — veritabanı tabloları + RLS + moderasyon
  functions/admin-letters   — şifre kontrolü + listeleme/onaylama/silme
```
