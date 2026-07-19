import { useState } from 'react'
import { supabase, supabaseYapilandirildi } from '../supabaseClient'

// Çok fazla mektup birikince, kod içinde tek bu satırı değiştirerek
// mektup yazmayı geçici olarak kapatıp açabilirsin.
const MEKTUP_YAZMA_ACIK = false

export default function MektupYaz({ onMektupGonderildi }) {
  const [ad, setAd] = useState('')
  const [sosyal, setSosyal] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [durum, setDurum] = useState('form') // form | gonderiliyor | ucuyor | hata

  const adGecerli = ad.trim().length >= 2 && ad.trim().length <= 40
  const mesajGecerli = mesaj.trim().length >= 20 && mesaj.trim().length <= 2000

  async function gonder(e) {
    e.preventDefault()
    if (!adGecerli || !mesajGecerli) return
    setDurum('gonderiliyor')

    try {
      const { error } = await supabase.from('letters').insert({
        name: ad.trim(),
        social_handle: sosyal.trim() || null,
        message: mesaj.trim(),
      })
      if (error) throw error

      setDurum('ucuyor')
      onMektupGonderildi?.()
      setTimeout(() => {
        setAd('')
        setSosyal('')
        setMesaj('')
        setDurum('form')
      }, 2800)
    } catch {
      setDurum('hata')
    }
  }

  return (
    <section id="yaz" className="max-w-5xl mx-auto px-6 py-24 relative z-10">
      <div className="grid md:grid-cols-2 gap-12 border-t-2 border-electric-blue pt-12 relative">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-electric-blue bg-deep-navy px-4 text-2xl">
          ✦ ★ ✦
        </span>

        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-on-surface">
            Ayberk'e <br />
            <span className="text-electric-blue">Mektup</span> Gönder
          </h2>
          <div className="w-20 h-1 bg-electric-blue" />
          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            Ayberk'e neler söylemek istersin? Kalbindeki sözleri yaz, biz iletiyoruz. Her
            mektup bir zarfa giriyor ve pano üzerinde uçuşuyor — Ayberk istediği zaman tıklayıp
            okuyabilir.
          </p>
          <div className="bg-deep-navy/50 border border-electric-blue/50 p-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-success-cyan">info</span>
            <p className="font-mono text-xs text-on-surface-variant">
              Site yöneticileri mektupları denetledikten sonra sisteme ekler.
            </p>
          </div>
        </div>

        <div className="bg-deep-navy/80 backdrop-blur-sm border-2 border-electric-blue p-8 relative min-h-[420px]">
          <span className="absolute -top-3 -right-3 text-electric-blue text-3xl bg-deep-navy px-1">★</span>

          {!MEKTUP_YAZMA_ACIK ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-electric-blue">mail_lock</span>
              <p className="font-display font-bold text-sm text-on-surface">
                Mektup kutusu şu an kapalı ✦
              </p>
              <p className="font-body text-sm text-on-surface-variant max-w-xs">
                Çok fazla mektup birikti, onaylama işlemini yetiştirebilmek için mektup
                yazmayı geçici olarak kapattık. Yakında tekrar açılacak!
              </p>
            </div>
          ) : durum === 'ucuyor' ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-16">
              <div className="text-5xl animate-floating">✉️</div>
              <p className="font-display font-bold text-sm text-center text-on-surface">
                Mektubun uçuşmaya başladı! ✦
              </p>
              <p className="font-body text-sm text-center text-on-surface-variant">
                Ayberk onayladıktan sonra panoya eklenecek 🌿
              </p>
            </div>
          ) : (
            <form onSubmit={gonder} className="space-y-6">
              <div>
                <label className="font-mono text-xs text-electric-blue block mb-2 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-xs">✦</span> Adın (maks. 40)
                </label>
                <div className="relative">
                  <span className="absolute left-0 bottom-3 text-electric-blue">▸</span>
                  <input
                    value={ad}
                    onChange={(e) => setAd(e.target.value)}
                    placeholder="Adınız"
                    className="w-full bg-transparent border-0 border-b border-electric-blue focus:ring-0 pl-6 py-2 font-mono text-sm text-on-surface"
                  />
                </div>
                {ad.length > 0 && !adGecerli && (
                  <p className="font-mono text-xs text-error-red mt-1">
                    Adın en az 2, en fazla 40 karakter olmalı
                  </p>
                )}
              </div>

              <div>
                <label className="font-mono text-xs text-electric-blue block mb-2 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-xs">✦</span> Sosyal medyan <span className="text-on-surface-variant/50 normal-case">(opsiyonel)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-0 bottom-3 text-electric-blue">▸</span>
                  <input
                    value={sosyal}
                    onChange={(e) => setSosyal(e.target.value)}
                    placeholder="@kullaniciadi ya da profil linki"
                    className="w-full bg-transparent border-0 border-b border-electric-blue focus:ring-0 pl-6 py-2 font-mono text-sm text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-electric-blue block mb-2 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-xs">✦</span> Mesajın
                </label>
                <div className="relative">
                  <span className="absolute left-0 top-2 text-electric-blue">▸</span>
                  <textarea
                    value={mesaj}
                    onChange={(e) => setMesaj(e.target.value)}
                    placeholder="Mesajını buraya yaz..."
                    rows={6}
                    maxLength={2000}
                    className="w-full bg-transparent border-0 border-b border-electric-blue focus:ring-0 pl-6 py-2 font-mono text-sm resize-none text-on-surface"
                  />
                </div>
                <div className="flex justify-between mt-2 font-mono text-[10px] text-on-surface-variant">
                  <span>min 20</span>
                  <span>{mesaj.length} / 2000</span>
                </div>
                {mesaj.length > 0 && !mesajGecerli && (
                  <p className="font-mono text-xs text-error-red mt-1">
                    Mesajın en az 20 karakter olmalı
                  </p>
                )}
              </div>

              {durum === 'hata' && (
                <p className="font-mono text-xs text-error-red">
                  {supabaseYapilandirildi
                    ? 'Bir şeyler ters gitti, lütfen tekrar dene.'
                    : 'Supabase henüz bağlanmadı — bu sadece arayüz önizlemesi, mektup kaydedilmiyor.'}
                </p>
              )}

              <button
                type="submit"
                disabled={!adGecerli || !mesajGecerli || durum === 'gonderiliyor'}
                className="w-full bg-electric-blue text-deep-navy font-mono font-bold py-4 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50"
              >
                <span className="material-symbols-outlined">send</span>
                {durum === 'gonderiliyor' ? '...' : 'MEKTUBU GÖNDER'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}