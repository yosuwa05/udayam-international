import React, { useState, useEffect, useRef, useCallback } from "react"
import DestinationsSection from "../Destinationscarousel"
import TravelCards from "../TravelCards"
import { useNavigate } from "react-router-dom"
import {
  heroSlides,
  services,
  catPills,
  footerServices,
  stats,
  testimonials,
  whyUs,
} from "@/lib/homeData"
import type { Page } from "@/lib/navData"

const SectionTitle: React.FC<{
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
  const [activeCat, setActiveCat] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const navigate = useNavigate()

  const gSlide = useCallback((n: number) => {
    setSlide((n + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => gSlide(slide + 1), 5000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slide, gSlide])

  return (
    <div>
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

        {/* Prev / Next */}
        {/* {[
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
            }}
          >
            {ch}
          </button>
        ))} */}

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
          style={{ color: "rgba(255,255,255,0.6)" }}
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
      <DestinationsSection />

      {/* ══ SERVICES ══ */}
      {/* <section className="py-[80px]" style={{ background: "#F7F9FC" }}>
        <div className="mx-auto max-w-[1280px] px-10">
          <div className="mb-11">
            <SectionTitle hl="Services">All Our</SectionTitle>
            <p
              className="mt-2 max-w-[520px] text-[15px] leading-[1.7]"
              style={{ color: "#5A6880" }}
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
                <h3
                  className="mb-2 text-[20px] font-extrabold"
                  style={{ color: "#0D1B3E" }}
                >
                  {s.title}
                </h3>
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
      </section> */}

      <section className="bg-[#F7F9FC] py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-10 md:mb-12">
            <h2 className="text-4xl font-bold text-[#0D1B3E] md:text-5xl">
              Our <span className="text-[#2E7D32]">Services</span>
            </h2>
            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-[#5A6880]">
              One trusted company for all your travel, healthcare, education,
              and career needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#DDE3F0] bg-[#DDE3F0] md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => navigate(service.page)}
                className="group flex h-full flex-col bg-white p-8 text-left transition-all duration-300 hover:bg-[#EFF3FB] active:bg-[#E6ECF7] md:p-9 lg:p-10"
              >
                {/* Icon */}
                <div className="mb-6 text-4xl transition-transform duration-300 group-hover:scale-110 md:text-5xl">
                  {service.icon}
                </div>

                {/* Badge / Number */}
                <div className="mb-3 text-xs font-bold tracking-[1.5px] text-[#2E7D32] uppercase md:text-sm">
                  {service.num}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-[20px] leading-tight font-extrabold text-[#0D1B3E] md:text-[22px]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="flex-1 text-[13px] leading-relaxed text-[#5A6880] md:text-[14px]">
                  {service.desc}
                </p>

                {/* CTA */}
                <div className="mt-6 flex items-center gap-2 font-inter text-sm font-semibold text-[#1B2B6B] transition-all group-hover:gap-3">
                  {service.cta}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOUR CARDS ══ */}

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-10 flex flex-wrap items-end justify-center gap-4">
            <div>
              <h2 className="text-4xl font-bold text-[#0D1B3E] md:text-5xl">
                Top Tour <span className="text-[#1B2B6B]">Packages</span>
              </h2>
            </div>

            {/* <button
              onClick={() => onNavigate("tourism")}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8ECFA] bg-[#E8ECFA] px-6 py-2.5 font-inter text-sm font-semibold text-[#1B2B6B] transition-all hover:border-[#1B2B6B] hover:bg-[#1B2B6B] hover:text-white"
            >
              All Packages →
            </button> */}
          </div>

          {/* Category Pills */}
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

          {/* Packages Grid */}
          <TravelCards />
        </div>
      </section>
      {/* ══ STATS ══ */}
      {/* <div
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
      </div> */}
      <div className="grid grid-cols-2 border-t-[3px] border-[#388E3C] bg-[#0F1B47] md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`border-r border-white/10 px-6 py-8 text-center last:border-r-0 md:border-r md:px-7 md:py-[38px] md:last:border-r-0`}
          >
            <div
              className="font-inter leading-none font-extrabold text-white"
              style={{ fontSize: "42px" }}
            >
              {s.num}
              <sup
                className="align-super text-[22px]"
                style={{ color: "#43A047" }}
              >
                {s.sup}
              </sup>
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
      {/* ══ DEALS ══ */}
      {/* <section className="py-[80px]" style={{ background: "#F7F9FC" }}>
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
      </section> */}

      {/* ══ WHY US ══ */}
      {/* <section className="py-[80px]">
        <div className="mx-auto max-w-[1280px] px-10">
          <div className="mx-auto mb-11 max-w-[580px] text-center">
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
      </section> */}
      <section className="py-14">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-10">
          {/* Header */}
          {/* <div className="mx-auto mb-10 max-w-[580px] md:mb-11">
            <SectionTitle center hl="Confidence">
              Travel with
            </SectionTitle>
            <p
              className="mx-auto mt-3 text-[15px] leading-relaxed md:leading-[1.7]"
              style={{ color: "#5A6880" }}
            >
              15+ years of crafting unforgettable journeys — we're with you
              every step of the way.
            </p>
          </div> */}
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
      {/* <section className="py-[80px]" style={{ background: "#EFF3FB" }}>
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
      </section> */}
      <section className="py-14" style={{ background: "#EFF3FB" }}>
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-10">
          {/* Header */}
          <div className="mx-auto mb-10 max-w-[580px] text-center md:mb-11">
            <SectionTitle center hl="Clients Say">
              What Our
            </SectionTitle>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[22px] lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative cursor-default overflow-hidden rounded-[18px] px-6 py-8 transition-all duration-300 md:px-7 md:py-[28px]"
                style={{
                  background: "#fff",
                  border: "1px solid #DDE3F0",
                  boxShadow: "0 1px 3px rgba(27,43,107,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = "#1B2B6B"
                  el.style.boxShadow = "0 6px 24px rgba(27,43,107,0.11)"
                  el.style.transform = "translateY(-4px)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = "#DDE3F0"
                  el.style.boxShadow = "0 1px 3px rgba(27,43,107,0.07)"
                  el.style.transform = "none"
                }}
              >
                {/* Big Quote Mark */}
                <div
                  className="pointer-events-none absolute top-[-12px] right-4 text-[90px] leading-none font-extrabold select-none md:right-[18px] md:text-[110px]"
                  style={{ color: "#E8ECFA" }}
                >
                  "
                </div>

                {/* Stars */}
                <div
                  className="mb-4 text-[13px] tracking-[2px]"
                  style={{ color: "#F59E0B" }}
                >
                  ★★★★★
                </div>

                {/* Testimonial Text */}
                <p
                  className="relative z-[1] mb-6 text-[14.5px] leading-relaxed md:text-[14px] md:leading-[1.78]"
                  style={{ color: "#2D3A5A" }}
                >
                  {t.text}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[17px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #1B2B6B, #1565C0)",
                    }}
                  >
                    {t.av}
                  </div>
                  <div>
                    <div
                      className="text-[14.5px] font-bold md:text-[14px]"
                      style={{ color: "#0D1B3E" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="mt-0.5 text-[12.5px] md:text-[12px]"
                      style={{ color: "#5A6880" }}
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
      {/* <section
        className="relative overflow-hidden py-[72px]"
        style={{
          background:
            "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 55%, #1B5E20 100%)",
        }}
      >
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
      </section> */}
      <section
        className="relative overflow-hidden py-14"
        style={{
          background:
            "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 55%, #1B5E20 100%)",
        }}
      >
        {/* Background circles */}
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full md:h-72 md:w-72"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />

        <div
          className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full md:h-56 md:w-56"
          style={{ background: "rgba(255,255,255,0.03)" }}
        />

        <div className="relative z-[1] mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 xl:px-10">
          <div className="text-center">
            {/* Heading */}
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
              ✉️ Stay Inspired
            </h2>

            {/* Subtitle */}
            <p
              className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed sm:text-base"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Join 50,000+ travellers. Get exclusive deals, destination guides,
              and early-bird offers.
            </p>

            {/* Input */}
            <div
              className="mx-auto flex max-w-[600px] flex-col overflow-hidden rounded-2xl sm:flex-row sm:rounded-full"
              style={{
                background: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 px-5 py-4 text-sm text-[#0D1B3E] outline-none"
              />

              <button
                className="cursor-pointer px-6 py-4 text-sm font-bold text-white transition-opacity duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #388E3C, #43A047)",
                }}
              >
                Subscribe →
              </button>
            </div>

            {/* Features */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
              {[
                "✓ No spam, ever",
                "✓ Exclusive deals first",
                "✓ Unsubscribe anytime",
              ].map((item) => (
                <span
                  key={item}
                  className="text-sm"
                  style={{
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ══ FOOTER ══ */}
      {/* <footer
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
      </footer> */}

      <footer
        style={{ background: "#060E24", paddingTop: 68, paddingBottom: 28 }}
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-10">
          <div
            className="grid grid-cols-1 gap-10 pb-11 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Brand Column */}
            <div className="xl:col-span-2">
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
                className="mb-5 max-w-[280px] text-[13px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,0.42)" }}
              >
                Your trusted partner for travel, medical tourism, foreign
                education, trade, and global recruitment. Connecting lives
                across the world since 2010.
              </p>
              <div className="flex gap-2">
                {/* {["📘", "📸", "🐦", "▶️"].map((ico, i) => ( */}
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
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Services
              </h4>
              <ul className="flex list-none flex-col gap-[9px]">
                {footerServices.map((s) => (
                  <li key={s.page}>
                    <button
                      onClick={() => navigate(s.page)}
                      className="cursor-pointer border-none bg-transparent text-left text-[13px] transition-colors duration-200"
                      style={{
                        color: "rgba(255,255,255,0.42)",
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
                style={{ color: "rgba(255,255,255,0.45)" }}
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
                      onClick={() => navigate(l.page)}
                      className="cursor-pointer border-none bg-transparent text-left text-[13px] transition-colors duration-200"
                      style={{
                        color: "rgba(255,255,255,0.42)",
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
                      }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tours */}
            <div>
              <h4
                className="mb-4 text-[11px] font-bold tracking-[1.8px] uppercase"
                style={{ color: "rgba(255,255,255,0.45)" }}
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
                      }}
                    >
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4
                className="mb-4 text-[11px] font-bold tracking-[1.8px] uppercase"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Contact Us
              </h4>
              <div
                className="font-inter text-[13px] leading-[2.1]"
                style={{ color: "rgba(255,255,255,0.42)" }}
              >
                <div> Chennai, Tamil Nadu, India</div>
                <div> +91 98765 43210</div>
                <div> info@udayaminternational.com</div>
                <div> Mon–Sat: 9AM–7PM</div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 pt-[22px] md:flex-row">
            <div
              className="text-center text-[12px] md:text-left"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              © 2026 Udayam International. All rights reserved. | Trade · Travel
              · Trust
            </div>
            <div className="flex items-center gap-[7px]">
              <span
                className="mr-1.5 text-[12px]"
                style={{ color: "rgba(255,255,255,0.3)" }}
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
          style={{ background: "#0D1B3E" }}
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
