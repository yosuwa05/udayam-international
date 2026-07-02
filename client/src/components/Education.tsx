import React from "react"
import { useState } from "react"
import education from "../assets/Education.jpeg"
import { EducationCursor } from "./cursor/Educationcursor"

const destinations = [
  {
    flag: "🇬🇧",
    name: "United Kingdom",
    unis: "Oxford · Cambridge · Imperial College\nLondon School of Economics\nUniversity of Edinburgh",
  },
  {
    flag: "🇦🇺",
    name: "Australia",
    unis: "University of Melbourne · Sydney · ANU\nMonash University\nUniversity of Queensland",
  },
  {
    flag: "🇨🇦",
    name: "Canada",
    unis: "University of Toronto · UBC\nMcGill University\nWaterloo · McMaster",
  },
  {
    flag: "🇩🇪",
    name: "Germany",
    unis: "TU Munich · Heidelberg\nFree University Berlin\nTuition-free options available",
  },
  {
    flag: "🇸🇬",
    name: "Singapore",
    unis: "NUS · NTU · SMU\nSUTD · SIM\nGateway to ASEAN careers",
  },
  {
    flag: "🇳🇿",
    name: "New Zealand",
    unis: "Auckland · Otago\nVictoria University\nPost-study work visa options",
  },
]

const steps = [
  {
    num: "01",
    title: "Profile Assessment",
    desc: "Academic background, goals, and budget analysis.",
  },
  {
    num: "02",
    title: "Course Selection",
    desc: "Shortlisting universities and programs that fit you.",
  },
  {
    num: "03",
    title: "Application",
    desc: "SOP writing and full application support.",
  },
  {
    num: "04",
    title: "Visa Filing",
    desc: "Documentation and embassy interview prep.",
  },
  {
    num: "05",
    title: "Pre-Departure",
    desc: "Accommodation, forex, travel, and orientation.",
  },
]

export default function Education() {
  const [form, setForm] = useState({
    studentName: "",
    phone: "",
    email: "",
    country: "",
    course: "",
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
      "Education enquiry submitted! Our counsellor will reach you within 24 hours."
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
      {/* <EducationCursor /> */}
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
              backgroundImage: `url(${education})`,
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

        {/* STUDY DESTINATIONS */}
        {/* <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                Study Destinations
              </div>
              <h2 className="mb-2 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                Where Will You <span className="text-[#1B2B6B]">Study?</span>
              </h2>
              <p className="max-w-xl text-[15px] text-[#5A6880]">
                From the Ivy League to Russell Group — we help you reach the
                institution of your dreams.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((dest) => (
                <div
                  key={dest.name}
                  className="group overflow-hidden rounded-2xl border border-[#DDE3F0] bg-white transition-all hover:-translate-y-1 hover:border-[#1B2B6B] hover:shadow-xl"
                >
                  <div className="flex h-28 items-center justify-center bg-[#EFF3FB] text-5xl">
                    {dest.flag}
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 font-['Playfair_Display',serif] text-[17px] font-bold text-[#0D1B3E] transition-colors group-hover:text-[#1B2B6B]">
                      {dest.name}
                    </h3>
                    <div className="text-[12.5px] leading-7 whitespace-pre-line text-[#5A6880]">
                      {dest.unis}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* HOW WE HELP — STEPS */}
        {/* <section className="bg-[#F7F9FC] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] text-[#2E7D32] uppercase">
                <span className="h-0.5 w-5 rounded bg-[#2E7D32]" />
                Admission Journey
              </div>
              <h2 className="font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-[#0D1B3E] md:text-4xl">
                How We Help You{" "}
                <span className="text-[#1B2B6B]">Get Admitted</span>
              </h2>
            </div>

            <div className="relative mt-10">
              <div className="absolute top-8 right-[10%] left-[10%] hidden h-[1.5px] bg-[#C5CEDF] md:block" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-5">
                {steps.map((step, i) => (
                  <div
                    key={step.num}
                    className="relative z-10 flex flex-col items-center px-2 text-center"
                  >
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C5CEDF] bg-white font-['Playfair_Display',serif] text-xl font-extrabold text-[#1B2B6B] shadow-sm transition-all hover:border-[#1B2B6B] hover:bg-[#1B2B6B] hover:text-white">
                      {step.num}
                    </div>
                    <div className="mb-1 text-[13px] font-bold text-[#0D1B3E]">
                      {step.title}
                    </div>
                    <div className="text-[12px] leading-snug text-[#5A6880]">
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
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
                  Start Your Journey
                </div>
                <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl leading-tight font-extrabold text-white md:text-4xl">
                  Submit an{" "}
                  <em className="text-[#7EC8E3] italic not-italic">
                    Education
                  </em>
                  <br />
                  Enquiry
                </h2>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/60">
                  Our counsellors will guide you every step of the way — from
                  shortlisting to departure.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  {[
                    {
                      icon: "🎓",
                      title: "University Shortlisting",
                      sub: "Personalised list based on your profile",
                    },
                    {
                      icon: "📝",
                      title: "SOP & Application Help",
                      sub: "Expert writing and review support",
                    },
                    {
                      icon: "🛂",
                      title: "Student Visa Assistance",
                      sub: "Documentation and interview preparation",
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
                  <FormField label="Student Name">
                    <input
                      name="studentName"
                      value={form.studentName}
                      onChange={handleChange}
                      type="text"
                      placeholder="Full name"
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
                <FormField label="Preferred Country" className="mb-4">
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="">Select country</option>
                    {[
                      "UK",
                      "Australia",
                      "Canada",
                      "Germany",
                      "Singapore",
                      "New Zealand",
                      "Other",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Course / Field of Study" className="mb-4">
                  <input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. MBA, Computer Science, Medicine"
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Message" className="mb-4">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Academic background and goals…"
                    className={inputCls + " resize-y"}
                  />
                </FormField>
                <button
                  type="submit"
                  className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#1B2B6B] to-[#1565C0] py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  Submit Education Enquiry →
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
