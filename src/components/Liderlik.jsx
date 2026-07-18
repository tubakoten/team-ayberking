import { useEffect, useState } from 'react'
import { supabase, supabaseYapilandirildi } from '../supabaseClient'

export default function Liderlik() {
  const [top10, setTop10] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [mobilAcik, setMobilAcik] = useState(false)

  async function veriGetir() {
    if (!supabaseYapilandirildi) {
      setYukleniyor(false)
      return
    }
    try {
      const { data } = await supabase
        .from('game_scores')
        .select('name,score')
        .order('score', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(10)
      setTop10(data || [])
    } catch {
      /* sessizce geç — bir sonraki periyotta tekrar dener */
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    veriGetir()
    const aralik = window.setInterval(veriGetir, 12000)
    return () => window.clearInterval(aralik)
  }, [])

  const tablo = (
    <div className="border-2 border-electric-blue bg-deep-navy/80 p-4 w-full">
      <p className="font-mono text-xs text-electric-blue uppercase tracking-widest mb-4 flex items-center gap-2">
        🏆 Liderlik Tablosu
        <span className="w-1.5 h-1.5 rounded-full bg-success-cyan animate-pulse" title="canlı" />
      </p>

      {!supabaseYapilandirildi && (
        <p className="font-mono text-[11px] text-on-surface-variant">
          Supabase bağlanınca burada canlı skorlar görünecek.
        </p>
      )}
      {supabaseYapilandirildi && yukleniyor && (
        <p className="font-mono text-xs text-on-surface-variant">Yükleniyor...</p>
      )}
      {supabaseYapilandirildi && !yukleniyor && top10.length === 0 && (
        <p className="font-mono text-xs text-on-surface-variant">Henüz skor yok — ilk sen ol!</p>
      )}
      {supabaseYapilandirildi && top10.length > 0 && (
        <div className="space-y-1">
          {top10.map((k, i) => (
            <div
              key={i}
              className="flex justify-between font-mono text-xs px-2 py-1.5 border-b border-electric-blue/20 text-on-surface"
            >
              <span className="truncate pr-2">
                {i + 1}. {k.name}
              </span>
              <span className="text-electric-blue shrink-0">{k.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Masaüstü: kalıcı yan panel */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-24">{tablo}</div>

      {/* Mobil: butonla açılıp kapanan panel */}
      <div className="lg:hidden mt-6">
        <button
          onClick={() => setMobilAcik((v) => !v)}
          className="w-full font-mono text-xs px-4 py-3 border border-electric-blue text-electric-blue flex items-center justify-center gap-2"
        >
          🏆 Liderlik Tablosu {mobilAcik ? '▲' : '▼'}
        </button>
        {mobilAcik && <div className="mt-3">{tablo}</div>}
      </div>
    </>
  )
}
