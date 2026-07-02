import React from "react"
import { useState } from "react"
import requirment from "../assets/Requirement.jpeg"
const expertiseItems = [
  {
    icon: "🌍",
    title: "International Placement",
    desc: "Gulf, Malaysia, Singapore, Europe, UK, and Canada.",
  },
  {
    icon: "🇮🇳",
    title: "Domestic Placement",
    desc: "Pan-India placement across industries for all skill levels.",
  },
  {
    icon: "📑",
    title: "Visa & Work Permit",
    desc: "End-to-end work visa processing for international candidates.",
  },
  {
    icon: "🎓",
    title: "Skill Development",
    desc: "Pre-departure training and orientation programmes.",
  },
]

const jobCategories = [
  {
    type: "Healthcare",
    title: "Nurses & Paramedics",
    markets: "Gulf · UK · Canada · Australia",
  },
  {
    type: "Engineering",
    title: "Civil & Mechanical Engineers",
    markets: "Gulf · Malaysia · Singapore",
  },
  {
    type: "IT & Technology",
    title: "Software Developers",
    markets: "UK · Canada · Germany",
  },
  {
    type: "Hospitality",
    title: "Hotel & Restaurant Staff",
    markets: "Gulf · Europe · Singapore",
  },
  {
    type: "Construction",
    title: "Skilled & Semi-skilled Workers",
    markets: "Gulf · Malaysia",
  },
  {
    type: "Education",
    title: "Teachers & Trainers",
    markets: "Gulf · Singapore · UK",
  },
]

export default function Recruitment() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "",
    role: "",
    location: "",
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
    alert("Registration submitted! Our team will contact you shortly.")
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
              backgroundImage: `url(${requirment})`,
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
        {/* EXPERTISE */}
        {/* <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                  <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                  Our Expertise
                </div>
                <h2 className="mb-6 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                  Connecting{" "}
                  <span className="text-[#1B2B6B]">Talent & Opportunity</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {expertiseItems.map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-xl border border-[#DDE3F0] bg-[#F7F9FC] p-4 transition-colors hover:border-[#1B2B6B] md:p-5"
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
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
                  alt="Recruitment"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* JOB CATEGORIES */}
        {/* <section className="bg-[#F7F9FC] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                Available Sectors
              </div>
              <h2 className="font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                Job <span className="text-[#1B2B6B]">Categories</span> We Serve
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobCategories.map((job) => (
                <div
                  key={job.title}
                  className="rounded-xl border border-l-[3px] border-[#DDE3F0] border-l-[#388E3C] bg-white p-6 transition-all hover:border-[#DDE3F0] hover:shadow-md"
                >
                  <div className="mb-2 text-[10.5px] font-bold tracking-[1.5px] text-[#2E7D32] uppercase">
                    {job.type}
                  </div>
                  <div className="mb-1.5 font-['Playfair_Display',serif] text-[17px] font-bold text-[#0D1B3E]">
                    {job.title}
                  </div>
                  <div className="text-[12px] text-[#5A6880]">
                    {job.markets}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* REGISTRATION FORM */}
        {/* <section className="bg-[#0F1B47] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#43A047] uppercase">
                  <span className="h-0.5 w-5 rounded bg-[#43A047]" />
                  Register
                </div>
                <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-white md:text-4xl">
                  Register Your{" "}
                  <em className="text-[#7EC8E3] italic not-italic">Interest</em>
                </h2>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/60">
                  Job seeker or employer — we connect the right people with the
                  right opportunities.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  {[
                    {
                      icon: "🌍",
                      title: "Global Network",
                      sub: "Opportunities across Gulf, Europe, and more",
                    },
                    {
                      icon: "📑",
                      title: "Work Visa Support",
                      sub: "Full documentation and processing",
                    },
                    {
                      icon: "🎓",
                      title: "Pre-departure Training",
                      sub: "Skill development and orientation",
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
                <FormField label="I Am A" className="mb-4">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="">Select</option>
                    <option>Job Seeker</option>
                    <option>Employer / Company</option>
                  </select>
                </FormField>
                <FormField label="Role / Category" className="mb-4">
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Nurse, Civil Engineer, IT Developer"
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Preferred Location" className="mb-4">
                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="">Select location</option>
                    {[
                      "Gulf Countries",
                      "Malaysia",
                      "Singapore",
                      "UK",
                      "Canada",
                      "Europe",
                      "Domestic India",
                    ].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Message" className="mb-4">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Experience and expectations…"
                    className={inputCls + " resize-y"}
                  />
                </FormField>
                <button
                  type="submit"
                  className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#1B2B6B] to-[#1565C0] py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  Submit Registration →
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
