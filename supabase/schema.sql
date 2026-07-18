-- PÜSKÜLLÜ BELA — veritabanı şeması
-- Supabase projende SQL Editor'e yapıştırıp çalıştır.

-- ============ MEKTUPLAR ============
create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  social_handle text,
  message text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table letters enable row level security;

-- Herkes (anon) mektup gönderebilir — ama sunucu tarafında da uzunluk kontrolü var.
-- "approved = false" şartı, birinin insert isteğine approved:true göndererek
-- moderasyonu atlamasını engeller — her yeni mektup daima onay bekler durumda başlar.
create policy "anon_insert_letters"
on letters for insert
to anon
with check (
  char_length(name) between 2 and 40
  and char_length(message) between 20 and 2000
  and approved = false
);

-- ÖNEMLİ: Kasıtlı olarak anon için SELECT / UPDATE / DELETE policy YOK.
-- Mektupları okumak, onaylamak ve silmek yalnızca "admin-letters" Edge Function
-- üzerinden, service role ile ve şifre kontrolünden geçerek yapılabilir. Bu sayede
-- frontend'e gömülü anon key ile kimse doğrudan mektupları okuyamaz/silemez/onaylayamaz.

-- Herkesin görebileceği, içerik açığa çıkarmayan güvenli mektup sayacı.
-- Sadece admin tarafından ONAYLANMIŞ mektupları sayar (moderasyon bekleyenler sayılmaz).
create or replace function letter_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*) from letters where approved = true;
$$;

grant execute on function letter_count() to anon;


-- ============ ŞARKI İSTEKLERİ ============
create table if not exists song_requests (
  id uuid primary key default gen_random_uuid(),
  spotify_link text not null,
  created_at timestamptz not null default now()
);

alter table song_requests enable row level security;

create policy "anon_insert_song_requests"
on song_requests for insert
to anon
with check (spotify_link like 'https://open.spotify.com/%');


-- ============ OYUN SKORLARI (Kurbağa oyunu liderlik tablosu) ============
create table if not exists game_scores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score integer not null,
  created_at timestamptz not null default now()
);

create index if not exists game_scores_score_idx on game_scores (score desc);

alter table game_scores enable row level security;

-- Skor gönderme herkese açık (basit bir fan-oyunu, hile koruması gerekmiyor
-- ama makul bir üst sınır koyuyoruz).
create policy "anon_insert_game_scores"
on game_scores for insert
to anon
with check (
  char_length(name) between 2 and 24
  and score between 0 and 5000
);

-- Liderlik tablosu herkese açık olduğu için (mektuplardan farklı olarak)
-- burada anon SELECT'e izin veriyoruz — bu tabloda gizli/hassas veri yok.
create policy "anon_select_game_scores"
on game_scores for select
to anon
using (true);
