import React, { useState, useEffect, useRef } from "react"
import {
  // intlPackages,
  PCard,
  SecHeader,
} from "./Tourism"
import { MedicalCursor } from "./cursor/Medicalcursor"
export const tripTypes = [
  { label: "Honeymoon", count: 28 },
  { label: "Family", count: 44 },
  { label: "Adventure", count: 30 },
  { label: "Solo Travel", count: 20 },
  { label: "Luxury", count: 16 },
]
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
// ─── Types ────────────────────────────────────────────────
interface TreatmentCard {
  id: number
  cat: string
  img: string
  tag: string
  hot?: string
  title: string
  desc: string
  saving: string
  featured?: boolean
}

interface Hospital {
  id: number
  img: string
  accred: string
  location: string
  name: string
  type: string
  specs: string[]
  tags: string[]
  rating: string
  reviews: string
}
export const destFilters = [
  { label: "India", count: 48 },
  { label: "Europe", count: 32 },
  { label: "South-East Asia", count: 36 },
  { label: "Middle East", count: 22 },
  { label: "Americas", count: 18 },
]
// ─── Data ─────────────────────────────────────────────────
const treatments: TreatmentCard[] = [
  {
    id: 1,
    cat: "cardiac",
    featured: true,
    img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=900&auto=format&fit=crop&q=80",
    tag: "✚ Cardiac Surgery",
    hot: "Most Sought",
    title: "Cardiac Surgery & Heart Care",
    desc: "Bypass surgery (CABG), valve replacement, angioplasty, pacemaker implants and heart failure treatment — by India's top cardiologists with 98%+ success rates.",
    saving: "Save up to 75% vs. USA",
  },
  {
    id: 2,
    cat: "ortho",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80",
    tag: "✚ Orthopaedics",
    title: "Joint Replacement & Orthopaedics",
    desc: "Knee, hip, shoulder replacement, robotic-assisted joint surgery, spinal fusion, and arthroscopy with top-grade implants.",
    saving: "Save up to 70% vs. UK",
  },
  {
    id: 3,
    cat: "onco",
    img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop&q=80",
    tag: "✚ Oncology",
    hot: "Advanced",
    title: "Cancer Treatment",
    desc: "Chemotherapy, immunotherapy, targeted therapy, CyberKnife radiosurgery, and robotic cancer surgery at India's top oncology centres.",
    saving: "Save up to 65% vs. USA",
  },
  {
    id: 4,
    cat: "neuro",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&auto=format&fit=crop&q=80",
    tag: "✚ Neurology",
    title: "Neurology & Brain Surgery",
    desc: "Brain tumour removal, DBS, stroke management, epilepsy surgery by world-renowned neurosurgeons.",
    saving: "Save up to 72% vs. AU",
  },
  {
    id: 5,
    cat: "cosmetic",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&auto=format&fit=crop&q=80",
    tag: "✚ Cosmetic",
    title: "Cosmetic & Plastic Surgery",
    desc: "Hair transplant, rhinoplasty, liposuction, breast augmentation and full body contouring at accredited centres.",
    saving: "Save up to 80% vs. UK",
  },
  {
    id: 6,
    cat: "cardiac",
    img: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600&auto=format&fit=crop&q=80",
    tag: "✚ Transplant",
    title: "Organ Transplant",
    desc: "Kidney, liver and bone marrow transplants at India's most advanced transplant centres.",
    saving: "Save up to 78% vs. USA",
  },
  {
    id: 7,
    cat: "ortho",
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80",
    tag: "✚ Eye Care",
    title: "Eye Care & LASIK",
    desc: "LASIK, cataract, retinal surgeries, corneal transplants at specialised ophthalmology hospitals.",
    saving: "Save up to 60% vs. USA",
  },
  {
    id: 8,
    cat: "onco",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
    tag: "✚ Dental",
    title: "Dental & Maxillofacial",
    desc: "Implants, veneers, full mouth rehabilitation, orthodontics and cosmetic dentistry at ISO-certified dental hospitals.",
    saving: "Save up to 85% vs. UK",
  },
  {
    id: 9,
    cat: "cosmetic",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
    tag: "✚ Wellness",
    hot: "Trending",
    title: "Wellness & Ayurveda",
    desc: "Panchakarma detox, joint therapies, stress retreats and holistic healing at Kerala's certified Ayurveda centres.",
    saving: "World-renowned treatments",
  },
]

