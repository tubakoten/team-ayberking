import { useState } from 'react'

const sarkilar = [
  'Köz',
  'Ölüyorum Ah',
  'Ahde Vefa',
  'Her Şey Yalan',
  'Beni Anlama',
  'Güzelliğine',
  'Oyna',
  'Kanımda',
  '20',
]

// Her şarkının Spotify ID'si — gömülü çalar için kullanılıyor.
// "track" olanlar gerçek parça ID'si (bazı single'lar 2 parçalı çıkmış,
// albüm ID'siyle gömünce Spotify yanlış/ilk parçayı çalıyordu — bu yüzden
// mümkün olanları doğrudan parça ID'sine çevirdim).
const sarkiSpotifyId = {
  'Köz': { tur: 'track', id: '15yOaVekkgVm0apzD8eUlW' },
  'Ölüyorum Ah': { tur: 'track', id: '0w3aEiJPZ1uMbU5Ft0VtFy' },
  'Ahde Vefa': { tur: 'track', id: '3TexiUvBYXoAmVIKBWFcEi' },
  'Her Şey Yalan': { tur: 'track', id: '3xELnHj3Z0wgFkmTn5v4Bn' },
  'Beni Anlama': { tur: 'album', id: '35p6brZSvWAmSfQQ34QxcE' },
  'Güzelliğine': { tur: 'album', id: '71sCqAPElJshdetxIthz77' },
  'Oyna': { tur: 'album', id: '76RJrvHMVniAMh5hPHSXyv' },
  'Kanımda': { tur: 'album', id: '5WQHzi8OcRLry9KLdrXN6v' },
  '20': { tur: 'track', id: '08dcqtOLVtJoSguL7y9iYS' },
}

export default function SarkiQuiz() {
  const [donuk, setDonuk] = useState(false)
  const [sonuc, setSonuc] = useState(null)
  const [sallaniyor, setSallaniyor] = useState(false)

  function topaTikla() {
    if (sallaniyor) return
    if (donuk) {
      setDonuk(false)
      window.setTimeout(() => setSonuc(null), 350)
      return
    }
    setSallaniyor(true)
    window.setTimeout(() => {
      setSallaniyor(false)
      const rastgele = sarkilar[Math.floor(Math.random() * sarkilar.length)]
      setSonuc(rastgele)
      setDonuk(true)
    }, 380)
  }

  return (
    <section id="quiz" className="max-w-5xl mx-auto px-6 py-24 relative z-10">
      <style>{`
        .magic8-sahne {
          perspective: 1200px;
          -webkit-perspective: 1200px;
        }
        .magic8-ic {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          transition: transform 0.9s cubic-bezier(0.4, 0.2, 0.2, 1);
          -webkit-transition: -webkit-transform 0.9s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        .magic8-ic.donuk {
          transform: rotateY(180deg);
          -webkit-transform: rotateY(180deg);
        }
        .magic8-yuz {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 9999px;
          overflow: hidden;
        }
        .magic8-arka {
          transform: rotateY(180deg);
          -webkit-transform: rotateY(180deg);
        }
        @keyframes magic8-salla {
          0%, 100% { transform: rotateZ(0deg) scale(1); }
          20% { transform: rotateZ(-9deg) scale(1.03); }
          40% { transform: rotateZ(8deg) scale(1.03); }
          60% { transform: rotateZ(-6deg) scale(1.02); }
          80% { transform: rotateZ(4deg) scale(1.01); }
        }
        .magic8-ic.sallaniyor {
          animation: magic8-salla 0.38s ease-in-out;
          -webkit-animation: magic8-salla 0.38s ease-in-out;
        }
      `}</style>

      <div className="relative overflow-hidden rounded-xl bg-deep-navy/60 backdrop-blur-md border border-electric-blue/40 p-8 md:p-12 shadow-[0_0_30px_rgba(59,130,246,0.1)] text-center">
        <span className="absolute top-4 left-4 text-electric-blue text-2xl animate-floating">✦</span>
        <span className="absolute bottom-4 right-4 text-electric-blue text-2xl animate-floating" style={{ animationDelay: '1s' }}>★</span>

        <div className="relative z-10">
          <span className="font-mono text-xs text-on-surface-variant block uppercase tracking-[0.2em] mb-2">
            İnteraktif
          </span>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-electric-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] mb-4">
            Bugün Hangi Ayberk Şarkısısın?
          </h2>
          <p className="font-body text-on-surface-variant max-w-xl mx-auto mb-10">
            Topa dokun, cevabını görsün.
          </p>

          <div className="flex flex-col items-center gap-6">
            <div
              className="magic8-sahne w-56 h-56 md:w-64 md:h-64 cursor-pointer select-none"
              onClick={topaTikla}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && topaTikla()}
              aria-label="Şarkımı bul"
            >
              <div className={`magic8-ic w-full h-full ${donuk ? 'donuk' : ''} ${sallaniyor ? 'sallaniyor' : ''}`}>
                {/* ÖN YÜZ */}
                <div
                  className="magic8-yuz flex items-center justify-center shadow-[0_0_35px_rgba(59,130,246,0.45)]"
                  style={{
                    background: 'radial-gradient(circle at 32% 28%, #3a3a3a 0%, #111 45%, #000 100%)',
                  }}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="font-display font-black text-4xl md:text-5xl text-deep-navy">8</span>
                  </div>
                </div>

                {/* ARKA YÜZ */}
                <div
                  className="magic8-yuz magic8-arka flex items-center justify-center p-5"
                  style={{
                    background: 'radial-gradient(circle at 32% 28%, #3a3a3a 0%, #111 45%, #000 100%)',
                  }}
                >
                  <div
                    className="w-[80%] h-[80%] rounded-full flex items-center justify-center text-center px-5"
                    style={{
                      background: 'radial-gradient(circle at 50% 32%, #1a3a6b 0%, #0a1930 85%)',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
                    }}
                  >
                    <span
                      className={`font-display font-bold text-electric-blue leading-snug drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] ${
                        (sonuc?.length ?? 0) > 20 ? 'text-xs md:text-sm' : 'text-sm md:text-lg'
                      }`}
                    >
                      {sonuc}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="font-mono text-xs text-on-surface-variant">
              {donuk ? 'Tekrar sormak için tekrar dokun' : 'Sormak için dokun ►'}
            </p>

            {donuk && sonuc && sarkiSpotifyId[sonuc] && (
              <div className="w-full max-w-xs">
                <iframe
                  key={sonuc}
                  src={`https://open.spotify.com/embed/${sarkiSpotifyId[sonuc].tur}/${sarkiSpotifyId[sonuc].id}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                  title={`${sonuc} - Spotify`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}