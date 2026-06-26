import React, { useState, useEffect, useRef } from "react"
import { ToursCursor } from "./cursor/Tourscursor"
import video from "../assets/de251262.mov"
import img1 from "../assets/2.png"
import TourismIntro from "./TourismIntro"
// ─── Types ────────────────────────────────────────────────

interface PackageCard {
  id: number
  img: string
  type: "domestic" | "international"
  title: string
  destination: string
  duration: string
  pax: string
  rating: string
  ratingScore: string
  reviews: string
  price: string
  oldPrice?: string
  discount?: string
  label?: string
  badges: {
    text: string
    variant: "domestic" | "intl" | "hot" | "sale" | "new"
  }[]
  inclusions: string[]
}

// ─── Data ────────────────────────────────────────────────
export const domesticPackages: PackageCard[] = [
  {
    id: 1,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
    title: "Kerala Backwaters Bliss",
    destination: "📍 Kerala, India",
    duration: "5 Days / 4 Nights",
    pax: "2–8 Pax",
    rating: "★★★★★",
    ratingScore: "4.9",
    reviews: "(312 reviews)",
    price: "₹18,999",
    oldPrice: "₹22,499",
    discount: "15% OFF",
    badges: [
      { text: "Domestic", variant: "domestic" },
      { text: "🔥 Top Pick", variant: "hot" },
    ],
    inclusions: ["🏨 Hotel", "🍽 Meals", "🚢 Houseboat", "🚌 Transfers"],
  },
  {
    id: 2,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&auto=format&fit=crop&q=80",
    title: "Rajasthan Royal Heritage Tour",
    destination: "📍 Rajasthan, India",
    duration: "7 Days / 6 Nights",
    pax: "2–12 Pax",
    rating: "★★★★½",
    ratingScore: "4.7",
    reviews: "(218 reviews)",
    price: "₹24,999",
    oldPrice: "₹29,999",
    discount: "17% OFF",
    badges: [
      { text: "Domestic", variant: "domestic" },
      { text: "New", variant: "new" },
    ],
    inclusions: ["🏰 Palace Stay", "🍽 Meals", "🐪 Camel Safari"],
  },
  {
    id: 3,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80",
    title: "Himachal Mountain Escape",
    destination: "📍 Himachal Pradesh, India",
    duration: "6 Days / 5 Nights",
    pax: "2–10 Pax",
    rating: "★★★★★",
    ratingScore: "4.8",
    reviews: "(145 reviews)",
    price: "₹15,999",
    label: "Best Value",
    badges: [{ text: "Domestic", variant: "domestic" }],
    inclusions: ["🏔 Trekking", "🏨 Resort", "🚌 Transfers"],
  },
  {
    id: 4,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
    title: "Goa Sun, Sand & Serenity",
    destination: "📍 Goa, India",
    duration: "4 Days / 3 Nights",
    pax: "2–6 Pax",
    rating: "★★★★",
    ratingScore: "4.5",
    reviews: "(389 reviews)",
    price: "₹12,999",
    oldPrice: "₹16,499",
    discount: "21% OFF",
    badges: [
      { text: "Domestic", variant: "domestic" },
      { text: "🏷 Sale", variant: "sale" },
    ],
    inclusions: ["🏖 Beach Resort", "🍹 Meals", "🛵 Bike Rental"],
  },
  {
    id: 5,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&auto=format&fit=crop&q=80",
    title: "Andaman Island Retreat",
    destination: "📍 Andaman Islands, India",
    duration: "6 Days / 5 Nights",
    pax: "2–8 Pax",
    rating: "★★★★★",
    ratingScore: "4.9",
    reviews: "(267 reviews)",
    price: "₹28,999",
    oldPrice: "₹33,999",
    discount: "15% OFF",
    badges: [
      { text: "Domestic", variant: "domestic" },
      { text: "🔥 Trending", variant: "hot" },
    ],
    inclusions: ["✈ Flights", "🤿 Scuba", "🏨 Resort"],
  },
  {
    id: 6,
    type: "domestic",
    img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80",
    title: "Varanasi Spiritual Journey",
    destination: "📍 Varanasi, India",
    duration: "3 Days / 2 Nights",
    pax: "1–20 Pax",
    rating: "★★★★",
    ratingScore: "4.6",
    reviews: "(190 reviews)",
    price: "₹9,999",
    label: "Best Budget",
    badges: [{ text: "Domestic", variant: "domestic" }],
    inclusions: ["🛕 Temple Tour", "🚢 River Cruise", "🏨 Hotel"],
  },
]

export const destFilters = [
  { label: "India", count: 48 },
  { label: "Europe", count: 32 },
  { label: "South-East Asia", count: 36 },
  { label: "Middle East", count: 22 },
  { label: "Americas", count: 18 },
]
export const tripTypes = [
  { label: "Honeymoon", count: 28 },
  { label: "Family", count: 44 },
  { label: "Adventure", count: 30 },
  { label: "Solo Travel", count: 20 },
  { label: "Luxury", count: 16 },
]

export const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  domestic: { bg: "#e8f5e9", color: "#2E7D32" },
  intl: { bg: "rgba(27,43,107,0.85)", color: "#fff" },
  hot: { bg: "#E53E3E", color: "#fff" },
  sale: { bg: "#F59E0B", color: "#fff" },
  new: { bg: "#1B2B6B", color: "#fff" },
}

// ─── Mobile Sheet ─────────────────────────────────────────
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