const hospitals: Hospital[] = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=700&auto=format&fit=crop&q=80",
    accred: "✚ JCI + NABH",
    location: "📍 Pan-India",
    name: "Apollo Hospitals",
    type: "Multi-Speciality · Tier 1",
    specs: [
      "10,000+ beds across India",
      "First JCI accredited in South Asia",
      "4,000+ specialist consultants",
    ],
    tags: ["Cardiac", "Oncology", "Transplant", "Neuro"],
    rating: "★★★★★",
    reviews: "4.9 (2.1K)",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&auto=format&fit=crop&q=80",
    accred: "✚ Government Premier",
    location: "📍 New Delhi",
    name: "AIIMS New Delhi",
    type: "Super-Speciality · Premier Govt.",
    specs: [
      "India's #1 ranked medical institute",
      "Complex & rare case specialists",
      "Cutting-edge research & treatment",
    ],
    tags: ["Rare Cases", "Research", "All Specialities"],
    rating: "★★★★★",
    reviews: "4.9 (3.2K)",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=700&auto=format&fit=crop&q=80",
    accred: "✚ JCI Accredited",
    location: "📍 Gurugram",
    name: "Medanta The Medicity",
    type: "Super-Speciality · Private",
    specs: [
      "1,600+ beds, 45 specialities",
      "Robotic surgery pioneer in India",
      "Dedicated international patient wing",
    ],
    tags: ["Robotic", "Cardiac", "Neuro", "Ortho"],
    rating: "★★★★★",
    reviews: "4.8 (1.4K)",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&auto=format&fit=crop&q=80",
    accred: "✚ NABH Certified",
    location: "📍 Delhi · Mumbai · Bengaluru",
    name: "Fortis Healthcare",
    type: "Multi-Speciality · Tier 1",
    specs: [
      "4,000+ beds nationwide",
      "500+ intl. patients per month",
      "Dedicated international lounge",
    ],
    tags: ["Bone Marrow", "IVF", "Cardiac"],
    rating: "★★★★★",
    reviews: "4.8 (1.8K)",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=700&auto=format&fit=crop&q=80",
    accred: "✚ NABH + ISO",
    location: "📍 Vellore, Tamil Nadu",
    name: "CMC Vellore",
    type: "Teaching Hospital · World Renowned",
    specs: [
      "Ranked #1 in India — Newsweek 2023",
      "World-class tropical medicine",
      "Exceptionally affordable excellence",
    ],
    tags: ["Haematology", "Transplant", "Oncology"],
    rating: "★★★★★",
    reviews: "5.0 (2.9K)",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=700&auto=format&fit=crop&q=80",
    accred: "✚ JCI + NABH",
    location: "📍 Mumbai",
    name: "Kokilaben Dhirubhai Ambani",
    type: "Super-Speciality · Luxury",
    specs: [
      "CyberKnife & Da Vinci robot",
      "Western-standard patient experience",
      "Premium international services",
    ],
    tags: ["CyberKnife", "Da Vinci", "Luxury"],
    rating: "★★★★★",
    reviews: "4.9 (1.6K)",
  },
]

const marqueeItems = [
  "NABH Accredited Partners",
  "JCI Certified Hospitals",
  "Medical Visa Assistance",
  "Dedicated Care Coordinator",
  "Zero Hidden Costs",
  "Airport to Hospital Transfer",
  "Interpreter Services — 24 Languages",
  "Post-Recovery Wellness Stays",
]

const steps = [
  {
    n: "01",
    label: "Day 1–2",
    title: "Submit a Free Inquiry",
    desc: "Fill our simple form with your reports and treatment type. No commitment needed — our team reviews everything confidentially.",
  },
  {
    n: "02",
    label: "Day 2–5",
    title: "Free Medical Assessment",
    desc: "We match you with 2–3 specialist doctors for a free virtual consultation and share a transparent, all-inclusive cost estimate.",
  },
  {
    n: "03",
    label: "1–2 Weeks",
    title: "Visa, Flights & Logistics",
    desc: "Medical visa, flight booking, airport transfer, and hospital accommodation — all arranged and coordinated by our team.",
  },
  {
    n: "04",
    label: "On Arrival",
    title: "Treatment & In-Hospital Care",
    desc: "Your dedicated coordinator stays on-ground throughout — liaising with doctors and keeping your family updated every day.",
  },
  {
    n: "05",
    label: "Post-op",
    title: "Recovery & Return Home",
    desc: "Once cleared, enjoy an optional curated wellness retreat. We arrange your return journey with all medical records.",
  },
]

const wiStats = [
  { icon: "🏥", n: "800", suf: "K+", label: "Intl. Patients per Year" },
  { icon: "💰", n: "80", suf: "%", label: "Avg. Cost Savings vs. USA" },
  { icon: "🌍", n: "150", suf: "+", label: "Countries Send Patients" },
  { icon: "⭐", n: "98", suf: "%", label: "Patient Satisfaction Rate" },
]

const wiFacts = [
  {
    icon: "🎓",
    title: "Surgeons Trained at the World's Best",
    desc: "Many Indian doctors completed fellowships at Harvard, Johns Hopkins, and Oxford before returning to practice in India.",
  },
  {
    icon: "💊",
    title: "Pharmacy of the World",
    desc: "India produces 20% of global generic medicines — dramatically reducing post-treatment medication costs.",
  },
  {
    icon: "🌿",
    title: "Heal + Recover in Paradise",
    desc: "After treatment, recover in Kerala's backwaters, Goa's beaches, or Rishikesh's yoga retreats — all included.",
  },
]

// ─── Animated Counter ─────────────────────────────────────
const AnimCounter: React.FC<{ target: number; suffix?: string }> = ({
  target,
  suffix = "",
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          const step = Math.max(1, Math.ceil(target / 55))
          let n = 0
          const ti = setInterval(() => {
            n = Math.min(n + step, target)
            setCount(n)
            if (n >= target) clearInterval(ti)
          }, 30)
        }
      },
      { threshold: 0.5 }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [target])
  return (
    <span ref={ref}>
      {target > 500 ? count.toLocaleString() : count}
      {suffix}
    </span>
  )
}

// ─── Scroll Reveal Hook ───────────────────────────────────
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true)
      },
      { threshold: 0.09 }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])
  return { ref, visible }
}

