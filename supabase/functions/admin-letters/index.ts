// Supabase Edge Function: admin-letters
//
// Mektupları listelemek ve silmek için TEK giriş noktası.
// Şifre burada, sunucu tarafında (Supabase secrets) kontrol edilir —
// frontend koduna hiçbir zaman gömülmez. Kontrolü geçen istekler
// service role key ile veritabanına erişir (RLS'yi bypass ederek),
// böylece anon key ile kimse mektupları doğrudan okuyamaz/silemez.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, password, id } = await req.json()

    const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')
    if (!ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'ADMIN_PASSWORD secret tanımlı değil' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Yanlış şifre' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    if (action === 'list') {
      const { data, error } = await supabaseAdmin
        .from('letters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(JSON.stringify({ letters: data }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'approve') {
      if (!id) {
        return new Response(JSON.stringify({ error: 'id gerekli' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      const { error } = await supabaseAdmin.from('letters').update({ approved: true }).eq('id', id)
      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      if (!id) {
        return new Response(JSON.stringify({ error: 'id gerekli' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      const { error } = await supabaseAdmin.from('letters').delete().eq('id', id)
      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Bilinmeyen action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
