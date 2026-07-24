import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home/Home"
import AboutUs from "./components/Aboutus"
import Tourism from "./components/Tourism"
import MedicalTourism from "./components/Medical"
import Footer from "./components/Footer"
import NewsLetter from "./components/NewsLetter"
import TravelService from "./components/TravelSevice"
import Trade from "./components/Trade"
import Education from "./components/Education"
import Recruitment from "./components/Recruiment"
import Contact from "./components/Contact"
import IntroScreen from "./components/Introscreen"
import Profile from "./components/Profile"
import MyBookings from "./components/MyBookings"
import { AuthProvider } from "./lib/useAuth"
import { LoginModalProvider } from "./lib/useLoginModal"
import LoginModal from "./components/LoginModal"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [pathname])

  return null
}

export function App() {
  const [showIntro, setShowIntro] = useState(true)

  const handleIntroDone = () => {
    setShowIntro(false)
  }

  return (
    <AuthProvider>
      <LoginModalProvider modal={(isOpen, onClose) => <LoginModal isOpen={isOpen} onClose={onClose} />}>
        {showIntro && <IntroScreen onComplete={handleIntroDone} />}
        <BrowserRouter>
          <ScrollToTop />
          <AppShell />
        </BrowserRouter>
      </LoginModalProvider>
    </AuthProvider>
  )
}

function AppShell() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/tourism" element={<Tourism />} />
          <Route path="/medical" element={<MedicalTourism />} />
          <Route path="/travel" element={<TravelService />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/education" element={<Education />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <NewsLetter />
      <Footer />
      <a
        href="https://wa.me/917299771111"
        target="_blank"
        rel="noreferrer"
        className="group fixed right-[26px] bottom-[26px] z-[998] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
        style={{
          background: "#25D366",
          boxShadow: "0 4px 20px rgba(37,211,102,0.38)",
          animation: "waPulse 2.5s infinite",
        }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span
          className="pointer-events-none absolute right-16 bottom-1/2 translate-y-1/2 rounded-lg px-3.5 py-1.5 text-[12px] whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: "#0D1B3E" }}
        >
          Chat on WhatsApp
        </span>
      </a>
    </>
  )
}

export default App