// ─── RevealDiv ────────────────────────────────────────────
const RV: React.FC<{
  children: React.ReactNode
  delay?: number
  dir?: "up" | "left" | "right"
  style?: React.CSSProperties
  className?: string
}> = ({ children, delay = 0, dir = "up", style, className }) => {
  const { ref, visible } = useReveal()
  const base: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? "none"
      : dir === "left"
        ? "translateX(-28px)"
        : dir === "right"
          ? "translateX(28px)"
          : "translateY(28px)",
    transition: `opacity 0.8s cubic-bezier(.25,.46,.45,.94) ${delay}s, transform 0.8s cubic-bezier(.25,.46,.45,.94) ${delay}s`,
    ...style,
  }
  return (
    <div ref={ref} style={base} className={className}>
      {children}
    </div>
  )
}

// ─── Section Code Label ───────────────────────────────────
const SectionCode: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ children, style }) => (
  <div
    style={{
      fontFamily: "'DM Mono',monospace",
      fontSize: ".62rem",
      color: "var(--teal)",
      letterSpacing: ".2em",
      textTransform: "uppercase" as const,
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 10,
      ...style,
    }}
  >
    <span
      style={{
        width: 30,
        height: 1,
        background: "var(--teal)",
        display: "inline-block",
      }}
    />
    {children}
  </div>
)

