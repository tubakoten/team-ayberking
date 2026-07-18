import { useEffect, useState } from 'react'
import { supabase, supabaseYapilandirildi } from '../supabaseClient'

const favoriler = [
  { tip: 'youtube', baslik: 'FE!N', altYazi: 'Final A Grubu', href: 'https://www.youtube.com/watch?v=XXr5slkOiAI', gorsel: 'https://img.youtube.com/vi/XXr5slkOiAI/hqdefault.jpg' },
  { tip: 'youtube', baslik: 'Cakkıdı', altYazi: 'Final A Grubu', href: 'https://www.youtube.com/watch?v=ls7_Km5YTDc', gorsel: 'https://img.youtube.com/vi/ls7_Km5YTDc/hqdefault.jpg' },
  { tip: 'youtube', baslik: "Killin' It Girl", altYazi: 'Final A Grubu', href: 'https://www.youtube.com/watch?v=FATJtBwyptM', gorsel: 'https://img.youtube.com/vi/FATJtBwyptM/hqdefault.jpg' },
  { tip: 'instagram', baslik: 'İkiz Dingiller', altYazi: 'Reels', href: 'https://www.instagram.com/reel/DZsT_YtzTlN/', gorsel: '/ikiz-dingiller.jpg' },
  { tip: 'instagram', baslik: 'Mercy (with Can)', altYazi: 'Reels', href: 'https://www.instagram.com/reel/DY7RviRqkXL/', gorsel: '/mercy-can.jpg' },
]

const ROZET_STIL = {
  youtube: 'bg-red-600 text-white',
  instagram: 'bg-fuchsia-600 text-white',
}

