import React, { useState, useEffect, useRef } from "react"
import service1 from "../../assets/home/Service1.jpeg"
import service2 from "../../assets/home/Service2.jpeg"
import service4 from "../../assets/home/Service4.jpeg"
import service5 from "../../assets/home/Service5.jpeg"
import service6 from "../../assets/home/Service6.jpeg"
import service7 from "../../assets/home/Service7.jpeg"
import service8 from "../../assets/home/Service8.jpeg"
import service9 from "../../assets/home/Service9.jpeg"

import { SectionTitle } from "./Home"

// ── Types ──────────────────────────────────────────────
interface Specialty {
  name: string
  badge: string
  title: string
  desc: string
  stat1: { val: string; lbl: string }
  stat2: { val: string; lbl: string; green?: boolean }
  bgClass: string
  icon: React.ReactNode
  bgImage: any
}

// ── SVG Icons ──────────────────────────────────────────
const CardiacIcon = ({ color = "#6b7280" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2.5c.8 0 1.6.5 2 1.2L14.5 8H18a1 1 0 01.8 1.6l-3 4 1 4.3a1 1 0 01-1.5 1.1L10 17l-5.3 2a1 1 0 01-1.5-1.1l1-4.3-3-4A1 1 0 013.5 8H7l2.5-4.3A2 2 0 0110 2.5z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
)
const OrthoIcon = ({ color = "#6b7280" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7 3v4M10 3v5M13 3v4M5 9h10a1 1 0 011 1v5a3 3 0 01-3 3H7a3 3 0 01-3-3v-5a1 1 0 011-1z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)
const CosmeticIcon = ({ color = "#6b7280" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="7.5" r="3.5" stroke={color} strokeWidth="1.4" />
    <path
      d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)
const OncologyIcon = ({ color = "#6b7280" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.4" />
    <path
      d="M10 7v3l2 2"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)
const IVFIcon = ({ color = "#6b7280" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2.5a5.5 5.5 0 015.5 5.5c0 4.5-5.5 10-5.5 10S4.5 12.5 4.5 8A5.5 5.5 0 0110 2.5z"
      stroke={color}
      strokeWidth="1.4"
    />
    <circle cx="10" cy="8" r="2" stroke={color} strokeWidth="1.4" />
  </svg>
)
const DentalIcon = ({ color = "#6b7280" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7 6.5c0-1.7 1.3-3 3-3s3 1.3 3 3v1.5a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 017 8V6.5z"
      stroke={color}
      strokeWidth="1.4"
    />
    <path
      d="M5 18c0-2.8 2.2-5 5-5s5 2.2 5 5"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)
const HairIcon = ({ color = "#6b7280" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2.5C8 2.5 6.5 4 6.5 6c0 3.5 3.5 8 3.5 8s3.5-4.5 3.5-8C13.5 4 12 2.5 10 2.5z"
      stroke={color}
      strokeWidth="1.4"
    />
    <path
      d="M5 15.5l-2 4.5h14l-2-4.5"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const NeuroIcon = ({ color = "#6b7280" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <ellipse cx="10" cy="10" rx="4" ry="6.5" stroke={color} strokeWidth="1.4" />
    <line
      x1="3.5"
      y1="10"
      x2="16.5"
      y2="10"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.4" />
  </svg>
)
const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M2 6.5h9M8 3l3.5 3.5L8 10"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M6 4l4 4-4 4"
      stroke="#1B2B6B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

// ── Specialty Data ─────────────────────────────────────
const specialties: Specialty[] = [
  {
    name: "Cardiac Surgery",
    badge: "India's #1 Hospital for Cardiac Care",
    title: "Cardiac Surgery",
    desc: "Access world-class heart care including bypass surgery and valve replacements. Our partner hospitals maintain a 98.5% surgical success rate with JCI-accredited cardiac units.",
    stat1: { val: "98.5%", lbl: "SUCCESS RATE" },
    stat2: { val: "80%", lbl: "COST SAVINGS", green: true },
    bgClass: "bg-cardiac",
    icon: <CardiacIcon />,
    bgImage: service1,
  },
  {
    name: "Orthopedics",
    badge: "Advanced Joint Replacement Center",
    title: "Orthopedics",
    desc: "World-leading joint replacements, spine surgery and sports medicine. Robotic-assisted procedures deliver faster recovery with precision implants and expert rehabilitation.",
    stat1: { val: "97%", lbl: "PATIENT SATISFACTION" },
    stat2: { val: "70%", lbl: "COST SAVINGS", green: true },
    bgClass: "bg-ortho",
    icon: <OrthoIcon />,
    bgImage: service9,
  },
  {
    name: "Cosmetic Surgery",
    badge: "Board-Certified Cosmetic Surgeons",
    title: "Cosmetic Surgery",
    desc: "Transform your confidence with procedures performed by internationally trained surgeons in state-of-the-art accredited facilities — at a fraction of Western prices.",
    stat1: { val: "10K+", lbl: "PROCEDURES DONE" },
    stat2: { val: "65%", lbl: "COST SAVINGS", green: true },
    bgClass: "bg-cosmetic",
    icon: <CosmeticIcon />,
    bgImage: service2,
  },
  {
    name: "Oncology",
    badge: "Advanced Cancer Treatment Centers",
    title: "Oncology",
    desc: "Comprehensive cancer care with cutting-edge immunotherapy, targeted therapy and robotic oncology surgery. Multidisciplinary tumor boards review every single case.",
    stat1: { val: "96%", lbl: "TREATMENT SUCCESS" },
    stat2: { val: "75%", lbl: "COST SAVINGS", green: true },
    bgClass: "bg-oncology",
    icon: <OncologyIcon />,
    bgImage: service8,
  },
  {
    name: "IVF & Fertility",
    badge: "Top-Ranked IVF Clinics in Asia",
    title: "IVF & Fertility",
    desc: "Realise the dream of parenthood with India's leading fertility specialists. Our clinics use the latest PGT-A genetic screening technology for optimised IVF outcomes.",
    stat1: { val: "72%", lbl: "IVF SUCCESS RATE" },
    stat2: { val: "60%", lbl: "COST SAVINGS", green: true },
    bgClass: "bg-ivf",
    icon: <IVFIcon />,
    bgImage: service4,
  },
  {
    name: "Dental Treatments",
    badge: "ISO-Certified Dental Excellence",
    title: "Dental Treatments",
    desc: "From full-mouth rehabilitation to same-day implants and Hollywood smiles — world-class dentistry by specialists trained at leading global institutions.",
    stat1: { val: "99%", lbl: "PATIENT SATISFACTION" },
    stat2: { val: "85%", lbl: "COST SAVINGS", green: true },
    bgClass: "bg-dental",
    icon: <DentalIcon />,
    bgImage: service5,
  },
  {
    name: "Hair Transplant",
    badge: "Asia's Most Trusted Hair Clinics",
    title: "Hair Transplant",
    desc: "Restore natural hair density with FUE and DHI techniques by award-winning trichologists. Natural hairlines, minimal downtime, and results that last a lifetime.",
    stat1: { val: "95%", lbl: "GRAFT SURVIVAL" },
    stat2: { val: "70%", lbl: "COST SAVINGS", green: true },
    bgClass: "bg-hair",
    icon: <HairIcon />,
    bgImage: service7,
  },
  {
    name: "Neurology",
    badge: "Centre of Excellence in Neurosciences",
    title: "Neurology",
    desc: "Expert diagnosis and treatment of neurological conditions including stroke, epilepsy and brain tumors. Neuro-ICUs equipped with the latest intraoperative imaging systems.",
    stat1: { val: "95%", lbl: "RECOVERY RATE" },
    stat2: { val: "78%", lbl: "COST SAVINGS", green: true },
    bgClass: "bg-neuro",
    icon: <NeuroIcon />,
    bgImage: service6,
  },
]

// ── Panel Background — service1 image for all specialties ──
// The overlay in each panel keeps text readable over the photo
const bgImageStyle = (img: string): React.CSSProperties => ({
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center right",
  backgroundRepeat: "no-repeat",
})

// ── Panel Content ──────────────────────────────────────
const PanelContent = ({
  s,
  isMobile = false,
  img,
}: {
  s: Specialty
  isMobile?: boolean
  img: string
}) => (
  <div
    className={`relative z-10 flex h-full flex-col justify-center gap-0 ${isMobile ? "justify-start p-8 sm:p-10" : "p-12 xl:p-14"}`}
  >
    {/* Badge */}
    <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm">
      <span
        className="h-2 w-2 flex-shrink-0 rounded-full bg-green-600"
        style={{ animation: "pulse-dot 2.2s ease-in-out infinite" }}
      />
      <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#1B2B6B] uppercase">
        {s.badge}
      </span>
    </div>

    {/* Title */}
    <h2
      className="mb-4 font-serif leading-[1.05] font-bold tracking-[-0.03em] text-[#1B2B6B]"
      style={{
        fontSize: isMobile ? "clamp(28px,7vw,40px)" : "clamp(32px,4vw,52px)",
      }}
    >
      {s.title}
    </h2>

    {/* Desc */}
    <p
      className={`mb-7 leading-[1.8] text-[#5a6080] ${isMobile ? "max-w-full text-sm" : "max-w-[480px] text-[15px]"}`}
    >
      {s.desc}
    </p>

    {/* Stats */}
    <div className="mb-8 flex gap-9">
      <div>
        <div className="font-serif text-[38px] leading-none font-bold tracking-[-0.03em] text-[#1B2B6B]">
          {s.stat1.val}
        </div>
        <div className="mt-1.5 font-sans text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
          {s.stat1.lbl}
        </div>
      </div>
      <div>
        <div
          className={`font-serif text-[38px] leading-none font-bold tracking-[-0.03em] ${s.stat2.green ? "text-green-700" : "text-[#1B2B6B]"}`}
        >
          {s.stat2.val}
        </div>
        <div className="mt-1.5 font-sans text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
          {s.stat2.lbl}
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div
      className={`flex gap-3 ${isMobile ? "flex-col sm:flex-row" : "flex-wrap"}`}
    >
      <a
        href="https://wa.me/917299771111"
        target="_blank"
        rel="noreferrer"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-[#1B2B6B] px-7 py-3.5 font-sans text-[12px] font-bold tracking-[0.07em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#243580] hover:shadow-xl"
        style={{ boxShadow: "0 12px 40px rgba(27,43,107,0.14)" }}
      >
        Explore Treatment <ArrowRight />
      </a>
      <a
        href="https://wa.me/917299771111"
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer rounded-full border-[1.5px] border-gray-200 bg-white px-7 py-3.5 font-sans text-[12px] font-bold tracking-[0.07em] text-[#1B2B6B] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1B2B6B] hover:bg-[#e8ecf7]"
      >
        Free Consultation
      </a>
    </div>
  </div>
)

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

// ── Swipe Hook ─────────────────────────────────────────
function useSwipe(onSwipe: (dir: "left" | "right") => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let startX = 0
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) onSwipe(dx < 0 ? "left" : "right")
    }
    el.addEventListener("touchstart", onStart, { passive: true })
    el.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchend", onEnd)
    }
  }, [onSwipe])
  return ref
}

// ── Main Component ─────────────────────────────────────
const Services: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const { ref: cardRef, visible: cardVisible } = useReveal()

  const switchTo = (idx: number) => {
    setCurrent(idx)
    tabRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }

  const swipeRef = useSwipe((dir) => {
    const next =
      dir === "left"
        ? Math.min(current + 1, specialties.length - 1)
        : Math.max(current - 1, 0)
    switchTo(next)
  })

  return (
    <div className="mx-auto max-w-[1280px] overflow-x-hidden rounded-xl px-5 py-7 text-[#1a1a2e] md:px-0 md:py-14">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Libre Baskerville', serif; }
        .font-sans  { font-family: 'Raleway', sans-serif; }
        .font-mono  { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: #1B2B6B; border-radius: 2px; }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.4); }
        }
      `}</style>

      {/* ── Section Header ── */}

      <div className="mb-10 md:mb-12">
        <SectionTitle hl="Services">Our</SectionTitle>
        <p
          className="mx-auto mt-3 font-inter text-[15px] leading-relaxed md:leading-[1.7]"
          style={{ color: "#5A6880" }}
        >
          15+ years of crafting unforgettable journeys — we're with you every
          step of the way.
        </p>
      </div>
      {/* ══ DESKTOP CARD (hidden on mobile) ══ */}
      <div
        ref={cardRef}
        className="mx-3 hidden overflow-hidden rounded-[36px] bg-white shadow-[0_12px_40px_rgba(27,43,107,0.14)] md:block"
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? "none" : "translateY(28px)",
          transition:
            "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.08s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.08s",
        }}
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: "280px 1fr", minHeight: 560 }}
        >
          {/* Service List — fixed width, no overflow, full height */}
          <div
            className="flex flex-col border-r border-gray-100 bg-white py-2.5"
            style={{ minWidth: 0, overflowY: "auto", overflowX: "hidden" }}
          >
            {specialties.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setCurrent(i)}
                className="flex w-full cursor-pointer items-center gap-3.5 py-4 text-left transition-all duration-200"
                style={{
                  paddingLeft: 20,
                  paddingRight: 16,
                  background: current === i ? "#e8ecf7" : "transparent",
                  borderLeft: `3px solid ${current === i ? "#1B2B6B" : "transparent"}`,
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (current !== i)
                    (e.currentTarget as HTMLElement).style.background =
                      "#f7f8fc"
                }}
                onMouseLeave={(e) => {
                  if (current !== i)
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent"
                }}
              >
                {/* Icon */}
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] transition-colors duration-200"
                  style={{ background: current === i ? "#1B2B6B" : "#f3f4f8" }}
                >
                  {current === i
                    ? React.cloneElement(
                        s.icon as React.ReactElement,
                        { color: "white" } as { color: string }
                      )
                    : s.icon}
                </div>
                {/* Label */}
                <span
                  className="min-w-0 flex-1 truncate font-sans text-[14px] transition-colors duration-200"
                  style={{
                    fontWeight: current === i ? 600 : 500,
                    color: current === i ? "#1B2B6B" : "#6b7280",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.name}
                </span>
                {/* Chevron */}
                <span
                  className="flex-shrink-0 transition-all duration-200"
                  style={{
                    opacity: current === i ? 1 : 0,
                    transform: current === i ? "none" : "translateX(-4px)",
                  }}
                >
                  <ChevronRight />
                </span>
              </button>
            ))}
          </div>

          {/* Feature Panel — fills full height of grid row */}
          <div className="relative overflow-hidden" style={{ display: "grid" }}>
            {specialties.map((s, i) => (
              <div
                key={s.name}
                style={{
                  gridArea: "1 / 1",
                  opacity: current === i ? 1 : 0,
                  transform:
                    current === i ? "translateX(0)" : "translateX(20px)",
                  transition:
                    "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  pointerEvents: current === i ? "auto" : "none",
                  position: "relative",
                }}
              >
                {/* BG Image */}
                <div
                  className="absolute inset-0"
                  style={bgImageStyle(s.bgImage)}
                />
                {/* Overlay — strong on the left so text is always legible */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(105deg, rgba(238,241,248,0.97) 0%, rgba(238,241,248,0.90) 40%, rgba(238,241,248,0.40) 70%, rgba(238,241,248,0.10) 100%)",
                  }}
                />
                <PanelContent s={s} img={s.bgImage} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MOBILE: Tabs + Panel (shown on mobile only) ══ */}
      <div className="md:hidden">
        {/* Horizontal scroll tabs */}
        <div className="flex gap-2 overflow-x-auto px-3 pb-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {specialties.map((s, i) => (
            <button
              key={s.name}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              onClick={() => switchTo(i)}
              className="inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-200"
              style={{
                background: current === i ? "#1B2B6B" : "white",
                border: `1.5px solid ${current === i ? "#1B2B6B" : "#dde1f0"}`,
              }}
            >
              {/* Icon */}
              <div
                className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] transition-colors duration-200"
                style={{
                  background:
                    current === i ? "rgba(255,255,255,0.18)" : "#f3f4f8",
                }}
              >
                {current === i
                  ? React.cloneElement(
                      s.icon as React.ReactElement,
                      { color: "white" } as { color: string }
                    )
                  : s.icon}
              </div>
              <span
                className="font-sans text-[12px] font-semibold whitespace-nowrap transition-colors duration-200"
                style={{ color: current === i ? "white" : "#6b7280" }}
              >
                {s.name}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Panel */}
        <div
          ref={swipeRef}
          className="relative mx-3 min-h-[400px] overflow-hidden rounded-[28px]"
        >
          {specialties.map((s, i) => (
            <div
              key={s.name}
              className="absolute inset-0 transition-all duration-[400ms]"
              style={{
                opacity: current === i ? 1 : 0,
                transform: current === i ? "translateX(0)" : "translateX(20px)",
                pointerEvents: current === i ? "auto" : "none",
                ...(current === i ? { position: "relative" } : {}),
              }}
            >
              {/* BG Image */}
              <div
                className="absolute inset-0"
                style={bgImageStyle(s.bgImage)}
              />
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, rgba(238,241,248,0.96) 0%, rgba(238,241,248,0.90) 45%, rgba(238,241,248,0.40) 75%, rgba(238,241,248,0.10) 100%)",
                }}
              />
              <PanelContent s={s} isMobile img={s.bgImage} />
            </div>
          ))}
        </div>

        {/* Swipe hint dots */}
        <div className="mt-4 flex justify-center gap-1.5">
          {specialties.map((_, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: current === i ? 20 : 6,
                height: 6,
                background: current === i ? "#1B2B6B" : "#c5cedf",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services