// ─── Sidebar Content ──────────────────────────────────────
interface SidebarContentProps {
  search: string
  setSearch: (v: string) => void
  activeType: "all" | "domestic" | "international"
  setActiveType: (v: "all" | "domestic" | "international") => void
  maxPrice: number
  setMaxPrice: (v: number) => void
  activeDur: string
  setActiveDur: (v: string) => void
  onReset: () => void
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  search,
  setSearch,
  activeType,
  setActiveType,
  maxPrice,
  setMaxPrice,
  activeDur,
  setActiveDur,
  onReset,
}) => {
  const pricePct = ((maxPrice - 5000) / (200000 - 5000)) * 100
  const fmtPrice = (v: number) => "₹" + v.toLocaleString("en-IN")
  const durations = ["Any", "1–3 Days", "4–7 Days", "8–14 Days", "15+ Days"]
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

      {/* Type Toggle */}
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
        {destFilters.map((d) => (
          <label
            key={d.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <input type="checkbox" defaultChecked style={{ display: "none" }} />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: "1.5px solid #E8E4DC",
                background: "#1B2B6B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{ color: "#fff", fontSize: ".65rem", fontWeight: 700 }}
              >
                ✓
              </span>
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
              <span
                style={{
                  fontFamily: f,
                  fontSize: ".72rem",
                  color: "#9494b0",
                  background: "#F7F5F0",
                  padding: "2px 8px",
                  borderRadius: 999,
                }}
              >
                {d.count}
              </span>
            </span>
          </label>
        ))}
      </div>

      {/* Price Range */}
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
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDur(d)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: `1.5px solid ${activeDur === d ? "#1B2B6B" : "#E8E4DC"}`,
              fontFamily: f,
              fontSize: ".76rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all .2s",
              background: activeDur === d ? "#1B2B6B" : "#fff",
              color: activeDur === d ? "#fff" : "#5a5a7a",
            }}
          >
            {d}
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
        {tripTypes.map((t) => (
          <label
            key={t.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <input type="checkbox" defaultChecked style={{ display: "none" }} />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: "1.5px solid #1B2B6B",
                background: "#1B2B6B",
                flexShrink: 0,
              }}
            />
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
              <span
                style={{
                  fontFamily: f,
                  fontSize: ".72rem",
                  color: "#9494b0",
                  background: "#F7F5F0",
                  padding: "2px 8px",
                  borderRadius: 999,
                }}
              >
                {t.count}
              </span>
            </span>
          </label>
        ))}
      </div>

      {/* Sort */}
      {lbl("Sort By")}
      <select
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
        {[
          "Most Popular",
          "Price: Low to High",
          "Price: High to Low",
          "Rating",
          "Duration",
          "Newest",
        ].map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>

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

// ─── Package Card ─────────────────────────────────────────
export const PCard: React.FC<{ card: PackageCard; listView: boolean }> = ({
  card,
  listView,
}) => {
  const [wished, setWished] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const WHATSAPP_NUMBER = "917299771111"

  const handleWhatsAppEnquiry = () => {
    const message =
      `🌍 New Travel Package Enquiry\n\n` +
      `📦 Package: ${card.title}\n` +
      `📍 Destination: ${card.destination.replace("📍", "")}\n` +
      `🗓 Duration: ${card.duration}\n` +
      `👥 Pax: ${card.pax}\n` +
      `💰 Price: ${card.price}\n\n` +
      `I am interested in this package. Please share more details.`

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`

    window.open(whatsappUrl, "_blank")
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
          src={card.img}
          alt={card.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .7s ease",
            display: "block",
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

        {/* Price on image */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            textAlign: "right",
          }}
        >
          {card.oldPrice && (
            <div
              style={{
                fontFamily: f,
                fontSize: ".68rem",
                color: "rgba(255,255,255,.55)",
                textDecoration: "line-through",
              }}
            >
              {card.oldPrice}
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
            {card.price}
          </div>
        </div>
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
          {card.destination}
        </div>
        <div
          style={{
            fontFamily: "'Libre Baskerville',serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#1B2B6B",
            marginBottom: 10,
            lineHeight: 1.3,
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
          <span
            style={{
              fontFamily: f,
              fontSize: ".75rem",
              color: "#9494b0",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            🗓 {card.duration}
          </span>
          <span
            style={{
              fontFamily: f,
              fontSize: ".75rem",
              color: "#9494b0",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            👥 {card.pax}
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
          {card.discount ? (
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
              {card.discount}
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
              {card.label}
            </span>
          )}
          <button
            onClick={handleWhatsAppEnquiry}
            style={{
              fontFamily: f,
              fontSize: ".78rem",
              fontWeight: 700,
              background: "#1B2B6B",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              transition: "all .25s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "#243590"
              ;(e.currentTarget as HTMLButtonElement).style.transform =
                "translateX(2px)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "#1B2B6B"
              ;(e.currentTarget as HTMLButtonElement).style.transform =
                "translateX(0)"
            }}
          >
            Enquiry Now →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────
export const SecHeader: React.FC<{
  eyebrow: string
  title: string
  seeAll?: string
}> = ({ eyebrow, title, seeAll }) => (
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
    {seeAll && (
      <a
        href="#"
        style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: ".78rem",
          fontWeight: 600,
          color: "#1B2B6B",
          opacity: 0.6,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "opacity .2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "1")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = ".6")
        }
      >
        {seeAll}
      </a>
    )}
  </div>
)

// ─── Main Component ───────────────────────────────────────
const Tourism = () => {
  const [introComplete, setIntroComplete] = useState(false)

  const [search, setSearch] = useState("")
  const [activeType, setActiveType] = useState<
    "all" | "domestic" | "international"
  >("all")
  const [maxPrice, setMaxPrice] = useState(200000)
  const [activeDur, setActiveDur] = useState("Any")
  const [gridView, setGridView] = useState<"grid" | "list">("grid")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  useEffect(() => {
    const fn = () => setVw(window.innerWidth)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  const isMobile = vw < 900
  const isTablet = vw >= 900 && vw < 1100

  // Measure actual navbar height dynamically
  const [NAV_H, setNavH] = useState(73)
  useEffect(() => {
    const measure = () => {
      const nav =
        document.querySelector("nav") ||
        document.querySelector("header") ||
        document.querySelector("[class*='navbar']") ||
        document.querySelector("[class*='Navbar']")
      if (nav) {
        const h = (nav as HTMLElement).getBoundingClientRect().height
        if (h > 0) setNavH(Math.ceil(h))
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Fix parent overflow that kills position:sticky — walk ancestors and remove overflow:hidden/auto/scroll
  const pageWrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!pageWrapRef.current) return
    const fixed: Array<{ el: HTMLElement; prev: string }> = []
    let el = pageWrapRef.current.parentElement
    while (el && el !== document.body) {
      const ov =
        window.getComputedStyle(el).overflow +
        window.getComputedStyle(el).overflowY +
        window.getComputedStyle(el).overflowX
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

  const filteredDomestic = domesticPackages.filter((c) => {
    if (activeType === "international") return false
    return !search || c.title.toLowerCase().includes(search.toLowerCase())
  })

  const totalVisible = filteredDomestic.length

  const sidebarProps = {
    search,
    setSearch,
    activeType,
    setActiveType,
    maxPrice,
    setMaxPrice,
    activeDur,
    setActiveDur,
    onReset: () => {
      setSearch("")
      setActiveType("all")
      setMaxPrice(200000)
      setActiveDur("Any")
    },
  }

  // Grid columns — matches HTML: 3-col default, 2-col on tablet, 1-col list/mobile
  const cardCols =
    gridView === "list"
      ? "1fr"
      : isMobile
        ? "1fr"
        : isTablet
          ? "repeat(2,1fr)"
          : "repeat(3,1fr)"
  const f = "'Inter',sans-serif"

  return (
    <>
      {!introComplete && (
        <TourismIntro onComplete={() => setIntroComplete(true)} />
      )}
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* <ToursCursor /> */}

      <style>{`
   
        @keyframes fsu{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes mqscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .t-h1-anim{opacity:0;animation:fsu 1s .35s forwards}
        .t-eye-anim{opacity:0;animation:fsu .9s .2s forwards}
        .t-meta-anim{opacity:0;animation:fsu 1s .5s forwards}
        .mq-run{animation:mqscroll 30s linear infinite}
        input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#1B2B6B;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(27,43,107,.3);cursor:pointer}
        .tourism-sidebar::-webkit-scrollbar{width:3px}
        .tourism-sidebar::-webkit-scrollbar-thumb{background:#E8E4DC}
        @media(max-width:540px){
          .hero-sect{height:60vh!important;padding:0 20px 48px!important}
          .fb-img-wrap{display:none!important}
          .feat-banner-inner{grid-template-columns:1fr!important}
          .cta-sect{padding:60px 20px!important}
          .footer-sect{padding:40px 20px 24px!important}
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
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <section
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
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hero-video"
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
            Your browser does not support the video tag.
          </video>

          {/* Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(15,26,66,.25) 0%, rgba(15,26,66,.15) 30%, rgba(15,26,66,.7) 70%, rgba(15,26,66,.92) 100%)",
            }}
          />

          {/* Hero Content */}
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
              Explore the World with
              <br />
              <em
                className="mt-[15px]"
                style={{
                  fontStyle: "italic",
                  color: "#7ed88a",
                  paddingTop: "10px",
                }}
              >
                UV Holidays
              </em>
            </h1>
            <p className="h-desc max-w-[460px] text-base leading-[1.8] text-white/60">
              Discover unforgettable journeys with expertly crafted holiday
              packages and seamless travel experiences worldwide.
            </p>
          </div>
        </section>
        {/* ABOUT US SECTION */}
        {/* ── ABOUT US SECTION ── */}
        {/* ── ABOUT US SECTION ── */}
        <section className="w-full bg-white px-5 py-16 md:px-16 md:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
            {/* LEFT — Text */}
            <div>
              <p className="mb-[14px] flex items-center gap-2.5 font-inter text-[0.75rem] font-bold tracking-[0.18em] text-[#2E7D32] uppercase">
                <span className="h-[1.5px] w-6 flex-shrink-0 bg-[#2E7D32]" />
                Who We Are
              </p>
              {/* <h2 className="font-libre text-[clamp(1.7rem,3vw,2.8rem)] leading-[1.15] font-bold text-[#1B2B6B]">
                <em className="text-[#2E7D32] italic">About</em> UV Holidays
              </h2> */}
              <p className="mt-5 text-[0.92rem] leading-[1.85] text-[#5a5a7a]">
                UV Holidays is the tourism division of{" "}
                <strong className="text-[#1B2B6B]">Udayam International</strong>
                , specialising in customised holiday packages, tours, and
                itineraries that create memorable travel experiences across
                domestic and international destinations.
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
            <div className="relative flex h-[300px] w-full items-center justify-center sm:h-[400px] lg:h-[560px]">
              <img
                src={img1}
                alt="Travel with UV Holidays"
                className="h-full w-full rounded-2xl object-contain"
              />
            </div>
          </div>
        </section>

        {/* ─── MOBILE FILTER BAR ─── */}
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
            {totalVisible} Packages Found
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
            <span>⚙</span> Filters & Sort
          </button>
        </div>

        {/* ─── MOBILE SHEET ─── */}
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
              <div
                style={{
                  fontFamily: f,
                  fontSize: ".78rem",
                  color: "#9494b0",
                  marginTop: 2,
                }}
              >
                {totalVisible} packages match
              </div>
            </div>
            <SidebarContent {...sidebarProps} />
          </div>
        </MobileSheet>

        {/* ─── PAGE LAYOUT — grid matches HTML .page-wrap exactly ─── */}
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
          {/* ─── SIDEBAR — position:sticky, align-self:start (required for sticky in grid) ─── */}
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

          {/* ─── MAIN CONTENT ─── */}
          <main
            className="bg-white!"
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
              <div style={{ display: "flex", gap: 6 }}>
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
              </div>
            </div>
            <div
              className="feat-card-inner"
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                borderRadius: 22,
                overflow: "hidden",
                border: "1px solid #E8E4DC",
                background: "#fff",
                marginBottom: 32,
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
                style={{ position: "relative", minHeight: 340 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=900&auto=format&fit=crop&q=80"
                  alt="Switzerland"
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
                    }}
                  >
                    International
                  </span>
                  <span
                    style={{
                      fontFamily: f,
                      fontSize: ".65rem",
                      fontWeight: 700,
                      padding: "4px 11px",
                      borderRadius: 999,
                      background: "#E53E3E",
                      color: "#fff",
                    }}
                  >
                    🔥 Bestseller
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: isMobile ? "28px 24px" : "40px 36px",
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
                  Swiss Alps &{" "}
                  <em style={{ fontStyle: "italic", color: "#2E7D32" }}>
                    Zurich
                  </em>{" "}
                  Splendour
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
                  Glide through crystal-clear lakes, snow-kissed peaks, and
                  charming Alpine villages on this 8-day Swiss masterpiece.
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  {[
                    ["✈", "Return Flights"],
                    ["🏨", "4-Star Hotels"],
                    ["🍽", "Daily Breakfast"],
                    ["🚌", "All Transfers"],
                    ["📸", "Expert Guide"],
                    ["🛡", "Travel Insurance"],
                  ].map(([ico, txt]) => (
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
                      <span style={{ color: "#2E7D32" }}>{ico}</span>
                      {txt}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      color: "#F59E0B",
                      fontSize: ".75rem",
                      letterSpacing: 1,
                    }}
                  >
                    ★★★★★
                  </span>
                  <span
                    style={{
                      fontFamily: f,
                      fontSize: ".78rem",
                      fontWeight: 700,
                      color: "#1a1a2e",
                    }}
                  >
                    5.0
                  </span>
                  <span
                    style={{
                      fontFamily: f,
                      fontSize: ".72rem",
                      color: "#9494b0",
                    }}
                  >
                    (527 reviews)
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
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
                      ₹1,24,999
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".88rem",
                      color: "#9494b0",
                      textDecoration: "line-through",
                      marginBottom: 6,
                    }}
                  >
                    ₹1,47,999 &nbsp;
                    <span
                      style={{
                        color: "#E53E3E",
                        fontWeight: 700,
                        fontSize: ".82rem",
                        textDecoration: "none",
                      }}
                    >
                      15% off
                    </span>
                  </div>
                </div>
                <a
                  href="#"
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
                    textDecoration: "none",
                    transition: "all .25s",
                    width: "fit-content",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      "#243590"
                    ;(e.currentTarget as HTMLElement).style.transform =
                      "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      "#1B2B6B"
                    ;(e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)"
                  }}
                >
                  View Package →
                </a>
              </div>
            </div>

            {/* Promo Strip */}
            <div
              className="promo-strip-inner"
              style={{
                background: "linear-gradient(135deg,#2E7D32 0%,#43A047 100%)",
                borderRadius: 18,
                padding: isMobile ? "24px 20px" : "28px 36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                marginBottom: 36,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Libre Baskerville',serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  🎉 Group Discount Alert!
                </h3>
                <p
                  style={{
                    fontFamily: "'Raleway',sans-serif",
                    fontSize: ".85rem",
                    color: "rgba(255,255,255,.7)",
                  }}
                >
                  Travel with 6+ people and get flat 20% off on any package.
                </p>
              </div>
              <div
                style={{
                  fontFamily: f,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: ".12em",
                  padding: "10px 20px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,.18)",
                  border: "1.5px dashed rgba(255,255,255,.4)",
                }}
              >
                HORIZONS25
              </div>
              <a
                href="#"
                style={{
                  fontFamily: f,
                  fontSize: ".82rem",
                  fontWeight: 700,
                  background: "#fff",
                  color: "#2E7D32",
                  padding: "12px 24px",
                  borderRadius: 999,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "all .25s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)")
                }
              >
                Claim Offer →
              </a>
            </div>

            {/* Domestic Packages */}
            {(activeType === "all" || activeType === "domestic") &&
              filteredDomestic.length > 0 && (
                <>
                  <SecHeader
                    eyebrow="Explore India"
                    title="Domestic Packages"
                    seeAll="See all 48 →"
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: cardCols,
                      gap: 22,
                      marginBottom: 52,
                    }}
                  >
                    {filteredDomestic.map((c) => (
                      <PCard
                        key={c.id}
                        card={c}
                        listView={gridView === "list"}
                      />
                    ))}
                  </div>
                </>
              )}

            {/* Load More */}
            {totalVisible > 0 && (
              <div style={{ textAlign: "center", padding: "16px 0 32px" }}>
                <button
                  onClick={() => {
                    setLoadingMore(true)
                    setTimeout(() => setLoadingMore(false), 1500)
                  }}
                  style={{
                    fontFamily: f,
                    fontSize: ".88rem",
                    fontWeight: 600,
                    background: "transparent",
                    color: "#1B2B6B",
                    border: "1.5px solid rgba(27,43,107,.2)",
                    padding: "14px 40px",
                    borderRadius: 999,
                    cursor: "pointer",
                    transition: "all .3s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "#1B2B6B"
                    ;(e.currentTarget as HTMLButtonElement).style.color = "#fff"
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#1B2B6B"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "transparent"
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "#1B2B6B"
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(27,43,107,.2)"
                  }}
                >
                  {loadingMore ? "Loading..." : "Load More Packages"} ↓
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default Tourism

// Dynamic
// import React, { useState, useEffect, useRef, useCallback } from "react"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import { ToursCursor } from "./cursor/Tourscursor"
// import { _axios } from "@/lib/axios"
// import video from "../assets/de251262.mov"

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface ApiBadge {
//   text: string
//   variant: "domestic" | "intl" | "hot" | "sale" | "new"
// }

// interface ApiPackage {
//   _id: string
//   title: string
//   destination: string
//   destinationRegion: string
//   packageType: "DOMESTIC" | "INTERNATIONAL"
//   tripTypes: string[]
//   price: number
//   strikePrice?: number
//   discount?: string
//   days: number
//   nights: number
//   durationCategory: string
//   minPax: number
//   maxPax: number
//   imageUrl: string
//   badges: ApiBadge[]
//   inclusions: string[]
//   isActive: boolean
//   isFeatured: boolean
//   label?: string
// }

// interface ApiResponse {
//   status: boolean
//   data: ApiPackage[]
//   pagination: {
//     total: number
//     page: number
//     limit: number
//     totalPages: number
//     hasNext: boolean
//     hasPrev: boolean
//   }
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const DEST_FILTERS = [
//   { label: "India", value: "INDIA" },
//   { label: "Europe", value: "EUROPE" },
//   { label: "South-East Asia", value: "SOUTH_EAST_ASIA" },
//   { label: "Middle East", value: "MIDDLE_EAST" },
//   { label: "Americas", value: "AMERICAS" },
//   { label: "Africa", value: "AFRICA" },
//   { label: "Oceania", value: "OCEANIA" },
// ]

// const TRIP_TYPE_FILTERS = [
//   { label: "Honeymoon", value: "HONEYMOON" },
//   { label: "Family", value: "FAMILY" },
//   { label: "Adventure", value: "ADVENTURE" },
//   { label: "Solo Travel", value: "SOLO" },
//   { label: "Group", value: "GROUP" },
//   { label: "Pilgrimage", value: "PILGRIMAGE" },
// ]

// const DURATION_FILTERS = [
//   { label: "Any", value: "" },
//   { label: "1–3 Days", value: "1-3" },
//   { label: "4–7 Days", value: "4-7" },
//   { label: "8–14 Days", value: "8-14" },
//   { label: "15+ Days", value: "15+" },
// ]

// const SORT_OPTIONS = [
//   { label: "Most Popular", value: "newest" },
//   { label: "Price: Low to High", value: "price_asc" },
//   { label: "Price: High to Low", value: "price_desc" },
//   { label: "Featured", value: "featured" },
// ]

// export const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
//   domestic: { bg: "#e8f5e9", color: "#2E7D32" },
//   intl: { bg: "rgba(27,43,107,0.85)", color: "#fff" },
//   hot: { bg: "#E53E3E", color: "#fff" },
//   sale: { bg: "#F59E0B", color: "#fff" },
//   new: { bg: "#1B2B6B", color: "#fff" },
// }

// const PAGE_LIMIT = 6

// // ─── API fetch ────────────────────────────────────────────────────────────────

// interface FetchParams {
//   page: number
//   search: string
//   packageType: string
//   destinationRegions: string[]
//   tripTypes: string[]
//   durationCategory: string
//   maxPrice: number
//   sortBy: string
// }

// const fetchPackages = async (p: FetchParams): Promise<ApiResponse> => {
//   const params: Record<string, string> = {
//     page: String(p.page),
//     limit: String(PAGE_LIMIT),
//     isActive: "true",
//     sortBy: p.sortBy,
//     maxPrice: String(p.maxPrice),
//   }
//   if (p.search) params.search = p.search
//   if (p.packageType !== "all") params.packageType = p.packageType.toUpperCase()
//   if (p.destinationRegions.length)
//     params.destinationRegions = p.destinationRegions.join(",")
//   if (p.tripTypes.length) params.tripTypes = p.tripTypes.join(",")
//   if (p.durationCategory) params.durationCategories = p.durationCategory

//   const res = await _axios.get("/tourism", { params })
//   return res.data
// }

// // ─── Mobile Sheet ─────────────────────────────────────────────────────────────

// const MobileSheet: React.FC<{
//   open: boolean
//   onClose: () => void
//   children: React.ReactNode
// }> = ({ open, onClose, children }) => {
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : ""
//     return () => {
//       document.body.style.overflow = ""
//     }
//   }, [open])
//   return (
//     <>
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 998,
//           background: "rgba(0,0,0,0.45)",
//           backdropFilter: "blur(2px)",
//           opacity: open ? 1 : 0,
//           pointerEvents: open ? "auto" : "none",
//           transition: "opacity 0.3s ease",
//         }}
//       />
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           bottom: 0,
//           zIndex: 999,
//           width: "min(320px,88vw)",
//           background: "#fff",
//           boxShadow: "4px 0 32px rgba(0,0,0,0.18)",
//           overflowY: "auto",
//           transform: open ? "translateX(0)" : "translateX(-100%)",
//           transition: "transform 0.35s cubic-bezier(.25,.46,.45,.94)",
//         }}
//       >
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute",
//             top: 16,
//             right: 16,
//             zIndex: 1,
//             width: 36,
//             height: 36,
//             borderRadius: "50%",
//             border: "1.5px solid #E8E4DC",
//             background: "#F7F5F0",
//             cursor: "pointer",
//             fontSize: "1.1rem",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#5a5a7a",
//           }}
//         >
//           ×
//         </button>
//         {children}
//       </div>
//     </>
//   )
// }

// // ─── Sidebar Content ──────────────────────────────────────────────────────────

// interface SidebarProps {
//   search: string
//   setSearch: (v: string) => void
//   activeType: string
//   setActiveType: (v: string) => void
//   maxPrice: number
//   setMaxPrice: (v: number) => void
//   activeDur: string
//   setActiveDur: (v: string) => void
//   activeDestRegions: string[]
//   toggleDestRegion: (v: string) => void
//   activeTripTypes: string[]
//   toggleTripType: (v: string) => void
//   sortBy: string
//   setSortBy: (v: string) => void
//   onReset: () => void
//   total: number
// }

// const SidebarContent: React.FC<SidebarProps> = ({
//   search,
//   setSearch,
//   activeType,
//   setActiveType,
//   maxPrice,
//   setMaxPrice,
//   activeDur,
//   setActiveDur,
//   activeDestRegions,
//   toggleDestRegion,
//   activeTripTypes,
//   toggleTripType,
//   sortBy,
//   setSortBy,
//   onReset,
//   total,
// }) => {
//   const pricePct = ((maxPrice - 5000) / (200000 - 5000)) * 100
//   const fmtPrice = (v: number) => "₹" + v.toLocaleString("en-IN")
//   const f = "'Inter',sans-serif"
//   const lbl = (t: string) => (
//     <div
//       style={{
//         fontFamily: f,
//         fontSize: ".68rem",
//         fontWeight: 700,
//         color: "#9494b0",
//         letterSpacing: ".14em",
//         textTransform: "uppercase" as const,
//         marginBottom: 14,
//       }}
//     >
//       {t}
//     </div>
//   )

//   return (
//     <div
//       style={{ padding: "48px 28px 32px", fontFamily: "'Raleway',sans-serif" }}
//     >
//       {/* Search */}
//       <div style={{ position: "relative", marginBottom: 36 }}>
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search destinations..."
//           style={{
//             width: "100%",
//             padding: "13px 44px 13px 18px",
//             borderRadius: 12,
//             border: "1.5px solid #E8E4DC",
//             fontFamily: "'Raleway',sans-serif",
//             fontSize: ".9rem",
//             color: "#1a1a2e",
//             background: "#FAF8F4",
//             outline: "none",
//           }}
//           onFocus={(e) => (e.target.style.borderColor = "#1B2B6B")}
//           onBlur={(e) => (e.target.style.borderColor = "#E8E4DC")}
//         />
//         <span
//           style={{
//             position: "absolute",
//             right: 14,
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: "#9494b0",
//             fontSize: ".85rem",
//             pointerEvents: "none",
//           }}
//         >
//           🔍
//         </span>
//       </div>

//       {/* Package type toggle */}
//       {lbl("Package Type")}
//       <div
//         style={{
//           display: "flex",
//           background: "#F7F5F0",
//           borderRadius: 12,
//           padding: 4,
//           gap: 4,
//           marginBottom: 32,
//         }}
//       >
//         {(["all", "domestic", "international"] as const).map((t) => (
//           <button
//             key={t}
//             onClick={() => setActiveType(t)}
//             style={{
//               flex: 1,
//               padding: "10px 4px",
//               borderRadius: 9,
//               border: "none",
//               fontFamily: f,
//               fontSize: ".76rem",
//               fontWeight: 600,
//               cursor: "pointer",
//               transition: "all .25s",
//               background: activeType === t ? "#1B2B6B" : "transparent",
//               color: activeType === t ? "#fff" : "#9494b0",
//               boxShadow:
//                 activeType === t ? "0 4px 14px rgba(27,43,107,.2)" : "none",
//               letterSpacing: ".04em",
//             }}
//           >
//             {t === "all" ? "All" : t === "domestic" ? "Domestic" : "Intl"}
//           </button>
//         ))}
//       </div>

//       {/* Destinations */}
//       {lbl("Destinations")}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 10,
//           marginBottom: 32,
//         }}
//       >
//         {DEST_FILTERS.map((d) => {
//           const checked = activeDestRegions.includes(d.value)
//           return (
//             <label
//               key={d.value}
//               onClick={() => toggleDestRegion(d.value)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 cursor: "pointer",
//               }}
//             >
//               <div
//                 style={{
//                   width: 18,
//                   height: 18,
//                   borderRadius: 5,
//                   flexShrink: 0,
//                   border: `1.5px solid ${checked ? "#1B2B6B" : "#E8E4DC"}`,
//                   background: checked ? "#1B2B6B" : "#fff",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   transition: "all .2s",
//                 }}
//               >
//                 {checked && (
//                   <span
//                     style={{
//                       color: "#fff",
//                       fontSize: ".65rem",
//                       fontWeight: 700,
//                     }}
//                   >
//                     ✓
//                   </span>
//                 )}
//               </div>
//               <span
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".88rem",
//                   color: "#5a5a7a",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   flex: 1,
//                 }}
//               >
//                 {d.label}
//               </span>
//             </label>
//           )
//         })}
//       </div>

//       {/* Budget */}
//       {lbl("Budget (₹ per person)")}
//       <div style={{ marginBottom: 32 }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             fontFamily: f,
//             fontSize: ".8rem",
//             fontWeight: 600,
//             color: "#1B2B6B",
//             marginBottom: 12,
//           }}
//         >
//           <span>₹5,000</span>
//           <span>{fmtPrice(maxPrice)}</span>
//         </div>
//         <input
//           type="range"
//           min={5000}
//           max={200000}
//           step={5000}
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(+e.target.value)}
//           style={{
//             width: "100%",
//             height: 4,
//             borderRadius: 2,
//             appearance: "none" as any,
//             WebkitAppearance: "none",
//             outline: "none",
//             cursor: "pointer",
//             background: `linear-gradient(to right,#1B2B6B 0%,#1B2B6B ${pricePct}%,#E8E4DC ${pricePct}%,#E8E4DC 100%)`,
//           }}
//         />
//       </div>

//       {/* Duration */}
//       {lbl("Duration")}
//       <div
//         style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
//       >
//         {DURATION_FILTERS.map((d) => (
//           <button
//             key={d.value}
//             onClick={() => setActiveDur(d.value)}
//             style={{
//               padding: "7px 14px",
//               borderRadius: 999,
//               border: `1.5px solid ${activeDur === d.value ? "#1B2B6B" : "#E8E4DC"}`,
//               fontFamily: f,
//               fontSize: ".76rem",
//               fontWeight: 500,
//               cursor: "pointer",
//               transition: "all .2s",
//               background: activeDur === d.value ? "#1B2B6B" : "#fff",
//               color: activeDur === d.value ? "#fff" : "#5a5a7a",
//             }}
//           >
//             {d.label}
//           </button>
//         ))}
//       </div>

//       {/* Trip Type */}
//       {lbl("Trip Type")}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 10,
//           marginBottom: 32,
//         }}
//       >
//         {TRIP_TYPE_FILTERS.map((t) => {
//           const checked = activeTripTypes.includes(t.value)
//           return (
//             <label
//               key={t.value}
//               onClick={() => toggleTripType(t.value)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 cursor: "pointer",
//               }}
//             >
//               <div
//                 style={{
//                   width: 18,
//                   height: 18,
//                   borderRadius: 5,
//                   flexShrink: 0,
//                   border: `1.5px solid ${checked ? "#1B2B6B" : "#E8E4DC"}`,
//                   background: checked ? "#1B2B6B" : "#fff",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   transition: "all .2s",
//                 }}
//               >
//                 {checked && (
//                   <span
//                     style={{
//                       color: "#fff",
//                       fontSize: ".65rem",
//                       fontWeight: 700,
//                     }}
//                   >
//                     ✓
//                   </span>
//                 )}
//               </div>
//               <span
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".88rem",
//                   color: "#5a5a7a",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   flex: 1,
//                 }}
//               >
//                 {t.label}
//               </span>
//             </label>
//           )
//         })}
//       </div>

//       {/* Sort */}
//       {lbl("Sort By")}
//       <select
//         value={sortBy}
//         onChange={(e) => setSortBy(e.target.value)}
//         style={{
//           width: "100%",
//           padding: "11px 16px",
//           border: "1.5px solid #E8E4DC",
//           borderRadius: 10,
//           fontFamily: "'Raleway',sans-serif",
//           fontSize: ".88rem",
//           color: "#1a1a2e",
//           background: "#FAF8F4",
//           outline: "none",
//           cursor: "pointer",
//           marginBottom: 16,
//         }}
//       >
//         {SORT_OPTIONS.map((o) => (
//           <option key={o.value} value={o.value}>
//             {o.label}
//           </option>
//         ))}
//       </select>

//       {/* Result count */}
//       <div
//         style={{
//           fontFamily: f,
//           fontSize: ".78rem",
//           color: "#9494b0",
//           textAlign: "center",
//           marginBottom: 12,
//         }}
//       >
//         {total} package{total !== 1 ? "s" : ""} found
//       </div>

//       <button
//         onClick={onReset}
//         style={{
//           width: "100%",
//           padding: "12px",
//           border: "1.5px solid #E8E4DC",
//           borderRadius: 12,
//           fontFamily: f,
//           fontSize: ".82rem",
//           fontWeight: 600,
//           color: "#5a5a7a",
//           background: "#fff",
//           cursor: "pointer",
//           transition: "all .2s",
//         }}
//         onMouseEnter={(e) => {
//           ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#1B2B6B"
//           ;(e.currentTarget as HTMLButtonElement).style.color = "#1B2B6B"
//         }}
//         onMouseLeave={(e) => {
//           ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#E8E4DC"
//           ;(e.currentTarget as HTMLButtonElement).style.color = "#5a5a7a"
//         }}
//       >
//         ↺ &nbsp;Reset All Filters
//       </button>
//     </div>
//   )
// }

// // ─── Card skeleton ────────────────────────────────────────────────────────────

// const CardSkeleton: React.FC = () => (
//   <div
//     style={{
//       background: "#fff",
//       borderRadius: 20,
//       overflow: "hidden",
//       border: "1px solid #E8E4DC",
//     }}
//   >
//     <div
//       style={{
//         height: 210,
//         background: "#F0EDE8",
//         animation: "pulse 1.5s ease-in-out infinite",
//       }}
//     />
//     <div style={{ padding: "20px 22px 22px" }}>
//       <div
//         style={{
//           height: 10,
//           width: "40%",
//           background: "#F0EDE8",
//           borderRadius: 6,
//           marginBottom: 10,
//           animation: "pulse 1.5s ease-in-out infinite",
//         }}
//       />
//       <div
//         style={{
//           height: 16,
//           width: "80%",
//           background: "#F0EDE8",
//           borderRadius: 6,
//           marginBottom: 10,
//           animation: "pulse 1.5s ease-in-out infinite",
//         }}
//       />
//       <div
//         style={{
//           height: 10,
//           width: "60%",
//           background: "#F0EDE8",
//           borderRadius: 6,
//           marginBottom: 14,
//           animation: "pulse 1.5s ease-in-out infinite",
//         }}
//       />
//       <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             style={{
//               height: 22,
//               width: 60,
//               background: "#F0EDE8",
//               borderRadius: 6,
//               animation: "pulse 1.5s ease-in-out infinite",
//             }}
//           />
//         ))}
//       </div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           paddingTop: 14,
//           borderTop: "1px solid #E8E4DC",
//         }}
//       >
//         <div
//           style={{
//             height: 22,
//             width: 60,
//             background: "#F0EDE8",
//             borderRadius: 999,
//             animation: "pulse 1.5s ease-in-out infinite",
//           }}
//         />
//         <div
//           style={{
//             height: 36,
//             width: 110,
//             background: "#F0EDE8",
//             borderRadius: 999,
//             animation: "pulse 1.5s ease-in-out infinite",
//           }}
//         />
//       </div>
//     </div>
//   </div>
// )

// // ─── Package Card ─────────────────────────────────────────────────────────────

// export const PCard: React.FC<{ card: ApiPackage; listView: boolean }> = ({
//   card,
//   listView,
// }) => {
//   const ref = useRef<HTMLDivElement>(null)
//   const WHATSAPP_NUMBER = "917299771111"

//   const handleWhatsAppEnquiry = () => {
//     const message =
//       `🌍 New Travel Package Enquiry\n\n` +
//       `📦 Package: ${card.title}\n` +
//       `📍 Destination: ${card.destination}\n` +
//       `🗓 Duration: ${card.days} Days / ${card.nights} Nights\n` +
//       `👥 Pax: ${card.minPax}–${card.maxPax}\n` +
//       `💰 Price: ₹${card.price.toLocaleString("en-IN")}\n\n` +
//       `I am interested in this package. Please share more details.`
//     window.open(
//       `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
//       "_blank"
//     )
//   }

//   useEffect(() => {
//     const el = ref.current
//     if (!el) return
//     const ob = new IntersectionObserver(
//       ([e]) => {
//         if (e.isIntersecting) {
//           el.style.opacity = "1"
//           el.style.transform = "translateY(0)"
//         }
//       },
//       { threshold: 0.08 }
//     )
//     ob.observe(el)
//     return () => ob.disconnect()
//   }, [])

//   const f = "'Inter',sans-serif"
//   const fmtPrice = (v: number) => "₹" + v.toLocaleString("en-IN")

//   return (
//     <div
//       ref={ref}
//       style={{
//         background: "#fff",
//         borderRadius: 20,
//         overflow: "hidden",
//         border: "1px solid #E8E4DC",
//         transition: "all .38s cubic-bezier(.25,.46,.45,.94)",
//         opacity: 0,
//         transform: "translateY(28px)",
//         cursor: "default",
//       }}
//       onMouseEnter={(e) => {
//         const el = e.currentTarget as HTMLElement
//         el.style.transform = "translateY(-8px)"
//         el.style.boxShadow = "0 28px 72px rgba(27,43,107,.12)"
//         el.style.borderColor = "transparent"
//       }}
//       onMouseLeave={(e) => {
//         const el = e.currentTarget as HTMLElement
//         el.style.transform = "translateY(0)"
//         el.style.boxShadow = "none"
//         el.style.borderColor = "#E8E4DC"
//       }}
//     >
//       {/* Image */}
//       <div
//         style={{
//           position: "relative",
//           height: listView ? 220 : 210,
//           overflow: "hidden",
//         }}
//       >
//         <img
//           src={card.imageUrl}
//           alt={card.title}
//           loading="lazy"
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             transition: "transform .7s ease",
//             display: "block",
//           }}
//           onMouseEnter={(e) =>
//             ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")
//           }
//           onMouseLeave={(e) =>
//             ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
//           }
//         />
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             background:
//               "linear-gradient(to top,rgba(15,26,66,.55) 0%,transparent 55%)",
//           }}
//         />
//         {/* Badges */}
//         <div
//           style={{
//             position: "absolute",
//             top: 14,
//             left: 14,
//             display: "flex",
//             gap: 7,
//             flexWrap: "wrap",
//           }}
//         >
//           {card.badges.map((b, i) => {
//             const s = BADGE_STYLES[b.variant] || { bg: "#ccc", color: "#fff" }
//             return (
//               <span
//                 key={i}
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".65rem",
//                   fontWeight: 700,
//                   padding: "4px 11px",
//                   borderRadius: 999,
//                   letterSpacing: ".05em",
//                   background: s.bg,
//                   color: s.color,
//                 }}
//               >
//                 {b.text}
//               </span>
//             )
//           })}
//         </div>
//         {/* Featured star */}
//         {card.isFeatured && (
//           <div
//             style={{
//               position: "absolute",
//               top: 14,
//               right: 14,
//               background: "rgba(245,158,11,.95)",
//               borderRadius: 999,
//               padding: "3px 8px",
//               fontFamily: f,
//               fontSize: ".6rem",
//               fontWeight: 700,
//               color: "#fff",
//             }}
//           >
//             ⭐ Featured
//           </div>
//         )}
//         {/* Price */}
//         <div
//           style={{
//             position: "absolute",
//             bottom: 14,
//             right: 14,
//             textAlign: "right",
//           }}
//         >
//           {card.strikePrice && (
//             <div
//               style={{
//                 fontFamily: f,
//                 fontSize: ".68rem",
//                 color: "rgba(255,255,255,.55)",
//                 textDecoration: "line-through",
//               }}
//             >
//               {fmtPrice(card.strikePrice)}
//             </div>
//           )}
//           <div
//             style={{
//               fontFamily: "'Libre Baskerville',serif",
//               fontSize: "1.3rem",
//               fontWeight: 700,
//               color: "#fff",
//               lineHeight: 1,
//             }}
//           >
//             {fmtPrice(card.price)}
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div style={{ padding: "20px 22px 22px" }}>
//         <div
//           style={{
//             fontFamily: f,
//             fontSize: ".68rem",
//             fontWeight: 700,
//             color: "#2E7D32",
//             letterSpacing: ".1em",
//             textTransform: "uppercase" as const,
//             marginBottom: 6,
//           }}
//         >
//           📍 {card.destination}
//         </div>
//         <div
//           style={{
//             fontFamily: "'Libre Baskerville',serif",
//             fontSize: "1.05rem",
//             fontWeight: 700,
//             color: "#1B2B6B",
//             marginBottom: 10,
//             lineHeight: 1.3,
//           }}
//         >
//           {card.title}
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 14,
//             marginBottom: 14,
//           }}
//         >
//           <span style={{ fontFamily: f, fontSize: ".75rem", color: "#9494b0" }}>
//             🗓 {card.days} Days / {card.nights} Nights
//           </span>
//           <span style={{ fontFamily: f, fontSize: ".75rem", color: "#9494b0" }}>
//             👥 {card.minPax}–{card.maxPax} Pax
//           </span>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             gap: 6,
//             flexWrap: "wrap",
//             marginBottom: 18,
//           }}
//         >
//           {card.inclusions.map((inc, i) => (
//             <span
//               key={i}
//               style={{
//                 fontFamily: f,
//                 fontSize: ".66rem",
//                 fontWeight: 500,
//                 color: "#5a5a7a",
//                 background: "#F7F5F0",
//                 borderRadius: 6,
//                 padding: "4px 9px",
//               }}
//             >
//               {inc}
//             </span>
//           ))}
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             paddingTop: 14,
//             borderTop: "1px solid #E8E4DC",
//           }}
//         >
//           {card.discount ? (
//             <span
//               style={{
//                 fontFamily: f,
//                 fontSize: ".72rem",
//                 fontWeight: 700,
//                 color: "#E53E3E",
//                 background: "rgba(229,62,62,.08)",
//                 padding: "4px 10px",
//                 borderRadius: 999,
//               }}
//             >
//               {card.discount}
//             </span>
//           ) : (
//             <span
//               style={{
//                 fontFamily: f,
//                 fontSize: ".72rem",
//                 fontWeight: 700,
//                 color:
//                   card.label === "Best Value" || card.label === "Best Budget"
//                     ? "#2E7D32"
//                     : "#9494b0",
//               }}
//             >
//               {card.label || ""}
//             </span>
//           )}
//           <button
//             onClick={handleWhatsAppEnquiry}
//             style={{
//               fontFamily: f,
//               fontSize: ".78rem",
//               fontWeight: 700,
//               background: "#1B2B6B",
//               color: "#fff",
//               padding: "10px 20px",
//               borderRadius: 999,
//               border: "none",
//               cursor: "pointer",
//               transition: "all .25s",
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//             }}
//             onMouseEnter={(e) => {
//               ;(e.currentTarget as HTMLButtonElement).style.background =
//                 "#243590"
//               ;(e.currentTarget as HTMLButtonElement).style.transform =
//                 "translateX(2px)"
//             }}
//             onMouseLeave={(e) => {
//               ;(e.currentTarget as HTMLButtonElement).style.background =
//                 "#1B2B6B"
//               ;(e.currentTarget as HTMLButtonElement).style.transform =
//                 "translateX(0)"
//             }}
//           >
//             Enquiry Now →
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Section Header ───────────────────────────────────────────────────────────

// export const SecHeader: React.FC<{
//   eyebrow: string
//   title: string
//   count?: number
// }> = ({ eyebrow, title, count }) => (
//   <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: 24,
//     }}
//   >
//     <div>
//       <div
//         style={{
//           fontFamily: "'Inter',sans-serif",
//           fontSize: ".7rem",
//           fontWeight: 700,
//           color: "#2E7D32",
//           letterSpacing: ".16em",
//           textTransform: "uppercase" as const,
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//           marginBottom: 4,
//         }}
//       >
//         <span
//           style={{
//             display: "inline-block",
//             width: 20,
//             height: 1.5,
//             background: "#2E7D32",
//           }}
//         />
//         {eyebrow}
//       </div>
//       <div
//         style={{
//           fontFamily: "'Libre Baskerville',serif",
//           fontSize: "1.5rem",
//           fontWeight: 700,
//           color: "#1B2B6B",
//         }}
//       >
//         {title}
//       </div>
//     </div>
//     {count !== undefined && (
//       <div
//         style={{
//           fontFamily: "'Inter',sans-serif",
//           fontSize: ".78rem",
//           fontWeight: 600,
//           color: "#1B2B6B",
//           opacity: 0.6,
//         }}
//       >
//         {count} packages
//       </div>
//     )}
//   </div>
// )

// // ─── Main Component ───────────────────────────────────────────────────────────

// const Tourism = () => {
//   // Filter state
//   const [search, setSearch] = useState("")
//   const [debouncedSearch, setDebouncedSearch] = useState("")
//   const [activeType, setActiveType] = useState<string>("all")
//   const [maxPrice, setMaxPrice] = useState(200000)
//   const [debouncedPrice, setDebouncedPrice] = useState(200000)
//   const [activeDur, setActiveDur] = useState("")
//   const [activeDestRegions, setActiveDestRegions] = useState<string[]>([])
//   const [activeTripTypes, setActiveTripTypes] = useState<string[]>([])
//   const [sortBy, setSortBy] = useState("newest")

//   // UI state
//   const [gridView, setGridView] = useState<"grid" | "list">("grid")
//   const [sheetOpen, setSheetOpen] = useState(false)
//   const [page, setPage] = useState(1)
//   const [accumulatedPackages, setAccumulatedPackages] = useState<ApiPackage[]>(
//     []
//   )
//   const [vw, setVw] = useState(
//     typeof window !== "undefined" ? window.innerWidth : 1200
//   )

//   const pageWrapRef = useRef<HTMLDivElement>(null)
//   const queryClient = useQueryClient()

//   // Debounce search
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(search), 400)
//     return () => clearTimeout(t)
//   }, [search])

//   // Debounce price slider
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedPrice(maxPrice), 500)
//     return () => clearTimeout(t)
//   }, [maxPrice])

//   // Reset accumulation when filters change
//   useEffect(() => {
//     setPage(1)
//     setAccumulatedPackages([])
//   }, [
//     debouncedSearch,
//     activeType,
//     debouncedPrice,
//     activeDur,
//     activeDestRegions,
//     activeTripTypes,
//     sortBy,
//   ])

//   // Viewport
//   useEffect(() => {
//     const fn = () => setVw(window.innerWidth)
//     window.addEventListener("resize", fn)
//     return () => window.removeEventListener("resize", fn)
//   }, [])

//   // Fix sticky sidebar by removing overflow:hidden from ancestors
//   const [NAV_H, setNavH] = useState(73)
//   useEffect(() => {
//     const measure = () => {
//       const nav =
//         document.querySelector("nav") || document.querySelector("header")
//       if (nav) {
//         const h = (nav as HTMLElement).getBoundingClientRect().height
//         if (h > 0) setNavH(Math.ceil(h))
//       }
//     }
//     measure()
//     window.addEventListener("resize", measure)
//     return () => window.removeEventListener("resize", measure)
//   }, [])

//   useEffect(() => {
//     if (!pageWrapRef.current) return
//     const fixed: Array<{ el: HTMLElement; prev: string }> = []
//     let el = pageWrapRef.current.parentElement
//     while (el && el !== document.body) {
//       const ov =
//         window.getComputedStyle(el).overflow +
//         window.getComputedStyle(el).overflowY
//       if (/auto|scroll|hidden/.test(ov)) {
//         fixed.push({ el, prev: el.style.overflow })
//         el.style.overflow = "visible"
//       }
//       el = el.parentElement
//     }
//     return () => {
//       fixed.forEach(({ el, prev }) => {
//         el.style.overflow = prev
//       })
//     }
//   }, [])

//   const isMobile = vw < 900
//   const isTablet = vw >= 900 && vw < 1100

//   const fetchParams: FetchParams = {
//     page,
//     search: debouncedSearch,
//     packageType: activeType,
//     destinationRegions: activeDestRegions,
//     tripTypes: activeTripTypes,
//     durationCategory: activeDur,
//     maxPrice: debouncedPrice,
//     sortBy,
//   }

//   const { data, isLoading, isFetching, isError } = useQuery({
//     queryKey: ["tourism-public", fetchParams],
//     queryFn: () => fetchPackages(fetchParams),
//     staleTime: 60_000,
//   })

//   // Accumulate pages into a single list for "load more"
//   useEffect(() => {
//     if (!data?.data) return
//     if (page === 1) {
//       setAccumulatedPackages(data.data)
//     } else {
//       setAccumulatedPackages((prev) => {
//         const existingIds = new Set(prev.map((p) => p._id))
//         const fresh = data.data.filter((p) => !existingIds.has(p._id))
//         return [...prev, ...fresh]
//       })
//     }
//   }, [data, page])

//   // Prefetch next page
//   useEffect(() => {
//     if (data?.pagination?.hasNext) {
//       const nextParams = { ...fetchParams, page: page + 1 }
//       queryClient.prefetchQuery({
//         queryKey: ["tourism-public", nextParams],
//         queryFn: () => fetchPackages(nextParams),
//       })
//     }
//   }, [data, page])

//   const toggleDestRegion = useCallback((v: string) => {
//     setActiveDestRegions((prev) =>
//       prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
//     )
//   }, [])

//   const toggleTripType = useCallback((v: string) => {
//     setActiveTripTypes((prev) =>
//       prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
//     )
//   }, [])

//   const onReset = () => {
//     setSearch("")
//     setActiveType("all")
//     setMaxPrice(200000)
//     setActiveDur("")
//     setActiveDestRegions([])
//     setActiveTripTypes([])
//     setSortBy("newest")
//   }

//   const handleLoadMore = () => {
//     if (data?.pagination?.hasNext && !isFetching) {
//       setPage((p) => p + 1)
//     }
//   }

//   const total = data?.pagination?.total ?? 0
//   const hasNext = data?.pagination?.hasNext ?? false
//   const isFirstLoad = isLoading && page === 1
//   const isLoadingMore = isFetching && page > 1

//   const cardCols =
//     gridView === "list"
//       ? "1fr"
//       : isMobile
//         ? "1fr"
//         : isTablet
//           ? "repeat(2,1fr)"
//           : "repeat(3,1fr)"

//   const f = "'Inter',sans-serif"

//   const sidebarProps: SidebarProps = {
//     search,
//     setSearch,
//     activeType,
//     setActiveType,
//     maxPrice,
//     setMaxPrice,
//     activeDur,
//     setActiveDur,
//     activeDestRegions,
//     toggleDestRegion,
//     activeTripTypes,
//     toggleTripType,
//     sortBy,
//     setSortBy,
//     onReset,
//     total,
//   }

//   return (
//     <>
//       <link
//         href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
//         rel="stylesheet"
//       />
//       <ToursCursor />

//       <style>{`
//         * { cursor: none !important; }
//         @keyframes fsu { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
//         .t-h1-anim{opacity:0;animation:fsu 1s .35s forwards}
//         .t-eye-anim{opacity:0;animation:fsu .9s .2s forwards}
//         .t-meta-anim{opacity:0;animation:fsu 1s .5s forwards}
//         input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;outline:none;cursor:pointer}
//         input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#1B2B6B;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(27,43,107,.3);cursor:pointer}
//         .tourism-sidebar::-webkit-scrollbar{width:3px}
//         .tourism-sidebar::-webkit-scrollbar-thumb{background:#E8E4DC}
//         @media(max-width:540px){
//           .hero-sect{height:60vh!important;padding:0 20px 48px!important}
//           .cta-sect{padding:60px 20px!important}
//           .promo-strip-inner{flex-direction:column!important;text-align:center!important}
//         }
//         @media(max-width:900px){
//           .feat-card-inner{grid-template-columns:1fr!important}
//           .feat-card-img{min-height:220px!important}
//         }
//         @media(min-width:900px){.mob-filter-bar{display:none!important}}
//         @media(max-width:899px){.tourism-sidebar{display:none!important}}
//       `}</style>

//       <div
//         style={{
//           fontFamily: "'Raleway',sans-serif",
//           background: "#F7F5F0",
//           color: "#1a1a2e",
//           overflowX: "hidden",
//         }}
//       >
//         {/* ─── Hero ─────────────────────────────────────────────────────────── */}
//         <section
//           className="hero-sect"
//           style={{
//             position: "relative",
//             overflow: "hidden",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "flex-end",
//             height: "72vh",
//             minHeight: 560,
//             padding: "0 64px 80px",
//           }}
//         >
//           <video
//             autoPlay
//             loop
//             muted
//             playsInline
//             style={{
//               position: "absolute",
//               inset: 0,
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               transition: "transform 8s ease",
//             }}
//             onMouseEnter={(e) => {
//               ;(e.currentTarget as HTMLElement).style.transform = "scale(1.03)"
//             }}
//             onMouseLeave={(e) => {
//               ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
//             }}
//           >
//             <source src={video} type="video/mp4" />
//           </video>
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               background:
//                 "linear-gradient(180deg,rgba(15,26,66,.25) 0%,rgba(15,26,66,.15) 30%,rgba(15,26,66,.7) 70%,rgba(15,26,66,.92) 100%)",
//             }}
//           />
//           <div style={{ position: "relative", zIndex: 2 }}>
//             <div
//               className="t-eye-anim"
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 10,
//                 fontFamily: f,
//                 fontSize: ".72rem",
//                 fontWeight: 600,
//                 color: "rgba(255,255,255,.5)",
//                 letterSpacing: ".16em",
//                 textTransform: "uppercase",
//                 marginBottom: 18,
//               }}
//             >
//               <span
//                 style={{
//                   display: "inline-block",
//                   width: 30,
//                   height: 1,
//                   background: "rgba(255,255,255,.35)",
//                 }}
//               />
//               Explore · Discover · Experience
//             </div>
//             <h1
//               className="t-h1-anim"
//               style={{
//                 fontFamily: "'Libre Baskerville',serif",
//                 fontSize: "clamp(2.4rem,5.5vw,5.5rem)",
//                 fontWeight: 700,
//                 lineHeight: 1.02,
//                 color: "#fff",
//                 marginBottom: 28,
//               }}
//             >
//               Find Your Perfect
//               <br />
//               <em style={{ fontStyle: "italic", color: "#7ed88a" }}>
//                 Tour Package
//               </em>
//             </h1>
//             <div
//               className="t-meta-anim"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 24,
//                 flexWrap: "wrap",
//               }}
//             >
//               {[
//                 ["240+", "Curated Packages"],
//                 ["Domestic & International", ""],
//                 ["All Budgets", "Welcome"],
//               ].map(([b, r], i) => (
//                 <React.Fragment key={i}>
//                   {i > 0 && (
//                     <div
//                       style={{
//                         width: 1,
//                         height: 20,
//                         background: "rgba(255,255,255,.2)",
//                       }}
//                     />
//                   )}
//                   <div
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".82rem",
//                       color: "rgba(255,255,255,.55)",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 6,
//                     }}
//                   >
//                     <strong style={{ color: "#fff", fontWeight: 600 }}>
//                       {b}
//                     </strong>
//                     {r && <span>{r}</span>}
//                   </div>
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ─── Mobile Filter Bar ─────────────────────────────────────────────── */}
//         <div
//           className="mob-filter-bar"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "12px 20px",
//             background: "#fff",
//             borderBottom: "1px solid #E8E4DC",
//           }}
//         >
//           <span
//             style={{
//               fontFamily: f,
//               fontSize: ".82rem",
//               fontWeight: 600,
//               color: "#1B2B6B",
//             }}
//           >
//             {isLoading ? "Loading…" : `${total} Packages`}
//           </span>
//           <button
//             onClick={() => setSheetOpen(true)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "9px 18px",
//               borderRadius: 999,
//               border: "1.5px solid #E8E4DC",
//               fontFamily: f,
//               fontSize: ".78rem",
//               fontWeight: 600,
//               color: "#1B2B6B",
//               background: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             ⚙ Filters & Sort
//           </button>
//         </div>

//         {/* ─── Mobile Sheet ──────────────────────────────────────────────────── */}
//         <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
//           <div style={{ paddingTop: 8 }}>
//             <div
//               style={{
//                 padding: "20px 28px 12px",
//                 borderBottom: "1px solid #E8E4DC",
//               }}
//             >
//               <div
//                 style={{
//                   fontFamily: "'Libre Baskerville',serif",
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#1B2B6B",
//                 }}
//               >
//                 Filters & Sort
//               </div>
//             </div>
//             <SidebarContent {...sidebarProps} />
//           </div>
//         </MobileSheet>

//         {/* ─── Page Layout ───────────────────────────────────────────────────── */}
//         <div
//           ref={pageWrapRef}
//           style={{
//             display: "grid",
//             gridTemplateColumns: isMobile
//               ? "1fr"
//               : isTablet
//                 ? "260px 1fr"
//                 : "300px 1fr",
//             alignItems: "start",
//           }}
//         >
//           {/* Sticky Sidebar */}
//           <aside
//             className="tourism-sidebar"
//             style={{
//               position: "sticky",
//               top: NAV_H,
//               alignSelf: "start",
//               height: `calc(100vh - ${NAV_H}px)`,
//               overflowY: "auto",
//               background: "#fff",
//               borderRight: "1px solid #E8E4DC",
//             }}
//           >
//             <SidebarContent {...sidebarProps} />
//           </aside>

//           {/* ─── Main Content ────────────────────────────────────────────────── */}
//           <main
//             style={{
//               minWidth: 0,
//               padding: isMobile
//                 ? "28px 16px"
//                 : isTablet
//                   ? "36px 28px"
//                   : "48px 52px",
//               overflowX: "hidden",
//             }}
//           >
//             {/* View toggle */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: 40,
//                 flexWrap: "wrap",
//                 gap: 12,
//               }}
//             >
//               <div
//                 style={{
//                   fontFamily: "'Libre Baskerville',serif",
//                   fontSize: isMobile ? "1.2rem" : "1.5rem",
//                   fontWeight: 700,
//                   color: "#1B2B6B",
//                 }}
//               >
//                 <span style={{ color: "#2E7D32" }}>Featured</span> Packages
//               </div>
//               <div style={{ display: "flex", gap: 6 }}>
//                 {(["grid", "list"] as const).map((v) => (
//                   <button
//                     key={v}
//                     onClick={() => setGridView(v)}
//                     style={{
//                       width: 36,
//                       height: 36,
//                       borderRadius: 8,
//                       border: `1.5px solid ${gridView === v ? "#1B2B6B" : "#E8E4DC"}`,
//                       background: gridView === v ? "#1B2B6B" : "#fff",
//                       color: gridView === v ? "#fff" : "#9494b0",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       fontSize: ".85rem",
//                       transition: "all .2s",
//                     }}
//                   >
//                     {v === "grid" ? "⊞" : "☰"}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Featured highlight card */}
//             <div
//               className="feat-card-inner"
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.2fr 1fr",
//                 borderRadius: 22,
//                 overflow: "hidden",
//                 border: "1px solid #E8E4DC",
//                 background: "#fff",
//                 marginBottom: 32,
//                 transition: "all .38s ease",
//               }}
//               onMouseEnter={(e) => {
//                 const el = e.currentTarget as HTMLElement
//                 el.style.boxShadow = "0 28px 72px rgba(27,43,107,.12)"
//                 el.style.borderColor = "transparent"
//                 el.style.transform = "translateY(-5px)"
//               }}
//               onMouseLeave={(e) => {
//                 const el = e.currentTarget as HTMLElement
//                 el.style.boxShadow = "none"
//                 el.style.borderColor = "#E8E4DC"
//                 el.style.transform = "translateY(0)"
//               }}
//             >
//               <div
//                 className="feat-card-img"
//                 style={{ position: "relative", minHeight: 340 }}
//               >
//                 <img
//                   src="https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=900&auto=format&fit=crop&q=80"
//                   alt="Switzerland"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     position: "absolute",
//                     inset: 0,
//                   }}
//                 />
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     background:
//                       "linear-gradient(to right,transparent 60%,rgba(15,26,66,.05))",
//                   }}
//                 />
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 18,
//                     left: 18,
//                     display: "flex",
//                     gap: 7,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".65rem",
//                       fontWeight: 700,
//                       padding: "4px 11px",
//                       borderRadius: 999,
//                       background: "rgba(27,43,107,0.85)",
//                       color: "#fff",
//                     }}
//                   >
//                     International
//                   </span>
//                   <span
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".65rem",
//                       fontWeight: 700,
//                       padding: "4px 11px",
//                       borderRadius: 999,
//                       background: "#E53E3E",
//                       color: "#fff",
//                     }}
//                   >
//                     🔥 Bestseller
//                   </span>
//                 </div>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   padding: isMobile ? "28px 24px" : "40px 36px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 7,
//                     fontFamily: f,
//                     fontSize: ".65rem",
//                     fontWeight: 700,
//                     color: "#2E7D32",
//                     background: "#e8f5e9",
//                     padding: "5px 13px",
//                     borderRadius: 999,
//                     letterSpacing: ".08em",
//                     textTransform: "uppercase" as const,
//                     marginBottom: 16,
//                     width: "fit-content",
//                   }}
//                 >
//                   ✦ Featured Package
//                 </div>
//                 <div
//                   style={{
//                     fontFamily: "'Libre Baskerville',serif",
//                     fontSize: "1.6rem",
//                     fontWeight: 700,
//                     color: "#1B2B6B",
//                     lineHeight: 1.2,
//                     marginBottom: 12,
//                   }}
//                 >
//                   Swiss Alps &{" "}
//                   <em style={{ fontStyle: "italic", color: "#2E7D32" }}>
//                     Zurich
//                   </em>{" "}
//                   Splendour
//                 </div>
//                 <p
//                   style={{
//                     fontFamily: "'Raleway',sans-serif",
//                     fontSize: ".9rem",
//                     lineHeight: 1.75,
//                     color: "#5a5a7a",
//                     marginBottom: 20,
//                   }}
//                 >
//                   Glide through crystal-clear lakes, snow-kissed peaks, and
//                   charming Alpine villages on this 8-day Swiss masterpiece.
//                 </p>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 8,
//                     marginBottom: 24,
//                   }}
//                 >
//                   {[
//                     ["✈", "Return Flights"],
//                     ["🏨", "4-Star Hotels"],
//                     ["🍽", "Daily Breakfast"],
//                     ["🚌", "All Transfers"],
//                     ["📸", "Expert Guide"],
//                     ["🛡", "Travel Insurance"],
//                   ].map(([ico, txt]) => (
//                     <div
//                       key={txt}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 6,
//                         fontFamily: "'Raleway',sans-serif",
//                         fontSize: ".82rem",
//                         color: "#5a5a7a",
//                       }}
//                     >
//                       <span style={{ color: "#2E7D32" }}>{ico}</span>
//                       {txt}
//                     </div>
//                   ))}
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "flex-end",
//                     gap: 10,
//                     marginBottom: 20,
//                   }}
//                 >
//                   <div>
//                     <div
//                       style={{
//                         fontFamily: f,
//                         fontSize: ".7rem",
//                         color: "#9494b0",
//                         marginBottom: 4,
//                       }}
//                     >
//                       Starting from
//                     </div>
//                     <div
//                       style={{
//                         fontFamily: "'Libre Baskerville',serif",
//                         fontSize: "2rem",
//                         fontWeight: 700,
//                         color: "#1B2B6B",
//                       }}
//                     >
//                       ₹1,24,999
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".88rem",
//                       color: "#9494b0",
//                       textDecoration: "line-through",
//                       marginBottom: 6,
//                     }}
//                   >
//                     ₹1,47,999 &nbsp;
//                     <span
//                       style={{
//                         color: "#E53E3E",
//                         fontWeight: 700,
//                         fontSize: ".82rem",
//                         textDecoration: "none",
//                       }}
//                     >
//                       15% off
//                     </span>
//                   </div>
//                 </div>
//                 <a
//                   href="#"
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 8,
//                     fontFamily: f,
//                     fontSize: ".85rem",
//                     fontWeight: 700,
//                     background: "#1B2B6B",
//                     color: "#fff",
//                     padding: "13px 28px",
//                     borderRadius: 999,
//                     textDecoration: "none",
//                     transition: "all .25s",
//                     width: "fit-content",
//                   }}
//                   onMouseEnter={(e) => {
//                     ;(e.currentTarget as HTMLElement).style.background =
//                       "#243590"
//                     ;(e.currentTarget as HTMLElement).style.transform =
//                       "translateY(-2px)"
//                   }}
//                   onMouseLeave={(e) => {
//                     ;(e.currentTarget as HTMLElement).style.background =
//                       "#1B2B6B"
//                     ;(e.currentTarget as HTMLElement).style.transform =
//                       "translateY(0)"
//                   }}
//                 >
//                   View Package →
//                 </a>
//               </div>
//             </div>

//             {/* Promo Strip */}
//             <div
//               className="promo-strip-inner"
//               style={{
//                 background: "linear-gradient(135deg,#2E7D32 0%,#43A047 100%)",
//                 borderRadius: 18,
//                 padding: isMobile ? "24px 20px" : "28px 36px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 gap: 24,
//                 marginBottom: 36,
//                 flexWrap: "wrap",
//               }}
//             >
//               <div>
//                 <h3
//                   style={{
//                     fontFamily: "'Libre Baskerville',serif",
//                     fontSize: "1.2rem",
//                     fontWeight: 700,
//                     color: "#fff",
//                     marginBottom: 4,
//                   }}
//                 >
//                   🎉 Group Discount Alert!
//                 </h3>
//                 <p
//                   style={{
//                     fontFamily: "'Raleway',sans-serif",
//                     fontSize: ".85rem",
//                     color: "rgba(255,255,255,.7)",
//                   }}
//                 >
//                   Travel with 6+ people and get flat 20% off on any package.
//                 </p>
//               </div>
//               <div
//                 style={{
//                   fontFamily: f,
//                   fontSize: "1.1rem",
//                   fontWeight: 700,
//                   color: "#fff",
//                   letterSpacing: ".12em",
//                   padding: "10px 20px",
//                   borderRadius: 10,
//                   background: "rgba(255,255,255,.18)",
//                   border: "1.5px dashed rgba(255,255,255,.4)",
//                 }}
//               >
//                 HORIZONS25
//               </div>
//               <a
//                 href="#"
//                 style={{
//                   fontFamily: f,
//                   fontSize: ".82rem",
//                   fontWeight: 700,
//                   background: "#fff",
//                   color: "#2E7D32",
//                   padding: "12px 24px",
//                   borderRadius: 999,
//                   textDecoration: "none",
//                   whiteSpace: "nowrap",
//                 }}
//                 onMouseEnter={(e) =>
//                   ((e.currentTarget as HTMLElement).style.transform =
//                     "translateY(-2px)")
//                 }
//                 onMouseLeave={(e) =>
//                   ((e.currentTarget as HTMLElement).style.transform =
//                     "translateY(0)")
//                 }
//               >
//                 Claim Offer →
//               </a>
//             </div>

//             {/* ─── Dynamic Packages Grid ─────────────────────────────────────── */}
//             <SecHeader
//               eyebrow="Explore Packages"
//               title="All Packages"
//               count={total}
//             />

//             {/* Error state */}
//             {isError && (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: "60px 20px",
//                   fontFamily: f,
//                   color: "#9494b0",
//                 }}
//               >
//                 <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
//                 <div
//                   style={{
//                     fontSize: ".95rem",
//                     fontWeight: 600,
//                     color: "#1B2B6B",
//                     marginBottom: 6,
//                   }}
//                 >
//                   Couldn't load packages
//                 </div>
//                 <div style={{ fontSize: ".85rem" }}>
//                   Check your connection and try again.
//                 </div>
//               </div>
//             )}

//             {/* Skeleton grid on first load */}
//             {isFirstLoad && !isError && (
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: cardCols,
//                   gap: 22,
//                   marginBottom: 52,
//                 }}
//               >
//                 {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
//                   <CardSkeleton key={i} />
//                 ))}
//               </div>
//             )}

//             {/* Package cards */}
//             {!isFirstLoad && !isError && accumulatedPackages.length > 0 && (
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: cardCols,
//                   gap: 22,
//                   marginBottom: 32,
//                 }}
//               >
//                 {accumulatedPackages.map((c) => (
//                   <PCard key={c._id} card={c} listView={gridView === "list"} />
//                 ))}
//               </div>
//             )}

//             {/* Loading more skeletons appended at bottom */}
//             {isLoadingMore && (
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: cardCols,
//                   gap: 22,
//                   marginBottom: 32,
//                 }}
//               >
//                 {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
//                   <CardSkeleton key={`more-${i}`} />
//                 ))}
//               </div>
//             )}

//             {/* Empty state */}
//             {!isFirstLoad && !isError && accumulatedPackages.length === 0 && (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: "80px 20px",
//                   fontFamily: f,
//                 }}
//               >
//                 <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🗺</div>
//                 <div
//                   style={{
//                     fontFamily: "'Libre Baskerville',serif",
//                     fontSize: "1.2rem",
//                     fontWeight: 700,
//                     color: "#1B2B6B",
//                     marginBottom: 8,
//                   }}
//                 >
//                   No packages found
//                 </div>
//                 <div
//                   style={{
//                     fontSize: ".88rem",
//                     color: "#9494b0",
//                     marginBottom: 24,
//                   }}
//                 >
//                   Try adjusting your filters or clearing the search.
//                 </div>
//                 <button
//                   onClick={onReset}
//                   style={{
//                     fontFamily: f,
//                     fontSize: ".85rem",
//                     fontWeight: 600,
//                     background: "#1B2B6B",
//                     color: "#fff",
//                     border: "none",
//                     padding: "12px 28px",
//                     borderRadius: 999,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             )}

//             {/* ─── Load More ────────────────────────────────────────────────── */}
//             {!isFirstLoad && !isError && accumulatedPackages.length > 0 && (
//               <div style={{ textAlign: "center", padding: "16px 0 32px" }}>
//                 {hasNext ? (
//                   <button
//                     onClick={handleLoadMore}
//                     disabled={isLoadingMore}
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".88rem",
//                       fontWeight: 600,
//                       background: "transparent",
//                       color: "#1B2B6B",
//                       border: "1.5px solid rgba(27,43,107,.2)",
//                       padding: "14px 40px",
//                       borderRadius: 999,
//                       cursor: isLoadingMore ? "not-allowed" : "pointer",
//                       transition: "all .3s",
//                       opacity: isLoadingMore ? 0.6 : 1,
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: 8,
//                     }}
//                     onMouseEnter={(e) => {
//                       if (isLoadingMore) return
//                       ;(e.currentTarget as HTMLButtonElement).style.background =
//                         "#1B2B6B"
//                       ;(e.currentTarget as HTMLButtonElement).style.color =
//                         "#fff"
//                       ;(
//                         e.currentTarget as HTMLButtonElement
//                       ).style.borderColor = "#1B2B6B"
//                     }}
//                     onMouseLeave={(e) => {
//                       ;(e.currentTarget as HTMLButtonElement).style.background =
//                         "transparent"
//                       ;(e.currentTarget as HTMLButtonElement).style.color =
//                         "#1B2B6B"
//                       ;(
//                         e.currentTarget as HTMLButtonElement
//                       ).style.borderColor = "rgba(27,43,107,.2)"
//                     }}
//                   >
//                     {isLoadingMore ? "Loading…" : `Load More Packages`}{" "}
//                     {!isLoadingMore && "↓"}
//                   </button>
//                 ) : (
//                   <div
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".82rem",
//                       color: "#9494b0",
//                     }}
//                   >
//                     All {total} packages shown
//                   </div>
//                 )}

//                 {/* Pagination info */}
//                 {data?.pagination && (
//                   <div
//                     style={{
//                       fontFamily: f,
//                       fontSize: ".72rem",
//                       color: "#9494b0",
//                       marginTop: 10,
//                     }}
//                   >
//                     Showing {accumulatedPackages.length} of {total} packages
//                     {data.pagination.totalPages > 1 &&
//                       ` · Page ${page} of ${data.pagination.totalPages}`}
//                   </div>
//                 )}
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Tourism
