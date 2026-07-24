import React, { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Homelogo from "../assets/home/HomeLogo.jpeg"
import TourismLogo from "../assets/UVHolidays.JPG.jpeg"
import MedicalLogo from "../assets/MedicalLogo.jpeg"
import TradeLogo from "../assets/TradeLogo.jpeg"
import RecruitmentLogo from "../assets/RecruitmentLogo.jpeg"
import TravelLogo from "../assets/TravelLogo.jpeg"
import EducationLogo from "../assets/UVPathways.JPG.jpeg"

import { navItems, pageToPath, type Page } from "@/lib/navData"
import callIcon from "../assets/Call.svg"
import mailIcon from "../assets/Email.svg"
import locationIcon from "../assets/Location.svg"
import { ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/useAuth"
import { useLoginModal } from "@/lib/useLoginModal"
import LogoutModal from "./LogoutModal"

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user, logout } = useAuth()
  const { openLogin } = useLoginModal()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isActive = (page: Page) => location.pathname === pageToPath[page]

  const go = (page: Page) => {
    setMenuOpen(false)

    if (page === "contact") {
      navigate("/contact#contact-section")
      return
    }
    navigate(pageToPath[page])

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const pageLogos: Partial<Record<Page, string>> = {
    home: Homelogo,
    about: Homelogo,
    tourism: TourismLogo,
    medical: MedicalLogo,
    trade: TradeLogo,
    travel: TravelLogo,
    recruitment: RecruitmentLogo,
    education: EducationLogo,
  }

  const currentPage =
    (Object.entries(pageToPath).find(
      ([_, path]) => path === location.pathname
    )?.[0] as Page) || "home"

  const currentLogo = pageLogos[currentPage] || Homelogo

  return (
    <>
      <div
        className="hidden flex-col items-center justify-between gap-3 px-4 py-2 md:flex md:flex-row md:px-10"
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
            <span>+91 72997 71111</span>
          </div>
          <div className="flex items-center gap-2 opacity-90">
            <img src={mailIcon} />
            <span>info@udayaminternational.com</span>
          </div>
          <div className="hidden items-center gap-2 opacity-90 lg:flex">
            <img src={locationIcon} />
            <span>Kaniyaanvilai, Kanyakumari, India</span>
          </div>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-[999] flex h-[72px] items-center justify-between bg-white px-1 md:px-8"
        style={{
          borderBottom: "1px solid #DDE3F0",
          boxShadow: "0 2px 8px rgba(27,43,107,0.09)",
        }}
      >
        <div
          className="flex h-[54px] cursor-pointer items-center gap-2"
          onClick={() => go("home")}
        >
          <img
            src={currentLogo}
            alt="Udayam International"
            className={` ${currentLogo === Homelogo ? "h-[35px]" : "h-[60px] md:h-[70px]"} w-auto object-contain`}
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = "none"
              const sib = e.currentTarget.nextSibling as HTMLElement
              if (sib) sib.style.display = "block"
            }}
          />
          {currentLogo === Homelogo && (
            <span className="text-[20px] font-bold text-[#0D1B3E]">
              Udayam <span style={{ color: "#1B2B6B" }}>International</span>
            </span>
          )}
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

        {/* Desktop right: Contact Us + Auth ─────────────────────────────── */}
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

          {/* Auth button */}
          {user ? (
            /* ── Logged-in avatar + dropdown ── */
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={user.fullName}
                style={{
                  width: 40, height: 40,
                  borderRadius: "50%",
                  border: "2px solid #1B2B6B",
                  cursor: "pointer",
                  overflow: "hidden",
                  background: user.profileImage ? "transparent" : "linear-gradient(135deg, #0F1B47, #1B2B6B)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "0.95rem",
                  fontFamily: "'Inter', sans-serif",
                  transition: "box-shadow 0.2s",
                  boxShadow: dropdownOpen ? "0 0 0 3px rgba(27,43,107,0.25)" : "none",
                }}
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  (user.fullName?.[0] || "U").toUpperCase()
                )}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  minWidth: 220,
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 12px 40px rgba(13,27,62,0.18), 0 2px 8px rgba(13,27,62,0.08)",
                  border: "1px solid #E8ECFA",
                  overflow: "hidden",
                  zIndex: 1000,
                  animation: "dropIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                }}>
                  {/* User info */}
                  <div style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid #E8ECFA",
                    background: "linear-gradient(135deg, #F0F4FF, #fff)",
                  }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: "#0F1B47", fontFamily: "'Inter', sans-serif" }}>
                      {user.fullName}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>
                      {user.email || (user.mobile ? `+91 ${user.mobile}` : "")}
                    </p>
                  </div>
                  {/* Menu items */}
                  {[
                    { icon: "👤", label: "My Profile", path: "/profile" },
                    { icon: "📋", label: "My Bookings", path: "/my-bookings" },
                  ].map(({ icon, label, path }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setDropdownOpen(false)
                        navigate(path)
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F0F4FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span>{icon}</span> {label}
                    </button>
                  ))}
                  <div style={{ height: 1, background: "#E8ECFA", margin: "4px 0" }} />
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      setLogoutModalOpen(true)
                    }}
                    style={{ ...dropdownItemStyle, color: "#DC2626" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Login button ── */
            <button
              onClick={openLogin}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 18px",
                background: "linear-gradient(135deg, #0F1B47, #1B2B6B)",
                color: "#fff", border: "none", borderRadius: 999,
                fontSize: "0.82rem", fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(27,43,107,0.28)",
                transition: "opacity 0.2s, transform 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Login
            </button>
          )}
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
            {user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 4px 4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "linear-gradient(135deg, #0F1B47, #1B2B6B)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                      flexShrink: 0, overflow: "hidden",
                    }}>
                      {user.profileImage
                        ? <img src={user.profileImage} alt={user.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (user.fullName?.[0] || "U").toUpperCase()
                      }
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.82rem", color: "#0F1B47", fontFamily: "'Inter', sans-serif" }}>{user.fullName}</p>
                      <p style={{ margin: 0, fontSize: "0.72rem", color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>
                        {user.email || (user.mobile ? `+91 ${user.mobile}` : "")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      setLogoutModalOpen(true)
                    }}
                    style={{
                      padding: "6px 14px", background: "#FEF2F2", color: "#DC2626",
                      border: "1px solid #FECACA", borderRadius: 999,
                      fontSize: "0.78rem", fontWeight: 600,
                      fontFamily: "'Inter', sans-serif", cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, pt: 4 }}>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                    style={{
                      padding: "8px 12px", background: "#E8ECFA", color: "#1B2B6B",
                      border: "none", borderRadius: 10, fontSize: "0.78rem", fontWeight: 700,
                      fontFamily: "'Inter', sans-serif", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyCenter: "center", gap: 6,
                    }}
                  >
                    <span>👤</span> My Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/my-bookings"); }}
                    style={{
                      padding: "8px 12px", background: "#E8ECFA", color: "#1B2B6B",
                      border: "none", borderRadius: 10, fontSize: "0.78rem", fontWeight: 700,
                      fontFamily: "'Inter', sans-serif", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyCenter: "center", gap: 6,
                    }}
                  >
                    <span>📋</span> My Bookings
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); openLogin(); }}
                style={{
                  width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "12px",
                  background: "linear-gradient(135deg, #0F1B47, #1B2B6B)",
                  color: "#fff", border: "none", borderRadius: 999,
                  fontSize: "0.85rem", fontWeight: 700,
                  fontFamily: "'Inter', sans-serif", cursor: "pointer",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Login / Sign Up
              </button>
            )}
          </li>
        </ul>
      </div>

      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        isLoggingOut={isLoggingOut}
        onConfirm={async () => {
          setIsLoggingOut(true)
          try {
            await logout()
            navigate("/")
          } finally {
            setIsLoggingOut(false)
            setLogoutModalOpen(false)
          }
        }}
      />
    </>
  )
}

const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "10px 18px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontFamily: "'Inter', sans-serif",
  color: "#374151",
  fontWeight: 500,
  textAlign: "left",
  transition: "background 0.15s",
}

export default Navbar
