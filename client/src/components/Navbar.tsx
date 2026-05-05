import React, { useState } from "react"
import logo from "../assets/UDAYAM INTERNATION LOGO - Higher Pixel .jpg.jpeg"
export type Page =
  | "home"
  | "about"
  | "tourism"
  | "medical"
  | "travel"
  | "trade"
  | "education"
  | "recruitment"
  | "contact"

interface NavbarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "About Us", page: "about" },
  { label: "Tourism", page: "tourism" },
  { label: "Medical Tourism", page: "medical" },
  { label: "Travel Services", page: "travel" },
  { label: "Trade", page: "trade" },
  { label: "Foreign Education", page: "education" },
  { label: "Recruitment", page: "recruitment" },
  { label: "Contact Us", page: "contact" },
]

const promoItems = [
  "Flat 20% OFF on International Packages",
  "Free Visa Assistance on Select Tours",
  "Medical Tourism — JCI Accredited Hospitals",
  "Group Discounts: 5+ Travellers Save More",
  "EMI Starting ₹3,999/month — No Cost",
]

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const doubled = [...promoItems, ...promoItems]

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap"
        rel="stylesheet"
      />

      {/* ── PROMO TICKER ── */}
      <div
        className="overflow-hidden py-2"
        style={{
          background: "linear-gradient(90deg, #0F1B47, #1B2B6B, #0F1B47)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          className="inline-flex whitespace-nowrap"
          style={{ animation: "ticker 32s linear infinite" }}
        >
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-10 text-[12.5px] font-medium"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              <span className="text-base" style={{ color: "#43A047" }}>
                ✦
              </span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-[999] flex h-[72px] items-center justify-between bg-white px-10"
        style={{
          borderBottom: "1px solid #DDE3F0",
          boxShadow: "0 2px 8px rgba(27,43,107,0.09)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Logo */}
        <div
          className="flex h-[54px] cursor-pointer items-center"
          onClick={() => onNavigate("home")}
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
          <span
            className="text-[20px] font-bold text-[#0D1B3E]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Udayam <span style={{ color: "#1B2B6B" }}>International</span>
          </span>
        </div>

        {/* Desktop links */}
        <ul className="hidden list-none items-center gap-0.5 xl:flex">
          {navItems.map(({ label, page }) => (
            <li key={page}>
              <button
                onClick={() => onNavigate(page)}
                className="rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all duration-200"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  background: currentPage === page ? "#E8ECFA" : "transparent",
                  color: currentPage === page ? "#1B2B6B" : "#2D3A5A",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "#E8ECFA"
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "#1B2B6B"
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
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

        {/* Right actions */}
        <div className="hidden items-center gap-2.5 xl:flex">
          {/* <button
            className="rounded-full px-[18px] py-2 text-[13px] font-semibold transition-all duration-200"
            style={{
              border: "1.5px solid #C5CEDF",
              color: "#2D3A5A",
              background: "none",
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate("contact")}
            className="cursor-pointer rounded-full border-none px-[22px] py-[9px] text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #1B2B6B, #1565C0)",
              boxShadow: "0 4px 14px rgba(27,43,107,0.3)",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Get a Quote ↗
          </button> */}
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

      {/* Mobile menu */}
      <div
        className="fixed right-0 left-0 z-[998] overflow-hidden bg-white transition-all duration-300 xl:hidden"
        style={{
          top: 108,
          maxHeight: menuOpen ? 600 : 0,
          opacity: menuOpen ? 1 : 0,
          borderBottom: "1px solid #DDE3F0",
          boxShadow: "0 6px 24px rgba(27,43,107,0.11)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <ul className="flex list-none flex-col gap-1 px-7 py-3">
          {navItems.map(({ label, page }) => (
            <li key={page}>
              <button
                onClick={() => {
                  onNavigate(page)
                  setMenuOpen(false)
                }}
                className="w-full rounded-lg px-3 py-3 text-left text-[13px] font-medium transition-all duration-200"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  borderBottom: "1px solid #DDE3F0",
                  background: currentPage === page ? "#E8ECFA" : "transparent",
                  color: currentPage === page ? "#1B2B6B" : "#2D3A5A",
                }}
              >
                {label}
              </button>
            </li>
          ))}
          <li className="flex flex-col gap-2 pt-3 pb-2">
            <button
              className="w-full rounded-full py-3 text-[13px] font-semibold"
              style={{
                border: "1.5px solid #C5CEDF",
                color: "#2D3A5A",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onNavigate("contact")
                setMenuOpen(false)
              }}
              className="w-full rounded-full py-3 text-[13px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #1B2B6B, #1565C0)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Get a Quote ↗
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