// ─── Display Heading ──────────────────────────────────────
const DisplayH2: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ children, style }) => (
  <h2
    style={{
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "clamp(2.4rem,4vw,4rem)",
      fontWeight: 300,
      lineHeight: 1.1,
      color: "var(--navy)",
      marginBottom: 24,
      ...style,
    }}
  >
    {children}
  </h2>
)
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
// ─── Main Component ───────────────────────────────────────
const MedicalTourism: React.FC = () => {
  const [activeCat, setActiveCat] = useState("all")
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )
  const [search, setSearch] = useState("")
  const [maxPrice, setMaxPrice] = useState(200000)
  const [activeDur, setActiveDur] = useState("Any")
  const [gridView, setGridView] = useState<"grid" | "list">("grid")

  const [sheetOpen, setSheetOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeType, setActiveType] = useState<
    "all" | "domestic" | "international"
  >("all")
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
  // const filteredIntl = intlPackages.filter((c) => {
  //   if (activeType === "domestic") return false
  //   return !search || c.title.toLowerCase().includes(search.toLowerCase())
  // })
  const totalVisible = filteredDomestic.length

  useEffect(() => {
    const fn = () => setVw(window.innerWidth)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  const isMobile = vw < 860
  const isTablet = vw >= 860 && vw < 1100

  const filteredTreatments =
    activeCat === "all"
      ? treatments
      : treatments.filter((t) => t.cat === activeCat)
  const cardCols =
    gridView === "list"
      ? "1fr"
      : isMobile
        ? "1fr"
        : isTablet
          ? "repeat(2,1fr)"
          : "repeat(3,1fr)"
  const f = "'Inter',sans-serif"
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
  return (
    <>
      {/* * {
  cursor: none !important;
} */}
      <style>{`
   
  @keyframes medPulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.8);
    opacity: 0;
  }
}
        :root {
          --teal:#007A6E; --teal-mid:#009688; --teal-dim:#005A52;
          --teal-glow:rgba(0,122,110,.12); --teal-pale:rgba(0,122,110,.07);
          --obsidian:#F5F3EF; --charcoal:#EAE7E0; --graphite:#FFFFFF;
          --ivory:#1C1C1E; --ivory-dim:#3D3D40; --ivory-muted:#7A7A85;
          --navy:#1B2B6B; --border:rgba(0,0,0,.09); --border-teal:rgba(0,122,110,.22);
          --red-accent:#D93025;
        }
        .med-wrap { font-family:'DM Sans',sans-serif; background:var(--obsidian); color:var(--ivory); overflow-x:hidden; }
        @keyframes mqs{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes scanMove{0%{top:0;opacity:.4}50%{opacity:.8}100%{top:100%;opacity:.4}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .hero-eyebrow-anim{opacity:0;animation:fadeInUp .8s .3s forwards}
        .hero-h1-anim{opacity:0;animation:fadeInUp 1s .45s forwards}
        .hero-desc-anim{opacity:0;animation:fadeInUp 1s .6s forwards}
        .hero-btns-anim{opacity:0;animation:fadeInUp 1s .75s forwards}
        .mq-run{animation:mqs 36s linear infinite}
        .hero-scan{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--teal),transparent);z-index:10;animation:scanMove 6s ease-in-out infinite;opacity:.4;}
        .step-item:hover{padding-left:8px!important;}
        .step-item:hover .step-num{background:var(--teal)!important;color:#fff!important;border-color:var(--teal)!important;}
        .pillar-item:hover{padding-left:8px!important;}
        .tcard-item:hover{transform:translateY(-4px)!important;box-shadow:0 20px 60px rgba(0,0,0,.12)!important;border-color:var(--border-teal)!important;}
        .tcard-item:hover .tc-arrow-btn{background:var(--teal)!important;color:#fff!important;border-color:var(--teal)!important;}
        .hcard-item:hover .hc-img-inner{transform:scale(1.07)!important;}
        .hcard-item:hover .hc-content-inner{transform:translateY(-8px)!important;}
        .wi-stat-item:hover{border-top-color:rgba(0,201,177,.9)!important;background:rgba(0,100,90,.5)!important;}
        .wi-fact-item:hover{padding-left:6px!important;}
        .btn-teal-cls{display:inline-flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:.72rem;letter-spacing:.08em;background:var(--teal);color:#fff;padding:14px 28px;border:none;border-radius:2px;cursor:pointer;text-transform:uppercase;transition:all .25s;text-decoration:none;}
        .btn-teal-cls:hover{background:var(--teal-dim);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,122,110,.28);}
        .btn-ghost-cls{display:inline-flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:.72rem;letter-spacing:.08em;background:transparent;color:var(--teal);border:1.5px solid var(--border-teal);padding:13px 28px;border-radius:2px;cursor:pointer;text-transform:uppercase;transition:all .25s;text-decoration:none;}
        .btn-ghost-cls:hover{background:var(--teal-pale);border-color:var(--teal);}
        .ttab-btn{font-family:'DM Mono',monospace;font-size:.62rem;padding:7px 16px;border-radius:2px;border:1px solid var(--border);color:var(--ivory-muted);background:transparent;cursor:pointer;transition:all .22s;letter-spacing:.08em;text-transform:uppercase;}
        .ttab-btn:hover{border-color:var(--teal);color:var(--teal);}
        .ttab-btn.active{background:var(--teal);border-color:var(--teal);color:#fff;}
        .hc-btn-cls{font-family:'DM Mono',monospace;font-size:.62rem;color:var(--teal);border:1.5px solid var(--border-teal);padding:6px 14px;border-radius:2px;text-decoration:none;letter-spacing:.06em;text-transform:uppercase;transition:all .2s;background:var(--teal-pale);}
        .hc-btn-cls:hover{background:var(--teal);color:#fff;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:var(--charcoal);}
        ::-webkit-scrollbar-thumb{background:var(--teal-dim);border-radius:2px;}
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
      {/* <MedicalCursor />  */}
      <div className="med-wrap">
        {/* ─── HERO ─── */}
        <section className="hero relative flex h-screen min-h-[700px] flex-col justify-end overflow-hidden px-4 pb-[88px] md:px-16">
          <div className="hbg absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&auto=format&fit=crop&q=85')] bg-cover bg-center" />
          <div className="hov2 absolute inset-0 bg-gradient-to-b from-[rgba(15,26,66,0.2)] via-[rgba(15,26,66,0.12)] via-35% to-[rgba(15,26,66,0.93)] to-75%" />
          <div className="scroll-hint absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 animate-[fsu_1s_0.7s_forwards] flex-col items-center gap-2 opacity-0">
            <div className="sh-line h-11 w-px animate-[shp_2.2s_ease-in-out_infinite] bg-gradient-to-b from-white/50 to-transparent" />
            <span className="sh-txt font-inter text-[0.62rem] tracking-[0.14em] text-white/35 uppercase">
              Scroll
            </span>
          </div>
          <div className="hero-content relative z-[2] max-w-[1100px]">
            <div className="h-eye mb-5 inline-flex animate-[fsu_0.9s_0.2s_forwards] items-center gap-2.5 font-inter text-[0.72rem] font-semibold tracking-[0.16em] text-white/55 uppercase opacity-0"></div>
            <h1 className="h1 font-libre mb-[30px] animate-[fsu_1s_0.35s_forwards] text-[clamp(3rem,6vw,6.2rem)] leading-[1.01] font-bold text-white opacity-0">
              We Craft Journeys
              <br />
              That Become{" "}
              <em className="text-[#7ed88a] italic not-italic">Stories</em>
              <br />
              For a Lifetime.
            </h1>
            <div className="h-row flex animate-[fsu_1s_0.5s_forwards] flex-col items-start justify-between gap-10 opacity-0 md:flex-row md:items-end">
              <p className="h-desc max-w-[460px] text-base leading-[1.8] text-white/60">
                Twenty years curating the world's finest travel experiences for
                explorers who believe the journey is just as important as the
                destination.
              </p>
              <div className="h-stats flex gap-11">
                <div className="hs text-right">
                  <div className="hs-n font-libre font-inter text-[2.2rem] leading-none font-bold text-white">
                    48K<sup className="text-[1.1rem] text-[#7ed88a]">+</sup>
                  </div>
                  <div className="hs-l mt-1 font-inter text-[0.68rem] tracking-[0.1em] text-white/40 uppercase">
                    Travellers
                  </div>
                </div>
                <div className="hs text-right">
                  <div className="hs-n font-libre font-inter text-[2.2rem] leading-none font-bold text-white">
                    120<sup className="text-[1.1rem] text-[#7ed88a]">+</sup>
                  </div>
                  <div className="hs-l mt-1 font-inter text-[0.68rem] tracking-[0.1em] text-white/40 uppercase">
                    Countries
                  </div>
                </div>
                <div className="hs text-right">
                  <div className="hs-n font-libre font-inter text-[2.2rem] leading-none font-bold text-white">
                    4.9<sup className="text-[1.1rem] text-[#7ed88a]">★</sup>
                  </div>
                  <div className="hs-l mt-1 font-inter text-[0.68rem] tracking-[0.1em] text-white/40 uppercase">
                    Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            minHeight: isMobile ? "auto" : "75vh",
          }}
        >
          <RV
            dir="left"
            style={{
              position: "relative",
              overflow: "hidden",
              height: isMobile ? "50vw" : "auto",
              minHeight: isMobile ? 240 : 0,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=900&auto=format&fit=crop&q=80"
              alt="Doctor consulting patient"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(.88) saturate(.9)",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right,transparent 60%,var(--charcoal) 100%),linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.28) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 32,
                left: 32,
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "8rem",
                fontWeight: 700,
                color: "rgba(255,255,255,.12)",
                lineHeight: 1,
                userSelect: "none" as const,
              }}
            >
              01
            </div>
            <div
              style={{
                position: "absolute",
                top: 32,
                right: 32,
                background: "var(--teal)",
                color: "#fff",
                fontFamily: "'DM Mono',monospace",
                fontSize: ".62rem",
                fontWeight: 500,
                letterSpacing: ".12em",
                textTransform: "uppercase" as const,
                padding: "8px 16px",
                borderRadius: 2,
              }}
            >
              Why Horizons Medical
            </div>
          </RV>

          <RV
            dir="right"
            style={{
              background: "var(--charcoal)",
              padding: isMobile ? "60px 22px" : "80px 72px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(to right,var(--teal),transparent)",
              }}
            />
            <SectionCode>Our Commitment</SectionCode>
            <DisplayH2>
              World-Class Care,
              <br />
              <em style={{ fontStyle: "italic", color: "var(--teal)" }}>
                Without
              </em>{" "}
              the
              <br />
              <strong style={{ fontWeight: 700, color: "var(--navy)" }}>
                World-Class Bill.
              </strong>
            </DisplayH2>
            <p
              style={{
                fontSize: ".93rem",
                lineHeight: 1.9,
                color: "var(--ivory-dim)",
                marginBottom: 16,
              }}
            >
              India is ranked among the top 5 global medical tourism
              destinations — combining internationally trained surgeons,
              state-of-the-art infrastructure, and treatment costs that are
              60–80% lower than the US, UK, or Australia.
            </p>
            <p
              style={{
                fontSize: ".93rem",
                lineHeight: 1.9,
                color: "var(--ivory-dim)",
                marginBottom: 0,
              }}
            >
              At Horizons, we handle everything beyond the medical. From visa
              and flights to on-ground coordination and a curated recovery
              retreat — you focus entirely on healing.
            </p>

            <div
              style={{
                marginTop: 36,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {[
                {
                  n: "01",
                  title: "Internationally Accredited Hospitals",
                  desc: "Every partner holds NABH or JCI accreditation — the global gold standard for healthcare quality.",
                },
                {
                  n: "02",
                  title: "Transparent, All-Inclusive Pricing",
                  desc: "Full cost breakdown before you fly — surgery, stay, medications, logistics. No surprises, ever.",
                },
                {
                  n: "03",
                  title: "Personal Care Coordinator",
                  desc: "A dedicated human coordinator liaises between you and your medical team — before, during, and after.",
                },
              ].map((p, i) => (
                <RV key={i} delay={i * 0.07}>
                  <div
                    className="pillar-item"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      padding: "18px 0",
                      borderBottom: "1px solid var(--border)",
                      borderTop: i === 0 ? "1px solid var(--border)" : "none",
                      transition: "all .3s",
                      paddingLeft: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: ".65rem",
                        color: "var(--teal)",
                        marginTop: 4,
                        flexShrink: 0,
                        letterSpacing: ".1em",
                      }}
                    >
                      {p.n}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: ".9rem",
                          fontWeight: 600,
                          color: "var(--navy)",
                          marginBottom: 5,
                        }}
                      >
                        {p.title}
                      </div>
                      <p
                        style={{
                          fontSize: ".82rem",
                          lineHeight: 1.65,
                          color: "var(--ivory-muted)",
                          margin: 0,
                        }}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </RV>
              ))}
            </div>
          </RV>
        </div>

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
              </div>
            </div>
            <SidebarContent {...sidebarProps} />
          </div>
        </MobileSheet>

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
          </main>
        </div> */}

        {/* ─── TREATMENTS ─── */}
        {/* <section
          id="treatments"
          style={{
            padding: isMobile ? "70px 22px" : "120px 72px",
            background: "var(--obsidian)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 24 : 60,
              alignItems: "end",
              marginBottom: 72,
            }}
          >
            <RV>
              <SectionCode>Medical Services</SectionCode>
              <DisplayH2>
                Treatments &amp;
                <br />
                <em style={{ fontStyle: "italic", color: "var(--teal)" }}>
                  Specialties
                </em>
              </DisplayH2>
              <p
                style={{
                  fontSize: ".93rem",
                  lineHeight: 1.9,
                  color: "var(--ivory-dim)",
                  maxWidth: 440,
                }}
              >
                40+ treatment categories across India's finest hospitals — from
                complex cardiac surgeries to transformative wellness programs.
              </p>
            </RV>
            <RV
              delay={0.14}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMobile ? "flex-start" : "flex-end",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: isMobile ? "flex-start" : "flex-end",
                }}
              >
                {[
                  ["all", "All"],
                  ["cardiac", "Cardiac"],
                  ["ortho", "Orthopaedics"],
                  ["onco", "Oncology"],
                  ["cosmetic", "Cosmetic"],
                  ["neuro", "Neurology"],
                ].map(([cat, label]) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`ttab-btn${activeCat === cat ? "active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </RV>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                  ? "repeat(6,1fr)"
                  : "repeat(12,1fr)",
              gap: 16,
            }}
          >
            {filteredTreatments.map((card, idx) => {
              const isFeatured = card.featured && activeCat === "all"
              const colSpan = isMobile
                ? 1
                : isTablet
                  ? isFeatured
                    ? 6
                    : idx % 3 === 1
                      ? 3
                      : 3
                  : isFeatured
                    ? 5
                    : [4, 3, 3, 4, 3, 4, 5, 4][idx % 8]
              return (
                <RV
                  key={card.id}
                  delay={idx * 0.05}
                  style={{ gridColumn: `span ${colSpan}` }}
                >
                  <div
                    className="tcard-item"
                    style={{
                      background: "var(--graphite)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      overflow: "hidden",
                      transition: "all .4s cubic-bezier(.25,.46,.45,.94)",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        overflow: "hidden",
                        position: "relative",
                        flexShrink: 0,
                        height: isFeatured ? 280 : 160,
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
                          filter: "brightness(.82) saturate(.9)",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.45) 100%)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 12,
                          left: 12,
                          fontFamily: "'DM Mono',monospace",
                          fontSize: ".58rem",
                          color: "#fff",
                          background: "rgba(0,122,110,.75)",
                          border: "1px solid rgba(0,122,110,.5)",
                          padding: "4px 10px",
                          borderRadius: 2,
                          letterSpacing: ".1em",
                          textTransform: "uppercase" as const,
                        }}
                      >
                        {card.tag}
                      </div>
                      {card.hot && (
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            background: "var(--red-accent)",
                            color: "#fff",
                            fontFamily: "'DM Mono',monospace",
                            fontSize: ".56rem",
                            padding: "4px 10px",
                            borderRadius: 2,
                            letterSpacing: ".08em",
                            textTransform: "uppercase" as const,
                          }}
                        >
                          {card.hot}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        padding: "20px 20px 22px",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: isFeatured ? "1.5rem" : "1.15rem",
                          fontWeight: 600,
                          color: "var(--navy)",
                          marginBottom: 8,
                          lineHeight: 1.25,
                        }}
                      >
                        {card.title}
                      </div>
                      <p
                        style={{
                          fontSize: ".8rem",
                          lineHeight: 1.7,
                          color: "var(--ivory-muted)",
                          flex: 1,
                          marginBottom: 16,
                        }}
                      >
                        {card.desc}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: 12,
                          borderTop: "1px solid var(--border)",
                          marginTop: "auto",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Mono',monospace",
                            fontSize: ".62rem",
                            color: "var(--teal)",
                            letterSpacing: ".06em",
                          }}
                        >
                          {card.saving}
                        </span>
                        <a
                          href="#inquiry"
                          className="tc-arrow-btn"
                          style={{
                            width: 28,
                            height: 28,
                            border: "1.5px solid var(--border-teal)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--teal)",
                            fontSize: ".8rem",
                            transition: "all .25s",
                            textDecoration: "none",
                          }}
                        >
                          →
                        </a>
                      </div>
                    </div>
                  </div>
                </RV>
              )
            })}
          </div>
        </section> */}

        {/* <section
          id="process"
          style={{
            background: "var(--charcoal)",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            minHeight: isMobile ? "auto" : "100vh",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                width: 1,
                background: "var(--border)",
                zIndex: 1,
              }}
            />
          )}

          <div
            style={{
              padding: isMobile ? "70px 22px" : "120px 72px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <RV>
              <SectionCode>How It Works</SectionCode>
              <DisplayH2>
                Your Path to
                <br />
                <em style={{ fontStyle: "italic", color: "var(--teal)" }}>
                  Recovery,
                </em>
                <br />
                <strong style={{ fontWeight: 700, color: "var(--navy)" }}>
                  Step by Step.
                </strong>
              </DisplayH2>
              <p
                style={{
                  fontSize: ".93rem",
                  lineHeight: 1.9,
                  color: "var(--ivory-dim)",
                  maxWidth: 380,
                  marginTop: 16,
                }}
              >
                From your first message to the flight home — we handle every
                detail so you focus entirely on healing.
              </p>
            </RV>
            <div style={{ marginTop: 48 }}>
              {steps.map((s, i) => (
                <RV key={i} delay={i * 0.07}>
                  <div
                    className="step-item"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "48px 1fr",
                      gap: 20,
                      padding: "24px 0",
                      paddingLeft: 0,
                      borderBottom: "1px solid var(--border)",
                      borderTop: i === 0 ? "1px solid var(--border)" : "none",
                      transition: "all .3s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        className="step-num"
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: ".65rem",
                          color: "var(--teal)",
                          letterSpacing: ".1em",
                          width: 28,
                          height: 28,
                          border: "1.5px solid var(--border-teal)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all .3s",
                        }}
                      >
                        {s.n}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: ".58rem",
                          color: "var(--teal)",
                          letterSpacing: ".15em",
                          textTransform: "uppercase" as const,
                          marginBottom: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {s.label}
                        <span
                          style={{
                            flex: 1,
                            height: 1,
                            background: "var(--border-teal)",
                            maxWidth: 40,
                            display: "inline-block",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: "1.2rem",
                          fontWeight: 600,
                          color: "var(--navy)",
                          marginBottom: 6,
                          lineHeight: 1.2,
                        }}
                      >
                        {s.title}
                      </div>
                      <p
                        style={{
                          fontSize: ".8rem",
                          lineHeight: 1.7,
                          color: "var(--ivory-muted)",
                          margin: 0,
                        }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </RV>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              overflow: "hidden",
              height: isMobile ? "50vw" : "auto",
              minHeight: isMobile ? 240 : 0,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=900&auto=format&fit=crop&q=80"
              alt="Hospital corridor"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(.72) saturate(.8)",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right,var(--charcoal) 0%,transparent 45%),linear-gradient(to top,rgba(234,231,224,.6) 0%,transparent 55%)",
              }}
            />
            {!isMobile && (
              <div
                style={{
                  position: "absolute",
                  bottom: 48,
                  right: 48,
                  zIndex: 5,
                  background: "rgba(255,255,255,.92)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--border-teal)",
                  borderRadius: 6,
                  padding: 28,
                  maxWidth: 300,
                  boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "1.1rem",
                    color: "var(--navy)",
                    marginBottom: 18,
                  }}
                >
                  Typical Journey Timeline
                </div>
                {[
                  ["Initial inquiry → Quote", "2–5 days"],
                  ["Visa + Travel booking", "1–2 weeks"],
                  ["Surgery + Hospital stay", "3–10 days"],
                  ["Recovery before departure", "7–14 days"],
                ].map(([label, val], i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: ".75rem",
                    }}
                  >
                    <span style={{ color: "var(--ivory-muted)" }}>{label}</span>
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        color: "var(--teal)",
                        fontSize: ".7rem",
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0 0",
                    fontSize: ".75rem",
                    borderTop: "1px solid rgba(0,201,177,.2)",
                    marginTop: 2,
                  }}
                >
                  <span style={{ color: "var(--ivory)", fontWeight: 500 }}>
                    Full journey duration
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      color: "var(--teal)",
                      fontSize: ".85rem",
                    }}
                  >
                    ~3 Weeks
                  </span>
                </div>
              </div>
            )}
          </div>
        </section> */}

        {/* <section
          id="hospitals"
          style={{
            padding: isMobile ? "70px 22px" : "120px 72px",
            background: "var(--obsidian)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 24 : 60,
              alignItems: "end",
              marginBottom: 64,
            }}
          >
            <RV>
              <SectionCode>Partner Network</SectionCode>
              <DisplayH2>
                India's Finest
                <br />
                <em style={{ fontStyle: "italic", color: "var(--teal)" }}>
                  Healthcare
                </em>{" "}
                Partners
              </DisplayH2>
            </RV>
            <RV delay={0.14}>
              <p
                style={{
                  fontSize: ".93rem",
                  lineHeight: 1.9,
                  color: "var(--ivory-dim)",
                  maxWidth: 340,
                }}
              >
                Every hospital is personally vetted, NABH or JCI accredited, and
                staffed with internationally trained specialists. We accept
                nothing less.
              </p>
            </RV>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                  ? "1fr 1fr"
                  : "repeat(3,1fr)",
              gap: 1,
              background: "var(--border)",
            }}
          >
            {hospitals.map((h, i) => (
              <RV key={h.id} delay={i * 0.07}>
                <div
                  className="hcard-item"
                  style={{
                    background: "var(--graphite)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all .4s cubic-bezier(.25,.46,.45,.94)",
                  }}
                >
                  <div
                    style={{
                      height: 260,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={h.img}
                      alt={h.name}
                      loading="lazy"
                      className="hc-img-inner"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform .8s ease",
                        filter: "brightness(.78) saturate(.85)",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: 20,
                        zIndex: 1,
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "7rem",
                        fontWeight: 700,
                        color: "rgba(255,255,255,.04)",
                        lineHeight: 1,
                        userSelect: "none" as const,
                      }}
                    >
                      0{h.id}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.8) 100%)",
                        transition: "opacity .4s",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        zIndex: 2,
                        fontFamily: "'DM Mono',monospace",
                        fontSize: ".56rem",
                        color: "var(--teal)",
                        background: "rgba(0,201,177,.1)",
                        border: "1px solid rgba(0,201,177,.2)",
                        padding: "4px 10px",
                        borderRadius: 2,
                        letterSpacing: ".1em",
                        textTransform: "uppercase" as const,
                      }}
                    >
                      {h.accred}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 14,
                        right: 14,
                        zIndex: 2,
                        fontFamily: "'DM Mono',monospace",
                        fontSize: ".6rem",
                        color: "rgba(255,255,255,.5)",
                        letterSpacing: ".08em",
                      }}
                    >
                      {h.location}
                    </div>
                  </div>
                  <div
                    className="hc-content-inner"
                    style={{
                      padding: "24px 24px 28px",
                      borderTop: "1px solid var(--border)",
                      transition: "transform .4s",
                      background: "var(--graphite)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        color: "var(--navy)",
                        marginBottom: 6,
                        lineHeight: 1.2,
                      }}
                    >
                      {h.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: ".6rem",
                        color: "var(--teal)",
                        letterSpacing: ".1em",
                        textTransform: "uppercase" as const,
                        marginBottom: 14,
                      }}
                    >
                      {h.type}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        marginBottom: 16,
                      }}
                    >
                      {h.specs.map((s, j) => (
                        <div
                          key={j}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: ".78rem",
                            color: "var(--ivory-dim)",
                          }}
                        >
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: "var(--teal)",
                              flexShrink: 0,
                              display: "inline-block",
                            }}
                          />
                          {s}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginBottom: 18,
                      }}
                    >
                      {h.tags.map((t, j) => (
                        <span
                          key={j}
                          style={{
                            fontFamily: "'DM Mono',monospace",
                            fontSize: ".58rem",
                            color: "var(--ivory-muted)",
                            background: "var(--charcoal)",
                            padding: "3px 10px",
                            borderRadius: 2,
                            letterSpacing: ".05em",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: ".7rem",
                            color: "#e09500",
                            letterSpacing: 1,
                          }}
                        >
                          {h.rating}
                        </span>
                        <span
                          style={{
                            fontSize: ".7rem",
                            color: "var(--ivory-muted)",
                            fontFamily: "'DM Mono',monospace",
                          }}
                        >
                          {h.reviews}
                        </span>
                      </div>
                      <a href="#inquiry" className="hc-btn-cls">
                        Enquire →
                      </a>
                    </div>
                  </div>
                </div>
              </RV>
            ))}
          </div>
        </section> */}

        {/* <section
          style={{
            position: "relative",
            minHeight: isMobile ? "auto" : "80vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&auto=format&fit=crop&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(.28) saturate(.5)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg,rgba(27,43,107,.96) 0%,rgba(27,43,107,.82) 50%,rgba(0,80,72,.75) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: isMobile ? "70px 22px" : "100px 72px",
              width: "100%",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 40 : 80,
              alignItems: "center",
            }}
          >
            <div>
              <RV>
                <SectionCode style={{ color: "rgba(0,201,177,.85)" }}>
                  Why India
                </SectionCode>
              </RV>
              <RV delay={0.07}>
                <DisplayH2 style={{ color: "#fff" }}>
                  The World Heals
                  <br />
                  in{" "}
                  <em style={{ fontStyle: "italic", color: "#7ee8d4" }}>
                    India.
                  </em>
                </DisplayH2>
              </RV>
              <RV delay={0.14}>
                <p
                  style={{
                    fontSize: ".93rem",
                    lineHeight: 1.9,
                    color: "rgba(255,255,255,.55)",
                    marginBottom: 0,
                  }}
                >
                  India treats over 800,000 international patients annually —
                  backed by Harvard-trained surgeons, WHO-grade infrastructure,
                  and costs that make premium healthcare genuinely accessible.
                </p>
              </RV>
              <RV delay={0.21}>
                <div style={{ marginTop: 0 }}>
                  {wiFacts.map((f, i) => (
                    <div
                      key={i}
                      className="wi-fact-item"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 16,
                        padding: "20px 0",
                        paddingLeft: 0,
                        borderBottom: "1px solid rgba(255,255,255,.1)",
                        transition: "all .3s",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.1rem",
                          flexShrink: 0,
                          marginTop: 3,
                        }}
                      >
                        {f.icon}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: ".88rem",
                            fontWeight: 600,
                            color: "#fff",
                            marginBottom: 4,
                          }}
                        >
                          {f.title}
                        </div>
                        <p
                          style={{
                            fontSize: ".78rem",
                            lineHeight: 1.65,
                            color: "rgba(255,255,255,.5)",
                            margin: 0,
                          }}
                        >
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </RV>
            </div>

            <RV delay={0.14}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                  background: "rgba(255,255,255,.12)",
                }}
              >
                {wiStats.map((s, i) => (
                  <div
                    key={i}
                    className="wi-stat-item"
                    style={{
                      background: "rgba(27,43,107,.7)",
                      backdropFilter: "blur(12px)",
                      padding: "36px 28px",
                      borderTop: "3px solid transparent",
                      transition: "all .3s",
                    }}
                  >
                    <div style={{ fontSize: "1.4rem", marginBottom: 12 }}>
                      {s.icon}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "3rem",
                        fontWeight: 600,
                        color: "#fff",
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      <AnimCounter target={parseInt(s.n)} />
                      <em style={{ fontStyle: "normal", color: "#7ee8d4" }}>
                        {s.suf}
                      </em>
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: ".62rem",
                        color: "rgba(255,255,255,.5)",
                        letterSpacing: ".1em",
                        textTransform: "uppercase" as const,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </RV>
          </div>
        </section> */}

        {/* <footer
          style={{
            background: "#0f1a42",
            padding: isMobile ? "48px 22px 28px" : "64px 72px 36px",
            borderTop: "1px solid rgba(255,255,255,.04)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr",
              gap: 40,
              marginBottom: 48,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 16,
                  letterSpacing: ".02em",
                }}
              >
                Horizons<span style={{ color: "var(--teal)" }}> ✚</span> Medical
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: ".85rem",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,.4)",
                  maxWidth: 280,
                }}
              >
                World-class healthcare, without the world-class bill. Connecting
                patients globally to India's finest hospitals since 2004.
              </p>
            </div>
            {[
              {
                title: "Services",
                links: [
                  "Cardiac Surgery",
                  "Orthopaedics",
                  "Oncology",
                  "Neurology",
                  "Cosmetic Surgery",
                ],
              },
              {
                title: "Hospitals",
                links: [
                  "Apollo Hospitals",
                  "AIIMS Delhi",
                  "Medanta",
                  "Fortis",
                  "CMC Vellore",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "How It Works",
                  "Testimonials",
                  "Contact",
                  "Privacy Policy",
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: ".62rem",
                    color: "var(--teal)",
                    letterSpacing: ".18em",
                    textTransform: "uppercase" as const,
                    marginBottom: 16,
                  }}
                >
                  {col.title}
                </div>
                {col.links.map((l) => (
                  <div
                    key={l}
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: ".82rem",
                      color: "rgba(255,255,255,.38)",
                      marginBottom: 10,
                      cursor: "pointer",
                      transition: "color .2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,.38)")
                    }
                  >
                    {l}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,.06)",
              paddingTop: 28,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: ".62rem",
                color: "rgba(255,255,255,.22)",
                letterSpacing: ".06em",
              }}
            >
              © 2026 Horizons Medical Tourism. All rights reserved.
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (l) => (
                  <span
                    key={l}
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: ".6rem",
                      color: "rgba(255,255,255,.28)",
                      cursor: "pointer",
                      letterSpacing: ".06em",
                      transition: "color .2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,.28)")
                    }
                  >
                    {l}
                  </span>
                )
              )}
            </div>
          </div>
        </footer> */}
      </div>
    </>
  )
}

export default MedicalTourism
