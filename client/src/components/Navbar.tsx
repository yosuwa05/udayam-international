import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import logo from "../assets/home/HomeLogo.jpeg"
import { navItems, pageToPath, type Page } from "@/lib/navData"

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (page: Page) => location.pathname === pageToPath[page]

  const go = (page: Page) => {
    navigate(pageToPath[page])
    window.scrollTo({ top: 0, behavior: "smooth" })
    setMenuOpen(false)
  }

  return (
    <>
      <div
        className="hidden flex-col items-center justify-between gap-3 px-4 py-2 md:flex md:flex-row md:px-8 xl:px-10"
        style={{
          background: "linear-gradient(90deg, #0F1B47, #1B2B6B, #0F1B47)",
        }}
      >
        <div className="flex items-center gap-2">
          {["instagram", "facebook", "x", "tiktok"].map((item) => (
            <button
              key={item}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-white transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {item === "instagram" && "◎"}
              {item === "facebook" && "f"}
              {item === "x" && "𝕏"}
              {item === "tiktok" && "♪"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-inter text-[13px] text-white md:justify-end">
          <div className="flex items-center gap-2 opacity-90">
            <span>📞</span>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 opacity-90">
            <span>✉</span>
            <span>info@example.com</span>
          </div>
          <div className="hidden items-center gap-2 opacity-90 lg:flex">
            <span>📍</span>
            <span>123 Main Street, Suite 62704</span>
          </div>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-[999] flex h-[72px] items-center justify-between bg-white px-10"
        style={{
          borderBottom: "1px solid #DDE3F0",
          boxShadow: "0 2px 8px rgba(27,43,107,0.09)",
        }}
      >
        {/* Logo */}
        <div
          className="flex h-[54px] cursor-pointer items-center"
          onClick={() => go("home")}
        >
          <img
            src={logo}
            alt="Udayam International"
            className="h-[54px] w-auto object-contain"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = "none"
              const sib = e.currentTarget.nextSibling as HTMLElement
              if (sib) sib.style.display = "block"
            }}
          />
          <span className="text-[20px] font-bold text-[#0D1B3E]">
            Udayam <span style={{ color: "#1B2B6B" }}>International</span>
          </span>
        </div>

        {/* Desktop links */}
        <ul className="hidden list-none items-center gap-0.5 xl:flex">
          {navItems.map(({ label, page }) => (
            <li key={page}>
              <button
                onClick={() => go(page)}
                className="cursor-pointer rounded-lg px-3 py-[7px] font-inter text-[13px] font-medium transition-all duration-200"
                style={{
                  background: isActive(page) ? "#E8ECFA" : "transparent",
                  color: isActive(page) ? "#1B2B6B" : "#2D3A5A",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(page)) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "#E8ECFA"
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "#1B2B6B"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(page)) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "transparent"
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "#2D3A5A"
                  }
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Contact Us button */}
        <div className="hidden items-center gap-2.5 xl:flex">
          <button
            onClick={() => go("contact")}
            className="cursor-pointer rounded-full border-none px-[22px] py-[9px] font-inter text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #388E3C, #43A047)",
              boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
            }}
          >
            Contact Us ↗
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="flex cursor-pointer flex-col gap-[5px] border-none bg-transparent p-2 xl:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-[2px] w-6 bg-[#0D1B3E] transition-all duration-300"
              style={{
                transform:
                  i === 0 && menuOpen
                    ? "rotate(45deg) translateY(7px)"
                    : i === 2 && menuOpen
                      ? "rotate(-45deg) translateY(-7px)"
                      : "none",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        className="fixed right-0 left-0 z-[998] overflow-hidden bg-white transition-all duration-300 xl:hidden"
        style={{
          maxHeight: menuOpen ? 600 : 0,
          opacity: menuOpen ? 1 : 0,
          borderBottom: "1px solid #DDE3F0",
          boxShadow: "0 6px 24px rgba(27,43,107,0.11)",
        }}
      >
        <ul className="flex list-none flex-col gap-1 px-7 py-3">
          {navItems.map(({ label, page }) => (
            <li key={page}>
              <button
                onClick={() => go(page)}
                className="w-full rounded-lg px-3 py-3 text-left font-inter text-[13px] font-medium transition-all duration-200"
                style={{
                  borderBottom: "1px solid #DDE3F0",
                  background: isActive(page) ? "#E8ECFA" : "transparent",
                  color: isActive(page) ? "#1B2B6B" : "#2D3A5A",
                }}
              >
                {label}
              </button>
            </li>
          ))}
          <li className="flex flex-col gap-2 pt-3 pb-2">
            <button
              onClick={() => go("contact")}
              className="w-full rounded-full py-3 font-inter text-[13px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #388E3C, #43A047)",
                boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
              }}
            >
              Contact Us ↗
            </button>
          </li>
        </ul>
      </div>

      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </>
  )
}

export default Navbar
