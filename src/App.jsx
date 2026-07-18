import { useEffect, useState } from 'react'
import { supabase, supabaseYapilandirildi } from './supabaseClient'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Hakkinda from './components/Hakkinda'
import Muzik from './components/Muzik'
import SarkiQuiz from './components/SarkiQuiz'
import MiniOyun from './components/MiniOyun'
import AyberkGiydirme from './components/AyberkGiydirme'
import Mektuplar from './components/Mektuplar'
import MektupYaz from './components/MektupYaz'
import Footer from './components/Footer'

export default function App() {
  const [mektupSayisi, setMektupSayisi] = useState(0)

  async function sayiyiGetir() {
    if (!supabaseYapilandirildi) return
    try {
      const { data, error } = await supabase.rpc('letter_count')
      if (!error && typeof data === 'number') setMektupSayisi(data)
    } catch {
      // Supabase henüz erişilebilir değil — sayaç 0 olarak kalır, önizleme etkilenmez.
    }
  }

  useEffect(() => {
    sayiyiGetir()
  }, [])

  return (
    <div className="min-h-screen bg-deep-navy">
      <Nav />
      <Hero />
      <Hakkinda letterCount={mektupSayisi} />
      <Muzik />
      <SarkiQuiz />
      <MiniOyun />
      <AyberkGiydirme />
      <Mektuplar letterCount={mektupSayisi} />
      <MektupYaz onMektupGonderildi={sayiyiGetir} />
      <Footer />
    </div>
  )
}