import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import {
  Compass,
  MapPin,
  Globe2,
  Building2,
  Briefcase,
  Image as ImageIcon,
  BookOpen,
  HelpCircle,
  Quote,
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"

import banner1 from "../assets/home/banner1.jpeg"
import banner3 from "../assets/home/banner3.jpeg"

export const TourismAboutUs: React.FC = () => {
  const location = useLocation()

  // Smooth scroll listener for hash navigation with navbar offset
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "")
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const yOffset = -90 // fixed navbar offset
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [location.hash, location.pathname])

  return (
    <div
      className="text-[#1E293B]"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#FAF9F5",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          1. EDITORIAL ABOUT US HEADER
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[#E8E4DC] bg-[#0F1B47] text-white">
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 opacity-20">
          <img
            src={banner3}
            alt="UV Holidays"
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,27,71,0.85) 0%, rgba(15,27,71,0.98) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-5 py-20 text-center md:px-8 md:py-28">
          {/* Eyebrow & Breadcrumb */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#A7F3D0] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
            DISCOVER OUR STORY · ABOUT US
          </div>

          {/* Headline */}
          <h1
            className="text-3xl leading-[1.2] font-bold text-white sm:text-5xl md:text-[3.25rem]"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            Crafting Meaningful Journeys,
            <br />
            <span className="text-[#7ed88a] italic">
              Creating Endless Memories
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
            UV Holidays is the dedicated tourism division of Udayam
            International, thoughtfully curating standard and customised travel
            solutions across domestic and international destinations.
          </p>

          {/* Simple breadcrumb */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <a href="/" className="transition-colors hover:text-white">
              Home
            </a>
            <span>/</span>
            <span className="text-[#A7F3D0]">About Us</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. WHO WE ARE SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section
        id="about-us"
        className="py-16 md:py-24"
        style={{ scrollMarginTop: 90 }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#2E7D32] uppercase">
                <span className="h-[2px] w-6 bg-[#2E7D32]" />
                WHO WE ARE
              </div>

              <h2
                className="mb-6 text-3xl leading-tight font-bold text-[#0D1B3E] sm:text-4xl lg:text-[2.75rem]"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                Passionate About Turning Journeys into Memories
              </h2>

              <div className="space-y-5 text-base leading-relaxed text-slate-700 sm:text-[17px]">
                <p>
                  <strong>UV Holidays</strong> is a growing tourism brand based
                  in <strong>Kanyakumari District, Tamil Nadu</strong>, offering
                  standard and customised holiday packages, thoughtfully planned
                  tours and personalised travel solutions across domestic and
                  international destinations.
                </p>
                <p>
                  We believe every traveller has a unique travel dream. Our aim
                  is to understand your preferences and create meaningful travel
                  experiences that turn journeys into memories.
                </p>
              </div>

              {/* Distinguishing Core Pillars */}
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1B2B6B]">
                    <Globe2 size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0D1B3E]">
                    Domestic & International
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Curated destinations across India and global landmarks.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#2E7D32]">
                    <Compass size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0D1B3E]">
                    Standard & Customised
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Flexible itineraries shaped around your personal
                    preferences.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0D1B3E]">
                    Rooted in Kanyakumari
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Proudly established in Tamil Nadu, serving travellers
                    everywhere.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Editorial Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Decorative border frame */}
                <div className="absolute -top-3 -right-3 -bottom-3 -left-3 rounded-3xl border border-dashed border-[#1B2B6B]/25" />

                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
                  <img
                    src={banner1}
                    alt="Who We Are - UV Holidays"
                    className="h-[430px] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A122C]/90 via-transparent to-transparent" />
                  <div className="absolute right-6 bottom-6 left-6 text-white">
                    <span className="inline-block rounded-full bg-[#2E7D32] px-3 py-1 text-xs font-bold text-white">
                      UV Holidays
                    </span>
                    <p
                      className="mt-2 text-xl font-bold"
                      style={{ fontFamily: "'Libre Baskerville', serif" }}
                    >
                      Endless Memories.
                    </p>
                    <p className="text-xs text-slate-300">
                      Kanyakumari District · Tamil Nadu · India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. DISCOVER / ABOUT UV HOLIDAYS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-[#E8E4DC] bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="mb-12 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#1B2B6B] uppercase">
              <span className="h-[2px] w-6 bg-[#1B2B6B]" />
              DISCOVER
              <span className="h-[2px] w-6 bg-[#1B2B6B]" />
            </div>

            <h2
              className="mb-4 text-3xl font-bold text-[#0D1B3E] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              ABOUT UV HOLIDAYS
            </h2>

            <div className="inline-block rounded-full bg-[#E8ECFA] px-5 py-1.5 text-sm font-bold text-[#1B2B6B]">
              UV Holidays – Endless Memories.
            </div>
          </div>

          {/* Narrative Prose */}
          <div className="space-y-6 text-base leading-relaxed text-slate-700 sm:text-lg">
            <div className="relative rounded-3xl border border-slate-100 bg-[#FAF9F5] p-6 shadow-xs sm:p-10">
              <Quote
                size={36}
                className="mb-3 text-[#1B2B6B]/20"
                strokeWidth={1.5}
              />
              <p className="leading-relaxed font-medium text-slate-800 sm:text-[1.12rem]">
                At <strong>UV Holidays</strong>, we believe some of life's best
                memories are made when we explore the world. A beautiful
                destination, a family vacation, a journey with loved ones or an
                adventure in a new country can become a story we cherish
                forever.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-[#FAF9F5] p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-[#2E7D32]">
                  <Sparkles size={18} />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#0D1B3E]">
                  The Joy of Discovery
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Our passion for travel comes from the joy of discovering new
                  places and experiencing different cultures. We understand that
                  every traveller has different dreams, expectations and reasons
                  for travelling.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#FAF9F5] p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-[#1B2B6B]">
                  <Heart size={18} />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#0D1B3E]">
                  Part of Your Journey
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  That is why we take the time to understand what matters to you
                  and help make your travel plans a reality. For us, it is not
                  just about arranging trips; it is about being part of your
                  journey and helping you create moments worth remembering.
                </p>
              </div>
            </div>

            {/* Quote Banner */}
            <div
              className="mt-8 rounded-2xl p-8 text-center text-white"
              style={{
                background: "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 100%)",
                boxShadow: "0 10px 30px rgba(15,27,71,0.18)",
              }}
            >
              <p
                className="text-xl leading-relaxed font-bold text-white sm:text-2xl"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                “Every destination has something special to offer,
                <br className="hidden sm:inline" />
                and every journey deserves to be memorable.”
              </p>
              <div className="mt-4 text-xs font-semibold tracking-widest text-[#A7F3D0] uppercase">
                UV Holidays – Endless Memories.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. PARENT ORGANISATION SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section
        id="parent-organisation"
        className="py-16 md:py-24"
        style={{ scrollMarginTop: 90 }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-12 lg:p-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Organization Story */}
              <div className="lg:col-span-7">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#1B2B6B] uppercase">
                  <Building2 size={16} />
                  OUR ROOTS & IDENTITY
                </div>

                <h2
                  className="mb-6 text-3xl font-bold text-[#0D1B3E] sm:text-4xl lg:text-[2.6rem]"
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
                >
                  PARENT ORGANISATION
                </h2>

                <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-[17px]">
                  <p>
                    <strong>UV Holidays</strong> operates as the Tourism
                    vertical under the <strong>Travel Division</strong> of{" "}
                    <strong>Udayam International</strong>, a professionally
                    managed organisation built around three core business
                    pillars: <strong>Travel</strong>, <strong>Talent</strong>{" "}
                    and <strong>Trade</strong>. While being part of this wider
                    organisation, UV Holidays maintains its own distinct
                    identity and dedicated focus on creating memorable domestic
                    and international travel experiences.
                  </p>
                  <p>
                    At the heart of our brand identity is <strong>UV</strong> —
                    short for <strong>‘Udayam Vision,’</strong> representing the
                    vision and aspirations of Udayam International that inspire
                    and guide all its business verticals, including UV Holidays.
                  </p>
                </div>

                {/* Callout box for UV abbreviation */}
                <div className="mt-6 flex items-center gap-4 rounded-xl border border-blue-100 bg-[#F0F4FF] p-4 text-[#1B2B6B]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-[#1B2B6B] shadow-xs">
                    UV
                  </div>
                  <div className="text-sm">
                    <strong>UV = Udayam Vision</strong>
                    <p className="mt-0.5 text-xs text-slate-600">
                      Representing the aspiration, integrity, and progress that
                      guides our travel division.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Three Core Business Pillars Showcase */}
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-[#FAF9F5] p-6 sm:p-8 lg:col-span-5">
                <div className="mb-1 text-xs font-bold tracking-wider text-[#1B2B6B] uppercase">
                  Udayam International
                </div>
                <div className="mb-2 text-lg font-bold text-[#0D1B3E]">
                  Three Core Business Pillars
                </div>

                {/* Pillar 1 */}
                <div className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                  <span className="mt-0.5 text-2xl">✈️</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      Travel
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      <strong>UV Holidays</strong> & personalised travel
                      solutions, domestic and international tour packages.
                    </div>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                  <span className="mt-0.5 text-2xl">🎓</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      Talent
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      Global education pathways, language prep, and overseas
                      career recruitment.
                    </div>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                  <span className="mt-0.5 text-2xl">📦</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      Trade
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      International trade, import-export solutions, and global
                      logistics.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. OUR JOURNEY SECTION
          ══════════════════════════════════════════════════════════════════ */}
      {/* <section
        id="our-journey"
        className="border-t border-[#E8E4DC] bg-white py-16 md:py-24"
        style={{ scrollMarginTop: 90 }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="mb-14 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#2E7D32] uppercase">
              <span className="h-[2px] w-6 bg-[#2E7D32]" />
              MILESTONES & CORE ETHOS
              <span className="h-[2px] w-6 bg-[#2E7D32]" />
            </div>
            <h2
              className="text-3xl font-bold text-[#0D1B3E] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              OUR JOURNEY
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              From our roots in Kanyakumari District to curating travel
              experiences worldwide, here is how UV Holidays brings purpose to
              every journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "The Vision Begins",
                desc: "Established under Udayam International's Travel Division with a simple promise: make domestic and global travel deeply personal and honest.",
              },
              {
                step: "02",
                title: "Curated Horizons",
                desc: "Handcrafted standard and customised holiday itineraries covering popular hill stations, coastal gems, cultural circuits, and overseas wonders.",
              },
              {
                step: "03",
                title: "Traveller-First Care",
                desc: "Built on transparent pricing with no hidden charges, caring destination guidance, and end-to-end trip coordination.",
              },
              {
                step: "04",
                title: "Endless Memories",
                desc: "Continuously helping families, couples, and explorers discover new places and turn each travel plan into a story worth keeping forever.",
              },
            ].map((m, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#FAF9F5] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#1B2B6B]/40 hover:bg-white hover:shadow-lg"
              >
                <div>
                  <div className="mb-3 text-xs font-bold tracking-wider text-[#2E7D32]">
                    PHASE {m.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#0D1B3E]">
                    {m.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════════════════
          6. CAREERS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      {/* <section
        id="careers"
        className="py-16 md:py-24"
        style={{ scrollMarginTop: 90 }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-xs">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#1B2B6B] uppercase">
              <Briefcase size={16} />
              JOIN OUR TEAM
            </div>
            <h2
              className="text-2xl font-bold text-[#0D1B3E] sm:text-3xl"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Careers at UV Holidays
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              We are continually welcoming passionate travel planners, tour
              coordinators, and hospitality specialists who love helping travellers
              discover the world.
            </p>

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-[#FAF9F5] p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">
                Job vacancies and internship announcements will be updated here.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Interested in working with us? Send your profile to{" "}
                <a
                  href="mailto:hr@udayam.international"
                  className="font-semibold text-[#1B2B6B] underline"
                >
                  hr@udayam.international
                </a>
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════════════════
          7. GALLERY SECTION
          ══════════════════════════════════════════════════════════════════ */}
      {/* <section
        id="gallery"
        className="border-t border-[#E8E4DC] bg-white py-16 md:py-24"
        style={{ scrollMarginTop: 90 }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="mb-10 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#2E7D32] uppercase">
              <ImageIcon size={16} />
              VISUAL HIGHLIGHTS
            </div>
            <h2
              className="text-2xl font-bold text-[#0D1B3E] sm:text-3xl"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Travel Gallery
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              Photographs, scenic destinations, and moments captured across our
              tours.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex aspect-4/3 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#FAF9F5] p-4 text-center text-slate-400"
              >
                <ImageIcon size={26} className="mb-2 opacity-50" />
                <span className="text-xs font-medium">Gallery Item #{n}</span>
                <span className="text-[11px] text-slate-400">
                  Photographs coming soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════════════════
          8. TRAVEL BLOG SECTION
          ══════════════════════════════════════════════════════════════════ */}
      {/* <section
        id="travel-blog"
        className="py-16 md:py-24"
        style={{ scrollMarginTop: 90 }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="mb-10 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#1B2B6B] uppercase">
              <BookOpen size={16} />
              STORIES & GUIDES
            </div>
            <h2
              className="text-2xl font-bold text-[#0D1B3E] sm:text-3xl"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Travel Blog
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              Travel inspiration, destination guides, and practical tips from our
              holiday planners.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Planning Your Dream Domestic Vacation",
                tag: "Itinerary Tips",
              },
              {
                title: "How to Choose Between Standard and Custom Tours",
                tag: "Travel Guide",
              },
              {
                title: "Must-Visit Places Across South India",
                tag: "Destinations",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
              >
                <div>
                  <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {b.tag}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-[#0D1B3E]">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Articles and travel insights will be published soon.
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-3 text-xs font-semibold text-[#1B2B6B]">
                  Coming soon →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════════════════
          9. FAQS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      {/* <section
        id="faqs"
        className="border-t border-[#E8E4DC] bg-white py-16 md:py-24"
        style={{ scrollMarginTop: 90 }}
      >
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="mb-12 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#2E7D32] uppercase">
              <HelpCircle size={16} />
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2
              className="text-2xl font-bold text-[#0D1B3E] sm:text-3xl"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
              Clear answers regarding UV Holidays, tour customization, and our
              services.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What makes UV Holidays different from generic tour agencies?",
                a: "We take the time to understand your individual travel preferences. Rather than offering rigid one-size-fits-all itineraries, our specialists craft standard and tailored holiday packages backed by transparent pricing and personal support.",
              },
              {
                q: "What is the relationship between UV Holidays and Udayam International?",
                a: "UV Holidays is the dedicated tourism division under the Travel vertical of Udayam International. The name UV represents ‘Udayam Vision,’ the guiding ethos that powers our service excellence.",
              },
              {
                q: "Where is UV Holidays based?",
                a: "UV Holidays is proudly based in Kanyakumari District, Tamil Nadu, with operations covering domestic packages throughout India and international destinations globally.",
              },
              {
                q: "Can I customize a package with specific hotels or durations?",
                a: "Yes. Our team specializes in customised holiday packages. We adjust travel dates, durations, preferred hotel ratings, transfers, and activities to fit your dreams and budget.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-[#FAF9F5] p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#2E7D32]"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#0D1B3E]">
                      {faq.q}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default TourismAboutUs