export default function Muzik() {
  const [link, setLink] = useState('')
  const [durum, setDurum] = useState('idle') // idle | gonderiliyor | tamam | zatenGonderildi | hata
  const [istekler, setIstekler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)

  const zatenIstekVarMi = () => localStorage.getItem('pb_song_request_sent') === '1'

  async function metaVeriGetir(spotifyLink) {
    try {
      const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyLink)}`)
      if (!res.ok) return null
      const data = await res.json()
      return { baslik: data.title, gorsel: data.thumbnail_url }
    } catch {
      return null
    }
  }

  async function isteklerGetir() {
    if (!supabaseYapilandirildi) {
      setYukleniyor(false)
      return
    }
    try {
      const { data } = await supabase
        .from('song_requests')
        .select('id,spotify_link,created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      const zenginlestirilmis = await Promise.all(
        (data || []).map(async (istek) => {
          const meta = await metaVeriGetir(istek.spotify_link)
          return { ...istek, baslik: meta?.baslik || null, gorsel: meta?.gorsel || null }
        })
      )
      setIstekler(zenginlestirilmis)
    } catch {
      /* sessizce geç */
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    isteklerGetir()
  }, [])

  async function istekGonder(e) {
    e.preventDefault()
    if (zatenIstekVarMi()) {
      setDurum('zatenGonderildi')
      return
    }
    if (!link.includes('open.spotify.com')) {
      setDurum('hata')
      return
    }
    setDurum('gonderiliyor')
    try {
      const { error } = await supabase.from('song_requests').insert({ spotify_link: link })
      if (error) throw error
      localStorage.setItem('pb_song_request_sent', '1')
      setDurum('tamam')
      setLink('')
      isteklerGetir()
    } catch {
      setDurum('hata')
    }
  }

  return (
    <section id="muzik" className="max-w-5xl mx-auto px-6 py-24 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:divide-x lg:divide-electric-blue/30">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <span className="material-symbols-outlined text-electric-blue text-3xl">graphic_eq</span>
            <h2 className="font-display font-extrabold text-2xl text-on-surface flex items-center gap-2">
              Favoriler <span className="text-electric-blue text-xl">✦</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-on-surface-variant mb-6">
            En sevilen performanslar &amp; coverlar
          </p>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {favoriler.map((f) => (
              <a
                key={f.href}
                href={f.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-deep-navy/80 border border-electric-blue/40 p-3 hover:bg-electric-blue/10 hover:border-electric-blue transition-all group"
              >
                <div className="w-14 h-14 shrink-0 bg-deep-navy border border-electric-blue/30 overflow-hidden flex items-center justify-center">
                  {f.gorsel ? (
                    <img src={f.gorsel} alt={f.baslik} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-electric-blue">photo_camera</span>
                  )}
                </div>
                <div className="min-w-0">
                  <span className={`inline-block font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 mb-1 ${ROZET_STIL[f.tip]}`}>
                    {f.tip === 'youtube' ? 'YouTube' : 'Instagram'}
                  </span>
                  <h4 className="font-mono text-electric-blue text-sm truncate group-hover:text-success-cyan transition-colors">
                    {f.baslik}
                  </h4>
                  <p className="font-mono text-[11px] text-on-surface-variant truncate">{f.altYazi}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div id="istek" className="lg:pl-12">
          <div className="flex items-center gap-4 mb-2">
            <span className="material-symbols-outlined text-electric-blue text-3xl">queue_music</span>
            <h2 className="font-display font-bold text-2xl text-on-surface">İstek Şarkılar</h2>
          </div>
          <p className="font-mono text-xs text-on-surface-variant mb-6">
            Spotify'dan şarkı öner — oturum başına 1 istek hakkın var
          </p>

          <form onSubmit={istekGonder} className="space-y-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-electric-blue/60">
                link
              </span>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Geçerli bir Spotify şarkı linki gir"
                className="w-full bg-deep-navy/60 border border-electric-blue/50 rounded-lg focus:border-electric-blue focus:ring-1 focus:ring-electric-blue pl-12 py-4 font-mono text-sm placeholder:text-on-surface-variant/60 text-on-surface"
                required
              />
            </div>
            <button
              type="submit"
              disabled={durum === 'gonderiliyor'}
              className="w-full bg-electric-blue text-deep-navy font-mono font-bold py-4 rounded-lg hover:bg-success-cyan hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-60"
            >
              <span className="material-symbols-outlined">add</span> EKLE
            </button>

            {durum === 'tamam' && (
              <p className="font-mono text-xs text-success-cyan text-center">İsteğin iletildi ✦</p>
            )}
            {durum === 'zatenGonderildi' && (
              <p className="font-mono text-xs text-on-surface-variant text-center">
                Bu oturumda zaten bir istek gönderdin.
              </p>
            )}
            {durum === 'hata' && (
              <p className="font-mono text-xs text-error-red text-center">
                {!supabaseYapilandirildi
                  ? 'Supabase henüz bağlanmadı — bu sadece arayüz önizlemesi.'
                  : 'Geçerli bir Spotify linki gir ve tekrar dene.'}
              </p>
            )}
          </form>

          <div className="mt-10">
            <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest mb-3">
              ▸ Gelen İstekler
            </p>
            {!supabaseYapilandirildi && (
              <p className="font-mono text-xs text-on-surface-variant">
                Supabase bağlanınca buradaki istekler görünecek.
              </p>
            )}
            {supabaseYapilandirildi && yukleniyor && (
              <p className="font-mono text-xs text-on-surface-variant">Yükleniyor...</p>
            )}
            {supabaseYapilandirildi && !yukleniyor && istekler.length === 0 && (
              <p className="font-mono text-xs text-on-surface-variant">Henüz istek yok — ilk sen ol!</p>
            )}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
              {istekler.map((istek, i) => (
                <a
                  key={istek.id}
                  href={istek.spotify_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-deep-navy/60 border border-electric-blue/30 px-3 py-2 hover:bg-electric-blue/10 hover:border-electric-blue transition-all group"
                >
                  <span className="font-mono text-xs text-electric-blue w-6 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-9 h-9 shrink-0 bg-deep-navy border border-electric-blue/30 overflow-hidden flex items-center justify-center">
                    {istek.gorsel ? (
                      <img src={istek.gorsel} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span className="material-symbols-outlined text-base text-electric-blue">music_note</span>
                    )}
                  </div>
                  <span className="font-mono text-sm text-electric-blue truncate group-hover:text-success-cyan transition-colors">
                    {istek.baslik || 'Spotify şarkısı'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}