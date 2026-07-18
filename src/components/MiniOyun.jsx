import { useEffect, useRef, useState } from 'react'
import { supabase, supabaseYapilandirildi } from '../supabaseClient'

// ---- Sabitler -------------------------------------------------------------
const GENISLIK = 700
const YUKSEKLIK = 220
const FROG_H = 32
const FROG_W = Math.round(FROG_H * (642 / 482))
const LILY_ORAN = 568 / 464
const PAD_ORANLARI = {
  yaprak: 568 / 464,
  yaprak2: 787 / 619,
  lotus: 859 / 734,
}
const TIMSAH_ORAN = 1178 / 834
const STEP_GENISLIK = 150
const PAD_GORUNUR_GENISLIK = STEP_GENISLIK * 0.62
const KURBAGA_SOL = 70
const YER_Y = YUKSEKLIK - 66

// Zıplama süreleri 
const HOP_SURESI_BASLANGIC = 500 // Akan dünyaya ayak uydurmak için biraz daha seri bir başlangıç
const HOP_SURESI_MIN = 220 
const HOP_YUKSEKLIK = 46
const BASILI_TUTMA_ESIGI = 180

function hopSuresiHesapla(skor) {
  return Math.max(HOP_SURESI_MIN, HOP_SURESI_BASLANGIC - skor * 14)
}

const KALKAN_SKORU = 8
const PX = 4 

const bandTop = YER_Y + FROG_H
const bandH = YUKSEKLIK - bandTop
const merkezSabit = KURBAGA_SOL + FROG_W / 2

function rastgeleYaprakGorseli() {
  const r = Math.random()
  if (r < 0.13) return 'lotus'
  if (r < 0.5) return 'yaprak2'
  return 'yaprak'
}

function ilkKareler() {
  return [{ tip: 'kiyi' }, { tip: 'pad', gorsel: 'yaprak' }, { tip: 'pad', gorsel: 'yaprak' }, { tip: 'pad', gorsel: 'yaprak' }]
}

function sonrakiKare(kareler, skor) {
  const son = kareler[kareler.length - 1]
  if (son.tip === 'su' || son.tip === 'timsah') {
    return { tip: 'pad', gorsel: rastgeleYaprakGorseli() } 
  }
  const tehlikeOlasiligi = Math.min(0.4, 0.14 + skor * 0.012)
  if (Math.random() < tehlikeOlasiligi) {
    return { tip: Math.random() < 0.35 ? 'timsah' : 'su' }
  }
  return { tip: 'pad', gorsel: rastgeleYaprakGorseli() }
}

function kareleriGarantiEt(s) {
  while (s.kareler.length < s.mevcutIndex + 10) {
    s.kareler.push(sonrakiKare(s.kareler, s.skor))
  }
}

function resimYukle(src) {
  const img = new Image()
  img.src = src
  img.onerror = () => {
    img._hata = true
  }
  return img
}

function hazirMi(img) {
  return !!img && img.complete && img.naturalWidth > 0 && !img._hata
}

function blok(ctx, x, y, w, h, renk) {
  ctx.fillStyle = renk
  ctx.fillRect(Math.round(x / PX) * PX, Math.round(y / PX) * PX, Math.max(PX, Math.round(w / PX) * PX), Math.max(PX, Math.round(h / PX) * PX))
}

function renkKaristir(renk1, renk2, t) {
  const p1 = renk1.match(/\w\w/g).map((h) => parseInt(h, 16))
  const p2 = renk2.match(/\w\w/g).map((h) => parseInt(h, 16))
  return `rgb(${p1.map((c, i) => Math.round(c + (p2[i] - c) * t)).join(',')})`
}

const GECE_ESIGI_SKOR = 25 

const SAZLAR = Array.from({ length: 9 }, (_, i) => {
  const seed = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
  return { x: (i / 9) * GENISLIK + seed * 20, yukseklik: 10 + seed * 20 }
})

