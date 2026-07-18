import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseYapilandirildi = Boolean(supabaseUrl && supabaseAnonKey)

if (!supabaseYapilandirildi) {
  console.warn(
    '[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY tanımlı değil — Supabase kurulana kadar sadece arayüz önizlemesi çalışır, mektup/istek gönderimi ve mektup sayısı devre dışı kalır.'
  )
}

// Supabase henüz kurulmadıysa placeholder değerlerle client oluşturuyoruz ki
// createClient() hata fırlatıp tüm uygulamayı çökertmesin. Gerçek istekler
// (insert/rpc) yine de başarısız olur ama bunlar try/catch ile yakalanıyor,
// arayüz önizlemesi bundan etkilenmez.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)

// Edge Function endpoint for admin letter operations (list / delete).
// This never exposes the admin password check on the client — the function
// verifies it server-side against a secret only Supabase knows.
export const ADMIN_LETTERS_FUNCTION_URL = `${supabaseUrl}/functions/v1/admin-letters`

// Supabase'in API gateway'i artık edge function çağrılarında bir yetkilendirme
// başlığı istiyor (apikey/anon key ile) — bu, bizim kendi şifre kontrolümüzden
// AYRI bir platform seviyesi kontrol. Bu değeri fetch çağrılarında
// Authorization/apikey header'ı olarak kullanıyoruz.
export const SUPABASE_ANON_KEY_ICIN_HEADER = supabaseAnonKey || 'placeholder-anon-key'