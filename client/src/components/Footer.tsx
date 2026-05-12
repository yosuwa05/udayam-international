import { footerServices } from "@/lib/homeData"
import type { Page } from "@/lib/navData"
import { useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer
      style={{ background: "#0f1a42", paddingTop: 68, paddingBottom: 28 }}
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
                  ((e.currentTarget as HTMLImageElement).style.display = "none")
                }
              />
            </div>
            <p
              className="mb-5 max-w-[280px] text-[13px] leading-[1.75]"
              style={{ color: "rgba(255,255,255,0.42)" }}
            >
              Your trusted partner for travel, medical tourism, foreign
              education, trade, and global recruitment. Connecting lives across
              the world since 2010.
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
            © 2026 Udayam International. All rights reserved. | Trade · Travel ·
            Trust
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
  )
}

export default Footer