export default function MiniOyun() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const resimlerRef = useRef(null)

  const [isim, setIsim] = useState(() => localStorage.getItem('pb_frog_name') || '')
  const [asama, setAsama] = useState('isimGir')
  const [skor, setSkor] = useState(0)
  const [enIyi, setEnIyi] = useState(() => Number(localStorage.getItem('pb_frog_best') || 0))
  const [liderlik, setLiderlik] = useState(null)
  const [yukleniyorLiderlik, setYukleniyorLiderlik] = useState(false)
  const [kalkanAktif, setKalkanAktif] = useState(false)
  const [kalkanMesaj, setKalkanMesaj] = useState('')

  useEffect(() => {
    resimlerRef.current = {
      kurbaga: resimYukle('/frog_sprite.png'),
      yaprak: resimYukle('/lily_pad.png'),
      yaprak2: resimYukle('/yaprak_varyant2.png'),
      lotus: resimYukle('/lotus_pembe.png'),
      timsah: resimYukle('/timsah.png'),
      mate: resimYukle('/mate_tea.png'),
    }
  }, [])

  function mesajGoster(m) {
    setKalkanMesaj(m)
    window.clearTimeout(mesajGoster._t)
    mesajGoster._t = window.setTimeout(() => setKalkanMesaj(''), 2500)
  }

  function oyunuBaslat() {
    const kiyiCimTomurcuklari = Array.from({ length: 12 }, () => ({
      dx: Math.random() * STEP_GENISLIK,
      yukseklik: 5 + Math.random() * 7,
    }))
    const kiyiCakillar = Array.from({ length: 8 }, () => ({
      dx: Math.random() * STEP_GENISLIK,
      dy: Math.random(),
      boyut: PX + (Math.random() > 0.5 ? PX : 0),
    }))

    stateRef.current = {
      kareler: ilkKareler(),
      mevcutIndex: 0,
      kameraX: 0, // YENİ: Gölün ne kadar sola kaydığını takip eder
      hopDurumu: 'yok',
      hopMiktari: 1,
      hopIlerleme: 0,
      hopBaslangicZamani: 0,
      hopSuresi: HOP_SURESI_BASLANGIC,
      skor: 0,
      bitti: false,
      kalkanVar: false,
      kalkanKazanildiMi: false,
      olumAsamasi: 'yok',
      batmaBaslangic: 0,
      batisSkoru: 0,
      sicramaBaslangic: null,
      kiyiCimTomurcuklari,
      kiyiCakillar,
    }
    kareleriGarantiEt(stateRef.current)
    setSkor(0)
    setLiderlik(null)
    setKalkanAktif(false)
    setKalkanMesaj('')
    setAsama('oynuyor')
  }

  const basisZamaniRef = useRef(null)
  const bekleyenTekZiplamaRef = useRef(null)
  const CIFT_TIKLAMA_PENCERESI = 220 // ms — bu süre içinde ikinci dokunuş gelirse çift zıplama olur

  function ziplaBaslat(miktar) {
    const s = stateRef.current
    if (!s || s.bitti || s.hopDurumu === 'devam' || s.olumAsamasi !== 'yok') return
    s.hopMiktari = miktar
    s.hopSuresi = hopSuresiHesapla(s.skor)
    s.hopDurumu = 'devam'
    s.hopBaslangicZamani = performance.now()
  }

  function basisBaslat() {
    const s = stateRef.current
    if (!s || s.bitti || s.hopDurumu === 'devam' || s.olumAsamasi !== 'yok') return
    basisZamaniRef.current = performance.now()
  }

  function basisBitir() {
    const s = stateRef.current
    if (!s || s.bitti || s.hopDurumu === 'devam' || s.olumAsamasi !== 'yok' || basisZamaniRef.current === null) return
    const tutulanSure = performance.now() - basisZamaniRef.current
    basisZamaniRef.current = null

    // Uzun basış: bekletmeden hemen çift zıplama.
    if (tutulanSure > BASILI_TUTMA_ESIGI) {
      if (bekleyenTekZiplamaRef.current) {
        window.clearTimeout(bekleyenTekZiplamaRef.current)
        bekleyenTekZiplamaRef.current = null
      }
      ziplaBaslat(2)
      return
    }

    // Kısa dokunuş: az önce bekleyen bir tek-zıplama varsa, bu ikinci dokunuş
    // demektir — çift tıklama algılandı, çift zıplamaya çeviriyoruz.
    if (bekleyenTekZiplamaRef.current) {
      window.clearTimeout(bekleyenTekZiplamaRef.current)
      bekleyenTekZiplamaRef.current = null
      ziplaBaslat(2)
      return
    }

    // İlk kısa dokunuş — ikinci bir dokunuş gelir mi diye çok kısa bir süre bekle.
    bekleyenTekZiplamaRef.current = window.setTimeout(() => {
      bekleyenTekZiplamaRef.current = null
      ziplaBaslat(1)
    }, CIFT_TIKLAMA_PENCERESI)
  }

  async function oyunBitti(finalSkor) {
    const s = stateRef.current
    if (s) s.bitti = true

    const yeniEnIyi = Math.max(enIyi, finalSkor)
    setEnIyi(yeniEnIyi)
    localStorage.setItem('pb_frog_best', String(yeniEnIyi))
    localStorage.setItem('pb_frog_name', isim)
    setAsama('bitti')

    if (!supabaseYapilandirildi) return

    setYukleniyorLiderlik(true)
    try {
      await supabase.from('game_scores').insert({ name: isim.trim().slice(0, 24), score: finalSkor })
      const [{ data: top10 }, { count: dahaYuksek }, { count: toplam }] = await Promise.all([
        supabase.from('game_scores').select('name,score').order('score', { ascending: false }).order('created_at', { ascending: true }).limit(10),
        supabase.from('game_scores').select('id', { count: 'exact', head: true }).gt('score', finalSkor),
        supabase.from('game_scores').select('id', { count: 'exact', head: true }),
      ])
      setLiderlik({ top10: top10 || [], siram: (dahaYuksek ?? 0) + 1, toplam: toplam ?? 0 })
    } catch {
      setLiderlik(null)
    } finally {
      setYukleniyorLiderlik(false)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    let animationId

    function golArkaPlaniCiz(skor, kameraX) {
      const gece = Math.min(1, (skor ?? 0) / GECE_ESIGI_SKOR)
      blok(ctx, 0, 0, GENISLIK, bandTop, renkKaristir('#0a1930', '#03060f', gece))
      blok(ctx, 0, bandTop, GENISLIK, bandH * 0.45, renkKaristir('#1a6690', '#0d2a45', gece))
      blok(ctx, 0, bandTop + bandH * 0.45, GENISLIK, bandH * 0.55, renkKaristir('#0a3a58', '#051828', gece))

      const sazRengi = renkKaristir('#0d2440', '#050d1c', gece)
      const parallaxX = (kameraX || 0) * 0.15 // Sazlıklar biraz daha yavaş kayar (derinlik hissi)

      SAZLAR.forEach((r) => {
        const xPozisyon = ((r.x - parallaxX) % GENISLIK + GENISLIK) % GENISLIK
        blok(ctx, xPozisyon, bandTop - r.yukseklik, PX, r.yukseklik, sazRengi)
        blok(ctx, xPozisyon + PX * 2, bandTop - r.yukseklik * 0.6, PX, r.yukseklik * 0.6, sazRengi)
      })

      if (gece > 0.15) {
        const yildizAlfa = (gece - 0.15) * 0.7
        ctx.fillStyle = `rgba(227,226,231,${yildizAlfa})`
        SAZLAR.forEach((r, i) => {
          blok(ctx, (r.x * 1.7) % GENISLIK, 8 + (i * 13) % (bandTop - 16), PX, PX, `rgba(227,226,231,${yildizAlfa})`)
        })
      }

      // Suyun üzerindeki parıltılar da dünyayla birlikte akmalı
      const nabiz = (Math.sin(Date.now() / 700) + 1) / 2
      const suParallax = (kameraX || 0) * 0.5
      for (let ry = bandTop + PX * 3; ry < YUKSEKLIK; ry += PX * 5) {
        for (let base = PX * 2; base < GENISLIK; base += PX * 9) {
          const wX = ((base - suParallax) % GENISLIK + GENISLIK) % GENISLIK
          blok(ctx, wX, ry, PX * 2, PX, `rgba(255,255,255,${0.05 + nabiz * 0.08})`)
        }
      }
    }

    function kiyiCiz(startX, genislik, s) {
      blok(ctx, startX, bandTop, genislik, bandH * 0.3, '#4d7c0f')
      blok(ctx, startX, bandTop + bandH * 0.3, genislik, bandH * 0.7, '#6b4a2f')
      const tomurcuklar = s?.kiyiCimTomurcuklari || []
      const cakillar = s?.kiyiCakillar || []
      tomurcuklar.forEach((c) => {
        if (c.dx > genislik) return
        blok(ctx, startX + c.dx, bandTop - c.yukseklik + bandH * 0.1, PX, c.yukseklik, '#7fb92f')
      })
      cakillar.forEach((c) => {
        if (c.dx > genislik) return
        blok(ctx, startX + c.dx, bandTop + bandH * 0.4 + c.dy * bandH * 0.5, c.boyut, c.boyut, '#4a3620')
      })
    }

    function yaprakCiz(cx, gorselAdi) {
      const img = resimlerRef.current?.[gorselAdi || 'yaprak']
      const oran = PAD_ORANLARI[gorselAdi] || LILY_ORAN
      const w = Math.min(PAD_GORUNUR_GENISLIK, bandH * 2)
      const h = Math.min(w / oran, bandH)
      const cy = bandTop + bandH / 2
      const dx = cx - w / 2
      const dy = cy - h / 2

      if (hazirMi(img)) {
        try {
          ctx.drawImage(img, dx, dy, w, h)
          return
        } catch {}
      }
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    function timsahCiz(cx) {
      const img = resimlerRef.current?.timsah
      const w = Math.min(PAD_GORUNUR_GENISLIK * 1.15, bandH * 2.2)
      const h = Math.min(w / TIMSAH_ORAN, bandH)
      const cy = bandTop + bandH / 2
      const dx = cx - w / 2
      const dy = cy - h / 2
      if (hazirMi(img)) {
        try {
          ctx.drawImage(img, dx, dy, w, h)
          return
        } catch {}
      }
      ctx.fillStyle = '#166534'
      ctx.beginPath()
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    function kurbagaCiz(destX, destY, germeOrani) {
      const img = resimlerRef.current?.kurbaga
      const ustDestH = FROG_H / 2
      const altDestH = FROG_H / 2 + germeOrani * (FROG_H * 0.55)
      if (hazirMi(img)) {
        try {
          const sw = img.naturalWidth
          const sh = img.naturalHeight
          const ustSrcH = sh / 2
          ctx.drawImage(img, 0, 0, sw, ustSrcH, destX, destY, FROG_W, ustDestH)
          ctx.drawImage(img, 0, ustSrcH, sw, sh - ustSrcH, destX, destY + ustDestH, FROG_W, altDestH)
          return
        } catch {}
      }
      ctx.fillStyle = '#84cc16'
      ctx.fillRect(destX, destY, FROG_W, ustDestH)
      ctx.fillStyle = '#4d7c0f'
      ctx.fillRect(destX + 4, destY + ustDestH, FROG_W - 8, altDestH)
    }

    function ciz() {
      const s = stateRef.current

      // YENİ: Sürekli Akan Nehir Mekaniği
      if (asama === 'oynuyor' && s && !s.bitti && s.olumAsamasi === 'yok') {
        // Göl hızını skora bağla (Skor 0 iken 1.2, sonra yavaşça artar)
        s.kameraX += 1.0 + (s.skor * 0.08)
      }

      // Kurbağanın Dünya Üzerindeki X Pozisyonunu Hesapla
      let kurbagaDunyaX = s ? s.mevcutIndex * STEP_GENISLIK : 0
      const hopDevamEdiyor = s && s.hopDurumu === 'devam'

      if (hopDevamEdiyor) {
        const gecen = performance.now() - s.hopBaslangicZamani
        s.hopIlerleme = Math.min(1, gecen / s.hopSuresi)

        // İvme eğrisi
        const kolay = 1 - Math.pow(1 - s.hopIlerleme, 2)
        kurbagaDunyaX += s.hopMiktari * STEP_GENISLIK * kolay

        if (s.hopIlerleme >= 1) {
          s.mevcutIndex += s.hopMiktari
          kareleriGarantiEt(s)
          
          const kare = s.kareler[s.mevcutIndex]
          const tehlikeliMi = kare.tip === 'su' || kare.tip === 'timsah'

          if (tehlikeliMi && !s.kalkanVar) {
            s.olumAsamasi = 'batiyor'
            s.batmaBaslangic = performance.now()
            s.batisSkoru = s.skor
          } else {
            if (tehlikeliMi && s.kalkanVar) {
              s.kalkanVar = false
              setKalkanAktif(false)
              mesajGoster('🧉 Mate çayı kalkanı seni kurtardı!')
              s.mevcutIndex += 1
              kareleriGarantiEt(s)
            }
            if (s.kareler[s.mevcutIndex].tip === 'pad') {
              s.sicramaBaslangic = performance.now()
              s.skor += 1
              setSkor(s.skor)

              if (s.skor >= KALKAN_SKORU && !s.kalkanKazanildiMi) {
                s.kalkanKazanildiMi = true
                s.kalkanVar = true
                setKalkanAktif(true)
                mesajGoster('🧉 Mate çayı kalkanı kazandın!')
              }
            }
          }
          s.hopDurumu = 'yok'
          s.hopIlerleme = 0
        }
      }

      // Kurbağanın Ekrandaki (Kameraya Göre) Pozisyonunu Hesapla
      let kurbaEkranMerkezX = merkezSabit + kurbagaDunyaX - (s?.kameraX || 0)

      // Oyuncu çok hızlı oynarsa kamera ona yetişmek için kendini ileri iter (Sağdan çıkmasını önleriz)
      const idealSagSinir = GENISLIK - 150
      if (kurbaEkranMerkezX > idealSagSinir && asama === 'oynuyor' && s) {
        const fark = kurbaEkranMerkezX - idealSagSinir
        s.kameraX += fark
        kurbaEkranMerkezX = idealSagSinir
      }

      // Oyuncu geride kalırsa oyun biter
      if (kurbaEkranMerkezX < -30 && asama === 'oynuyor' && s && s.olumAsamasi === 'yok') {
        s.olumAsamasi = 'suruklendi'
        s.batmaBaslangic = performance.now()
        s.batisSkoru = s.skor
      }

      // Ölüm Animasyonu Zamanlayıcıları
      if (asama === 'oynuyor' && s && !s.bitti && (s.olumAsamasi === 'batiyor' || s.olumAsamasi === 'suruklendi')) {
        if (performance.now() - s.batmaBaslangic > 550) {
          oyunBitti(s.batisSkoru)
        }
      }

      // --------- ÇİZİM BÖLÜMÜ ---------
      ctx.clearRect(0, 0, GENISLIK, YUKSEKLIK)
      golArkaPlaniCiz(s?.skor, s?.kameraX)

      if (asama === 'oynuyor' && s && !s.bitti) {
        
        // Ekranda Sadece Görünebilir Kareleri Çiz
        const cizimBaslangic = Math.max(0, s.mevcutIndex - 4)
        const cizimBitis = s.mevcutIndex + 7

        for (let i = cizimBaslangic; i <= cizimBitis; i++) {
          const kare = s.kareler[i]
          if (!kare) continue
          
          const dunyaX = i * STEP_GENISLIK
          const ekranX = merkezSabit + dunyaX - s.kameraX
          
          // Ekranda hiç yoksa pas geç (Optimizasyon)
          if (ekranX < -STEP_GENISLIK || ekranX > GENISLIK + STEP_GENISLIK) continue

          if (kare.tip === 'kiyi') {
             kiyiCiz(ekranX - STEP_GENISLIK / 2, STEP_GENISLIK, s)
          } else if (kare.tip === 'pad') {
             yaprakCiz(ekranX, kare.gorsel)
          } else if (kare.tip === 'timsah') {
             timsahCiz(ekranX)
          } else if (kare.tip === 'su' && i > s.mevcutIndex && i - s.mevcutIndex <= 2) {
             const nabiz = (Math.sin(Date.now() / 260) + 1) / 2
             blok(ctx, ekranX - STEP_GENISLIK / 2, bandTop, STEP_GENISLIK, bandH, `rgba(239,68,68,${0.06 + nabiz * 0.09})`)
          }
        }

        const germeOrani = hopDevamEdiyor && s.hopIlerleme < 0.5 ? (0.5 - s.hopIlerleme) * 2 : 0
        let frogY = hopDevamEdiyor ? YER_Y - HOP_YUKSEKLIK * 4 * s.hopIlerleme * (1 - s.hopIlerleme) : YER_Y

        // Suda Boğulma ve Sürüklenme Çizimleri
        if (s.olumAsamasi === 'batiyor' || s.olumAsamasi === 'suruklendi') {
          const t = Math.min(1, (performance.now() - s.batmaBaslangic) / 550)
          frogY = YER_Y + t * 34
          ctx.strokeStyle = `rgba(239,68,68,${0.55 * (1 - t)})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(kurbaEkranMerkezX, bandTop + bandH * 0.65, 10 + t * 44, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Suya Konma Dalga Efekti
        if (s.sicramaBaslangic && s.olumAsamasi === 'yok') {
          const t = (performance.now() - s.sicramaBaslangic) / 450
          if (t >= 1) {
            s.sicramaBaslangic = null
          } else {
            ctx.strokeStyle = `rgba(255,255,255,${0.55 * (1 - t)})`
            ctx.lineWidth = 2
            ;[0, 0.18].forEach((gecikme) => {
              const yerelT = t - gecikme
              if (yerelT <= 0) return
              ctx.beginPath()
              ctx.arc(kurbaEkranMerkezX, bandTop + bandH * 0.78, yerelT * 28, 0, Math.PI * 2)
              ctx.stroke()
            })
          }
        }

        kurbagaCiz(kurbaEkranMerkezX - FROG_W / 2, frogY, germeOrani)
      } else {
        kiyiCiz(0, 220, null)
        yaprakCiz(merkezSabit + 190)
        kurbagaCiz(KURBAGA_SOL, YER_Y, 0)
      }

      animationId = requestAnimationFrame(ciz)
    }

    animationId = requestAnimationFrame(ciz)
    return () => cancelAnimationFrame(animationId)
  }, [asama])

  useEffect(() => {
    function yaziYaziliyorMu(e) {
      const etiket = e.target?.tagName
      return etiket === 'INPUT' || etiket === 'TEXTAREA' || e.target?.isContentEditable
    }
    function tusBas(e) {
      if (e.repeat || yaziYaziliyorMu(e)) return
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        basisBaslat()
      }
    }
    function tusBirak(e) {
      if (yaziYaziliyorMu(e)) return
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        basisBitir()
      }
    }
    window.addEventListener('keydown', tusBas)
    window.addEventListener('keyup', tusBirak)
    return () => {
      window.removeEventListener('keydown', tusBas)
      window.removeEventListener('keyup', tusBirak)
    }
  })

  const isimGecerli = isim.trim().length >= 2

  return (
    <section id="oyun" className="max-w-5xl mx-auto px-6 py-24 relative z-10">
      <p className="font-mono text-xs text-electric-blue mb-3">• MİNİ OYUN</p>
      <h2 className="font-display font-extrabold text-2xl md:text-3xl mb-4 text-on-surface">
        Zıplayan <span className="text-electric-blue">Kurbağa</span>
      </h2>
      <p className="font-body text-sm mb-8 text-on-surface-variant">
        Dünya sürekli sağdan sola akıyor, yavaş kalırsan ekranın gerisinde sürüklenirsin! Suyun ya da timsahın üstünden atlamak için <strong>basılı tut</strong> ya da <strong>çift dokun/tıkla</strong> (ikisi de çift zıplama yapar). Düze inmek için kısa (tek) dokun. <strong>Çok hızlı olmalısın</strong>, çünkü skorun arttıkça gölün akıntısı şiddetlenecek!
      </p>

      <div className="border-2 border-electric-blue bg-deep-navy/80 p-4">
        <div className="flex justify-between items-center font-mono text-xs text-electric-blue mb-3">
          <span>SKOR {skor}</span>
          {kalkanAktif && (
            <span className="flex items-center gap-1 text-success-cyan">
              <img src="/mate_tea.png" alt="" className="w-5 h-5 object-contain" />
              KALKAN HAZIR
            </span>
          )}
          <span>EN İYİ {enIyi}</span>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={GENISLIK}
            height={YUKSEKLIK}
            onPointerDown={() => asama === 'oynuyor' && basisBaslat()}
            onPointerUp={() => asama === 'oynuyor' && basisBitir()}
            onPointerLeave={() => asama === 'oynuyor' && basisBitir()}
            onPointerCancel={() => asama === 'oynuyor' && basisBitir()}
            className="w-full border border-electric-blue touch-none"
            style={{ imageRendering: 'pixelated' }}
          />

          {kalkanMesaj && asama === 'oynuyor' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[11px] bg-deep-navy/90 border border-success-cyan text-success-cyan px-3 py-1">
              {kalkanMesaj}
            </div>
          )}

          {asama === 'isimGir' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-deep-navy/90 px-6">
              <p className="font-mono text-xs text-on-surface-variant text-center">
                Liderlik tablosunda görünmek için ismini yaz
              </p>
              <input
                value={isim}
                onChange={(e) => setIsim(e.target.value)}
                maxLength={24}
                placeholder="Adın..."
                className="w-full max-w-xs font-mono text-sm text-center px-3 py-3 bg-deep-navy/60 border border-electric-blue/50 focus:border-electric-blue text-on-surface"
              />
              <button
                onClick={oyunuBaslat}
                disabled={!isimGecerli}
                className="font-mono text-xs px-6 py-3 border border-electric-blue bg-electric-blue text-deep-navy hover:brightness-110 transition-all disabled:opacity-40"
              >
                ► OYNA
              </button>
            </div>
          )}

          {asama === 'bitti' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-deep-navy/90 px-6 py-6 overflow-y-auto">
              <p className="font-display font-extrabold text-xl text-error-red">YANDIN! 🔥</p>
              <p className="font-mono text-xs text-on-surface-variant">Skorun: {skor}</p>

              {!supabaseYapilandirildi && (
                <p className="font-mono text-[11px] text-on-surface-variant text-center max-w-xs">
                  Supabase bağlanınca skorun kaydedilecek ve liderlik tablosu burada görünecek.
                </p>
              )}
              {supabaseYapilandirildi && yukleniyorLiderlik && (
                <p className="font-mono text-xs text-on-surface-variant">Liderlik tablosu yükleniyor...</p>
              )}
              {supabaseYapilandirildi && liderlik && (
                <div className="w-full max-w-sm space-y-1">
                  <p className="font-mono text-[10px] text-electric-blue uppercase tracking-widest mb-1 text-center">
                    İlk 10
                  </p>
                  {liderlik.top10.map((k, i) => (
                    <div key={i} className="flex justify-between font-mono text-xs px-2 py-1 border-b border-electric-blue/20 text-on-surface">
                      <span>{i + 1}. {k.name}</span>
                      <span className="text-electric-blue">{k.score}</span>
                    </div>
                  ))}
                  <p className="font-mono text-xs text-success-cyan text-center pt-2">
                    Sen {liderlik.toplam} kişi arasında {liderlik.siram}. sıradasın
                  </p>
                </div>
              )}

              <button
                onClick={oyunuBaslat}
                className="font-mono text-xs px-6 py-3 border border-electric-blue bg-electric-blue text-deep-navy hover:brightness-110 transition-all mt-2"
              >
                ► TEKRAR OYNA
              </button>
            </div>
          )}
        </div>

        <p className="font-mono text-xs text-on-surface-variant mt-3 text-center">
          SPACE / ↑ / dokun = tek zıpla · basılı tut / çift dokun = çift zıpla
        </p>
      </div>
    </section>
  )
}