// Dynamic
import React, { useState, useEffect, useRef, useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { _axios } from "@/lib/axios"
import { useAuth } from "@/lib/useAuth"
import LoginModal from "./LoginModal"
import TourismBookingModal from "./TourismBookingModal"
import { toast } from "sonner"
import Carsoule from "./Carsoule"
import { CouponShowcase } from "./CouponShowcase"
import img1 from "../assets/1.png"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiBadge {
  text: string
  variant: "domestic" | "intl" | "hot" | "sale" | "new"
}

interface ApiPackage {
  _id: string
  title: string
  destination: string
  destinationRegion: string
  packageType: "DOMESTIC" | "INTERNATIONAL"
  bookingType?: "STANDARD" | "CUSTOMIZED"
  tripTypes: string[]
  description: string
  price: number
  strikePrice?: number
  discount?: string
  days: number
  nights: number
  durationCategory: string
  minPax: number
  maxPax: number
  imageUrl: string
  badges: ApiBadge[]
  inclusions: string[]
  exclusions?: string[]
  isActive: boolean
  isFeatured: boolean
  label?: string
  order?: number
  itinerary?: { day: number; title: string; description: string }[]
}

interface ApiResponse {
  status: boolean
  data: ApiPackage[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEST_FILTERS = [
  { label: "India", value: "INDIA" },
  { label: "Europe", value: "EUROPE" },
  { label: "South-East Asia", value: "SOUTH_EAST_ASIA" },
  { label: "Middle East", value: "MIDDLE_EAST" },
  { label: "Americas", value: "AMERICAS" },
  { label: "Africa", value: "AFRICA" },
  { label: "Oceania", value: "OCEANIA" },
]

const TRIP_TYPE_FILTERS = [
  { label: "Honeymoon", value: "HONEYMOON" },
  { label: "Family", value: "FAMILY" },
  { label: "Adventure", value: "ADVENTURE" },
  { label: "Solo Travel", value: "SOLO" },
  { label: "Group", value: "GROUP" },
  { label: "Pilgrimage", value: "PILGRIMAGE" },
]

const DURATION_FILTERS = [
  { label: "Any", value: "" },
  { label: "1–3 Days", value: "1-3" },
  { label: "4–7 Days", value: "4-7" },
  { label: "8–14 Days", value: "8-14" },
  { label: "15+ Days", value: "15+" },
]

const SORT_OPTIONS = [
  { label: "Most Popular", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Featured", value: "featured" },
]

export const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  domestic: { bg: "#e8f5e9", color: "#2E7D32" },
  intl: { bg: "rgba(27,43,107,0.85)", color: "#fff" },
  hot: { bg: "#E53E3E", color: "#fff" },
  sale: { bg: "#F59E0B", color: "#fff" },
  new: { bg: "#1B2B6B", color: "#fff" },
}

const PAGE_LIMIT = 6

// ─── API fetch ────────────────────────────────────────────────────────────────

interface FetchParams {
  page: number
  search: string
  packageType: string
  destinationRegions: string[]
  tripTypes: string[]
  durationCategory: string
  maxPrice: number
  sortBy: string
}

const fetchPackages = async (p: FetchParams): Promise<ApiResponse> => {
  const params: Record<string, string> = {
    page: String(p.page),
    limit: String(PAGE_LIMIT),
    isActive: "true",
    sortBy: p.sortBy,
    maxPrice: String(p.maxPrice),
  }
  if (p.search) params.search = p.search
  if (p.packageType !== "all") params.packageType = p.packageType.toUpperCase()
  if (p.destinationRegions.length)
    params.destinationRegions = p.destinationRegions.join(",")
  if (p.tripTypes.length) params.tripTypes = p.tripTypes.join(",")
  if (p.durationCategory) params.durationCategories = p.durationCategory

  const res = await _axios.get("/tourism", { params })
  return res.data
}

// ─── Mobile Sheet ─────────────────────────────────────────────────────────────

const MobileSheet: React.FC<{
  open: boolean
  onClose: () => void
  children: React.ReactNode
}> = ({ open, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 999,
          width: "min(320px,88vw)",
          background: "#fff",
          boxShadow: "4px 0 32px rgba(0,0,0,0.18)",
          overflowY: "auto",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(.25,.46,.45,.94)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid #E8E4DC",
            background: "#F7F5F0",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5a5a7a",
          }}
        >
          ×
        </button>
        {children}
      </div>
    </>
  )
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────

interface SidebarProps {
  search: string
  setSearch: (v: string) => void
  activeType: string
  setActiveType: (v: string) => void
  maxPrice: number
  setMaxPrice: (v: number) => void
  activeDur: string
  setActiveDur: (v: string) => void
  activeDestRegions: string[]
  toggleDestRegion: (v: string) => void
  activeTripTypes: string[]
  toggleTripType: (v: string) => void
  sortBy: string
  setSortBy: (v: string) => void
  onReset: () => void
  total: number
}

const SidebarContent: React.FC<SidebarProps> = ({
  search,
  setSearch,
  activeType,
  setActiveType,
  maxPrice,
  setMaxPrice,
  activeDur,
  setActiveDur,
  activeDestRegions,
  toggleDestRegion,
  activeTripTypes,
  toggleTripType,
  sortBy,
  setSortBy,
  onReset,
  total,
}) => {
  const pricePct = ((maxPrice - 5000) / (200000 - 5000)) * 100
  const fmtPrice = (v: number) => "₹" + v.toLocaleString("en-IN")
  const f = "'Inter',sans-serif"
  const lbl = (t: string) => (
    <div
      style={{
        fontFamily: f,
        fontSize: ".68rem",
        fontWeight: 700,
        color: "#9494b0",
        letterSpacing: ".14em",
        textTransform: "uppercase" as const,
        marginBottom: 14,
      }}
    >
      {t}
    </div>
  )

  return (
    <div
      style={{ padding: "48px 28px 32px", fontFamily: "'Raleway',sans-serif" }}
    >
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 36 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destinations..."
          style={{
            width: "100%",
            padding: "13px 44px 13px 18px",
            borderRadius: 12,
            border: "1.5px solid #E8E4DC",
            fontFamily: "'Raleway',sans-serif",
            fontSize: ".9rem",
            color: "#1a1a2e",
            background: "#FAF8F4",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1B2B6B")}
          onBlur={(e) => (e.target.style.borderColor = "#E8E4DC")}
        />
        <span
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9494b0",
            fontSize: ".85rem",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
      </div>

      {/* Package type toggle */}
      {lbl("Package Type")}
      <div
        style={{
          display: "flex",
          background: "#F7F5F0",
          borderRadius: 12,
          padding: 4,
          gap: 4,
          marginBottom: 32,
        }}
      >
        {(["all", "domestic", "international"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            style={{
              flex: 1,
              padding: "10px 4px",
              borderRadius: 9,
              border: "none",
              fontFamily: f,
              fontSize: ".76rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .25s",
              background: activeType === t ? "#1B2B6B" : "transparent",
              color: activeType === t ? "#fff" : "#9494b0",
              boxShadow:
                activeType === t ? "0 4px 14px rgba(27,43,107,.2)" : "none",
              letterSpacing: ".04em",
            }}
          >
            {t === "all" ? "All" : t === "domestic" ? "Domestic" : "Intl"}
          </button>
        ))}
      </div>

      {/* Destinations */}
      {lbl("Destinations")}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 32,
        }}
      >
        {DEST_FILTERS.map((d) => {
          const checked = activeDestRegions.includes(d.value)
          return (
            <label
              key={d.value}
              onClick={() => toggleDestRegion(d.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  flexShrink: 0,
                  border: `1.5px solid ${checked ? "#1B2B6B" : "#E8E4DC"}`,
                  background: checked ? "#1B2B6B" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .2s",
                }}
              >
                {checked && (
                  <span
                    style={{
                      color: "#fff",
                      fontSize: ".65rem",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: f,
                  fontSize: ".88rem",
                  color: "#5a5a7a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                {d.label}
              </span>
            </label>
          )
        })}
      </div>

      {/* Budget */}
      {lbl("Budget (₹ per person)")}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: f,
            fontSize: ".8rem",
            fontWeight: 600,
            color: "#1B2B6B",
            marginBottom: 12,
          }}
        >
          <span>₹5,000</span>
          <span>{fmtPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={5000}
          max={200000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          style={{
            width: "100%",
            height: 4,
            borderRadius: 2,
            appearance: "none" as any,
            WebkitAppearance: "none",
            outline: "none",
            cursor: "pointer",
            background: `linear-gradient(to right,#1B2B6B 0%,#1B2B6B ${pricePct}%,#E8E4DC ${pricePct}%,#E8E4DC 100%)`,
          }}
        />
      </div>

      {/* Duration */}
      {lbl("Duration")}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
      >
        {DURATION_FILTERS.map((d) => (
          <button
            key={d.value}
            onClick={() => setActiveDur(d.value)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: `1.5px solid ${activeDur === d.value ? "#1B2B6B" : "#E8E4DC"}`,
              fontFamily: f,
              fontSize: ".76rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all .2s",
              background: activeDur === d.value ? "#1B2B6B" : "#fff",
              color: activeDur === d.value ? "#fff" : "#5a5a7a",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Trip Type */}
      {lbl("Trip Type")}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 32,
        }}
      >
        {TRIP_TYPE_FILTERS.map((t) => {
          const checked = activeTripTypes.includes(t.value)
          return (
            <label
              key={t.value}
              onClick={() => toggleTripType(t.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  flexShrink: 0,
                  border: `1.5px solid ${checked ? "#1B2B6B" : "#E8E4DC"}`,
                  background: checked ? "#1B2B6B" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .2s",
                }}
              >
                {checked && (
                  <span
                    style={{
                      color: "#fff",
                      fontSize: ".65rem",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: f,
                  fontSize: ".88rem",
                  color: "#5a5a7a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                {t.label}
              </span>
            </label>
          )
        })}
      </div>

      {/* Sort */}
      {lbl("Sort By")}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{
          width: "100%",
          padding: "11px 16px",
          border: "1.5px solid #E8E4DC",
          borderRadius: 10,
          fontFamily: "'Raleway',sans-serif",
          fontSize: ".88rem",
          color: "#1a1a2e",
          background: "#FAF8F4",
          outline: "none",
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Result count */}
      <div
        style={{
          fontFamily: f,
          fontSize: ".78rem",
          color: "#9494b0",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        {total} package{total !== 1 ? "s" : ""} found
      </div>

      <button
        onClick={onReset}
        style={{
          width: "100%",
          padding: "12px",
          border: "1.5px solid #E8E4DC",
          borderRadius: 12,
          fontFamily: f,
          fontSize: ".82rem",
          fontWeight: 600,
          color: "#5a5a7a",
          background: "#fff",
          cursor: "pointer",
          transition: "all .2s",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#1B2B6B"
          ;(e.currentTarget as HTMLButtonElement).style.color = "#1B2B6B"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#E8E4DC"
          ;(e.currentTarget as HTMLButtonElement).style.color = "#5a5a7a"
        }}
      >
        ↺ &nbsp;Reset All Filters
      </button>
    </div>
  )
}

// ─── Card skeleton ────────────────────────────────────────────────────────────

const CardSkeleton: React.FC = () => (
  <div
    style={{
      background: "#fff",
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid #E8E4DC",
    }}
  >
    <div
      style={{
        height: 210,
        background: "#F0EDE8",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
    <div style={{ padding: "20px 22px 22px" }}>
      <div
        style={{
          height: 10,
          width: "40%",
          background: "#F0EDE8",
          borderRadius: 6,
          marginBottom: 10,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 16,
          width: "80%",
          background: "#F0EDE8",
          borderRadius: 6,
          marginBottom: 10,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 10,
          width: "60%",
          background: "#F0EDE8",
          borderRadius: 6,
          marginBottom: 14,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 22,
              width: 60,
              background: "#F0EDE8",
              borderRadius: 6,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 14,
          borderTop: "1px solid #E8E4DC",
        }}
      >
        <div
          style={{
            height: 22,
            width: 60,
            background: "#F0EDE8",
            borderRadius: 999,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 36,
            width: 110,
            background: "#F0EDE8",
            borderRadius: 999,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  </div>
)

// ─── Package Card ─────────────────────────────────────────────────────────────

export const PCard: React.FC<{
  card: ApiPackage
  listView: boolean
  onViewDetails: (pkg: ApiPackage) => void
  onBookNow: (pkg: ApiPackage) => void
}> = ({ card, listView, onViewDetails, onBookNow }) => {
  const ref = useRef<HTMLDivElement>(null)
  const WHATSAPP_NUMBER = "917299771111"

  const handleWhatsAppEnquiry = () => {
    const priceLine =
      card.bookingType === "CUSTOMIZED"
        ? ""
        : `💰 Price: ₹${card.price.toLocaleString("en-IN")}\n\n`
    const message =
      `🌍 New Travel Package Enquiry\n\n` +
      `📦 Package: ${card.title}\n` +
      `📍 Destination: ${card.destination}\n` +
      `🗓 Duration: ${card.days} Days / ${card.nights} Nights\n` +
      `👥 Pax: ${card.minPax}–${card.maxPax}\n` +
      priceLine +
      `I am interested in this package. Please share more details.`
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }
      },
      { threshold: 0.08 }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  const f = "'Inter',sans-serif"
  const fmtPrice = (v: number) => "₹" + v.toLocaleString("en-IN")

  return (
    <div
      ref={ref}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid #E8E4DC",
        transition: "all .38s cubic-bezier(.25,.46,.45,.94)",
        opacity: 0,
        transform: "translateY(28px)",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = "translateY(-8px)"
        el.style.boxShadow = "0 28px 72px rgba(27,43,107,.12)"
        el.style.borderColor = "transparent"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = "translateY(0)"
        el.style.boxShadow = "none"
        el.style.borderColor = "#E8E4DC"
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          height: listView ? 220 : 210,
          overflow: "hidden",
        }}
      >
        <img
          src={card.imageUrl}
          alt={card.title}
          loading="lazy"
          onClick={() => onViewDetails(card)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .7s ease",
            display: "block",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
          }
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(15,26,66,.55) 0%,transparent 55%)",
          }}
        />
        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
          }}
        >
          {card.badges.map((b, i) => {
            const s = BADGE_STYLES[b.variant] || { bg: "#ccc", color: "#fff" }
            return (
              <span
                key={i}
                style={{
                  fontFamily: f,
                  fontSize: ".65rem",
                  fontWeight: 700,
                  padding: "4px 11px",
                  borderRadius: 999,
                  letterSpacing: ".05em",
                  background: s.bg,
                  color: s.color,
                }}
              >
                {b.text}
              </span>
            )
          })}
        </div>
        {/* Featured star */}
        {/* {card.isFeatured && (
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "rgba(245,158,11,.95)",
              borderRadius: 999,
              padding: "3px 8px",
              fontFamily: f,
              fontSize: ".6rem",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            ⭐ Featured
          </div>
        )} */}
        {/* Price */}
        {card.bookingType !== "CUSTOMIZED" && (
          <div
            style={{
              position: "absolute",
              bottom: 14,
              right: 14,
              textAlign: "right",
            }}
          >
            {card.strikePrice && (
              <div
                style={{
                  fontFamily: f,
                  fontSize: ".68rem",
                  color: "rgba(255,255,255,.55)",
                  textDecoration: "line-through",
                }}
              >
                {fmtPrice(card.strikePrice)}
              </div>
            )}
            <div
              style={{
                fontFamily: "'Libre Baskerville',serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {fmtPrice(card.price)}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 22px 22px" }}>
        <div
          style={{
            fontFamily: f,
            fontSize: ".68rem",
            fontWeight: 700,
            color: "#2E7D32",
            letterSpacing: ".1em",
            textTransform: "uppercase" as const,
            marginBottom: 6,
          }}
        >
          📍 {card.destination}
        </div>
        <div
          onClick={() => onViewDetails(card)}
          style={{
            fontFamily: "'Libre Baskerville',serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#1B2B6B",
            marginBottom: 10,
            lineHeight: 1.3,
            cursor: "pointer",
            transition: "color .2s ease",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = "#E53E3E"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = "#1B2B6B"
          }}
        >
          {card.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <span style={{ fontFamily: f, fontSize: ".75rem", color: "#9494b0" }}>
            🗓 {card.days} Days / {card.nights} Nights
          </span>
          <span style={{ fontFamily: f, fontSize: ".75rem", color: "#9494b0" }}>
            👥 {card.minPax}–{card.maxPax} Pax
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          {card.inclusions.map((inc, i) => (
            <span
              key={i}
              style={{
                fontFamily: f,
                fontSize: ".66rem",
                fontWeight: 500,
                color: "#5a5a7a",
                background: "#F7F5F0",
                borderRadius: 6,
                padding: "4px 9px",
              }}
            >
              {inc}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            borderTop: "1px solid #E8E4DC",
          }}
        >
          {card.bookingType === "CUSTOMIZED" ? (
            <span
              style={{
                fontFamily: f,
                fontSize: ".72rem",
                fontWeight: 700,
                color: "#D97706",
                background: "rgba(217,119,6,.08)",
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              Customized
            </span>
          ) : card.discount ? (
            <span
              style={{
                fontFamily: f,
                fontSize: ".72rem",
                fontWeight: 700,
                color: "#E53E3E",
                background: "rgba(229,62,62,.08)",
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              {card.discount} % OFF
            </span>
          ) : (
            <span
              style={{
                fontFamily: f,
                fontSize: ".72rem",
                fontWeight: 700,
                color:
                  card.label === "Best Value" || card.label === "Best Budget"
                    ? "#2E7D32"
                    : "#9494b0",
              }}
            >
              {card.label || ""}
            </span>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => onViewDetails(card)}
              style={{
                fontFamily: f,
                fontSize: ".75rem",
                fontWeight: 700,
                background: "transparent",
                color: "#1B2B6B",
                border: "1.5px solid #1B2B6B",
                padding: "8px 14px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all .25s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(27,43,107,0.05)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "transparent"
              }}
            >
              Details
            </button>
            <button
              onClick={() => onBookNow(card)}
              style={{
                fontFamily: f,
                fontSize: ".75rem",
                fontWeight: 700,
                background: "#1B2B6B",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                transition: "all .25s",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "#243590"
                ;(e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "#1B2B6B"
                ;(e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)"
              }}
            >
              {card.bookingType === "CUSTOMIZED" ? "Enquire Now" : "Book Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

export const SecHeader: React.FC<{
  eyebrow: string
  title: string
  count?: number
}> = ({ eyebrow, title, count }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    }}
  >
    <div>
      <div
        style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: ".7rem",
          fontWeight: 700,
          color: "#2E7D32",
          letterSpacing: ".16em",
          textTransform: "uppercase" as const,
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 1.5,
            background: "#2E7D32",
          }}
        />
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: "'Libre Baskerville',serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#1B2B6B",
        }}
      >
        {title}
      </div>
    </div>
    {count !== undefined && (
      <div
        style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: ".78rem",
          fontWeight: 600,
          color: "#1B2B6B",
          opacity: 0.6,
        }}
      >
        {count} packages
      </div>
    )}
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const TourismDetailsDrawer: React.FC<{
  pkg: ApiPackage | null
  onClose: () => void
  onBookNow: (pkg: ApiPackage) => void
}> = ({ pkg, onClose, onBookNow }) => {
  const [isOpen, setIsOpen] = useState(false)
  const f = "'Inter',sans-serif"

  useEffect(() => {
    if (pkg) {
      setIsOpen(true)
      document.body.style.overflow = "hidden"
    } else {
      setIsOpen(false)
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [pkg])

  if (!pkg) return null

  const handleWhatsAppEnquiry = () => {
    const priceLine =
      pkg.bookingType === "CUSTOMIZED"
        ? ""
        : `💰 Price: ₹${pkg.price.toLocaleString("en-IN")}\n\n`
    const message =
      `🌍 New Travel Package Enquiry\n\n` +
      `📦 Package: ${pkg.title}\n` +
      `📍 Destination: ${pkg.destination}\n` +
      `🗓 Duration: ${pkg.days} Days / ${pkg.nights} Nights\n` +
      `👥 Pax: ${pkg.minPax}–${pkg.maxPax}\n` +
      priceLine +
      `I am interested in this package. Please share more details.`
    window.open(
      `https://wa.me/917299771111?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  const hasExclusions = pkg.exclusions && pkg.exclusions.length > 0

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,26,66,0.3)",
          backdropFilter: "blur(6px)",
          opacity: isOpen ? 1 : 0,
          zIndex: 1000,
          transition: "opacity 0.4s ease-out",
        }}
      />

      {/* Drawer Container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(560px, 100vw)",
          background: "#fff",
          boxShadow: "-10px 0 40px rgba(15,26,66,0.15)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
        }}
      >
        {/* Header Image & Close */}
        <div
          style={{
            position: "relative",
            height: 260,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
            }}
          />
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#1B2B6B",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ×
          </button>

          {/* Badges and destination */}
          <div
            style={{ position: "absolute", bottom: 20, left: 24, right: 24 }}
          >
            <div
              style={{
                fontFamily: f,
                fontSize: ".7rem",
                fontWeight: 700,
                color: "#4ADE80",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 6,
              }}
            >
              📍 {pkg.destination}
            </div>
            <h2
              style={{
                fontFamily: "'Libre Baskerville',serif",
                fontSize: "1.45rem",
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                lineHeight: 1.25,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {pkg.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Key details row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              background: "#F7F5F0",
              borderRadius: 16,
              padding: "16px 20px",
              border: "1px solid #E8E4DC",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>🗓</div>
              <div
                style={{ fontFamily: f, fontSize: ".72rem", color: "#9494b0" }}
              >
                Duration
              </div>
              <div
                style={{
                  fontFamily: f,
                  fontSize: ".82rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                }}
              >
                {pkg.days}D / {pkg.nights}N
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                borderLeft: "1px solid #E8E4DC",
                borderRight: "1px solid #E8E4DC",
              }}
            >
              <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>👥</div>
              <div
                style={{ fontFamily: f, fontSize: ".72rem", color: "#9494b0" }}
              >
                Group Size
              </div>
              <div
                style={{
                  fontFamily: f,
                  fontSize: ".82rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                }}
              >
                {pkg.minPax}–{pkg.maxPax} Pax
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              {pkg.bookingType === "CUSTOMIZED" ? (
                <>
                  <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>📝</div>
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".72rem",
                      color: "#9494b0",
                    }}
                  >
                    Package Type
                  </div>
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".82rem",
                      fontWeight: 700,
                      color: "#D97706",
                    }}
                  >
                    Customized
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>💰</div>
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".72rem",
                      color: "#9494b0",
                    }}
                  >
                    Starting From
                  </div>
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".82rem",
                      fontWeight: 700,
                      color: "#2E7D32",
                    }}
                  >
                    ₹{pkg.price ? pkg.price.toLocaleString("en-IN") : "0"}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {pkg.description && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h3
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                  margin: 0,
                }}
              >
                Overview
              </h3>
              <p
                style={{
                  fontFamily: f,
                  fontSize: ".88rem",
                  color: "#5a5a7a",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {pkg.description}
              </p>
            </div>
          )}

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h3
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                  margin: 0,
                }}
              >
                Highlights
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {pkg.highlights.map((hl, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: f,
                      fontSize: ".85rem",
                      color: "#5a5a7a",
                      lineHeight: 1.5,
                    }}
                  >
                    {hl}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inclusions and Exclusions side by side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: hasExclusions ? "1fr 1fr" : "1fr",
                gap: 20,
              }}
            >
              {/* Inclusions */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <h3
                  style={{
                    fontFamily: "'Libre Baskerville',serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#2E7D32",
                    margin: 0,
                  }}
                >
                  What's Included
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {pkg.inclusions.map((inc, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          color: "#2E7D32",
                          fontSize: ".9rem",
                          marginTop: 1,
                        }}
                      >
                        ✓
                      </span>
                      <span
                        style={{
                          fontFamily: f,
                          fontSize: ".85rem",
                          color: "#5a5a7a",
                          lineHeight: 1.4,
                        }}
                      >
                        {inc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              {hasExclusions && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <h3
                    style={{
                      fontFamily: "'Libre Baskerville',serif",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#E53E3E",
                      margin: 0,
                    }}
                  >
                    What's Excluded
                  </h3>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {pkg.exclusions!.map((exc, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            color: "#E53E3E",
                            fontSize: ".9rem",
                            marginTop: 1,
                          }}
                        >
                          ✗
                        </span>
                        <span
                          style={{
                            fontFamily: f,
                            fontSize: ".85rem",
                            color: "#5a5a7a",
                            lineHeight: 1.4,
                          }}
                        >
                          {exc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Itinerary */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                  margin: 0,
                }}
              >
                Itinerary Plan
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  position: "relative",
                }}
              >
                {/* Timeline line */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    bottom: 10,
                    left: 20,
                    width: 2,
                    background: "#E8E4DC",
                  }}
                />

                {pkg.itinerary.map((it, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: 20, position: "relative" }}
                  >
                    {/* Circle badge */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#1B2B6B",
                        color: "#fff",
                        fontFamily: f,
                        fontSize: ".75rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                        flexShrink: 0,
                        boxShadow: "0 4px 10px rgba(27,43,107,0.15)",
                      }}
                    >
                      D{it.day}
                    </div>
                    {/* Itinerary details */}
                    <div style={{ paddingTop: 6, flex: 1 }}>
                      <h4
                        style={{
                          fontFamily: f,
                          fontSize: ".9rem",
                          fontWeight: 700,
                          color: "#1B2B6B",
                          margin: "0 0 6px 0",
                        }}
                      >
                        {it.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: f,
                          fontSize: ".82rem",
                          color: "#5a5a7a",
                          lineHeight: 1.5,
                          margin: 0,
                        }}
                      >
                        {it.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div
          style={{
            padding: "20px 28px",
            borderTop: "1px solid #E8E4DC",
            background: "#F7F5F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          {pkg.bookingType === "CUSTOMIZED" ? (
            <div>
              <div
                style={{
                  fontFamily: f,
                  fontSize: ".7rem",
                  color: "#9494b0",
                  marginBottom: 2,
                }}
              >
                Package Type
              </div>
              <div
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: "1.45rem",
                  fontWeight: 700,
                  color: "#D97706",
                }}
              >
                Customized
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  fontFamily: f,
                  fontSize: ".7rem",
                  color: "#9494b0",
                  marginBottom: 2,
                }}
              >
                Starting Price
              </div>
              <div
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: "1.45rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                }}
              >
                ₹{pkg.price ? pkg.price.toLocaleString("en-IN") : "0"}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              onClose()
              onBookNow(pkg)
            }}
            style={{
              fontFamily: f,
              fontSize: ".85rem",
              fontWeight: 700,
              background: "#1B2B6B",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#243590")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1B2B6B")}
          >
            {pkg.bookingType === "CUSTOMIZED" ? "Enquire Now" : "Book Now"} →
          </button>
        </div>
      </div>
    </>
  )
}

function RotatingCities() {
  const cities = ["Chennai", "Coimbatore", "Bengaluru", "Kochi"]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cities.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <span
      style={{ fontFamily: "'Inter',sans-serif" }}
      className="relative inline-flex h-[1.8em] min-w-[8.5rem] items-center overflow-hidden"
    >
      {cities.map((city, i) => (
        <span
          key={city}
          aria-hidden={i !== index}
          className={`absolute inset-0 flex items-center text-[1rem] font-bold text-green-700 transition-all duration-500 ease-in-out sm:text-[1.15rem] ${
            i === index
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
        >
          {city}
        </span>
      ))}
    </span>
  )
}

const Tourism = () => {
  const { user } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [bookingPackage, setBookingPackage] = useState<ApiPackage | null>(null)

  const handleBookNow = (pkg: ApiPackage) => {
    if (!user) {
      toast.info("Please sign in to continue with your booking")
      setLoginModalOpen(true)
      return
    }
    setBookingPackage(pkg)
  }

  // Filter state
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [activeType, setActiveType] = useState<string>("all")
  const [maxPrice, setMaxPrice] = useState(200000)
  const [debouncedPrice, setDebouncedPrice] = useState(200000)
  const [activeDur, setActiveDur] = useState("")
  const [activeDestRegions, setActiveDestRegions] = useState<string[]>([])
  const [activeTripTypes, setActiveTripTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [selectedPackage, setSelectedPackage] = useState<ApiPackage | null>(
    null
  )

  // UI state
  const [gridView, setGridView] = useState<"grid" | "list">("grid")
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [accumulatedPackages, setAccumulatedPackages] = useState<ApiPackage[]>(
    []
  )
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  const pageWrapRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Debounce price slider
  useEffect(() => {
    const t = setTimeout(() => setDebouncedPrice(maxPrice), 500)
    return () => clearTimeout(t)
  }, [maxPrice])

  // Reset accumulation when filters change
  useEffect(() => {
    setPage(1)
    setAccumulatedPackages([])
  }, [
    debouncedSearch,
    activeType,
    debouncedPrice,
    activeDur,
    activeDestRegions,
    activeTripTypes,
    sortBy,
  ])

  // Viewport
  useEffect(() => {
    const fn = () => setVw(window.innerWidth)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  // Fix sticky sidebar by removing overflow:hidden from ancestors
  const [NAV_H, setNavH] = useState(73)
  useEffect(() => {
    const measure = () => {
      const nav =
        document.querySelector("nav") || document.querySelector("header")
      if (nav) {
        const h = (nav as HTMLElement).getBoundingClientRect().height
        if (h > 0) setNavH(Math.ceil(h))
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    if (!pageWrapRef.current) return
    const fixed: Array<{ el: HTMLElement; prev: string }> = []
    let el = pageWrapRef.current.parentElement
    while (el && el !== document.body) {
      const ov =
        window.getComputedStyle(el).overflow +
        window.getComputedStyle(el).overflowY
      if (/auto|scroll|hidden/.test(ov)) {
        fixed.push({ el, prev: el.style.overflow })
        el.style.overflow = "visible"
      }
      el = el.parentElement
    }
    return () => {
      fixed.forEach(({ el, prev }) => {
        el.style.overflow = prev
      })
    }
  }, [])

  const isMobile = vw < 900
  const isTablet = vw >= 900 && vw < 1100

  const fetchParams: FetchParams = {
    page,
    search: debouncedSearch,
    packageType: activeType,
    destinationRegions: activeDestRegions,
    tripTypes: activeTripTypes,
    durationCategory: activeDur,
    maxPrice: debouncedPrice,
    sortBy,
  }

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["tourism-public", fetchParams],
    queryFn: () => fetchPackages(fetchParams),
    staleTime: 60_000,
  })

  const { data: featuredResponse, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["tourism-featured"],
    queryFn: async () => {
      const res = await _axios.get("/tourism/featured")
      return res.data as { status: boolean; data: ApiPackage[] }
    },
    staleTime: 60_000,
  })

  const featuredPackages = featuredResponse?.data ?? []

  const handlePrevFeatured = () => {
    if (featuredPackages.length === 0) return
    setFeaturedIndex(
      (prev) => (prev - 1 + featuredPackages.length) % featuredPackages.length
    )
  }

  const handleNextFeatured = () => {
    if (featuredPackages.length === 0) return
    setFeaturedIndex((prev) => (prev + 1) % featuredPackages.length)
  }

  // Accumulate pages into a single list for "load more"
  useEffect(() => {
    if (!data?.data) return
    if (page === 1) {
      setAccumulatedPackages(data.data)
    } else {
      setAccumulatedPackages((prev) => {
        const existingIds = new Set(prev.map((p) => p._id))
        const fresh = data.data.filter((p) => !existingIds.has(p._id))
        return [...prev, ...fresh]
      })
    }
  }, [data, page])

  // Prefetch next page
  useEffect(() => {
    if (data?.pagination?.hasNext) {
      const nextParams = { ...fetchParams, page: page + 1 }
      queryClient.prefetchQuery({
        queryKey: ["tourism-public", nextParams],
        queryFn: () => fetchPackages(nextParams),
      })
    }
  }, [data, page])

  const toggleDestRegion = useCallback((v: string) => {
    setActiveDestRegions((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }, [])

  const toggleTripType = useCallback((v: string) => {
    setActiveTripTypes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }, [])

  const onReset = () => {
    setSearch("")
    setActiveType("all")
    setMaxPrice(200000)
    setActiveDur("")
    setActiveDestRegions([])
    setActiveTripTypes([])
    setSortBy("newest")
  }

  const handleLoadMore = () => {
    if (data?.pagination?.hasNext && !isFetching) {
      setPage((p) => p + 1)
    }
  }

  const total = data?.pagination?.total ?? 0
  const hasNext = data?.pagination?.hasNext ?? false
  const isFirstLoad = isLoading && page === 1
  const isLoadingMore = isFetching && page > 1

  const cardCols =
    gridView === "list"
      ? "1fr"
      : isMobile
        ? "1fr"
        : isTablet
          ? "repeat(2,1fr)"
          : "repeat(3,1fr)"

  const f = "'Inter',sans-serif"

  const sidebarProps: SidebarProps = {
    search,
    setSearch,
    activeType,
    setActiveType,
    maxPrice,
    setMaxPrice,
    activeDur,
    setActiveDur,
    activeDestRegions,
    toggleDestRegion,
    activeTripTypes,
    toggleTripType,
    sortBy,
    setSortBy,
    onReset,
    total,
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* <ToursCursor /> */}

      <style>{`
        @keyframes fsu { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .t-h1-anim{opacity:0;animation:fsu 1s .35s forwards}
        .t-eye-anim{opacity:0;animation:fsu .9s .2s forwards}
        .t-meta-anim{opacity:0;animation:fsu 1s .5s forwards}
        input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#1B2B6B;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(27,43,107,.3);cursor:pointer}
        .tourism-sidebar::-webkit-scrollbar{width:3px}
        .tourism-sidebar::-webkit-scrollbar-thumb{background:#E8E4DC}
        @media(max-width:540px){
          .hero-sect{height:60vh!important;padding:0 20px 48px!important}
          .cta-sect{padding:60px 20px!important}
          .promo-strip-inner{flex-direction:column!important;text-align:center!important}
        }
        @media(max-width:900px){
          .feat-card-inner{grid-template-columns:1fr!important}
          .feat-card-img{min-height:220px!important}
        }
        @media(min-width:900px){.mob-filter-bar{display:none!important}}
        @media(max-width:899px){.tourism-sidebar{display:none!important}}
      `}</style>

      <div
        style={{
          fontFamily: "'Raleway',sans-serif",
          background: "#F7F5F0",
          color: "#1a1a2e",
          overflowX: "hidden",
          // opacity: introComplete ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {/* ─── Hero ─────────────────────────────────────────────────────────── */}
        <Carsoule />
        {/* <section
          className="hero-sect"
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "72vh",
            minHeight: 560,
            padding: "0 64px 80px",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 8s ease",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.transform = "scale(1.03)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg,rgba(15,26,66,.25) 0%,rgba(15,26,66,.15) 30%,rgba(15,26,66,.7) 70%,rgba(15,26,66,.92) 100%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              className="t-eye-anim"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: f,
                fontSize: ".72rem",
                fontWeight: 600,
                color: "rgba(255,255,255,.5)",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 30,
                  height: 1,
                  background: "rgba(255,255,255,.35)",
                }}
              />
              Explore · Discover · Experience
            </div>
            <h1
              className="t-h1-anim"
              style={{
                fontFamily: "'Libre Baskerville',serif",
                fontSize: "clamp(2.4rem,5.5vw,5.5rem)",
                fontWeight: 700,
                lineHeight: 1.02,
                color: "#fff",
                marginBottom: 28,
              }}
            >
              Find Your Perfect
              <br />
              <em style={{ fontStyle: "italic", color: "#7ed88a" }}>
                Tour Package
              </em>
            </h1>
            <div
              className="t-meta-anim"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              {[
                ["240+", "Curated Packages"],
                ["Domestic & International", ""],
                ["All Budgets", "Welcome"],
              ].map(([b, r], i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div
                      style={{
                        width: 1,
                        height: 20,
                        background: "rgba(255,255,255,.2)",
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".82rem",
                      color: "rgba(255,255,255,.55)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <strong style={{ color: "#fff", fontWeight: 600 }}>
                      {b}
                    </strong>
                    {r && <span>{r}</span>}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section> */}
        {/* ── ABOUT US SECTION ── */}
        <section
          className="intro grid min-h-[85vh] grid-cols-1 overflow-hidden lg:min-h-[88vh] lg:grid-cols-2"
          id="about-us"
        >
          {/* LEFT — Text */}
          <div className="intro-l flex flex-col justify-center bg-[#FAF8F4] p-6 sm:p-10 lg:p-16">
            <p className="mb-[14px] flex items-center gap-2.5 font-inter text-[0.75rem] font-bold tracking-[0.18em] text-[#2E7D32] uppercase">
              <span className="h-[1.5px] w-6 flex-shrink-0 bg-[#2E7D32]" />
              Who We Are
            </p>
            <p className="mt-5 text-[0.92rem] leading-[1.85] text-[#5a5a7a]">
              <strong className="text-[#1B2B6B]"> UV Holidays</strong> is the
              tourism division of Udayam International , specialising in
              customised holiday packages, tours, and itineraries that create
              memorable travel experiences across domestic and international
              destinations.
            </p>

            {/* Timeline */}
            <div className="mt-8">
              <p className="mb-5 flex items-center gap-2.5 font-inter text-[0.75rem] font-bold tracking-[0.18em] text-[#2E7D32] uppercase">
                <span className="h-[1.5px] w-6 flex-shrink-0 bg-[#2E7D32]" />
                WHAT MAKES UV HOLIDAYS DIFFERENT
              </p>

              {[
                {
                  title: "Customised Itineraries",
                  desc: "Every trip is crafted around your preferences — no cookie-cutter packages, just journeys designed for you.",
                },
                {
                  title: "Expert Destination Guidance",
                  desc: "Our specialists bring deep local knowledge so you experience the very best of every place.",
                },
                {
                  title: "End-to-End Travel Solutions",
                  desc: "Flights, hotels, transfers, sightseeing — every detail handled so you can simply enjoy the journey.",
                },
                {
                  title: "Transparent Pricing",
                  desc: "No hidden charges, no surprises. Clear and honest from the very first quote.",
                },
                {
                  title: "Seamless Travel Experience",
                  desc: "Smooth coordination at every touchpoint means stress-free travel from departure to return.",
                },
                {
                  title: "Dedicated Customer Support",
                  desc: "Our team is with you before, during, and after your trip — always reachable, always ready.",
                },
              ].map((item, idx, arr) => (
                <div
                  key={idx}
                  className={`relative flex gap-[18px] ${idx < arr.length - 1 ? "pb-[26px]" : ""}`}
                >
                  {idx < arr.length - 1 && (
                    <div className="absolute top-[34px] left-[16px] h-[calc(100%-4px)] w-[1.5px] bg-[#E8E4DC]" />
                  )}
                  <div className="relative z-[1] flex h-[34px] w-[34px] flex-shrink-0 cursor-default items-center justify-center rounded-full border-[1.5px] border-[#E8E4DC] bg-white text-[0.72rem] text-[#1B2B6B] transition-all duration-300 hover:border-[#1B2B6B] hover:bg-[#1B2B6B] hover:text-white">
                    ✦
                  </div>
                  <div>
                    <div className="font-libre mb-1 text-[0.98rem] text-[#1B2B6B]">
                      {item.title}
                    </div>
                    <p className="text-[0.84rem] leading-[1.72] text-[#9494b0]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Single image */}
          <div className="intro-r relative min-h-[380px] overflow-hidden bg-[#fff] lg:min-h-auto">
            <img
              src={img1}
              alt="Travel with UV Holidays"
              className="absolute inset-0 h-full w-full object-contain transition-transform duration-[3s] ease-in-out hover:scale-105"
            />
            <div className="ir-overlay pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(247,245,240,0.15)] to-transparent" />
          </div>
        </section>
        {/* ─── Mobile Filter Bar ─────────────────────────────────────────────── */}
        <div
          className="mob-filter-bar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: "#fff",
            borderBottom: "1px solid #E8E4DC",
          }}
        >
          <span
            style={{
              fontFamily: f,
              fontSize: ".82rem",
              fontWeight: 600,
              color: "#1B2B6B",
            }}
          >
            {isLoading ? "Loading…" : `${total} Packages`}
          </span>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
              borderRadius: 999,
              border: "1.5px solid #E8E4DC",
              fontFamily: f,
              fontSize: ".78rem",
              fontWeight: 600,
              color: "#1B2B6B",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            ⚙ Filters & Sort
          </button>
        </div>

        {/* ─── Mobile Sheet ──────────────────────────────────────────────────── */}
        <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          <div style={{ paddingTop: 8 }}>
            <div
              style={{
                padding: "20px 28px 12px",
                borderBottom: "1px solid #E8E4DC",
              }}
            >
              <div
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                }}
              >
                Filters & Sort
              </div>
            </div>
            <SidebarContent {...sidebarProps} />
          </div>
        </MobileSheet>

        {/* ─── Page Layout ───────────────────────────────────────────────────── */}
        <div
          ref={pageWrapRef}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
                ? "260px 1fr"
                : "300px 1fr",
            alignItems: "start",
          }}
        >
          {/* Sticky Sidebar */}
          <aside
            className="tourism-sidebar"
            style={{
              position: "sticky",
              top: NAV_H,
              alignSelf: "start",
              height: `calc(100vh - ${NAV_H}px)`,
              overflowY: "auto",
              background: "#fff",
              borderRight: "1px solid #E8E4DC",
            }}
          >
            <SidebarContent {...sidebarProps} />
          </aside>

          {/* ─── Main Content ────────────────────────────────────────────────── */}
          <main
            style={{
              minWidth: 0,
              padding: isMobile
                ? "28px 16px"
                : isTablet
                  ? "36px 28px"
                  : "48px 52px",
              overflowX: "hidden",
            }}
          >
            {/* View toggle */}
            {/* Services Available Section */}
            <div className="flex items-center justify-center bg-[#F7F5F0] py-5 text-center">
              <span
                style={{ fontFamily: "'Libre Baskerville',serif" }}
                className="text-[1rem] font-semibold tracking-wide text-[#1B2B6B] sm:text-[1.15rem]"
              >
                Services Available At: &nbsp;
              </span>

              <RotatingCities />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 40,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                }}
              >
                <span style={{ color: "#2E7D32" }}>Featured</span> Packages
              </div>
              {/* <div style={{ display: "flex", gap: 6 }}>
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setGridView(v)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: `1.5px solid ${gridView === v ? "#1B2B6B" : "#E8E4DC"}`,
                      background: gridView === v ? "#1B2B6B" : "#fff",
                      color: gridView === v ? "#fff" : "#9494b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: ".85rem",
                      transition: "all .2s",
                    }}
                  >
                    {v === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div> */}
            </div>

            {isFeaturedLoading ? (
              <div
                style={{
                  height: 380,
                  background: "#F0EDE8",
                  borderRadius: 22,
                  animation: "pulse 1.5s ease-in-out infinite",
                  marginBottom: 32,
                }}
              />
            ) : featuredPackages.length > 0 ? (
              (() => {
                const featuredPkg = featuredPackages[featuredIndex]
                return (
                  <>
                    {/* Featured highlight card */}
                    <div
                      className="feat-card-inner"
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr",
                        borderRadius: 22,
                        overflow: "hidden",
                        border: "1px solid #E8E4DC",
                        background: "#fff",
                        marginBottom: 20,
                        transition: "all .38s ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.boxShadow = "0 28px 72px rgba(27,43,107,.12)"
                        el.style.borderColor = "transparent"
                        el.style.transform = "translateY(-5px)"
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.boxShadow = "none"
                        el.style.borderColor = "#E8E4DC"
                        el.style.transform = "translateY(0)"
                      }}
                    >
                      <div
                        className="feat-card-img"
                        style={{
                          position: "relative",
                          minHeight: isMobile ? 220 : 340,
                        }}
                      >
                        <img
                          src={featuredPkg.imageUrl}
                          alt={featuredPkg.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            inset: 0,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to right,transparent 60%,rgba(15,26,66,.05))",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 18,
                            left: 18,
                            display: "flex",
                            gap: 7,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: f,
                              fontSize: ".65rem",
                              fontWeight: 700,
                              padding: "4px 11px",
                              borderRadius: 999,
                              background: "rgba(27,43,107,0.85)",
                              color: "#fff",
                              textTransform: "capitalize",
                            }}
                          >
                            {featuredPkg.packageType.toLowerCase()}
                          </span>
                          {featuredPkg.badges.map((b, i) => {
                            const s = BADGE_STYLES[b.variant] || {
                              bg: "#ccc",
                              color: "#fff",
                            }
                            return (
                              <span
                                key={i}
                                style={{
                                  fontFamily: f,
                                  fontSize: ".65rem",
                                  fontWeight: 700,
                                  padding: "4px 11px",
                                  borderRadius: 999,
                                  letterSpacing: ".05em",
                                  background: s.bg,
                                  color: s.color,
                                }}
                              >
                                {b.text}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          padding: isMobile ? "24px 20px" : "40px 36px",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,
                            fontFamily: f,
                            fontSize: ".65rem",
                            fontWeight: 700,
                            color: "#2E7D32",
                            background: "#e8f5e9",
                            padding: "5px 13px",
                            borderRadius: 999,
                            letterSpacing: ".08em",
                            textTransform: "uppercase" as const,
                            marginBottom: 16,
                            width: "fit-content",
                          }}
                        >
                          ✦ Featured Package
                        </div>
                        <div
                          style={{
                            fontFamily: "'Libre Baskerville',serif",
                            fontSize: "1.6rem",
                            fontWeight: 700,
                            color: "#1B2B6B",
                            lineHeight: 1.2,
                            marginBottom: 12,
                          }}
                        >
                          {featuredPkg.title}
                        </div>
                        <p
                          style={{
                            fontFamily: "'Raleway',sans-serif",
                            fontSize: ".9rem",
                            lineHeight: 1.75,
                            color: "#5a5a7a",
                            marginBottom: 20,
                          }}
                        >
                          {featuredPkg.description ||
                            `Explore ${featuredPkg.destination} on this beautiful ${featuredPkg.days}-day tour.`}
                        </p>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 8,
                            marginBottom: 24,
                          }}
                        >
                          {featuredPkg.inclusions.slice(0, 6).map((txt) => (
                            <div
                              key={txt}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontFamily: "'Raleway',sans-serif",
                                fontSize: ".82rem",
                                color: "#5a5a7a",
                              }}
                            >
                              <span style={{ color: "#2E7D32" }}>✦</span>
                              {txt}
                            </div>
                          ))}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 10,
                            marginBottom: 20,
                            flexWrap: "wrap",
                          }}
                        >
                          {featuredPkg.bookingType === "CUSTOMIZED" ? (
                            <div>
                              <div
                                style={{
                                  fontFamily: f,
                                  fontSize: ".7rem",
                                  color: "#9494b0",
                                  marginBottom: 4,
                                }}
                              >
                                Package Type
                              </div>
                              <div
                                style={{
                                  fontFamily: "'Libre Baskerville',serif",
                                  fontSize: "2rem",
                                  fontWeight: 700,
                                  color: "#D97706",
                                }}
                              >
                                Customized
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div
                                  style={{
                                    fontFamily: f,
                                    fontSize: ".7rem",
                                    color: "#9494b0",
                                    marginBottom: 4,
                                  }}
                                >
                                  Starting from
                                </div>
                                <div
                                  style={{
                                    fontFamily: "'Libre Baskerville',serif",
                                    fontSize: "2rem",
                                    fontWeight: 700,
                                    color: "#1B2B6B",
                                  }}
                                >
                                  ₹{featuredPkg.price.toLocaleString("en-IN")}
                                </div>
                              </div>
                              {(featuredPkg.strikePrice ||
                                featuredPkg.discount) && (
                                <div
                                  style={{
                                    fontFamily: f,
                                    fontSize: ".88rem",
                                    color: "#9494b0",
                                    marginBottom: 6,
                                  }}
                                >
                                  {featuredPkg.strikePrice && (
                                    <span
                                      style={{ textDecoration: "line-through" }}
                                    >
                                      ₹
                                      {featuredPkg.strikePrice.toLocaleString(
                                        "en-IN"
                                      )}
                                    </span>
                                  )}
                                  {featuredPkg.strikePrice &&
                                    featuredPkg.discount && <>&nbsp;&nbsp;</>}
                                  {featuredPkg.discount && (
                                    <span
                                      style={{
                                        color: "#E53E3E",
                                        fontWeight: 700,
                                        fontSize: ".82rem",
                                      }}
                                    >
                                      {featuredPkg.discount} % OFF
                                    </span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => setSelectedPackage(featuredPkg)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              fontFamily: f,
                              fontSize: ".85rem",
                              fontWeight: 700,
                              background: "transparent",
                              color: "#1B2B6B",
                              border: "1.5px solid #1B2B6B",
                              padding: "12px 28px",
                              borderRadius: 999,
                              cursor: "pointer",
                              transition: "all .25s",
                            }}
                            onMouseEnter={(e) => {
                              ;(
                                e.currentTarget as HTMLElement
                              ).style.background = "rgba(27,43,107,0.05)"
                            }}
                            onMouseLeave={(e) => {
                              ;(
                                e.currentTarget as HTMLElement
                              ).style.background = "transparent"
                            }}
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleBookNow(featuredPkg)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              fontFamily: f,
                              fontSize: ".85rem",
                              fontWeight: 700,
                              background: "#1B2B6B",
                              color: "#fff",
                              padding: "13px 28px",
                              borderRadius: 999,
                              border: "none",
                              cursor: "pointer",
                              transition: "all .25s",
                              width: "fit-content",
                            }}
                            onMouseEnter={(e) => {
                              ;(
                                e.currentTarget as HTMLElement
                              ).style.background = "#243590"
                              ;(
                                e.currentTarget as HTMLElement
                              ).style.transform = "translateY(-2px)"
                            }}
                            onMouseLeave={(e) => {
                              ;(
                                e.currentTarget as HTMLElement
                              ).style.background = "#1B2B6B"
                              ;(
                                e.currentTarget as HTMLElement
                              ).style.transform = "translateY(0)"
                            }}
                          >
                            {featuredPkg.bookingType === "CUSTOMIZED"
                              ? "Enquire Now"
                              : "Book Now"}{" "}
                            →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Carousel navigation controls below card */}
                    {featuredPackages.length > 1 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 16,
                          marginBottom: 32,
                        }}
                      >
                        <button
                          onClick={handlePrevFeatured}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1.5px solid #E8E4DC",
                            background: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#1B2B6B",
                            fontSize: "1rem",
                            fontWeight: 700,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#1B2B6B"
                            e.currentTarget.style.background = "#F7F5F0"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#E8E4DC"
                            e.currentTarget.style.background = "#fff"
                          }}
                        >
                          ←
                        </button>
                        <span
                          style={{
                            fontFamily: "'Inter',sans-serif",
                            fontSize: "0.8rem",
                            color: "#9494b0",
                            fontWeight: 600,
                          }}
                        >
                          {featuredIndex + 1} / {featuredPackages.length}
                        </span>
                        <button
                          onClick={handleNextFeatured}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1.5px solid #E8E4DC",
                            background: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#1B2B6B",
                            fontSize: "1rem",
                            fontWeight: 700,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#1B2B6B"
                            e.currentTarget.style.background = "#F7F5F0"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#E8E4DC"
                            e.currentTarget.style.background = "#fff"
                          }}
                        >
                          →
                        </button>
                      </div>
                    )}
                  </>
                )
              })()
            ) : null}

            {/* Promo Showcase */}
            <CouponShowcase />

            {/* ─── Dynamic Packages Grid ─────────────────────────────────────── */}
            <SecHeader
              eyebrow="Explore Packages"
              title="All Packages"
              count={total}
            />

            {/* Error state */}
            {isError && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  fontFamily: f,
                  color: "#9494b0",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
                <div
                  style={{
                    fontSize: ".95rem",
                    fontWeight: 600,
                    color: "#1B2B6B",
                    marginBottom: 6,
                  }}
                >
                  Couldn't load packages
                </div>
                <div style={{ fontSize: ".85rem" }}>
                  Check your connection and try again.
                </div>
              </div>
            )}

            {/* Skeleton grid on first load */}
            {isFirstLoad && !isError && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: cardCols,
                  gap: 22,
                  marginBottom: 52,
                }}
              >
                {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Package cards */}
            {!isFirstLoad && !isError && accumulatedPackages.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: cardCols,
                  gap: 22,
                  marginBottom: 32,
                }}
              >
                {accumulatedPackages.map((c) => (
                  <PCard
                    key={c._id}
                    card={c}
                    listView={gridView === "list"}
                    onViewDetails={setSelectedPackage}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            )}

            {/* Loading more skeletons appended at bottom */}
            {isLoadingMore && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: cardCols,
                  gap: 22,
                  marginBottom: 32,
                }}
              >
                {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                  <CardSkeleton key={`more-${i}`} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isFirstLoad && !isError && accumulatedPackages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  fontFamily: f,
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🗺</div>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville',serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#1B2B6B",
                    marginBottom: 8,
                  }}
                >
                  No packages found
                </div>
                <div
                  style={{
                    fontSize: ".88rem",
                    color: "#9494b0",
                    marginBottom: 24,
                  }}
                >
                  Try adjusting your filters or clearing the search.
                </div>
                <button
                  onClick={onReset}
                  style={{
                    fontFamily: f,
                    fontSize: ".85rem",
                    fontWeight: 600,
                    background: "#1B2B6B",
                    color: "#fff",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* ─── Load More ────────────────────────────────────────────────── */}
            {!isFirstLoad && !isError && accumulatedPackages.length > 0 && (
              <div style={{ textAlign: "center", padding: "16px 0 32px" }}>
                {hasNext ? (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    style={{
                      fontFamily: f,
                      fontSize: ".88rem",
                      fontWeight: 600,
                      background: "transparent",
                      color: "#1B2B6B",
                      border: "1.5px solid rgba(27,43,107,.2)",
                      padding: "14px 40px",
                      borderRadius: 999,
                      cursor: isLoadingMore ? "not-allowed" : "pointer",
                      transition: "all .3s",
                      opacity: isLoadingMore ? 0.6 : 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      if (isLoadingMore) return
                      ;(e.currentTarget as HTMLButtonElement).style.background =
                        "#1B2B6B"
                      ;(e.currentTarget as HTMLButtonElement).style.color =
                        "#fff"
                      ;(
                        e.currentTarget as HTMLButtonElement
                      ).style.borderColor = "#1B2B6B"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.background =
                        "transparent"
                      ;(e.currentTarget as HTMLButtonElement).style.color =
                        "#1B2B6B"
                      ;(
                        e.currentTarget as HTMLButtonElement
                      ).style.borderColor = "rgba(27,43,107,.2)"
                    }}
                  >
                    {isLoadingMore ? "Loading…" : `Load More Packages`}{" "}
                    {!isLoadingMore && "↓"}
                  </button>
                ) : (
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".82rem",
                      color: "#9494b0",
                    }}
                  >
                    All {total} packages shown
                  </div>
                )}

                {/* Pagination info */}
                {data?.pagination && (
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".72rem",
                      color: "#9494b0",
                      marginTop: 10,
                    }}
                  >
                    Showing {accumulatedPackages.length} of {total} packages
                    {data.pagination.totalPages > 1 &&
                      ` · Page ${page} of ${data.pagination.totalPages}`}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Premium Package Details Drawer */}
      <TourismDetailsDrawer
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onBookNow={handleBookNow}
      />
      {/* Login Modal (enforced when not logged in) */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      {/* Booking & Enquiry Modal */}
      <TourismBookingModal
        isOpen={!!bookingPackage}
        pkg={bookingPackage}
        onClose={() => setBookingPackage(null)}
      />
    </>
  )
}

export default Tourism
