import React, { useEffect } from "react"
import { useState } from "react"
import { useLocation } from "react-router-dom"

const contactInfo = [
  {
    icon: "📍",
    label: "Office Address",
    value:
      "No: 6 - 178 / 1 , Kaniyaanvilai , Palliyadi Post , Kanyakumari Disrtict , Tamilnadu , India – 629 169.",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+ 91 72997 71111\n+ 04651 - 225 236",
  },
  {
    icon: "✉️",
    label: "Email",
    value: "info@udayaminternational.com\nsupport@udayaminternational.com",
  },
  // {
  //   icon: "🕐",
  //   label: "Working Hours",
  //   value: "Mon–Sat: 9:00 AM – 7:00 PM\nSunday: 10:00 AM – 2:00 PM",
  // },
]

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const f = "'Inter',sans-serif"
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)

      if (el) {
        setTimeout(() => {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }, 100)
      }
    }
  }, [location])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: "", phone: "", email: "", service: "", message: "" })
  }

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
              backgroundImage:
                "url('https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1800&auto=format&fit=crop&q=80')",
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

        {/* CONTACT SECTION */}
        <section id="contact-section" className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                We're Here for You
              </div>
              <h2 className="mb-2 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                Let's Start a{" "}
                <span className="text-[#1B2B6B]">Conversation</span>
              </h2>
              <p className="max-w-md text-[15px] text-[#5A6880]">
                Reach out for any enquiry. Our team responds within 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
              {/* LEFT — Contact Info + Map */}
              <div>
                <div className="mb-6 flex flex-col gap-4">
                  {contactInfo.map((ci) => (
                    <div key={ci.label} className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] border border-[#DDE3F0] bg-[#E8ECFA] text-xl">
                        {ci.icon}
                      </div>
                      <div>
                        <div className="mb-0.5 text-[11px] font-bold tracking-[1.5px] text-[#2E7D32] uppercase">
                          {ci.label}
                        </div>
                        <div className="text-[14.5px] leading-relaxed whitespace-pre-line text-[#0D1B3E]">
                          {ci.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Placeholder */}
                <div className="justify-content flex h-56 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#C5CEDF] bg-[#F7F9FC] text-[14px] text-[#5A6880]">
                  <span className="text-3xl">📍</span>
                  <span>Google Maps Integration</span>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-[12px] font-semibold text-[#1B2B6B] underline underline-offset-2"
                  >
                    View on Google Maps
                  </a>
                </div>

                {/* Quick Contacts */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-[#A5D6A7] bg-[#E8F5E9] p-4 text-[14px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#2E7D32] hover:text-white"
                  >
                    <span className="text-xl">💬</span>
                    WhatsApp Us
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 rounded-xl border border-[#C5CEDF] bg-[#E8ECFA] p-4 text-[14px] font-semibold text-[#1B2B6B] transition-colors hover:bg-[#1B2B6B] hover:text-white"
                  >
                    <span className="text-xl">📞</span>
                    Call Now
                  </a>
                </div>
              </div>

              {/* RIGHT — Message Form */}
              <div className="rounded-2xl border border-[#DDE3F0] bg-[#F7F9FC] p-7 md:p-9">
                <h3 className="mb-6 font-['Playfair_Display',serif] text-2xl font-extrabold tracking-tight text-[#0D1B3E]">
                  Send Us a Message
                </h3>

                {submitted && (
                  <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#A5D6A7] bg-[#E8F5E9] p-4 text-[14px] font-semibold text-[#2E7D32]">
                    ✅ Message sent! We'll reply within 24 hours.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Full Name">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="Your name"
                        required
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
                      required
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Service Interested In" className="mb-4">
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option value="">Select service</option>
                      {[
                        "Tourism",
                        "Medical Tourism",
                        "Travel Services",
                        "Trade",
                        "Foreign Education",
                        "Recruitment",
                        "General Enquiry",
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Message" className="mb-5">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="How can we help you?"
                      required
                      className={inputCls + " resize-y"}
                    />
                  </FormField>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#1B2B6B] to-[#1565C0] py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Send Message →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0F1B47] via-[#1B2B6B] to-[#1B5E20] py-16 md:py-20">
          <div className="absolute top-[-80px] right-[-80px] h-80 w-80 rounded-full bg-white/[0.04]" />
          <div className="absolute bottom-[-60px] left-[-60px] h-64 w-64 rounded-full bg-white/[0.03]" />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-3 font-['Playfair_Display',serif] text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-[15.5px] text-white/75">
              Whether it's travel, healthcare, education, or career — our
              experts are here for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#388E3C] to-[#43A047] px-7 py-3.5 text-[14.5px] font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                📞 Call Us Now
              </a>
              <a
                href="mailto:info@udayaminternational.com"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 bg-white/10 px-7 py-3.5 text-[14.5px] font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                ✉️ Email Us
              </a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              {[
                "✓ Free Consultation",
                "✓ 24/7 Support",
                "✓ Trusted Since 2010",
              ].map((chip) => (
                <span
                  key={chip}
                  className="flex items-center gap-1 text-[13px] text-white/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

const inputCls =
  "w-full bg-white border border-[#DDE3F0] text-[#0D1B3E] px-3.5 py-2.5 rounded-[9px] text-[14px] outline-none focus:border-[#1B2B6B] transition-colors placeholder:text-[#9BA8C0]"

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
