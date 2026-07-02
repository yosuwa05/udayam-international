import React from "react"
import { useState } from "react"
import travel from "../assets/Travel.jpeg"

const infoItems = [
  {
    icon: "✈️",
    title: "Flight Booking Assistance",
    desc: "Best fares on domestic and international flights with flexible booking options.",
  },
  {
    icon: "🛂",
    title: "Visa Services",
    desc: "Tourist, business, student, and work visa assistance for all major countries.",
  },
  {
    icon: "📋",
    title: "Document Guidance",
    desc: "Complete checklist and support for all visa and travel documentation.",
  },
  {
    icon: "🏨",
    title: "Hotel & Transfer Booking",
    desc: "Curated accommodation and airport transfer arrangements worldwide.",
  },
]

const visaCountries = [
  { flag: "🇬🇧", name: "United Kingdom", sub: "Tourist · Student · Business" },
  { flag: "🇦🇺", name: "Australia", sub: "Tourist · Student · Work" },
  { flag: "🇨🇦", name: "Canada", sub: "Tourist · PR · Work Permit" },
  { flag: "🇸🇬", name: "Singapore", sub: "Tourist · Business" },
  { flag: "🇯🇵", name: "Japan", sub: "Tourist · Business" },
  { flag: "🇩🇪", name: "Germany", sub: "Schengen · Student" },
  { flag: "🇦🇪", name: "UAE / Dubai", sub: "Tourist · Business" },
  { flag: "🇺🇸", name: "United States", sub: "B1/B2 · F1 · H1B" },
]

export default function TravelService() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    destination: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Enquiry submitted! We'll get back to you within 24 hours.")
  }
  const f = "'Inter',sans-serif"

  return (
    <>
      <style>{`
        @keyframes fsu{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes mqscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .t-h1-anim{opacity:0;animation:fsu 1s .35s forwards}
        .t-eye-anim{opacity:0;animation:fsu .9s .2s forwards}
        .t-meta-anim{opacity:0;animation:fsu 1s .5s forwards}
        .mq-run{animation:mqscroll 30s linear infinite}
    
    
    
      `}</style>
      <div className="bg-white font-[Outfit,sans-serif] text-[#0D1B3E]">
        {/* PAGE HERO */}
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${travel})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "transform 8s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.transform = "scale(1.03)")
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
        </section>

        {/* WHAT WE OFFER */}
        {/* <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                  <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                  What We Offer
                </div>
                <h2 className="mb-6 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                  Everything You{" "}
                  <span className="text-[#1B2B6B]">Need to Fly</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {infoItems.map((item) => (
                    <div
                      key={item.title}
                      className="group flex gap-4 rounded-xl border border-[#DDE3F0] bg-[#F7F9FC] p-4 transition-colors hover:border-[#1B2B6B] md:p-5"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[9px] bg-[#E8ECFA] text-xl">
                        {item.icon}
                      </div>
                      <div>
                        <div className="mb-1 text-[15px] font-bold text-[#0D1B3E]">
                          {item.title}
                        </div>
                        <div className="text-[13px] leading-relaxed text-[#5A6880]">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-72 overflow-hidden rounded-2xl shadow-2xl md:h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
                  alt="Travel"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* VISA DESTINATIONS */}
        {/* <section className="bg-[#F7F9FC] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                Visa Destinations
              </div>
              <h2 className="font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                Countries We <span className="text-[#1B2B6B]">Process</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {visaCountries.map((c) => (
                <div
                  key={c.name}
                  className="group flex cursor-pointer flex-col items-center rounded-xl border border-[#DDE3F0] bg-white p-5 text-center transition-all hover:border-[#1B2B6B] hover:bg-[#1B2B6B]"
                >
                  <div className="mb-2 text-3xl">{c.flag}</div>
                  <div className="text-[14.5px] font-bold text-[#0D1B3E] transition-colors group-hover:text-white">
                    {c.name}
                  </div>
                  <div className="mt-1 text-[12px] text-[#5A6880] transition-colors group-hover:text-white/80">
                    {c.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* ENQUIRY FORM */}
        {/* <section className="bg-[#0F1B47] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#43A047] uppercase">
                  <span className="h-0.5 w-5 rounded bg-[#43A047]" />
                  Submit Enquiry
                </div>
                <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-white md:text-4xl">
                  Plan Your{" "}
                  <em className="text-[#7EC8E3] italic not-italic">Travel</em>
                  <br />
                  with Us
                </h2>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/60">
                  Tell us your plans and we'll handle tickets, visa,
                  accommodation, and more.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  {[
                    {
                      icon: "✈️",
                      title: "Best Fare Guaranteed",
                      sub: "Domestic & international at unbeatable prices",
                    },
                    {
                      icon: "🛂",
                      title: "Visa Expert Support",
                      sub: "End-to-end documentation and filing",
                    },
                    {
                      icon: "📞",
                      title: "24/7 Assistance",
                      sub: "A dedicated advisor throughout your trip",
                    },
                  ].map((p) => (
                    <div key={p.title} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[9px] border border-white/[0.12] bg-white/[0.08] text-lg">
                        {p.icon}
                      </div>
                      <div>
                        <strong className="mb-0.5 block text-[14px] font-semibold text-white">
                          {p.title}
                        </strong>
                        <span className="text-[13px] text-white/55">
                          {p.sub}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl bg-white p-7 md:p-9"
              >
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Full Name">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Your name"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Phone">
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className={inputCls}
                    />
                  </FormField>
                </div>
                <FormField label="Email" className="mb-4">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@email.com"
                    className={inputCls}
                  />
                </FormField>
               
                <FormField label="Destination" className="mb-4">
                  <input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Singapore, UK"
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Message" className="mb-4">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Travel requirements…"
                    className={inputCls + " resize-none"}
                  />
                </FormField>
                <button
                  type="submit"
                  className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#1B2B6B] to-[#1565C0] py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  Submit Enquiry →
                </button>
              </form>
            </div>
          </div>
        </section> */}
      </div>
    </>
  )
}

const inputCls =
  "w-full bg-[#F7F9FC] border border-[#DDE3F0] text-[#0D1B3E] px-3.5 py-2.5 rounded-[9px] text-[14px] outline-none focus:border-[#1B2B6B] transition-colors placeholder:text-[#9BA8C0]"

function FormField({
  label,
  children,
  className = "",
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[11px] font-bold tracking-[1.2px] text-[#5A6880] uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}
