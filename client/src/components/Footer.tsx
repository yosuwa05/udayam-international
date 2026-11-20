import { footerServices } from "@/lib/homeData"
import type { Page } from "@/lib/navData"
import { useNavigate } from "react-router-dom"
import { isTourismDomain } from "@/utils"
import TourismLogo from "../assets/UVHolidays.JPG.jpeg"

interface FooterProps {
  isTourism?: boolean
}

const Footer = ({ isTourism: isTourismProp }: FooterProps = {}) => {
  const navigate = useNavigate()
  const isTourism = isTourismProp ?? isTourismDomain()

  const displayServices = isTourism
    ? [{ label: "Tourism", page: "tourism" as Page }]
    : footerServices

  return (
    <footer
      id="contact-section"
      style={{
        background: "#0f1a42",
        paddingTop: 68,
        paddingBottom: 28,
        scrollMarginTop: 90,
      }}
    >
      <div id="contact-us" style={{ scrollMarginTop: 90 }} />
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
                src={isTourism ? TourismLogo : "/Logo.jpeg"}
                alt={isTourism ? "UV Holidays" : "Udayam International"}
                className="h-[52px] w-auto rounded-[4px] object-contain"
                style={{ filter: isTourism ? "none" : "brightness(1.05)" }}
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.display = "none")
                }
              />
            </div>
            <p
              className="mb-5 max-w-[280px] text-[13px] leading-[1.75]"
              style={{ color: "white" }}
            >
              {isTourism
                ? "UV Holidays is a growing tourism brand offering standard and customised holiday packages, thoughtfully planned tours and personalised travel solutions across domestic and international destinations."
                : "Your trusted partner for travel, medical tourism, foreign education, trade, and global recruitment. Connecting lives across the world since 2010."}
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

          {/* Services */}
          <div>
            <h4
              className="mb-4 text-[11px] font-bold tracking-[1.8px] uppercase"
              style={{ color: "white" }}
            >
              Services
            </h4>
            <ul className="flex list-none flex-col gap-[9px]">
              {displayServices.map((s) => (
                <li key={s.page}>
                  <button
                    onClick={() => {
                      navigate(s.page.startsWith("/") ? s.page : `/${s.page}`)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className="cursor-pointer border-none bg-transparent text-left text-[13px] transition-colors duration-200"
                    style={{ color: "white" }}
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
              style={{ color: "white" }}
            >
              Company
            </h4>
            <ul className="flex list-none flex-col gap-[9px]">
              {[
                { label: "Home", page: "home" as Page },
                { label: "About Us", page: "about" as Page },
                // {
                //   label: "Contact Us",
                //   page: "contact/#contact-section" as Page,
                // },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => {
                      navigate(l.page)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className="cursor-pointer border-none bg-transparent text-left text-[13px] transition-colors duration-200"
                    style={{ color: "white" }}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                {
                  label: "Terms & Conditions",
                  href: "/tour-terms-and-conditions",
                },
                {
                  label: "Cancellation & Refund Policy",
                  href: "/cancellation-and-refund-policy",
                },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[13px] transition-colors duration-200"
                    style={{ color: "white" }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4
              className="mb-4 text-[11px] font-bold tracking-[1.8px] uppercase"
              style={{ color: "white" }}
            >
              Contact Us
            </h4>
            <div
              className="font-inter text-[13px] leading-[2.1]"
              style={{ color: "white" }}
            >
              <address style={{ fontStyle: "normal", lineHeight: "1.8" }}>
                No. 6, 178/1, Kaniyaanvilai,
                <br />
                Palliyadi Post, Kanyakumari,
                <br />
                Tamil Nadu - 629169, India
              </address>
              <div> +91 72997 71111</div>
              <div> 04651 - 225 236</div>
              {isTourism && (
                <div>
                  <a
                    href="mailto:enquiry@uvholidays.net"
                    className="hover:underline"
                    style={{ color: "white" }}
                  >
                    enquiry@uvholidays.net
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-[22px] md:flex-row">
          <div
            className="text-center text-[12px] md:text-left"
            style={{ color: "white" }}
          >
            {isTourism ? (
              <>
                © 2026 Udayam International · UV Holidays. All rights reserved.
              </>
            ) : (
              <>
                © 2026 Udayam International. All rights reserved. | Trade ·
                Travel · Trust
              </>
            )}
          </div>
          <div className="flex items-center gap-[7px]">
            <span className="mr-1.5 text-[12px]" style={{ color: "white" }}>
              We Accept:
            </span>
            {["VISA", "MC", "UPI", "EMI"].map((p) => (
              <span
                key={p}
                className="rounded-[5px] px-[11px] py-[3px] text-[11px] font-bold tracking-[0.3px]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
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
