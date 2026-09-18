import React from "react"
import { useNavigate } from "react-router-dom"

const f = "'Inter', sans-serif"

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "'Libre Baskerville', serif",
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#1B2B6B",
  marginTop: 28,
  marginBottom: 10,
}

const paragraphStyle: React.CSSProperties = {
  fontFamily: f,
  fontSize: ".92rem",
  lineHeight: 1.75,
  color: "#374151",
  marginBottom: 12,
}

const listStyle: React.CSSProperties = {
  fontFamily: f,
  fontSize: ".92rem",
  lineHeight: 1.75,
  color: "#374151",
  paddingLeft: "1.4rem",
  marginBottom: 12,
}

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8F4",
        padding: "0 0 60px",
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 100%)",
          color: "#fff",
          padding: "48px 24px 60px",
        }}
      >
        <div style={{ maxWidth: 840, margin: "0 auto", position: "relative" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: 20,
              padding: "6px 16px",
              fontFamily: f,
              fontSize: ".8rem",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            ← Back to Home
          </button>
          <div
            style={{
              fontFamily: f,
              fontSize: ".75rem",
              color: "#4ADE80",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".1em",
              marginBottom: 8,
            }}
          >
            UV Holidays — Tourism Division of Udayam International
          </div>
          <h1
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "2rem",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            PRIVACY POLICY
          </h1>
          <p
            style={{
              fontFamily: f,
              fontSize: ".88rem",
              color: "rgba(255,255,255,0.8)",
              marginTop: 10,
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            How UV Holidays collects, uses, and protects your personal information.
          </p>
        </div>
      </div>

      {/* Content Card */}
      <div
        style={{
          maxWidth: 840,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 12px 40px rgba(15,26,66,0.08)",
          padding: "40px 44px",
          marginTop: -32,
        }}
      >
        <p style={{ ...paragraphStyle, fontSize: ".96rem", color: "#1B2B6B", fontWeight: 500, marginBottom: 20 }}>
          <strong>UV Holidays</strong>, a tourism brand of <strong>Udayam International</strong>, respects your privacy and is committed to protecting your personal information.
        </p>

        <h2 style={{ ...sectionTitleStyle, marginTop: 10 }}>1. Information We Collect</h2>
        <p style={paragraphStyle}>We may collect information necessary to provide our services, including:</p>
        <ul style={listStyle}>
          <li>Name and contact details</li>
          <li>Travel and booking information</li>
          <li>Passport, visa and travel-document details, where required</li>
          <li>Billing and transaction-related information</li>
          <li>Information provided through enquiries and communications</li>
        </ul>

        <h2 style={sectionTitleStyle}>2. How We Use Your Information</h2>
        <p style={paragraphStyle}>We use personal information to:</p>
        <ul style={listStyle}>
          <li>Process and manage bookings;</li>
          <li>Arrange travel services;</li>
          <li>Process payments, invoices and receipts;</li>
          <li>Communicate booking and travel-related information;</li>
          <li>Handle amendments, cancellations and refunds;</li>
          <li>Provide customer support; and</li>
          <li>Comply with applicable legal requirements.</li>
        </ul>

        <h2 style={sectionTitleStyle}>3. Sharing of Information</h2>
        <p style={paragraphStyle}>
          Where necessary to provide the requested services, relevant information may be shared with airlines, hotels, transport operators, visa providers, activity providers, payment gateways and other authorised service providers. Information may also be disclosed to government or regulatory authorities where required by law.
        </p>

        <h2 style={sectionTitleStyle}>4. Payment Information</h2>
        <p style={paragraphStyle}>
          Online payments are processed through third-party payment gateways or payment service providers. UV Holidays does not intend to store customers' complete debit-card, credit-card, CVV or online-banking credentials on its own systems. We may retain transaction details such as payment status, transaction reference, amount and date for booking and accounting purposes.
        </p>

        <h2 style={sectionTitleStyle}>5. Data Security &amp; Retention</h2>
        <p style={paragraphStyle}>
          We take reasonable measures to protect personal information from unauthorised access, misuse, loss or disclosure. Personal information will be retained only for as long as reasonably necessary to provide services, maintain required records and comply with applicable legal obligations.
        </p>

        <h2 style={sectionTitleStyle}>6. Cookies</h2>
        <p style={paragraphStyle}>
          Our website may use cookies and similar technologies to provide essential functionality, analyse website usage and improve user experience.
        </p>

        <h2 style={sectionTitleStyle}>7. Third-Party Websites</h2>
        <p style={paragraphStyle}>
          Our website may contain links to third-party websites or services. UV Holidays is not responsible for the privacy practices or security of such third parties.
        </p>

        <h2 style={sectionTitleStyle}>8. Privacy Requests</h2>
        <p style={paragraphStyle}>
          Subject to applicable law, customers may contact us to request access to or correction of their personal information or to raise privacy-related concerns.
        </p>

        <h2 style={sectionTitleStyle}>9. Changes to this Policy</h2>
        <p style={paragraphStyle}>
          UV Holidays may update this Privacy Policy from time to time. Any updated version will be published on our website.
        </p>

        <h2 style={sectionTitleStyle}>10. Contact Us</h2>
        <p style={paragraphStyle}>
          For any questions, concerns or requests regarding this Privacy Policy or the handling of personal information, please contact:
        </p>
        <div
          style={{
            background: "#FAF8F4",
            border: "1px solid #E8E4DC",
            borderRadius: 14,
            padding: "20px 24px",
            marginTop: 12,
            fontFamily: f,
            fontSize: ".9rem",
            color: "#1B2B6B",
            lineHeight: 1.8,
          }}
        >
          <strong>UV Holidays - Tourism Division of Udayam International</strong>
          <br />
          Email: <a href="mailto:info@udayaminternational.com" style={{ color: "#2563EB", textDecoration: "underline" }}>info@udayaminternational.com</a>
          <br />
          Phone: 04651 – 225 236 ; 72 99 77 11 11
        </div>

        <div
          style={{
            marginTop: 36,
            paddingTop: 20,
            borderTop: "1px solid #E8E4DC",
            fontFamily: f,
            fontSize: ".82rem",
            color: "#6B7280",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span>© 2026 UV Holidays — Udayam International. All rights reserved.</span>
          <a
            href="/tour-terms-and-conditions"
            style={{
              color: "#1B2B6B",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            View Terms &amp; Conditions →
          </a>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
