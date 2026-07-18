import { useState } from 'react'

const fotograflar = [
  '/ayberk.jpg',
  '/ayberk-2.jpg',
  '/ayberk-3.jpg',
  '/ayberk-4.jpg',
  '/ayberk-5.jpg',
  '/ayberk-6.jpg',
]

export default function Hakkinda({ letterCount }) {
  const [index, setIndex] = useState(0)

  function onceki() {
    setIndex((i) => (i - 1 + fotograflar.length) % fotograflar.length)
  }
  function sonraki() {
    setIndex((i) => (i + 1) % fotograflar.length)
  }

  return (
    <section id="hakkinda" className="max-w-5xl mx-auto px-6 py-24 relative z-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="relative group">
          <div className="absolute -inset-1 bg-electric-blue opacity-20 blur-lg group-hover:opacity-40 transition duration-1000" />
          <div className="absolute -top-6 -left-6 text-electric-blue text-4xl animate-floating z-10">✦</div>
          <div className="absolute -bottom-6 -right-6 text-electric-blue text-4xl animate-floating z-10" style={{ animationDelay: '1s' }}>★</div>

          <div className="relative border-2 border-electric-blue overflow-hidden aspect-[3/4] bg-deep-navy">
            <img
              src={fotograflar[index]}
              alt={`Ayberk Özay ${index + 1}`}
              className="w-full h-full object-cover object-top"
            />

            {fotograflar.length > 1 && (
              <>
                <button
                  onClick={onceki}
                  aria-label="Önceki fotoğraf"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-deep-navy/70 border border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-deep-navy transition-colors z-20"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button
                  onClick={sonraki}
                  aria-label="Sonraki fotoğraf"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-deep-navy/70 border border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-deep-navy transition-colors z-20"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {fotograflar.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`${i + 1}. fotoğrafa git`}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-electric-blue' : 'bg-electric-blue/30'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="absolute -bottom-4 right-4 bg-deep-navy border border-electric-blue px-3 py-1 z-10">
            <span className="font-mono text-xs text-electric-blue">© 2026</span>
          </div>
        </div>

        <div className="space-y-6 relative">
          <div className="inline-block border-l-4 border-electric-blue pl-4">
            <span className="font-mono text-xs text-on-surface-variant block uppercase tracking-[0.2em]">Hakkında</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-surface">
              Ayberk'i <span className="text-electric-blue">Tanıyın</span>
            </h2>
          </div>

          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            Ayberk, 5 Nisan 2004 doğumlu bir Koç. Küçük yaşta bağlama kursuna giderek müzikle
            ilk tanışıklığını yaşamış. Bugün sahnede duyduğumuz sesin kökleri belki de oraya
            dayanıyor.
          </p>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            Köz, Ahde Vefa, Ölüyorum Ah gibi şarkılarıyla tanınıyor; sahne enerjisi kadar
            içtenliğiyle de sevilen bir isim. Sahne dışında ise bir iç mimarlık öğrencisi —
            yaratıcılığını başka bir alanda da sürdürüyor.
          </p>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            Küçük bir not: kurbağaları çok seviyor (bu yüzden sitede bir kurbağa oyunu var,
            tesadüf değil ✦), en sevdiği sayı 8, Magic Ball bile ona gönderme.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <a
              href="https://www.instagram.com/ayberkozayy"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-electric-blue py-3 px-4 font-mono text-xs tracking-widest text-electric-blue hover:bg-electric-blue hover:text-deep-navy transition-all bg-deep-navy/50"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span> INSTA
            </a>
            <a
              href="https://www.tiktok.com/@ayberkozay"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-electric-blue py-3 px-4 font-mono text-xs tracking-widest text-electric-blue hover:bg-electric-blue hover:text-deep-navy transition-all bg-deep-navy/50"
            >
              <span className="material-symbols-outlined text-[18px]">music_note</span> TIKTOK
            </a>
            <a
              href="https://x.com/ayberkozayy"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-electric-blue py-3 px-4 font-mono text-xs tracking-widest text-electric-blue hover:bg-electric-blue hover:text-deep-navy transition-all bg-deep-navy/50"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span> X
            </a>
            <a
              href="https://open.spotify.com/artist/0K20LJgsBHYIPiuEKNessd"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-success-cyan py-3 px-4 font-mono text-xs tracking-widest text-success-cyan hover:bg-success-cyan hover:text-deep-navy transition-all bg-deep-navy/50"
            >
              <span className="material-symbols-outlined text-[18px]">graphic_eq</span> SPOTIFY
            </a>
          </div>

          <a
            href="https://x.com/i/communities/1997437529356648448"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border border-electric-blue py-3 px-4 font-mono text-xs tracking-widest text-electric-blue hover:bg-electric-blue hover:text-deep-navy transition-all bg-deep-navy/50"
          >
            <span className="material-symbols-outlined text-[18px]">groups</span> X AYBERKING TOPLULUĞU
          </a>
        </div>
      </div>
    </section>
  )
}