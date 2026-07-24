import React, { useState, useEffect, useRef, useCallback } from "react"
import DestinationsSection from "../Destinationscarousel"
import TravelCards from "./TravelCards"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { _axios } from "@/lib/axios"
import { heroSlides, catPills, stats, whyUs } from "@/lib/homeData"
import Services from "./Services"
import UdayamEcosystem from "./EcoSystem"

export const SectionTitle: React.FC<{
  children: React.ReactNode
  hl?: string
  center?: boolean
}> = ({ children, hl, center }) => (
  <h2
    className="leading-[1.15] font-extrabold tracking-[-0.5px]"
    style={{
      fontSize: "clamp(26px, 3vw, 42px)",
      color: "#0D1B3E",
      textAlign: center ? "center" : "left",
    }}
  >
    {children}
    {hl && <span style={{ color: "#1B2B6B" }}> {hl}</span>}
  </h2>
)

const Home = () => {
  const [slide, setSlide] = useState(0)
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

  const { data: testimonialsResponse, isLoading: isTestimonialsLoading } =
    useQuery({
      queryKey: ["testimonials"],
      queryFn: async () => {
        const res = await _axios.get("/testimonials")
        return res.data as { status: boolean; data: any[] }
      },
      staleTime: 60_000,
    })
  const activeTestimonials = testimonialsResponse?.data ?? []
  const [testiIndex, setTestiIndex] = useState(1)
  const [transitionEnabled, setTransitionEnabled] = useState(true)

  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  useEffect(() => {
    const fn = () => setVw(window.innerWidth)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  const cardWidth = vw >= 1024 ? 33.333 : vw >= 768 ? 60 : 100

  // Display list with cloned boundary elements for seamless looping
  const displayList =
    activeTestimonials.length > 1
      ? [
          activeTestimonials[activeTestimonials.length - 1],
          ...activeTestimonials,
          activeTestimonials[0],
        ]
      : activeTestimonials

  useEffect(() => {
    if (activeTestimonials.length > 1) {
      setTestiIndex(1)
    } else {
      setTestiIndex(0)
    }
  }, [activeTestimonials.length])

  useEffect(() => {
    if (!transitionEnabled) {
      // Force repaint to make browser register the instant transform transition removal
      const _reflow = document.body.offsetHeight
      setTransitionEnabled(true)
    }
  }, [transitionEnabled])

  const handlePrevTesti = () => {
    if (displayList.length <= 1) return
    setTestiIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextTesti = () => {
    if (displayList.length <= 1) return
    setTestiIndex((prev) => Math.min(displayList.length - 1, prev + 1))
  }

  const handleTransitionEnd = () => {
    if (activeTestimonials.length <= 1) return
    if (testiIndex === displayList.length - 1) {
      setTransitionEnabled(false)
      setTestiIndex(1)
    } else if (testiIndex === 0) {
      setTransitionEnabled(false)
      setTestiIndex(displayList.length - 2)
    }
  }

  return (
    <div>
      {/* ══ HERO CAROUSEL ══ */}
      {/* <div
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
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(11,20,60,.82) 0%, rgba(11,20,60,.5) 55%, rgba(11,20,60,.15) 100%)",
              }}
            />
            <div className="absolute top-1/2 left-[9%] z-[3] max-w-[600px] -translate-y-1/2">
              <div
                className="mb-[18px] inline-flex items-center gap-2 text-[12px] font-bold tracking-[2px] uppercase"
                style={{ color: "rgba(255,255,255,0.8)" }}
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
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {s.desc}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(s.btn1.page)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none px-[30px] py-[13px] font-inter text-[14.5px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #388E3C, #43A047)",
                    boxShadow: "0 6px 24px rgba(46,125,50,0.45)",
                  }}
                >
                  {s.btn1.label}
                </button>
                <button
                  onClick={() => navigate(s.btn2.page)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full px-[26px] py-[13px] font-inter text-[14.5px] font-semibold text-white transition-all duration-200"
                  style={{
                    border: "2px solid rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {s.btn2.label}
                </button>
              </div>
            </div>
          </div>
        ))}

     
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

        <div
          className="absolute right-10 bottom-7 z-10 text-[13px] font-semibold"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <span className="text-[18px] font-bold text-white">{slide + 1}</span>/
          {heroSlides.length}
        </div>

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
      </div> */}
      <UdayamEcosystem />
      {/* ══ DESTINATIONS CAROUSEL ══ */}
      {/* <DestinationsSection /> */}

      {/* ══ SERVICES ══ */}

      {/* <Services /> */}

      {/* ══ TOUR CARDS ══ */}

      {/* <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
          <div className="mb-10 flex flex-wrap items-end justify-center gap-4">
            <div>
              <h2 className="text-4xl font-bold text-[#0D1B3E] md:text-5xl">
                Top Tour <span className="text-[#1B2B6B]">Packages</span>
              </h2>
            </div>

         
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {catPills.map((pill, i) => (
              <button
                key={i}
                onClick={() => setActiveCat(i)}
                className={`rounded-full px-4 py-2.5 font-inter text-sm font-medium transition-all duration-200 ${
                  activeCat === i
                    ? "bg-[#1B2B6B] text-white shadow-lg shadow-[#1B2B6B]/30"
                    : "border border-[#DDE3F0] bg-white text-[#2D3A5A] hover:border-[#1B2B6B]"
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          <TravelCards />
        </div>
      </section> */}

      {/* ══ STATS ══ */}

      <div className="grid grid-cols-2 bg-[#0F1B47] md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`border-r border-white/10 px-6 py-8 text-center last:border-r-0 md:border-r md:px-7 md:py-[38px] md:last:border-r-0`}
          >
            <div
              className="flex items-center justify-center font-inter leading-none font-extrabold text-white"
              style={{ fontSize: "42px" }}
            >
              <div> {s.num}</div>
              <div className="ml-1 text-3xl" style={{ color: "#43A047" }}>
                {s.sup}
              </div>
            </div>

            <div
              className="mt-1.5 text-xs font-medium tracking-[0.5px] uppercase"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ══ WHY US ══ */}

      <section className="py-14">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-10">
          <div className="mb-10 md:mb-12">
            <SectionTitle hl="Confidence">Travel with</SectionTitle>
            <p
              className="mx-auto mt-3 font-inter text-[15px] leading-relaxed md:leading-[1.7]"
              style={{ color: "#5A6880" }}
            >
              15+ years of crafting unforgettable journeys — we're with you
              every step of the way.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-[22px] lg:grid-cols-3 xl:grid-cols-4">
            {whyUs.map((w, i) => (
              <div
                key={i}
                className="group cursor-default rounded-[18px] px-6 py-8 text-center transition-all duration-300 md:px-[26px] md:py-[30px]"
                style={{
                  background: "#fff",
                  border: "1px solid #DDE3F0",
                  boxShadow: "0 1px 3px rgba(27,43,107,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = "#1B2B6B"
                  el.style.boxShadow = "0 8px 32px rgba(27,43,107,0.12)"
                  el.style.transform = "translateY(-5px)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = "#DDE3F0"
                  el.style.boxShadow = "0 1px 3px rgba(27,43,107,0.07)"
                  el.style.transform = "none"
                }}
              >
                {/* Icon */}
                <div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl text-3xl md:h-[62px] md:w-[62px] md:text-[26px]"
                  style={{ background: "#E8ECFA" }}
                >
                  {w.icon}
                </div>

                {/* Title */}
                <div
                  className="mb-3 font-inter text-lg font-bold md:text-[15.5px]"
                  style={{ color: "#0D1B3E" }}
                >
                  {w.title}
                </div>

                {/* Description */}
                <div
                  className="text-sm leading-relaxed md:text-[13px] md:leading-[1.65]"
                  style={{ color: "#5A6880" }}
                >
                  {w.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}

      <section className="py-14" style={{ background: "#EFF3FB" }}>
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-10">
          {/* Header */}
          <div className="mx-auto mb-10 max-w-[580px] text-center md:mb-11">
            <SectionTitle center hl="Clients Say">
              What Our
            </SectionTitle>
          </div>

          {isTestimonialsLoading ? (
            <div className="mx-auto h-72 w-full max-w-[620px] animate-pulse rounded-[18px] bg-white p-8" />
          ) : activeTestimonials.length > 0 ? (
            <div className="relative mt-8 px-10">
              {/* Slider track area */}
              <div className="w-full overflow-hidden py-6">
                <div
                  className="flex items-stretch"
                  style={{
                    transition: transitionEnabled
                      ? "transform 500ms ease-in-out"
                      : "none",
                    transform: `translateX(calc(${(100 - cardWidth) / 2}% - ${testiIndex * cardWidth}%))`,
                  }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {displayList.map((t, i) => {
                    const isActive = i === testiIndex
                    return (
                      <div
                        key={i}
                        className="flex flex-shrink-0 justify-center px-2 transition-all duration-500 md:px-3"
                        style={{
                          width: `${cardWidth}%`,
                          opacity: isActive ? 1 : 0.55,
                          transform: isActive ? "scale(1.04)" : "scale(0.94)",
                        }}
                      >
                        <div
                          className="relative flex w-full cursor-default flex-col rounded-[18px] px-7 py-7 sm:px-8 sm:py-8"
                          style={{
                            background: "#fff",
                            border: `1.5px solid ${isActive ? "#1B2B6B" : "#E4E9F3"}`,
                            boxShadow: isActive
                              ? "0 16px 40px rgba(27,43,107,0.14)"
                              : "0 4px 14px rgba(27,43,107,0.05)",
                            transition: "all 0.5s ease-in-out",
                            minHeight: "260px", // floor only — grows if text is longer, never clips
                          }}
                        >
                          {/* Stars */}
                          <div
                            className="mb-4 text-left text-[15px] tracking-[2px]"
                            style={{ color: "#F59E0B" }}
                          >
                            {"★".repeat(t.rating) + "☆".repeat(5 - t.rating)}
                          </div>

                          {/* Testimonial Text — left aligned, quotes inline, full text always shown */}
                          <p
                            className="mb-6 text-left text-[15px] leading-[1.7]"
                            style={{ color: "#3A4560" }}
                          >
                            "{t.text}"
                          </p>

                          {/* Author Info — avatar + name/trip in a row, pinned to bottom */}
                          <div className="mt-auto flex items-center gap-3">
                            <div
                              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[17px] font-bold text-white shadow-md"
                              style={{
                                background:
                                  "linear-gradient(135deg, #1B2B6B, #1565C0)",
                              }}
                            >
                              {t.avatarInitial ||
                                t.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <div
                                className="text-[15px] font-bold"
                                style={{ color: "#0D1B3E" }}
                              >
                                {t.name}
                              </div>
                              <div
                                className="mt-0.5 text-[13px]"
                                style={{ color: "#5A6880" }}
                              >
                                📍 {t.trip}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              {activeTestimonials.length > 1 && (
                <>
                  <button
                    onClick={handlePrevTesti}
                    className="absolute top-1/2 left-0 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#DDE3F0] bg-white text-[#1B2B6B] shadow-sm transition-all hover:border-[#1B2B6B] hover:bg-slate-50 sm:h-10 sm:w-10"
                    style={{ zIndex: 10 }}
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextTesti}
                    className="absolute top-1/2 right-0 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#DDE3F0] bg-white text-[#1B2B6B] shadow-sm transition-all hover:border-[#1B2B6B] hover:bg-slate-50 sm:h-10 sm:w-10"
                    style={{ zIndex: 10 }}
                  >
                    →
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </section>
      {/* ══ WHATSAPP ══ */}

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
