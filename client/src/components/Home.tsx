import React, { useState, useEffect, useRef, useCallback } from "react"
import type { Page } from "./Navbar"
import DestinationsCarousel from "./Destinationscarousel"

interface HomeProps {
  onNavigate: (page: Page) => void
}

/* ─── DATA ─────────────────────────────────────────────── */

const heroSlides = [
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=70",
    eyebrow: "Summer 2026 Special",
    h1Parts: ["Explore the", "World with", "Udayam"],
    emWord: "Udayam",
    desc: "Premium tour packages, medical tourism, visa services, and global recruitment — your trusted partner since 2010.",
    btn1: { label: "✈️ View Packages", page: "tourism" as Page },
    btn2: { label: "Get Free Quote", page: "contact" as Page },
  },
  {
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=120&q=70",
    eyebrow: "Domestic Heritage",
    h1Parts: ["Royal", "Rajasthan", "Awaits You"],
    emWord: "Rajasthan",
    desc: "Gilded palaces, camel dunes at sunset, and vibrant bazaars — India's most regal state in a curated tour.",
    btn1: { label: "🏰 Book Now", page: "tourism" as Page },
    btn2: { label: "View Itinerary", page: "tourism" as Page },
  },
  {
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=120&q=70",
    eyebrow: "International Tours",
    h1Parts: ["Thailand —", "Temples,", "Beaches & More"],
    emWord: "Temples,",
    desc: "Bangkok, Phuket, Pattaya in one unforgettable journey. Visa assistance included with all packages.",
    btn1: { label: "🌴 Explore Thailand", page: "tourism" as Page },
    btn2: { label: "Visa Help", page: "travel" as Page },
  },
  {
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&q=70",
    eyebrow: "Medical Tourism",
    h1Parts: ["World-Class", "Healthcare", "Abroad"],
    emWord: "Healthcare",
    desc: "JCI-accredited hospitals in Thailand, Malaysia & Singapore. End-to-end coordination for your medical journey.",
    btn1: { label: "🏥 Know More", page: "medical" as Page },
    btn2: { label: "Free Consultation", page: "contact" as Page },
  },
]

// const searchTabs = [
//   "🌍 Tours & Packages",
//   "✈️ Flights & Visa",
//   "🏥 Medical Tourism",
//   "🎓 Foreign Education",
//   "💼 Recruitment",
// ]

const services = [
  {
    icon: "🌍",
    num: "01",
    title: "Tourism",
    desc: "Domestic & international packages for every kind of traveller — adventure, leisure, heritage, and honeymoon.",
    cta: "Explore packages →",
    page: "tourism" as Page,
  },
  {
    icon: "🏥",
    num: "02",
    title: "Medical Tourism",
    desc: "World-class treatments at JCI-accredited hospitals abroad with full end-to-end coordination and care.",
    cta: "Learn more →",
    page: "medical" as Page,
  },
  {
    icon: "✈️",
    num: "03",
    title: "Travel Services",
    desc: "Flight booking, visa assistance, documentation guidance — everything for smooth and stress-free travel.",
    cta: "View services →",
    page: "travel" as Page,
  },
  {
    icon: "📦",
    num: "04",
    title: "Trade",
    desc: "Import and export facilitation across multiple industry categories with documentation and logistics support.",
    cta: "Get in touch →",
    page: "trade" as Page,
  },
  {
    icon: "🎓",
    num: "05",
    title: "Foreign Education",
    desc: "Study abroad guidance, admissions support, and student visa assistance for your global academic journey.",
    cta: "Explore destinations →",
    page: "education" as Page,
  },
  {
    icon: "💼",
    num: "06",
    title: "Recruitment",
    desc: "Domestic and international placement connecting skilled talent with the right opportunities worldwide.",
    cta: "Register now →",
    page: "recruitment" as Page,
  },
]

const catPills = [
  "🌟 All",
  "🏔️ Adventure",
  "🏖️ Beach",
  "🏰 Heritage",
  "💑 Honeymoon",
  "👨‍👩‍👧 Family",
]

