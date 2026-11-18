import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Compass,
  MapPin,
  ShieldCheck,
  Headphones,
  Sparkles,
  Plane,
  ArrowRight,
  Phone,
  Globe2,
} from "lucide-react"

import TourismTestimonials from "./TourismTestimonials"
import banner1 from "../assets/home/banner1.jpeg"
import banner3 from "../assets/home/banner3.jpeg"

const WHATSAPP_NUMBER = "917299771111"

const differences = [
  {
    title: "Customised Itineraries",
    description:
      "Every trip is crafted around your preferences — no cookie-cutter packages, just journeys designed for you.",
    icon: Compass,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    title: "Expert Destination Guidance",
    description:
      "Our specialists bring deep local knowledge so you experience the very best of every place.",
    icon: Globe2,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    title: "End-to-End Travel Solutions",
    description:
      "Flights, hotels, transfers, sightseeing — every detail handled so you can simply enjoy the journey.",
    icon: Plane,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden charges, no surprises. Clear and honest from the very first quote.",
    icon: ShieldCheck,
    color: "#9333EA",
    bg: "#FAF5FF",
  },
  {
    title: "Seamless Travel Experience",
    description:
      "Smooth coordination at every touchpoint means stress-free travel from departure to return.",
    icon: Sparkles,
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  {
    title: "Dedicated Customer Support",
    description:
      "Our team is with you before, during, and after your trip — always reachable, always ready.",
    icon: Headphones,
    color: "#DC2626",
    bg: "#FEF2F2",
  },
]

const TourismHome: React.FC = () => {
  const navigate = useNavigate()

  const openGeneralWhatsApp = () => {
    const message =
      `🌟 Hello UV Holidays team!\n\n` +
      `I am interested in planning a vacation and would love to know more about your standard and customised tour packages.\n\n` +
      `Please connect with me.`
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  return (
    <div className="bg-[#FAF9F5] text-[#1E293B]">
      {/* ═══ 1. HERO BANNER (ONE IMAGE & TEXT) ═══ */}
      <section className="relative overflow-hidden bg-[#0A122C]">
        <div className="relative h-[480px] w-full md:h-[540px]">
          <img
            src={banner3}
            alt="UV Holidays - Endless Memories"
            className="h-full w-full object-cover"
          />
          {/* Subtle Dark Gradient Overlay for optimal readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,18,44,0.45) 0%, rgba(10,18,44,0.72) 60%, rgba(10,18,44,0.92) 100%)",
            }}
          />

          <div className="absolute inset-0 z-10 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12">
              <div className="max-w-2xl text-white">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#A7F3D0] backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  UV HOLIDAYS · ENDLESS MEMORIES
                </div>

                <h1 className="mb-4 text-3xl font-extrabold leading-[1.14] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Crafting Meaningful Travel Experiences
                </h1>

                <p className="mb-8 text-sm leading-relaxed text-slate-200 sm:text-base md:text-lg">
                  Standard and customised holiday packages, thoughtfully planned
                  tours, and personalised travel solutions across domestic and
                  international destinations.
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  <button
                    onClick={() => navigate("/tourism")}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-gradient-to-r from-[#1B2B6B] to-[#2563EB] px-7 py-3.5 font-inter text-sm font-bold text-white shadow-lg shadow-blue-900/40 transition-transform duration-200 hover:scale-105"
                  >
                    Explore Tour Packages <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. WHO WE ARE ═══ */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-[#0D1B3E] sm:text-4xl lg:text-5xl">
                WHO WE ARE
              </h2>

              <div className="space-y-4 font-inter text-[15px] leading-relaxed text-slate-600 sm:text-base">
                <p>
                  <strong>UV Holidays</strong> is a growing tourism brand based
                  in <strong>Kanyakumari District, Tamil Nadu</strong>,
                  offering standard and customised holiday packages,
                  thoughtfully planned tours and personalised travel solutions
                  across domestic and international destinations.
                </p>
                <p>
                  We believe every traveller has a unique travel dream. Our aim
                  is to understand your preferences and create meaningful travel
                  experiences that turn journeys into memories.
                </p>
              </div>

              {/* Badges */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1B2B6B]">
                    <Globe2 size={20} />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Domestic & International
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Compass size={20} />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Standard & Customised Tours
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <MapPin size={20} />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Kanyakumari, Tamil Nadu
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border-4 border-white bg-slate-900 shadow-2xl">
                <img
                  src={banner1}
                  alt="UV Holidays - Who We Are"
                  className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A122C]/90 via-transparent to-transparent" />
                <div className="absolute right-6 bottom-6 left-6 text-white">
                  <div className="inline-block rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    UV Holidays
                  </div>
                  <p className="mt-2 text-xl font-bold">Endless Memories.</p>
                  <p className="text-xs text-slate-200">
                    Kanyakumari District · Tamil Nadu · India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. WHAT MAKES UV HOLIDAYS DIFFERENT ═══ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="mb-14 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#1B2B6B] uppercase">
              <span className="h-[2px] w-6 bg-[#1B2B6B]" />
              WHY CHOOSE US
              <span className="h-[2px] w-6 bg-[#1B2B6B]" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0D1B3E] sm:text-4xl lg:text-5xl">
              WHAT MAKES UV HOLIDAYS DIFFERENT
            </h2>
            <p className="mx-auto mt-3 max-w-2xl font-inter text-sm text-slate-600 sm:text-base">
              We focus on what matters most to you — bespoke planning, honest
              pricing, and caring support throughout your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {differences.map((diff, index) => {
              const IconComp = diff.icon
              return (
                <div
                  key={index}
                  className="group relative flex flex-col rounded-2xl border border-slate-100 bg-[#FAF9F5] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: diff.bg, color: diff.color }}
                  >
                    <IconComp size={24} />
                  </div>
                  <h3 className="mb-2.5 text-lg font-bold text-[#0D1B3E]">
                    ✦ {diff.title}
                  </h3>
                  <p className="font-inter text-sm leading-relaxed text-slate-600">
                    {diff.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ 4. STATS STRIP ═══ */}
      <section className="bg-[#0F1B47] py-12 text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="border-r border-white/10 text-center last:border-none">
              <div className="text-3xl font-extrabold sm:text-5xl">
                12K<span className="text-[#43A047]">+</span>
              </div>
              <div className="mt-1 text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Happy Travellers
              </div>
            </div>

            <div className="border-r border-white/10 text-center last:border-none">
              <div className="text-3xl font-extrabold sm:text-5xl">
                80<span className="text-[#43A047]">+</span>
              </div>
              <div className="mt-1 text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Destinations
              </div>
            </div>

            <div className="border-r border-white/10 text-center last:border-none">
              <div className="text-3xl font-extrabold sm:text-5xl">
                500<span className="text-[#43A047]">+</span>
              </div>
              <div className="mt-1 text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Tour Packages
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-extrabold sm:text-5xl">
                98<span className="text-[#43A047]">%</span>
              </div>
              <div className="mt-1 text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. DISCOVER / ABOUT UV HOLIDAYS ═══ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#1B2B6B] uppercase">
            <span className="h-[2px] w-6 bg-[#1B2B6B]" />
            DISCOVER
            <span className="h-[2px] w-6 bg-[#1B2B6B]" />
          </div>

          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-[#0D1B3E] sm:text-4xl lg:text-5xl">
            ABOUT UV HOLIDAYS
          </h2>

          <div className="mb-8 inline-block rounded-full bg-[#E8ECFA] px-5 py-1.5 text-sm font-bold text-[#1B2B6B]">
            UV Holidays – Endless Memories.
          </div>

          <div className="space-y-5 text-left font-inter text-base leading-relaxed text-slate-600 sm:text-lg">
            <p>
              At <strong>UV Holidays</strong>, we believe some of life's best
              memories are made when we explore the world. A beautiful
              destination, a family vacation, a journey with loved ones or an
              adventure in a new country can become a story we cherish forever.
            </p>
            <p>
              Our passion for travel comes from the joy of discovering new
              places and experiencing different cultures. We understand that
              every traveller has different dreams, expectations and reasons for
              travelling.
            </p>
            <p>
              That is why we take the time to understand what matters to you and
              help make your travel plans a reality. For us, it is not just
              about arranging trips; it is about being part of your journey and
              helping you create moments worth remembering.
            </p>
            <p className="font-semibold text-[#0D1B3E]">
              Every destination has something special to offer, and every
              journey deserves to be memorable.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 6. PARENT ORGANISATION ═══ */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12 lg:p-16">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#1B2B6B] uppercase">
                  <span className="h-[2px] w-6 bg-[#1B2B6B]" />
                  OUR ROOTS
                </div>

                <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-[#0D1B3E] sm:text-3xl lg:text-4xl">
                  PARENT ORGANISATION
                </h2>

                <div className="space-y-4 font-inter text-[15px] leading-relaxed text-slate-600 sm:text-base">
                  <p>
                    <strong>UV Holidays</strong> operates as the Tourism vertical
                    under the <strong>Travel Division</strong> of{" "}
                    <strong>Udayam International</strong>, a professionally
                    managed organisation built around three core business
                    pillars: <strong>Travel</strong>, <strong>Talent</strong>{" "}
                    and <strong>Trade</strong>. While being part of this wider
                    organisation, UV Holidays maintains its own distinct identity
                    and dedicated focus on creating memorable domestic and
                    international travel experiences.
                  </p>
                  <p>
                    At the heart of our brand identity is <strong>UV</strong> —
                    short for <strong>‘Udayam Vision,’</strong> representing the
                    vision and aspirations of Udayam International that inspire
                    and guide all its business verticals, including UV Holidays.
                  </p>
                </div>
              </div>

              {/* Three Pillars Badge */}
              <div className="flex flex-col gap-3 rounded-2xl bg-[#F0F4FF] p-6 lg:col-span-4">
                <div className="mb-1 text-xs font-bold tracking-wider text-[#1B2B6B] uppercase">
                  Three Core Business Pillars
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-xs">
                  <span className="text-xl">✈️</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      Travel
                    </div>
                    <div className="text-xs text-slate-500">
                      UV Holidays & Travel Solutions
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-xs">
                  <span className="text-xl">🎓</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      Talent
                    </div>
                    <div className="text-xs text-slate-500">
                      Global Education & Placements
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-xs">
                  <span className="text-xl">📦</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      Trade
                    </div>
                    <div className="text-xs text-slate-500">
                      Import, Export & Logistics
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center text-xs font-semibold text-[#1B2B6B]">
                  UV = Udayam Vision
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. WHATSAPP CTA BANNER (COPIED FROM HOME) ═══ */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div
            className="relative overflow-hidden rounded-3xl p-8 md:p-12"
            style={{
              background:
                "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 60%, #0F1B47 100%)",
              boxShadow: "0 12px 40px rgba(15,27,71,0.25)",
            }}
          >
            {/* Background Decorative Rings */}
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full border border-white/10" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="max-w-xl text-white">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-[#A7F3D0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  Instant WhatsApp Assistance
                </div>
                <h3 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                  Ready to Plan Your Next Vacation?
                </h3>
                <p className="mt-2 text-sm text-slate-200 sm:text-base">
                  Speak directly with our holiday specialists on WhatsApp for
                  customised itineraries, best hotel deals, and flight quotes.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={openGeneralWhatsApp}
                  className="flex cursor-pointer items-center gap-2.5 rounded-full px-7 py-4 font-inter text-sm font-bold text-white transition-all duration-200 hover:scale-105"
                  style={{
                    background: "#25D366",
                    boxShadow: "0 6px 24px rgba(37,211,102,0.45)",
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </button>

                <a
                  href="tel:+917299771111"
                  className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-4 font-inter text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Phone size={16} /> +91 72997 71111
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. TESTIMONIALS (USES TourismTestimonials INTERNAL HEADER DIRECTLY) ═══ */}
      <TourismTestimonials />
    </div>
  )
}

export default TourismHome
