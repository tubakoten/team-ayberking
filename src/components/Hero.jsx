export default function Hero() {
  return (
    <header
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden pt-24"
    >
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <span className="absolute top-20 left-[10%] text-electric-blue text-4xl animate-floating">✦</span>
        <span className="absolute top-40 right-[20%] text-electric-blue text-2xl animate-floating" style={{ animationDelay: '1s' }}>★</span>
        <span className="absolute top-[30%] left-[5%] text-electric-blue text-3xl animate-floating" style={{ animationDelay: '2s' }}>✧</span>
        <span className="absolute top-[60%] right-[10%] text-electric-blue text-5xl animate-floating" style={{ animationDelay: '0.5s' }}>✦</span>
        <span className="absolute top-[15%] right-[35%] text-electric-blue text-xl animate-floating" style={{ animationDelay: '1.8s' }}>★</span>
        <span className="absolute top-[45%] left-[25%] text-electric-blue text-2xl animate-floating" style={{ animationDelay: '0.3s' }}>✧</span>
        <span className="absolute top-[70%] left-[15%] text-electric-blue text-3xl animate-floating" style={{ animationDelay: '2.4s' }}>★</span>
        <span className="absolute top-[80%] right-[25%] text-electric-blue text-2xl animate-floating" style={{ animationDelay: '1.3s' }}>✦</span>
        <span className="absolute top-[85%] left-[45%] text-electric-blue text-xl animate-floating" style={{ animationDelay: '0.8s' }}>✧</span>
        <span className="absolute top-[8%] left-[55%] text-electric-blue text-lg animate-floating" style={{ animationDelay: '2.1s' }}>★</span>
        <span className="absolute top-[55%] right-[45%] text-electric-blue text-xl animate-floating" style={{ animationDelay: '1.6s' }}>✦</span>
        <span className="absolute top-[95%] right-[8%] text-electric-blue text-2xl animate-floating" style={{ animationDelay: '0.6s' }}>✧</span>
      </div>

      <div className="inline-block border border-electric-blue px-4 py-1 mb-8 relative bg-deep-navy/50 z-10">
        <span className="absolute -top-3 -left-3 text-electric-blue text-xl">✦</span>
        <span className="absolute -bottom-3 -right-3 text-electric-blue text-xl">✦</span>
        <span className="font-mono text-xs tracking-widest text-electric-blue">★ FAN SITE ★ EST. 2026</span>
      </div>

      <div className="relative py-8 z-10">
        <h1 className="font-display font-black text-5xl md:text-7xl text-electric-blue drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] leading-tight">
          TEAM
          <br />
          AYBERKING
        </h1>
        <p className="font-mono text-sm md:text-base text-on-surface-variant mt-4 tracking-widest">★ AYBERK ★</p>
        <div className="mt-6">
          <a
            className="font-mono text-sm text-success-cyan hover:underline decoration-success-cyan"
            href="https://x.com/hashtag/patiking"
            target="_blank"
            rel="noreferrer"
          >
            #patiking
          </a>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-2 opacity-70 z-10">
        <span className="font-mono text-xs tracking-widest">SCROLL</span>
        <span className="material-symbols-outlined animate-bounce">expand_more</span>
      </div>
    </header>
  )
}