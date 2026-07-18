export default function Footer() {
  return (
    <footer className="w-full py-16 flex flex-col items-center gap-6 text-center border-t border-electric-blue bg-deep-navy/90 mt-10 relative z-10">
      <span className="absolute top-6 left-10 text-electric-blue text-xl animate-floating">✧</span>
      <span className="absolute top-10 right-14 text-electric-blue text-2xl animate-floating" style={{ animationDelay: '1.5s' }}>★</span>
      <h2 className="font-display font-bold text-xl text-electric-blue flex items-center gap-4">
        <span className="text-2xl">★</span> TEAM AYBERKING <span className="text-2xl">★</span>
      </h2>

      <nav className="flex flex-wrap justify-center gap-6">
        <a href="#hakkinda" className="font-mono text-xs text-on-surface-variant hover:text-electric-blue underline decoration-electric-blue">Hakkında</a>
        <a href="#muzik" className="font-mono text-xs text-on-surface-variant hover:text-electric-blue underline decoration-electric-blue">Müzik</a>
        <a href="#istek" className="font-mono text-xs text-on-surface-variant hover:text-electric-blue underline decoration-electric-blue">İstek Şarkılar</a>
        <a href="#quiz" className="font-mono text-xs text-on-surface-variant hover:text-electric-blue underline decoration-electric-blue">Magic Ball</a>
        <a href="#oyun" className="font-mono text-xs text-on-surface-variant hover:text-electric-blue underline decoration-electric-blue">Oyun</a>
        <a href="#mektuplar" className="font-mono text-xs text-on-surface-variant hover:text-electric-blue underline decoration-electric-blue">Mektuplar</a>
        <a href="#yaz" className="font-mono text-xs text-on-surface-variant hover:text-electric-blue underline decoration-electric-blue">Ayberk'e Yazın</a>
      </nav>

      <div className="flex gap-8">
        <a href="https://www.instagram.com/ayberkozayy" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-electric-blue transition-colors">
          <span className="material-symbols-outlined">photo_camera</span>
        </a>
        <a href="https://www.tiktok.com/@ayberkozay" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-electric-blue transition-colors">
          <span className="material-symbols-outlined">music_video</span>
        </a>
        <a href="https://x.com/ayberkozayy" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-electric-blue transition-colors">
          <span className="material-symbols-outlined">alternate_email</span>
        </a>
      </div>

      <div className="space-y-2 relative z-10">
        <p className="font-body text-sm text-on-surface-variant uppercase tracking-widest">
          © 2026 TEAM AYBERKING · DIGITAL SHRINE VERSION 1.0 · ● ONLINE
        </p>
        <p className="font-mono text-[11px] text-on-surface-variant/40">
          RESMİ OLMAYAN HAYRAN SAYFASI ♥ Hazırlayan: Tuba Köten ·{' '}
          <a
            href="https://www.instagram.com/tubakoten"
            target="_blank"
            rel="noreferrer"
            className="hover:text-electric-blue underline decoration-electric-blue"
          >
            Instagram
          </a>{' '}
          ·{' '}
          <a
            href="https://x.com/baskabirzuko"
            target="_blank"
            rel="noreferrer"
            className="hover:text-electric-blue underline decoration-electric-blue"
          >
            X
          </a>
        </p>
      </div>
    </footer>
  )
}
