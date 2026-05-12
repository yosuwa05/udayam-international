import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import logo from "../assets/home/HomeLogo.jpeg"
import { navItems, pageToPath, type Page } from "@/lib/navData"
import callIcon from "../assets/Call.svg"
import mailIcon from "../assets/Email.svg"
import locationIcon from "../assets/Location.svg"
import { ArrowRight } from "lucide-react"

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
          {["instagram", "facebook", "whatsapp"].map((item) => (
            <button
              key={item}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-white transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {item === "instagram" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
                    />
                    <path d="M3 16V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m17.5 6.51l.01-.011"
                    />
                  </g>
                </svg>
              )}
              {item === "facebook" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M6.5 10v4h3v7h4v-7h3l1-4h-4V8c0-.545.455-1 1-1h3V3h-3c-2.723 0-5 2.277-5 5v2z"
                  />
                </svg>
              )}
              {item === "whatsapp" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-inter text-[13px] text-white md:justify-end">
          <div className="flex items-center gap-2 opacity-90">
            <img src={callIcon} />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 opacity-90">
            <img src={mailIcon} />
            <span>info@example.com</span>
          </div>
          <div className="hidden items-center gap-2 opacity-90 lg:flex">
            <img src={locationIcon} />
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
            className="h-[45px] w-auto object-contain"
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
                className="cursor-pointer rounded-md px-3 py-[7px] font-inter text-[13px] font-medium transition-all duration-200"
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
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-none px-[22px] py-[9px] font-inter text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #388E3C, #43A047)",
              boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
            }}
          >
            Contact Us <ArrowRight size={16} />
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
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-inter text-[13px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #388E3C, #43A047)",
                boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
              }}
            >
              Contact Us <ArrowRight size={16} />
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
