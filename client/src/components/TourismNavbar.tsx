import React, { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import TourismLogo from "../assets/UVHolidays.JPG.jpeg"
import callIcon from "../assets/Call.svg"
import mailIcon from "../assets/Email.svg"
import locationIcon from "../assets/Location.svg"
import { ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/useAuth"
import { useLoginModal } from "@/lib/useLoginModal"
import LogoutModal from "./LogoutModal"

type DropdownKey = "discover" | "destinations" | "packages" | null

interface DiscoverItem {
  label: string
  hash: string
}

const discoverItems: DiscoverItem[] = [
  { label: "About Us", hash: "about-us" },
  { label: "Parent Organisation", hash: "parent-organisation" },
  // { label: "Our Journey", hash: "our-journey" },
  // { label: "Careers", hash: "careers" },
  // { label: "Gallery", hash: "gallery" },
  // { label: "Travel Blog", hash: "travel-blog" },
  // { label: "FAQs", hash: "faqs" },
]

const destinationItems = [
  { label: "Domestic", value: "domestic" as const },
  { label: "International", value: "international" as const },
]

const packageItems = [
  { label: "Standard", value: "standard" as const },
  { label: "Customised", value: "customized" as const },
]

const TourismNavbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileDiscoverOpen, setMobileDiscoverOpen] = useState(false)
  const [mobileDestOpen, setMobileDestOpen] = useState(false)
  const [mobilePackOpen, setMobilePackOpen] = useState(false)

  // Desktop dropdown state (hover & click)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)

  // Auth & user dropdown
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  const { user, logout } = useAuth()
  const { openLogin } = useLoginModal()

  // Close desktop dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false)
      }
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Smooth scroll helper accounting for fixed navbar height
  const scrollToElement = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -90 // fixed navbar offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
    }
  }

  // Handle Home navigation
  const handleHomeClick = () => {
    setMenuOpen(false)
    setOpenDropdown(null)
    if (location.pathname === "/" && !location.search && !location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    navigate("/")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle Discover navigation (About Us sub-sections)
  const handleDiscoverSectionClick = (hash: string) => {
    setMenuOpen(false)
    setOpenDropdown(null)
    if (location.pathname === "/about") {
      scrollToElement(hash)
      window.history.replaceState(null, "", `/about#${hash}`)
    } else {
      navigate(`/about#${hash}`)
    }
  }

  // Handle Destinations navigation
  const handleDestinationClick = (type: "domestic" | "international") => {
    setMenuOpen(false)
    setOpenDropdown(null)
    if (location.pathname === "/") {
      window.dispatchEvent(
        new CustomEvent("tourism_filter", {
          detail: { type: "dest", value: type, target: "destinations" },
        })
      )
      window.history.replaceState(null, "", `/?type=${type}#destinations`)
      scrollToElement("destinations")
    } else {
      navigate(`/?type=${type}#destinations`)
    }
  }

  // Handle Holiday Packages navigation
  const handlePackageClick = (bookingType: "standard" | "customized") => {
    setMenuOpen(false)
    setOpenDropdown(null)
    if (location.pathname === "/") {
      window.dispatchEvent(
        new CustomEvent("tourism_filter", {
          detail: {
            type: "package",
            value: bookingType,
            target: "holiday-packages",
          },
        })
      )
      window.history.replaceState(
        null,
        "",
        `/?bookingType=${bookingType}#holiday-packages`
      )
      scrollToElement("holiday-packages")
    } else {
      navigate(`/?bookingType=${bookingType}#holiday-packages`)
    }
  }

  // Handle Traveller Stories navigation
  const handleStoriesClick = () => {
    setMenuOpen(false)
    setOpenDropdown(null)
    if (location.pathname === "/") {
      scrollToElement("traveller-stories")
      window.history.replaceState(null, "", "/#traveller-stories")
    } else {
      navigate("/#traveller-stories")
    }
  }

  // Handle Contact Us navigation
  const handleContactClick = () => {
    setMenuOpen(false)
    setOpenDropdown(null)
    if (location.pathname === "/") {
      scrollToElement("contact-section")
      window.history.replaceState(null, "", "/#contact-section")
    } else {
      navigate("/#contact-section")
    }
  }

  // Hover handlers with debounce to prevent closing on gap
  const handleMouseEnter = (key: DropdownKey) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpenDropdown(key)
  }

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 180)
  }

  // Active state helpers
  const isHomeActive =
    location.pathname === "/" && !location.hash && !location.search
  const isDiscoverActive = location.pathname === "/about"
  const isDestinationsActive =
    location.pathname === "/" &&
    (location.search.includes("type=domestic") ||
      location.search.includes("type=international") ||
      location.hash === "#destinations")
  const isPackagesActive =
    location.pathname === "/" &&
    (location.search.includes("bookingType=standard") ||
      location.search.includes("bookingType=customized") ||
      location.hash === "#holiday-packages")
  const isStoriesActive =
    location.pathname === "/" && location.hash === "#traveller-stories"
  const isContactActive =
    location.pathname === "/" && location.hash === "#contact-section"

  return (
    <>
      {/* ── TOP BAR ── */}
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
                  <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
                    />
                    <path d="M3 16V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6.5 10v4h3v7h4v-7h3l1-4h-4V8c0-.545.455-1 1-1h3V3h-3c-2.723 0-5 2.277-5 5v2z"
                  />
                </svg>
              )}
              {item === "whatsapp" && (
                <a
                  href="https://wa.me/917299771111"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full w-full items-center justify-center text-white"
                >
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
                </a>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-inter text-[13px] text-white md:justify-end">
          <a
            href="tel:+917299771111"
            className="flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100 text-white"
          >
            <img src={callIcon} alt="Phone" />
            <span>+91 72997 71111</span>
          </a>
          <a
            href="mailto:enquiry@uvholidays.net"
            className="flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100 text-white"
          >
            <img src={mailIcon} alt="Email" />
            <span>enquiry@uvholidays.net</span>
          </a>
          <div className="hidden items-center gap-2 opacity-90 lg:flex">
            <img src={locationIcon} alt="Location" />
            <span>Kaniyaanvilai, Kanyakumari, India</span>
          </div>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav
        ref={navContainerRef}
        className="sticky top-0 z-[999] flex h-[72px] items-center justify-between bg-white px-3 md:px-8"
        style={{
          borderBottom: "1px solid #DDE3F0",
          boxShadow: "0 2px 8px rgba(27,43,107,0.09)",
        }}
      >
        {/* Tourism Brand Logo */}
        <div
          className="flex h-[54px] cursor-pointer items-center gap-2"
          onClick={handleHomeClick}
        >
          <img
            src={TourismLogo}
            alt="UV Holidays"
            className="h-[58px] w-auto object-contain md:h-[66px]"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = "none"
            }}
          />
        </div>

        {/* ── Desktop Nav Menu (7 Items: Home, Discover, Destinations, Holiday Packages, Traveller Stories, Contact Us) ── */}
        <ul className="hidden list-none items-center gap-1 xl:flex">
          {/* 1. Home */}
          <li>
            <button
              onClick={handleHomeClick}
              className="cursor-pointer rounded-lg px-3 py-2 font-inter text-[13.5px] font-semibold transition-all duration-150"
              style={{
                background: isHomeActive ? "#E8ECFA" : "transparent",
                color: isHomeActive ? "#1B2B6B" : "#2D3A5A",
              }}
              onMouseEnter={(e) => {
                if (!isHomeActive) {
                  e.currentTarget.style.background = "#F0F4FF"
                  e.currentTarget.style.color = "#1B2B6B"
                }
              }}
              onMouseLeave={(e) => {
                if (!isHomeActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#2D3A5A"
                }
              }}
            >
              Home
            </button>
          </li>

          {/* 2. Discover (Dropdown) */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter("discover")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "discover" ? null : "discover"
                )
              }
              className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 font-inter text-[13.5px] font-semibold transition-all duration-150"
              style={{
                background:
                  isDiscoverActive || openDropdown === "discover"
                    ? "#E8ECFA"
                    : "transparent",
                color:
                  isDiscoverActive || openDropdown === "discover"
                    ? "#1B2B6B"
                    : "#2D3A5A",
              }}
            >
              <span>Discover</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  openDropdown === "discover" ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Discover Dropdown Card */}
            {openDropdown === "discover" && (
              <div
                className="absolute top-[calc(100%+6px)] left-0 min-w-[210px] rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5"
                style={{
                  border: "1px solid #E8ECFA",
                  boxShadow: "0 12px 32px rgba(15,27,71,0.14)",
                  animation: "navDropIn 0.18s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {discoverItems.map((item) => (
                  <button
                    key={item.hash}
                    onClick={() => handleDiscoverSectionClick(item.hash)}
                    className="flex w-full cursor-pointer items-center rounded-xl px-3.5 py-2.5 text-left font-inter text-[13px] font-medium transition-colors hover:bg-[#F0F4FF] hover:text-[#1B2B6B]"
                    style={{
                      color:
                        location.pathname === "/about" &&
                        location.hash === `#${item.hash}`
                          ? "#1B2B6B"
                          : "#374151",
                      background:
                        location.pathname === "/about" &&
                        location.hash === `#${item.hash}`
                          ? "#E8ECFA"
                          : "transparent",
                      fontWeight:
                        location.pathname === "/about" &&
                        location.hash === `#${item.hash}`
                          ? 600
                          : 500,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </li>

          {/* 3. Destinations (Dropdown) */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter("destinations")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "destinations" ? null : "destinations"
                )
              }
              className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 font-inter text-[13.5px] font-semibold transition-all duration-150"
              style={{
                background:
                  isDestinationsActive || openDropdown === "destinations"
                    ? "#E8ECFA"
                    : "transparent",
                color:
                  isDestinationsActive || openDropdown === "destinations"
                    ? "#1B2B6B"
                    : "#2D3A5A",
              }}
            >
              <span>Destinations</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  openDropdown === "destinations" ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Destinations Dropdown Card */}
            {openDropdown === "destinations" && (
              <div
                className="absolute top-[calc(100%+6px)] left-0 min-w-[180px] rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5"
                style={{
                  border: "1px solid #E8ECFA",
                  boxShadow: "0 12px 32px rgba(15,27,71,0.14)",
                  animation: "navDropIn 0.18s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {destinationItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleDestinationClick(item.value)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-inter text-[13px] font-medium transition-colors hover:bg-[#F0F4FF] hover:text-[#1B2B6B]"
                    style={{
                      color:
                        location.search.includes(`type=${item.value}`)
                          ? "#1B2B6B"
                          : "#374151",
                      background:
                        location.search.includes(`type=${item.value}`)
                          ? "#E8ECFA"
                          : "transparent",
                      fontWeight:
                        location.search.includes(`type=${item.value}`)
                          ? 600
                          : 500,
                    }}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                ))}
              </div>
            )}
          </li>

          {/* 4. Holiday Packages (Dropdown) */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter("packages")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "packages" ? null : "packages"
                )
              }
              className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 font-inter text-[13.5px] font-semibold transition-all duration-150"
              style={{
                background:
                  isPackagesActive || openDropdown === "packages"
                    ? "#E8ECFA"
                    : "transparent",
                color:
                  isPackagesActive || openDropdown === "packages"
                    ? "#1B2B6B"
                    : "#2D3A5A",
              }}
            >
              <span>Holiday Packages</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  openDropdown === "packages" ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Packages Dropdown Card */}
            {openDropdown === "packages" && (
              <div
                className="absolute top-[calc(100%+6px)] left-0 min-w-[190px] rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5"
                style={{
                  border: "1px solid #E8ECFA",
                  boxShadow: "0 12px 32px rgba(15,27,71,0.14)",
                  animation: "navDropIn 0.18s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {packageItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handlePackageClick(item.value)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-inter text-[13px] font-medium transition-colors hover:bg-[#F0F4FF] hover:text-[#1B2B6B]"
                    style={{
                      color:
                        location.search.includes(`bookingType=${item.value}`)
                          ? "#1B2B6B"
                          : "#374151",
                      background:
                        location.search.includes(`bookingType=${item.value}`)
                          ? "#E8ECFA"
                          : "transparent",
                      fontWeight:
                        location.search.includes(`bookingType=${item.value}`)
                          ? 600
                          : 500,
                    }}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                ))}
              </div>
            )}
          </li>

          {/* 5. Traveller Stories */}
          <li>
            <button
              onClick={handleStoriesClick}
              className="cursor-pointer rounded-lg px-3 py-2 font-inter text-[13.5px] font-semibold transition-all duration-150"
              style={{
                background: isStoriesActive ? "#E8ECFA" : "transparent",
                color: isStoriesActive ? "#1B2B6B" : "#2D3A5A",
              }}
              onMouseEnter={(e) => {
                if (!isStoriesActive) {
                  e.currentTarget.style.background = "#F0F4FF"
                  e.currentTarget.style.color = "#1B2B6B"
                }
              }}
              onMouseLeave={(e) => {
                if (!isStoriesActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#2D3A5A"
                }
              }}
            >
              Traveller Stories
            </button>
          </li>

          {/* 6. Contact Us */}
          <li>
            <button
              onClick={handleContactClick}
              className="cursor-pointer rounded-lg px-3 py-2 font-inter text-[13.5px] font-semibold transition-all duration-150"
              style={{
                background: isContactActive ? "#E8ECFA" : "transparent",
                color: isContactActive ? "#1B2B6B" : "#2D3A5A",
              }}
              onMouseEnter={(e) => {
                if (!isContactActive) {
                  e.currentTarget.style.background = "#F0F4FF"
                  e.currentTarget.style.color = "#1B2B6B"
                }
              }}
              onMouseLeave={(e) => {
                if (!isContactActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#2D3A5A"
                }
              }}
            >
              Contact Us
            </button>
          </li>
        </ul>

        {/* ── Desktop Right (WhatsApp CTA + Auth) ── */}
        <div className="hidden items-center gap-3 xl:flex">
          {/* WhatsApp Direct Chat Button */}
          <a
            href="https://wa.me/917299771111"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            WhatsApp
          </a>

          {/* Auth button */}
          {user ? (
            <div ref={userDropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                title={user.fullName}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "2px solid #1B2B6B",
                  cursor: "pointer",
                  overflow: "hidden",
                  background: user.profileImage
                    ? "transparent"
                    : "linear-gradient(135deg, #0F1B47, #1B2B6B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  fontFamily: "'Inter', sans-serif",
                  transition: "box-shadow 0.2s",
                  boxShadow: userDropdownOpen
                    ? "0 0 0 3px rgba(27,43,107,0.25)"
                    : "none",
                }}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  (user.fullName?.[0] || "U").toUpperCase()
                )}
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    minWidth: 220,
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow:
                      "0 12px 40px rgba(13,27,62,0.18), 0 2px 8px rgba(13,27,62,0.08)",
                    border: "1px solid #E8ECFA",
                    overflow: "hidden",
                    zIndex: 1000,
                    animation: "navDropIn 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 18px",
                      borderBottom: "1px solid #E8ECFA",
                      background: "linear-gradient(135deg, #F0F4FF, #fff)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#0F1B47",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {user.fullName}
                    </p>
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: "0.78rem",
                        color: "#6B7280",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {user.email || (user.mobile ? `+91 ${user.mobile}` : "")}
                    </p>
                  </div>
                  {[
                    { icon: "👤", label: "My Profile", path: "/profile" },
                    { icon: "📋", label: "My Bookings", path: "/my-bookings" },
                  ].map(({ icon, label, path }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setUserDropdownOpen(false)
                        navigate(path)
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#F0F4FF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span>{icon}</span> {label}
                    </button>
                  ))}
                  <div
                    style={{
                      height: 1,
                      background: "#E8ECFA",
                      margin: "4px 0",
                    }}
                  />
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false)
                      setLogoutModalOpen(true)
                    }}
                    style={{ ...dropdownItemStyle, color: "#DC2626" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLogin}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 18px",
                background: "linear-gradient(135deg, #0F1B47, #1B2B6B)",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                fontSize: "0.82rem",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(27,43,107,0.28)",
                transition: "opacity 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-1px)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Login
            </button>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="flex cursor-pointer flex-col gap-[5px] border-none bg-transparent p-2 xl:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
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

      {/* ── MOBILE ACCORDION MENU ── */}
      <div
        className="fixed right-0 left-0 z-[998] max-h-[85vh] overflow-y-auto bg-white transition-all duration-300 xl:hidden"
        style={{
          maxHeight: menuOpen ? "85vh" : "0px",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          borderBottom: "1px solid #DDE3F0",
          boxShadow: "0 10px 30px rgba(27,43,107,0.14)",
        }}
      >
        <ul className="flex list-none flex-col gap-1 px-5 py-4">
          {/* 1. Home */}
          <li>
            <button
              onClick={handleHomeClick}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-inter text-[14px] font-semibold transition-colors"
              style={{
                background: isHomeActive ? "#E8ECFA" : "transparent",
                color: isHomeActive ? "#1B2B6B" : "#2D3A5A",
              }}
            >
              <span>Home</span>
            </button>
          </li>

          {/* 2. Discover (Accordion) */}
          <li>
            <button
              onClick={() => setMobileDiscoverOpen(!mobileDiscoverOpen)}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-inter text-[14px] font-semibold transition-colors"
              style={{
                background:
                  isDiscoverActive || mobileDiscoverOpen
                    ? "#F0F4FF"
                    : "transparent",
                color:
                  isDiscoverActive || mobileDiscoverOpen
                    ? "#1B2B6B"
                    : "#2D3A5A",
              }}
            >
              <span>Discover</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  mobileDiscoverOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileDiscoverOpen && (
              <div className="mt-1 flex flex-col gap-1 rounded-xl bg-slate-50 p-2 pl-4">
                {discoverItems.map((item) => (
                  <button
                    key={item.hash}
                    onClick={() => handleDiscoverSectionClick(item.hash)}
                    className="flex w-full items-center py-2 text-left font-inter text-[13px] text-slate-600 transition-colors hover:text-[#1B2B6B]"
                  >
                    ✦ {item.label}
                  </button>
                ))}
              </div>
            )}
          </li>

          {/* 3. Destinations (Accordion) */}
          <li>
            <button
              onClick={() => setMobileDestOpen(!mobileDestOpen)}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-inter text-[14px] font-semibold transition-colors"
              style={{
                background:
                  isDestinationsActive || mobileDestOpen
                    ? "#F0F4FF"
                    : "transparent",
                color:
                  isDestinationsActive || mobileDestOpen
                    ? "#1B2B6B"
                    : "#2D3A5A",
              }}
            >
              <span>Destinations</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  mobileDestOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileDestOpen && (
              <div className="mt-1 flex flex-col gap-1 rounded-xl bg-slate-50 p-2 pl-4">
                {destinationItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleDestinationClick(item.value)}
                    className="flex w-full items-center justify-between py-2 text-left font-inter text-[13px] text-slate-600 transition-colors hover:text-[#1B2B6B]"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                ))}
              </div>
            )}
          </li>

          {/* 4. Holiday Packages (Accordion) */}
          <li>
            <button
              onClick={() => setMobilePackOpen(!mobilePackOpen)}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-inter text-[14px] font-semibold transition-colors"
              style={{
                background:
                  isPackagesActive || mobilePackOpen
                    ? "#F0F4FF"
                    : "transparent",
                color:
                  isPackagesActive || mobilePackOpen ? "#1B2B6B" : "#2D3A5A",
              }}
            >
              <span>Holiday Packages</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  mobilePackOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobilePackOpen && (
              <div className="mt-1 flex flex-col gap-1 rounded-xl bg-slate-50 p-2 pl-4">
                {packageItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handlePackageClick(item.value)}
                    className="flex w-full items-center justify-between py-2 text-left font-inter text-[13px] text-slate-600 transition-colors hover:text-[#1B2B6B]"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                ))}
              </div>
            )}
          </li>

          {/* 5. Traveller Stories */}
          <li>
            <button
              onClick={handleStoriesClick}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-inter text-[14px] font-semibold transition-colors"
              style={{
                background: isStoriesActive ? "#E8ECFA" : "transparent",
                color: isStoriesActive ? "#1B2B6B" : "#2D3A5A",
              }}
            >
              <span>Traveller Stories</span>
            </button>
          </li>

          {/* 6. Contact Us */}
          <li>
            <button
              onClick={handleContactClick}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-inter text-[14px] font-semibold transition-colors"
              style={{
                background: isContactActive ? "#E8ECFA" : "transparent",
                color: isContactActive ? "#1B2B6B" : "#2D3A5A",
              }}
            >
              <span>Contact Us</span>
            </button>
          </li>

          {/* 7. WhatsApp Quick Access */}
          <li className="pt-2">
            <a
              href="https://wa.me/917299771111"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 font-inter text-xs font-bold text-white shadow-xs"
            >
              <span>Chat on WhatsApp (+91 72997 71111)</span>
            </a>
          </li>

          {/* 8. Auth / Login */}
          <li className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B2B6B] font-bold text-white text-xs">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.fullName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        (user.fullName?.[0] || "U").toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F1B47]">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {user.email || user.mobile}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      setLogoutModalOpen(true)
                    }}
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                  >
                    Logout
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate("/profile")
                    }}
                    className="rounded-xl bg-slate-100 py-2 text-xs font-bold text-[#1B2B6B]"
                  >
                    👤 My Profile
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate("/my-bookings")
                    }}
                    className="rounded-xl bg-slate-100 py-2 text-xs font-bold text-[#1B2B6B]"
                  >
                    📋 My Bookings
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false)
                  openLogin()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F1B47] to-[#1B2B6B] py-3 text-sm font-bold text-white shadow-md"
              >
                Login / Sign Up
              </button>
            )}
          </li>
        </ul>
      </div>

      <style>{`
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
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

export default TourismNavbar
