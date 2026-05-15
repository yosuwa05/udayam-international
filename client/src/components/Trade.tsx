import React from "react"
import { useState } from "react"
import trade from "../assets/Trade.jpeg"

const tradeCategories = [
  { icon: "🌾", name: "Agriculture", sub: "Spices, grains, pulses" },
  { icon: "🏭", name: "Manufacturing", sub: "Machinery & equipment" },
  { icon: "💎", name: "Gems & Jewellery", sub: "Precious stones & crafts" },
  { icon: "👗", name: "Textiles", sub: "Fabrics & garments" },
  { icon: "💊", name: "Pharmaceuticals", sub: "Generic & herbal" },
  { icon: "🔌", name: "Electronics", sub: "Components & consumer goods" },
  { icon: "🛢️", name: "Chemicals", sub: "Industrial chemicals" },
  { icon: "🍽️", name: "Food & Beverage", sub: "Processed foods" },
]

const supportItems = [
  {
    icon: "📄",
    title: "Documentation & Compliance",
    desc: "LC handling, export documentation, customs clearance.",
  },
  {
    icon: "🚢",
    title: "Freight & Logistics",
    desc: "Sea, air, and road freight with trusted carrier partners.",
  },
  {
    icon: "🤝",
    title: "Buyer-Seller Matchmaking",
    desc: "Connecting Indian exporters with international buyers.",
  },
]

export default function Trade() {
  const [form, setForm] = useState({
    contactName: "",
    company: "",
    phone: "",
    email: "",
    category: "",
    service: "",
    message: "",
  })
  const f = "'Inter',sans-serif"

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(
      "Business enquiry submitted! Our trade expert will contact you shortly."
    )
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
              backgroundImage: `url(${trade})`,

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

        {/* TRADE CATEGORIES */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                Global Commerce
              </div>
              <h2 className="mb-2 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                Your Bridge to{" "}
                <span className="text-[#1B2B6B]">International Trade</span>
              </h2>
              <p className="max-w-xl text-[15px] text-[#5A6880]">
                We facilitate import and export across multiple industries,
                handling documentation, logistics, and compliance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {tradeCategories.map((cat) => (
                <div
                  key={cat.name}
                  className="group flex cursor-pointer flex-col items-center rounded-xl border border-[#DDE3F0] bg-[#F7F9FC] p-5 text-center transition-all hover:border-[#1B2B6B] hover:bg-[#1B2B6B] md:p-6"
                >
                  <div className="mb-2 text-3xl">{cat.icon}</div>
                  <div className="text-[14.5px] font-bold text-[#0D1B3E] transition-colors group-hover:text-white">
                    {cat.name}
                  </div>
                  <div className="mt-1 text-[12px] text-[#5A6880] transition-colors group-hover:text-white/80">
                    {cat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRADE SUPPORT */}
        <section className="bg-[#F7F9FC] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Left */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                  <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                  Our Support
                </div>
                <h2 className="mb-6 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                  Comprehensive{" "}
                  <span className="text-[#1B2B6B]">Trade Support</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {supportItems.map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-xl border border-[#DDE3F0] bg-white p-4 transition-colors hover:border-[#1B2B6B] md:p-5"
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
              {/* Right Image */}
              <div className="h-72 overflow-hidden rounded-2xl shadow-2xl md:h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80"
                  alt="Trade"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS ENQUIRY FORM */}
        <section className="bg-[#0F1B47] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Left */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#43A047] uppercase">
                  <span className="h-0.5 w-5 rounded bg-[#43A047]" />
                  Connect
                </div>
                <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-white md:text-4xl">
                  Submit a{" "}
                  <em className="text-[#7EC8E3] italic not-italic">Business</em>
                  <br />
                  Enquiry
                </h2>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/60">
                  Tell us about your trade requirements and our experts will
                  connect with you promptly.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  {[
                    {
                      icon: "🌍",
                      title: "40+ Country Network",
                      sub: "Active trade partnerships globally",
                    },
                    {
                      icon: "📑",
                      title: "Full Documentation",
                      sub: "LC, customs, export compliance",
                    },
                    {
                      icon: "⚡",
                      title: "Fast Turnaround",
                      sub: "Quick response on all trade enquiries",
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
              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl bg-white p-7 md:p-9"
              >
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Contact Name">
                    <input
                      name="contactName"
                      value={form.contactName}
                      onChange={handleChange}
                      type="text"
                      placeholder="Your name"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Company">
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      type="text"
                      placeholder="Company name"
                      className={inputCls}
                    />
                  </FormField>
                </div>
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <FormField label="Email">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="you@company.com"
                      className={inputCls}
                    />
                  </FormField>
                </div>
                <FormField label="Trade Category" className="mb-4">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="">Select category</option>
                    {[
                      "Agriculture",
                      "Manufacturing",
                      "Textiles",
                      "Pharmaceuticals",
                      "Electronics",
                      "Food & Beverage",
                      "Other",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Service Required" className="mb-4">
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="">Select service</option>
                    {[
                      "Export Assistance",
                      "Import Assistance",
                      "Freight & Logistics",
                      "Documentation",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Message" className="mb-4">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Trade requirements…"
                    className={inputCls + " resize-y"}
                  />
                </FormField>
                <button
                  type="submit"
                  className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#1B2B6B] to-[#1565C0] py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  Submit Business Enquiry →
                </button>
              </form>
            </div>
          </div>
        </section>
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