const tourCards = [
  {
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
    badge: { label: "Bestseller", color: "#FEF2F2", text: "#E53935" },
    dur: "7 Days",
    loc: "Jaipur · Jodhpur · Udaipur",
    title: "Royal Rajasthan Heritage Circuit — Palaces, Forts & Desert Safari",
    rating: "4.9",
    reviews: "312 reviews",
    tag: "Domestic",
    tagColor: "#E8ECFA",
    tagText: "#1B2B6B",
    price: "₹28,500",
  },
  {
    img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    badge: { label: "Top Rated", color: "#E8F5E9", text: "#2E7D32" },
    dur: "5 Days",
    loc: "Alleppey · Munnar · Thekkady",
    title: "Kerala Backwaters & Misty Hills — Houseboat & Tea Estate Retreat",
    rating: "4.8",
    reviews: "247 reviews",
    tag: "Domestic",
    tagColor: "#E8ECFA",
    tagText: "#1B2B6B",
    // price: "₹22,000",
  },
  {
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
    badge: { label: "Hot Deal", color: "#FEF2F2", text: "#E53935" },
    dur: "6 Days",
    loc: "Bangkok · Pattaya · Phuket",
    title: "Thailand Paradise — Temples, Islands & Culture",
    rating: "4.9",
    reviews: "589 reviews",
    tag: "International",
    tagColor: "#FFFBEB",
    tagText: "#92400E",
    price: "₹55,000",
  },
  {
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
    badge: { label: "Premium", color: "#E8ECFA", text: "#1B2B6B" },
    dur: "8 Days",
    loc: "Zurich · Interlaken · Geneva",
    title: "Swiss Alps Splendour — Jungfraujoch & Lake Geneva",
    rating: "5.0",
    reviews: "198 reviews",
    tag: "International",
    tagColor: "#FFFBEB",
    tagText: "#92400E",
    price: "₹1,85,000",
  },
]

const stats = [
  { num: "12K", sup: "+", label: "Happy Travellers" },
  { num: "80", sup: "+", label: "Destinations" },
  { num: "500", sup: "+", label: "Tour Packages" },
  { num: "98", sup: "%", label: "Satisfaction Rate" },
]

const deals = [
  {
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    tag: "25% OFF",
    title: "Cherry Blossom Japan Tour",
    sub: "Tokyo · Kyoto · Osaka · Nara",
    price: "Starting from ₹1,45,000/person",
    big: true,
  },
  {
    img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
    tag: "HONEYMOON",
    title: "Maldives Water Villa",
    sub: "Overwater Paradise · 5 Nights",
    price: "From ₹95,000/person",
    big: false,
  },
  {
    img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&q=80",
    tag: "LAST MINUTE",
    title: "Goa Beach Escape",
    sub: "North & South Goa · 4 Nights",
    price: "From ₹12,500/person",
    big: false,
  },
]

const whyUs = [
  {
    icon: "🏅",
    title: "15+ Years of Trust",
    desc: "Over a decade of crafting journeys for thousands of happy travellers across India and globally.",
  },
  {
    icon: "💰",
    title: "Best Price Guarantee",
    desc: "Transparent pricing with zero hidden surprises. Found it cheaper? We'll match the price.",
  },
  {
    icon: "🛡️",
    title: "Safe & Insured Travel",
    desc: "Fully insured packages, verified vendors, and 24/7 emergency support while you travel.",
  },
  {
    icon: "✈️",
    title: "End-to-End Service",
    desc: "Flights, hotels, visa, transfers, sightseeing — we handle everything so you just enjoy.",
  },
]

const testimonials = [
  {
    av: "P",
    stars: "★★★★★",
    text: '"The Rajasthan tour was absolutely magical. Every detail was taken care of — the hotels, transport, guides. Udayam made it feel completely effortless and truly royal!"',
    name: "Priya Menon",
    trip: "📍 Rajasthan Heritage Tour · 2025",
  },
  {
    av: "A",
    stars: "★★★★★",
    text: '"Our Maldives honeymoon was beyond our dreams. The water villa, sunset dinners, snorkelling — every moment was perfect. The team coordinated everything seamlessly!"',
    name: "Arjun & Sneha Pillai",
    trip: "📍 Maldives Honeymoon · 2025",
  },
  {
    av: "R",
    stars: "★★★★★",
    text: '"Switzerland with the family was the best decision we made. The Jungfraujoch ride, the team handled our visa and arrangements impeccably. Truly world-class service!"',
    name: "Rajesh Krishnamurthy",
    trip: "📍 Swiss Alps Family Tour · 2025",
  },
]

const footerServices: { label: string; page: Page }[] = [
  { label: "Tourism", page: "tourism" },
  { label: "Medical Tourism", page: "medical" },
  { label: "Travel Services", page: "travel" },
  { label: "Trade", page: "trade" },
  { label: "Foreign Education", page: "education" },
  { label: "Recruitment", page: "recruitment" },
]

/* ─── HELPERS ───────────────────────────────────────────── */
const poppins = "'Poppins', sans-serif"

const Eyebrow: React.FC<{ children: React.ReactNode; center?: boolean }> = ({
  children,
  center,
}) => (
  <div
    className={`mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase`}
    style={{
      color: "#2E7D32",
      justifyContent: center ? "center" : "flex-start",
      fontFamily: poppins,
    }}
  >
    <span
      className="h-[2px] w-5 flex-shrink-0 rounded-sm"
      style={{ background: "#2E7D32" }}
    />
    {children}
  </div>
)

