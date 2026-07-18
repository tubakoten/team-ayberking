import { useState } from 'react'
import { ADMIN_LETTERS_FUNCTION_URL, supabaseYapilandirildi } from '../supabaseClient'

export default function Mektuplar({ letterCount }) {
  const [kilitAcik, setKilitAcik] = useState(false)
  const [sifre, setSifre] = useState('')
  const [mektuplar, setMektuplar] = useState([])
  const [durum, setDurum] = useState('kapali') // kapali | yukleniyor | acik | yanlisSifre | hata
  const [islemId, setIslemId] = useState(null)

  const bekleyenler = mektuplar.filter((m) => !m.approved)
  const yayinlananlar = mektuplar.filter((m) => m.approved)

  async function mektuplariAc(e) {
    e.preventDefault()
    setDurum('yukleniyor')
    try {
      const res = await fetch(ADMIN_LETTERS_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', password: sifre }),
      })
      if (res.status === 401) {
        setDurum('yanlisSifre')
        return
      }
      if (!res.ok) throw new Error('istek başarısız')
      const data = await res.json()
      setMektuplar(data.letters || [])
      setKilitAcik(true)
      setDurum('acik')
    } catch {
      setDurum('hata')
    }
  }

  async function islemYap(action, id) {
    setIslemId(id)
    try {
      const res = await fetch(ADMIN_LETTERS_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, password: sifre, id }),
      })
      if (!res.ok) return
      if (action === 'delete') {
        setMektuplar((prev) => prev.filter((m) => m.id !== id))
      } else if (action === 'approve') {
        setMektuplar((prev) => prev.map((m) => (m.id === id ? { ...m, approved: true } : m)))
      }
    } finally {
      setIslemId(null)
    }
  }

  return (
    <section id="mektuplar" className="max-w-5xl mx-auto px-6 py-24 relative z-10">
      <span className="absolute top-2 left-8 text-electric-blue text-2xl animate-floating">✧</span>
      <span className="absolute top-10 right-12 text-electric-blue text-xl animate-floating" style={{ animationDelay: '1.2s' }}>★</span>
      <div className="text-center mb-10 relative">
        <span className="font-mono text-xs text-on-surface-variant block uppercase tracking-[0.2em]">
          Hayran Mektupları
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-surface">
          Ayberk'e <span className="text-electric-blue">Yazılanlar</span>
        </h2>
      </div>

      <div className="relative bg-deep-navy/80 backdrop-blur-sm border-2 border-electric-blue overflow-hidden p-8">
        {letterCount === 0 && !kilitAcik && (
          <p className="font-body text-sm text-center py-10 text-on-surface-variant">
            Henüz onaylanmış mektup yok.
            <br />
            İlk yazan sen ol!
          </p>
        )}

        {!kilitAcik && (
          <div className="relative z-10 bg-deep-navy/90 backdrop-blur-md p-10 border border-electric-blue max-w-md mx-auto shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div className="w-16 h-16 border-2 border-electric-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-electric-blue">lock</span>
            </div>
            <h3 className="font-display font-bold text-center mb-4 uppercase tracking-wider text-on-surface">
              Mektuplar Kilitli
            </h3>
            <p className="font-body text-sm text-on-surface-variant mb-8 text-center">
              Bu mektuplar yalnızca Ayberk için yazıldı. Okumak ve onaylamak için özel şifreyi
              girin.
            </p>

            <form onSubmit={mektuplariAc} className="space-y-3">
              <input
                type="password"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="Şifre"
                className="w-full font-mono text-sm px-3 py-3 bg-deep-navy/60 border border-electric-blue/50 focus:border-electric-blue text-on-surface"
              />
              {durum === 'yanlisSifre' && (
                <p className="font-mono text-xs text-error-red text-center">✕ YANLIŞ ŞİFRE</p>
              )}
              {durum === 'hata' && (
                <p className="font-mono text-xs text-error-red text-center">
                  {!supabaseYapilandirildi
                    ? 'Supabase henüz bağlanmadı — bu sadece arayüz önizlemesi.'
                    : 'Bağlantı hatası, tekrar dene.'}
                </p>
              )}
              <button
                type="submit"
                disabled={durum === 'yukleniyor'}
                className="w-full bg-electric-blue text-deep-navy font-mono font-bold px-8 py-3 hover:scale-[1.02] transition-transform shadow-[0_0_10px_rgba(59,130,246,0.5)] disabled:opacity-60"
              >
                ► ŞİFRE İLE AÇ
              </button>
            </form>
          </div>
        )}

        {kilitAcik && (
          <div className="space-y-10">
            <p className="font-display font-bold text-sm text-center text-on-surface">
              Hoş geldin, Ayberk! 🧡
            </p>

            <div>
              <h3 className="font-mono text-xs text-electric-blue uppercase tracking-widest mb-4">
                Onay Bekleyenler ({bekleyenler.length})
              </h3>
              <div className="space-y-4">
                {bekleyenler.length === 0 && (
                  <p className="font-mono text-xs text-on-surface-variant">Bekleyen mektup yok.</p>
                )}
                {bekleyenler.map((m) => (
                  <div key={m.id} className="border border-electric-blue/40 bg-deep-navy/60 p-4">
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <div>
                        <p className="font-mono text-xs text-on-surface">{m.name}</p>
                        {m.social_handle && (
                          <p className="font-mono text-[11px] text-electric-blue">{m.social_handle}</p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => islemYap('approve', m.id)}
                          disabled={islemId === m.id}
                          className="font-mono text-[10px] px-2 py-1 border border-success-cyan text-success-cyan hover:bg-success-cyan hover:text-deep-navy transition-colors disabled:opacity-50"
                        >
                          {islemId === m.id ? '...' : '✓ ONAYLA'}
                        </button>
                        <button
                          onClick={() => islemYap('delete', m.id)}
                          disabled={islemId === m.id}
                          className="font-mono text-[10px] px-2 py-1 border border-error-red text-error-red hover:bg-error-red hover:text-deep-navy transition-colors disabled:opacity-50"
                        >
                          {islemId === m.id ? '...' : '✕ SİL'}
                        </button>
                      </div>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant whitespace-pre-wrap">
                      {m.message}
                    </p>
                    <p className="font-mono text-[10px] text-on-surface-variant/50 mt-2">
                      {new Date(m.created_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-xs text-electric-blue uppercase tracking-widest mb-4">
                Yayında ({yayinlananlar.length})
              </h3>
              <div className="space-y-4">
                {yayinlananlar.map((m) => (
                  <div key={m.id} className="border border-electric-blue/20 bg-deep-navy/40 p-4">
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <div>
                        <p className="font-mono text-xs text-on-surface">{m.name}</p>
                        {m.social_handle && (
                          <p className="font-mono text-[11px] text-electric-blue">{m.social_handle}</p>
                        )}
                      </div>
                      <button
                        onClick={() => islemYap('delete', m.id)}
                        disabled={islemId === m.id}
                        className="font-mono text-[10px] px-2 py-1 border border-error-red text-error-red hover:bg-error-red hover:text-deep-navy transition-colors disabled:opacity-50 shrink-0"
                      >
                        {islemId === m.id ? '...' : '✕ SİL'}
                      </button>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant whitespace-pre-wrap">
                      {m.message}
                    </p>
                    <p className="font-mono text-[10px] text-on-surface-variant/50 mt-2">
                      {new Date(m.created_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
