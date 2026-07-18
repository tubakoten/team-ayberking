const linkler = [
  { href: '#hakkinda', etiket: 'Hakkında' },
  { href: '#muzik', etiket: 'Müzik' },
  { href: '#istek', etiket: 'İstek Şarkılar' },
  { href: '#quiz', etiket: 'Magic Ball' },
  { href: '#oyun', etiket: 'Oyun' },
  { href: '#mektuplar', etiket: 'Mektuplar' },
  { href: '#yaz', etiket: "Ayberk'e Yazın" },
]

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-4 bg-deep-navy/80 backdrop-blur-md border-b border-electric-blue shadow-[0px_0px_15px_rgba(59,130,246,0.4)]">
      <div className="flex flex-col">
        <span className="font-mono text-sm font-bold tracking-tighter text-electric-blue">
          <span className="mr-2">★</span>TEAM AYBERKING
        </span>
        <div className="flex items-center gap-2">
          <span className="text-success-cyan text-[10px]">● TUBA'S VERSION</span>
        </div>
      </div>
      <nav className="hidden md:flex gap-6 items-center">
        {linkler.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="font-mono text-xs tracking-widest text-on-surface-variant hover:text-electric-blue transition-all duration-300"
          >
            {l.etiket}
          </a>
        ))}
      </nav>
    </header>
  )
}