const SectionTitle: React.FC<{
  children: React.ReactNode
  hl?: string
  center?: boolean
}> = ({ children, hl, center }) => (
  <h2
    className="leading-[1.15] font-extrabold tracking-[-0.5px]"
    style={{
      fontFamily: poppins,
      fontSize: "clamp(26px, 3vw, 42px)",
      color: "#0D1B3E",
      textAlign: center ? "center" : "left",
    }}
  >
    {children}
    {hl && <span style={{ color: "#1B2B6B" }}> {hl}</span>}
  </h2>
)

/* ─── COMPONENT ─────────────────────────────────────────── */
const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [slide, setSlide] = useState(0)
  // const [activeTab, setActiveTab] = useState(0)
  const [activeCat, setActiveCat] = useState(0)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const gSlide = useCallback((n: number) => {
    setSlide((n + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => gSlide(slide + 1), 5000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slide, gSlide])

  const toggleWish = (i: number) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div style={{ fontFamily: poppins }}>
      {/* ══ HERO CAROUSEL ══ */}
      <div
        className="relative overflow-hidden"
        style={{
          height: "calc(100vh - 108px)",
          minHeight: 580,
          maxHeight: 820,
        }}
      >
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-[900ms] ease-in-out"
            style={{
              opacity: i === slide ? 1 : 0,
              transform: i === slide ? "scale(1)" : "scale(1.05)",
              pointerEvents: i === slide ? "auto" : "none",
            }}
          >
            <img src={s.img} alt="" className="h-full w-full object-cover" />
            {/* overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(11,20,60,.82) 0%, rgba(11,20,60,.5) 55%, rgba(11,20,60,.15) 100%)",
              }}
            />
            {/* content */}
            <div className="absolute top-1/2 left-[9%] z-[3] max-w-[600px] -translate-y-1/2">
              <div
                className="mb-[18px] inline-flex items-center gap-2 text-[12px] font-bold tracking-[2px] uppercase"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: poppins }}
              >
                <span
                  className="h-[2px] w-7 rounded-sm"
                  style={{ background: "#43A047" }}
                />
                {s.eyebrow}
              </div>
              <h1
                className="mb-4 leading-[1.08] font-extrabold tracking-[-0.8px] text-white"
                style={{
                  fontFamily: poppins,
                  fontSize: "clamp(40px, 5.5vw, 74px)",
                }}
              >
                {s.h1Parts.map((part, pi) => (
                  <React.Fragment key={pi}>
                    {part === s.emWord ? (
                      <em
                        key={pi}
                        style={{ fontStyle: "italic", color: "#7EC8E3" }}
                      >
                        {part}
                      </em>
                    ) : (
                      part
                    )}
                    {pi < s.h1Parts.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>
              <p
                className="mb-[34px] max-w-[460px] text-[16.5px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: poppins }}
              >
                {s.desc}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate(s.btn1.page)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none px-[30px] py-[13px] text-[14.5px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #388E3C, #43A047)",
                    boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
                    fontFamily: poppins,
                  }}
                >
                  {s.btn1.label}
                </button>
                <button
                  onClick={() => onNavigate(s.btn2.page)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full px-[26px] py-[13px] text-[14.5px] font-semibold text-white transition-all duration-200"
                  style={{
                    border: "2px solid rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    fontFamily: poppins,
                  }}
                >
                  {s.btn2.label}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Prev / Next */}
        {[
          { dir: "prev", ch: "←" },
          { dir: "next", ch: "→" },
        ].map(({ dir, ch }) => (
          <button
            key={dir}
            onClick={() => gSlide(dir === "prev" ? slide - 1 : slide + 1)}
            className="absolute top-1/2 z-10 flex h-[50px] w-[50px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[22px] text-white transition-all duration-200"
            style={{
              [dir === "prev" ? "left" : "right"]: 24,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              fontFamily: poppins,
            }}
          >
            {ch}
          </button>
        ))}

        {/* Dots */}
        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => gSlide(i)}
              className="cursor-pointer rounded-full border-none transition-all duration-300"
              style={{
                width: i === slide ? 28 : 8,
                height: 8,
                background: i === slide ? "#fff" : "rgba(255,255,255,0.38)",
              }}
            />
          ))}
        </div>

        {/* Slide number */}
        <div
          className="absolute right-10 bottom-7 z-10 text-[13px] font-semibold"
          style={{ color: "rgba(255,255,255,0.6)", fontFamily: poppins }}
        >
          <span className="text-[18px] font-bold text-white">{slide + 1}</span>/
          {heroSlides.length}
        </div>

        {/* Thumbnail sidebar */}
        <div className="absolute top-1/2 right-7 z-10 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex">
          {heroSlides.map((s, i) => (
            <button
              key={i}
              onClick={() => gSlide(i)}
              className="h-14 w-14 cursor-pointer overflow-hidden rounded-[10px] border-none p-0 transition-all duration-300"
              style={{
                opacity: i === slide ? 1 : 0.4,
                border:
                  i === slide ? "2px solid #fff" : "2px solid transparent",
                boxShadow: i === slide ? "0 4px 16px rgba(0,0,0,0.4)" : "none",
              }}
            >
              <img
                src={s.thumb}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ══ SEARCH STRIP ══ */}
      {/* <div
        className="bg-white"
        style={{
          borderBottom: "2px solid #DDE3F0",
          boxShadow: "0 6px 24px rgba(27,43,107,0.11)",
        }}
      >
        <div className="mx-auto max-w-[1200px] px-10">
          <div className="flex" style={{ borderBottom: "1px solid #DDE3F0" }}>
            {searchTabs.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="flex cursor-pointer items-center gap-1.5 border-none bg-none px-[22px] py-[14px] text-[13.5px] font-semibold transition-all duration-200"
                style={{
                  fontFamily: poppins,
                  color: activeTab === i ? "#1B2B6B" : "#5A6880",
                  borderBottom:
                    activeTab === i
                      ? "2.5px solid #1B2B6B"
                      : "2.5px solid transparent",
                  marginBottom: -1,
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div
            className="my-[18px] mb-[22px] flex items-stretch overflow-hidden rounded-xl"
            style={{ background: "#F7F9FC", border: "1.5px solid #DDE3F0" }}
          >
            {[
              { ico: "📍", lbl: "Destination", ph: "Where do you want to go?" },
              { ico: "📅", lbl: "Travel Date", ph: "Select dates" },
              { ico: "👥", lbl: "Travellers", ph: "2 Adults, 1 Child" },
              { ico: "💰", lbl: "Budget (₹)", ph: "Any budget" },
            ].map((f, i) => (
              <div
                key={i}
                className="flex flex-1 items-center gap-2.5 px-[18px] py-[13px] transition-colors duration-200 hover:bg-white"
                style={{ borderRight: "1.5px solid #DDE3F0" }}
              >
                <span className="flex-shrink-0 text-[18px]">{f.ico}</span>
                <div className="flex-1">
                  <div
                    className="mb-0.5 text-[10.5px] font-bold tracking-[0.8px] uppercase"
                    style={{ color: "#9BA8C0", fontFamily: poppins }}
                  >
                    {f.lbl}
                  </div>
                  <input
                    className="w-full border-none bg-transparent text-[14px] font-medium outline-none"
                    style={{ color: "#0D1B3E", fontFamily: poppins }}
                    placeholder={f.ph}
                  />
                </div>
              </div>
            ))}
            <button
              className="flex min-w-[130px] cursor-pointer items-center justify-center gap-2 border-none px-8 text-[14px] font-bold text-white transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1B2B6B, #1565C0)",
                fontFamily: poppins,
              }}
            >
              🔍 Search
            </button>
          </div>
        </div>
      </div> */}

      {/* ══ DESTINATIONS CAROUSEL ══ */}
      <DestinationsCarousel onNavigate={onNavigate} />

      {/* ══ SERVICES ══ */}
      <section className="py-[80px]" style={{ background: "#F7F9FC" }}>
        <div className="mx-auto max-w-[1280px] px-10">
          <div className="mb-11">
            <Eyebrow>What We Offer</Eyebrow>
            <SectionTitle hl="Services">All Our</SectionTitle>
            <p
              className="mt-2 max-w-[520px] text-[15px] leading-[1.7]"
              style={{ color: "#5A6880", fontFamily: poppins }}
            >
              One trusted company for all your travel, healthcare, education,
              and career needs.
            </p>
          </div>
          <div
            className="grid overflow-hidden rounded-[18px]"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "#DDE3F0",
              border: "1px solid #DDE3F0",
            }}
          >
            {services.map((s, i) => (
              <button
                key={i}
                onClick={() => onNavigate(s.page)}
                className="block w-full p-[36px_30px] text-left transition-colors duration-200"
                style={{
                  background: "#FFFFFF",
                  fontFamily: poppins,
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#EFF3FB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#FFFFFF")
                }
              >
                <div className="mb-[14px] text-[36px]">{s.icon}</div>
                <div
                  className="mb-2 text-[11px] font-bold tracking-[1.5px] uppercase"
                  style={{ color: "#2E7D32" }}
                >
                  {s.num}
                </div>
                <div
                  className="mb-2 text-[20px] font-extrabold"
                  style={{ color: "#0D1B3E", fontFamily: poppins }}
                >
                  {s.title}
                </div>
                <div
                  className="text-[13px] leading-[1.7]"
                  style={{ color: "#5A6880" }}
                >
                  {s.desc}
                </div>
                <div
                  className="mt-4 text-[13px] font-semibold"
                  style={{ color: "#1B2B6B" }}
                >
                  {s.cta}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOUR CARDS ══ */}
      <section className="py-[80px]">
        <div className="mx-auto max-w-[1280px] px-10">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Featured Packages</Eyebrow>
              <SectionTitle hl="Tour Packages">Top</SectionTitle>
            </div>
            <button
              onClick={() => onNavigate("tourism")}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[14px] font-semibold transition-all duration-200 hover:bg-[#1B2B6B] hover:text-white"
              style={{
                color: "#1B2B6B",
                background: "#E8ECFA",
                border: "1.5px solid #E8ECFA",
                fontFamily: poppins,
              }}
            >
              All Packages →
            </button>
          </div>

          {/* Category pills */}
          <div className="mb-9 flex flex-wrap gap-2.5">
            {catPills.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveCat(i)}
                className="flex cursor-pointer items-center gap-[7px] rounded-full px-[18px] py-[9px] text-[13.5px] font-medium transition-all duration-200"
                style={{
                  fontFamily: poppins,
                  border: "1.5px solid",
                  borderColor: activeCat === i ? "#1B2B6B" : "#DDE3F0",
                  background: activeCat === i ? "#1B2B6B" : "#FFFFFF",
                  color: activeCat === i ? "#fff" : "#2D3A5A",
                  boxShadow:
                    activeCat === i
                      ? "0 4px 16px rgba(27,43,107,0.3)"
                      : "0 1px 3px rgba(27,43,107,0.07)",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div
            className="grid gap-[22px]"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {tourCards.map((t, i) => (
              <div
                key={i}
                className="group cursor-pointer overflow-hidden rounded-[18px] transition-all duration-300"
                style={{
                  background: "#fff",
                  border: "1px solid #DDE3F0",
                  boxShadow: "0 1px 3px rgba(27,43,107,0.07)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform =
                    "translateY(-7px)"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 12px 48px rgba(27,43,107,0.13)"
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "transparent"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = "none"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 1px 3px rgba(27,43,107,0.07)"
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#DDE3F0"
                }}
              >
                {/* Image */}
                <div
                  className="relative h-[205px] overflow-hidden"
                  style={{ background: "#EFF3FB" }}
                >
                  <img
                    src={t.img}
                    alt={t.title}
                    className="h-full w-full object-cover transition-transform duration-500"
                    style={{ transform: "scale(1)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.transform =
                        "scale(1.08)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.transform =
                        "scale(1)")
                    }
                  />
                  {/* Wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWish(i)
                    }}
                    className="absolute top-3 right-3 z-[3] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full text-[16px] transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      border: "none",
                      color: wishlist.has(i) ? "#E53935" : "#5A6880",
                      boxShadow: "0 2px 8px rgba(27,43,107,0.09)",
                      fontFamily: poppins,
                    }}
                  >
                    {wishlist.has(i) ? "♥" : "♡"}
                  </button>
                  {/* Duration */}
                  <span
                    className="absolute bottom-3 left-3 z-[3] rounded-full px-[11px] py-1 text-[12px] font-semibold text-white"
                    style={{
                      background: "rgba(11,20,60,0.78)",
                      backdropFilter: "blur(6px)",
                      fontFamily: poppins,
                    }}
                  >
                    {t.dur}
                  </span>
                  {/* Badge */}
                  <span
                    className="absolute top-3 left-3 z-[3] rounded-full px-[10px] py-[3px] text-[11px] font-bold tracking-[0.3px]"
                    style={{
                      background: t.badge.color,
                      color: t.badge.text,
                      fontFamily: poppins,
                    }}
                  >
                    {t.badge.label}
                  </span>
                </div>
                {/* Body */}
                <div className="px-[18px] pt-4 pb-[18px]">
                  <div
                    className="mb-1.5 flex items-center gap-1 text-[12px]"
                    style={{ color: "#5A6880", fontFamily: poppins }}
                  >
                    📍 {t.loc}
                  </div>
                  <div
                    className="mb-2.5 text-[15px] leading-[1.4] font-bold"
                    style={{
                      color: "#0D1B3E",
                      fontFamily: poppins,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {t.title}
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-1">
                    <span
                      style={{
                        color: "#F59E0B",
                        fontSize: 13,
                        letterSpacing: 1,
                      }}
                    >
                      ★★★★★
                    </span>
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: "#0D1B3E", fontFamily: poppins }}
                    >
                      {t.rating}
                    </span>
                    <span
                      className="text-[12px]"
                      style={{ color: "#5A6880", fontFamily: poppins }}
                    >
                      ({t.reviews})
                    </span>
                    <span
                      className="ml-1 rounded-full px-[10px] py-[3px] text-[11px] font-bold"
                      style={{
                        background: t.tagColor,
                        color: t.tagText,
                        fontFamily: poppins,
                      }}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-center pt-3"
                    style={{ borderTop: "1px solid #DDE3F0" }}
                  >
                    <div>
                      {/* <div
                        className="text-[11px]"
                        style={{ color: "#5A6880", fontFamily: poppins }}
                      >
                        Starting from
                      </div> */}
                      {/* <span
                        className="font-extrabold tracking-[-0.3px]"
                        style={{
                          fontFamily: poppins,
                          fontSize: 22,
                          color: "#1B2B6B",
                        }}
                      >
                        {t.price}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: "#5A6880", fontFamily: poppins }}
                      >
                        {" "}
                        /person
                      </span> */}
                    </div>
                    <button
                      onClick={() => onNavigate("contact")}
                      className="cursor-pointer rounded-full border-none px-[18px] py-2 text-[13px] font-bold text-white transition-all duration-200"
                      style={{
                        background: "linear-gradient(135deg, #1B2B6B, #1565C0)",
                        fontFamily: poppins,
                      }}
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          background: "#0F1B47",
          borderTop: "3px solid #388E3C",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="px-7 py-[38px] text-center"
            style={{
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            <div
              className="leading-none font-extrabold text-white"
              style={{ fontFamily: poppins, fontSize: 42 }}
            >
              {s.num}
              <sup className="text-[22px]" style={{ color: "#43A047" }}>
                {s.sup}
              </sup>
            </div>
            <div
              className="mt-1.5 text-[12px] font-medium tracking-[0.5px] uppercase"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: poppins }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ══ DEALS ══ */}
      <section className="py-[80px]" style={{ background: "#F7F9FC" }}>
        <div className="mx-auto max-w-[1280px] px-10">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Limited Time</Eyebrow>
              <SectionTitle hl="Deals & Offers">Hot</SectionTitle>
            </div>
            <button
              onClick={() => onNavigate("tourism")}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[14px] font-semibold transition-all duration-200 hover:bg-[#1B2B6B] hover:text-white"
              style={{
                color: "#1B2B6B",
                background: "#E8ECFA",
                border: "1.5px solid #E8ECFA",
                fontFamily: poppins,
              }}
            >
              All Deals →
            </button>
          </div>
          <div
            className="grid gap-[18px]"
            style={{ gridTemplateColumns: "1.7fr 1fr 1fr" }}
          >
            {deals.map((d, i) => (
              <div
                key={i}
                className="group relative cursor-pointer overflow-hidden rounded-[18px]"
                style={{ minHeight: 260 }}
                onClick={() => onNavigate("tourism")}
              >
                <img
                  src={d.img}
                  alt={d.title}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.06]"
                  style={{ filter: "brightness(0.9)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(11,20,60,.82) 0%, transparent 65%)",
                  }}
                />
                <div className="relative z-[2] flex h-full flex-col justify-end p-6">
                  <span
                    className="mb-3 inline-block self-start rounded-full px-[13px] py-1 text-[11px] font-extrabold tracking-[0.5px] text-white"
                    style={{ background: "#E53935", fontFamily: poppins }}
                  >
                    {d.tag}
                  </span>
                  <div
                    className="mb-1.5 leading-[1.2] font-extrabold text-white"
                    style={{ fontFamily: poppins, fontSize: d.big ? 28 : 22 }}
                  >
                    {d.title}
                  </div>
                  <div
                    className="mb-3 text-[13px]"
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontFamily: poppins,
                    }}
                  >
                    {d.sub}
                  </div>
                  <div
                    className="text-[13px]"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: poppins,
                    }}
                  >
                    {d.price.split(/(?=₹)/)[0]}
                    <strong className="text-[18px] font-extrabold text-white">
                      {" "}
                      {d.price.match(/₹[\d,]+/)?.[0]}
                    </strong>
                    {d.price.split(/₹[\d,]+/)[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY US ══ */}
      <section className="py-[80px]">
        <div className="mx-auto max-w-[1280px] px-10">
          <div className="mx-auto mb-11 max-w-[580px] text-center">
            <Eyebrow center>Why Choose Us</Eyebrow>
            <SectionTitle center hl="Confidence">
              Travel with
            </SectionTitle>
            <p
              className="mx-auto mt-2 text-[15px] leading-[1.7]"
              style={{ color: "#5A6880", fontFamily: poppins }}
            >
              15+ years of crafting unforgettable journeys — we're with you
              every step of the way.
            </p>
          </div>
          <div
            className="grid gap-[22px]"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {whyUs.map((w, i) => (
              <div
                key={i}
                className="cursor-default rounded-[18px] px-[26px] py-[30px] text-center transition-all duration-300"
                style={{
                  background: "#fff",
                  border: "1px solid #DDE3F0",
                  boxShadow: "0 1px 3px rgba(27,43,107,0.07)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#1B2B6B"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 32px rgba(27,43,107,0.12)"
                  ;(e.currentTarget as HTMLElement).style.transform =
                    "translateY(-5px)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#DDE3F0"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 1px 3px rgba(27,43,107,0.07)"
                  ;(e.currentTarget as HTMLElement).style.transform = "none"
                }}
              >
                <div
                  className="mx-auto mb-4 flex h-[62px] w-[62px] items-center justify-center rounded-xl text-[26px]"
                  style={{ background: "#E8ECFA" }}
                >
                  {w.icon}
                </div>
                <div
                  className="mb-2 text-[15.5px] font-bold"
                  style={{ color: "#0D1B3E", fontFamily: poppins }}
                >
                  {w.title}
                </div>
                <div
                  className="text-[13px] leading-[1.65]"
                  style={{ color: "#5A6880", fontFamily: poppins }}
                >
                  {w.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-[80px]" style={{ background: "#EFF3FB" }}>
        <div className="mx-auto max-w-[1280px] px-10">
          <div className="mx-auto mb-11 max-w-[580px] text-center">
            <Eyebrow center>Real Stories</Eyebrow>
            <SectionTitle center hl="Clients Say">
              What Our
            </SectionTitle>
          </div>
          <div
            className="grid gap-[22px]"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative cursor-default overflow-hidden rounded-[18px] px-7 py-[28px] transition-all duration-300"
                style={{
                  background: "#fff",
                  border: "1px solid #DDE3F0",
                  boxShadow: "0 1px 3px rgba(27,43,107,0.07)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#1B2B6B"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 6px 24px rgba(27,43,107,0.11)"
                  ;(e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#DDE3F0"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 1px 3px rgba(27,43,107,0.07)"
                  ;(e.currentTarget as HTMLElement).style.transform = "none"
                }}
              >
                {/* Big quote mark */}
                <div
                  className="pointer-events-none absolute top-[-8px] right-[18px] text-[110px] leading-none font-extrabold select-none"
                  style={{ color: "#E8ECFA", fontFamily: poppins }}
                >
                  "
                </div>
                <div
                  className="mb-3 text-[13px] tracking-[2px]"
                  style={{ color: "#F59E0B" }}
                >
                  ★★★★★
                </div>
                <p
                  className="relative z-[1] mb-5 text-[14px] leading-[1.78]"
                  style={{ color: "#2D3A5A", fontFamily: poppins }}
                >
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[17px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #1B2B6B, #1565C0)",
                      fontFamily: poppins,
                    }}
                  >
                    {t.av}
                  </div>
                  <div>
                    <div
                      className="text-[14px] font-bold"
                      style={{ color: "#0D1B3E", fontFamily: poppins }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="mt-0.5 text-[12px]"
                      style={{ color: "#5A6880", fontFamily: poppins }}
                    >
                      {t.trip}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section
        className="relative overflow-hidden py-[72px]"
        style={{
          background:
            "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 55%, #1B5E20 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-[360px] w-[360px] rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-15 -left-15 h-[280px] w-[280px] rounded-full"
          style={{ background: "rgba(255,255,255,0.03)" }}
        />
        <div className="relative z-[1] mx-auto max-w-[1280px] px-10">
          <div className="text-center">
            <h2
              className="mb-2.5 font-extrabold tracking-[-0.5px] text-white"
              style={{ fontFamily: poppins, fontSize: 36 }}
            >
              ✉️ Stay Inspired
            </h2>
            <p
              className="mb-[30px] text-[15.5px]"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: poppins }}
            >
              Join 50,000+ travellers. Get exclusive deals, destination guides,
              and early-bird offers.
            </p>
            <div
              className="mx-auto flex max-w-[500px] overflow-hidden rounded-full"
              style={{
                background: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 border-none bg-transparent px-[22px] py-[14px] text-[14px] outline-none"
                style={{ fontFamily: poppins, color: "#0D1B3E" }}
              />
              <button
                className="cursor-pointer border-none px-[26px] text-[14px] font-bold text-white transition-opacity duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #388E3C, #43A047)",
                  fontFamily: poppins,
                }}
              >
                Subscribe →
              </button>
            </div>
            <div className="mt-[22px] flex flex-wrap justify-center gap-7">
              {[
                "✓ No spam, ever",
                "✓ Exclusive deals first",
                "✓ Unsubscribe anytime",
              ].map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 text-[13px]"
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontFamily: poppins,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        style={{ background: "#060E24", paddingTop: 68, paddingBottom: 28 }}
      >
        <div className="mx-auto max-w-[1280px] px-10">
          <div
            className="grid gap-11 pb-11"
            style={{
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1.3fr",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Brand */}
            <div>
              <div className="mb-3.5 flex items-center gap-2.5">
                <img
                  src="/Logo.jpeg"
                  alt="Udayam International"
                  className="h-[52px] w-auto object-contain"
                  style={{ filter: "brightness(1.05)" }}
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.display =
                      "none")
                  }
                />
              </div>
              <p
                className="mb-5 max-w-[250px] text-[13px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,0.42)", fontFamily: poppins }}
              >
                Your trusted partner for travel, medical tourism, foreign
                education, trade, and global recruitment. Connecting lives
                across the world since 2010.
              </p>
              <div className="flex gap-2">
                {["📘", "📸", "🐦", "▶️"].map((ico, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-[9px] text-[15px] transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {ico}
                  </a>
                ))}
              </div>
            </div>
            {/* Services */}
            <div>
              <h4
                className="mb-4 text-[11px] font-bold tracking-[1.8px] uppercase"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: poppins }}
              >
                Services
              </h4>
              <ul className="flex list-none flex-col gap-[9px]">
                {footerServices.map((s) => (
                  <li key={s.page}>
                    <button
                      onClick={() => onNavigate(s.page)}
                      className="cursor-pointer border-none bg-transparent text-left text-[13px] transition-colors duration-200"
                      style={{
                        color: "rgba(255,255,255,0.42)",
                        fontFamily: poppins,
                      }}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4
                className="mb-4 text-[11px] font-bold tracking-[1.8px] uppercase"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: poppins }}
              >
                Company
              </h4>
              <ul className="flex list-none flex-col gap-[9px]">
                {[
                  { label: "Home", page: "home" as Page },
                  { label: "About Us", page: "about" as Page },
                  { label: "Contact Us", page: "contact" as Page },
                ].map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => onNavigate(l.page)}
                      className="cursor-pointer border-none bg-transparent text-left text-[13px] transition-colors duration-200"
                      style={{
                        color: "rgba(255,255,255,0.42)",
                        fontFamily: poppins,
                      }}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
                {["Privacy Policy", "Terms of Service"].map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[13px] transition-colors duration-200"
                      style={{
                        color: "rgba(255,255,255,0.42)",
                        fontFamily: poppins,
                      }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Tours */}
            <div>
              <h4
                className="mb-4 text-[11px] font-bold tracking-[1.8px] uppercase"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: poppins }}
              >
                Popular Tours
              </h4>
              <ul className="flex list-none flex-col gap-[9px]">
                {[
                  "Rajasthan Circuit",
                  "Kerala Backwaters",
                  "Thailand Paradise",
                  "Swiss Alps Tour",
                  "Maldives Escape",
                ].map((t) => (
                  <li key={t}>
                    <a
                      href="#"
                      className="text-[13px]"
                      style={{
                        color: "rgba(255,255,255,0.42)",
                        fontFamily: poppins,
                      }}
                    >
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4
                className="mb-4 text-[11px] font-bold tracking-[1.8px] uppercase"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: poppins }}
              >
                Contact Us
              </h4>
              <div
                className="text-[13px] leading-[2.1]"
                style={{ color: "rgba(255,255,255,0.42)", fontFamily: poppins }}
              >
                <div>📍 Chennai, Tamil Nadu, India</div>
                <div>📞 +91 98765 43210</div>
                <div>✉️ info@udayaminternational.com</div>
                <div>🕐 Mon–Sat: 9AM–7PM</div>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="flex flex-wrap items-center justify-between gap-3.5 pt-[22px]">
            <div
              className="text-[12px]"
              style={{ color: "rgba(255,255,255,0.28)", fontFamily: poppins }}
            >
              © 2026 Udayam International. All rights reserved. | Trade · Travel
              · Trust
            </div>
            <div className="flex items-center gap-[7px]">
              <span
                className="mr-1.5 text-[12px]"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: poppins }}
              >
                We Accept:
              </span>
              {["VISA", "MC", "UPI", "EMI"].map((p) => (
                <span
                  key={p}
                  className="rounded-[5px] px-[11px] py-[3px] text-[11px] font-bold tracking-[0.3px]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: poppins,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ══ WHATSAPP ══ */}
      <a
        href="https://wa.me/91xxxxxxx"
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
          style={{ background: "#0D1B3E", fontFamily: poppins }}
        >
          Chat on WhatsApp
        </span>
      </a>

      <style>{`
        @keyframes waPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.38); }
          50% { box-shadow: 0 4px 28px rgba(37,211,102,0.58); }
        }
        /* Responsive overrides */
        @media (max-width: 1100px) {
          .dest-grid-r { grid-template-columns: repeat(3, 1fr) !important; }
          .tour-grid-r { grid-template-columns: repeat(2, 1fr) !important; }
          .why-grid-r  { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .dest-grid-r  { grid-template-columns: repeat(2, 1fr) !important; }
          .tour-grid-r  { grid-template-columns: 1fr !important; }
          .svc-grid-r   { grid-template-columns: 1fr !important; }
          .deal-grid-r  { grid-template-columns: 1fr !important; }
          .testi-grid-r { grid-template-columns: 1fr !important; }
          .ft-grid-r    { grid-template-columns: 1fr 1fr !important; }
          .stats-grid-r { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default Home
