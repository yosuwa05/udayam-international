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

const tableHeaderStyle: React.CSSProperties = {
  fontFamily: f,
  fontSize: ".85rem",
  fontWeight: 700,
  color: "#1B2B6B",
  background: "#F4F6FB",
  padding: "12px 16px",
  textAlign: "left",
  borderBottom: "2px solid #E2E8F0",
}

const tableCellStyle: React.CSSProperties = {
  fontFamily: f,
  fontSize: ".88rem",
  color: "#374151",
  padding: "12px 16px",
  borderBottom: "1px solid #E8E4DC",
}

export const CancellationRefundPolicy: React.FC = () => {
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
            CANCELLATION &amp; REFUND POLICY
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
            Applicable cancellation charges, procedures, and refund timelines for all tour bookings arranged through UV Holidays.
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
          <strong>UV Holidays</strong>, a tourism brand of <strong>Udayam International</strong>, follows the cancellation and refund terms outlined below for tour bookings. Applicable cancellation charges and refund conditions are specified below.
        </p>

        {/* Cancellation Policy */}
        <h2 style={{ ...sectionTitleStyle, marginTop: 10 }}>Cancellation Policy</h2>
        <p style={paragraphStyle}>
          Cancellation charges shall be determined with reference to the scheduled departure date.
        </p>

        {/* Schedule Table */}
        <div
          style={{
            overflowX: "auto",
            marginTop: 12,
            marginBottom: 24,
            border: "1px solid #E8E4DC",
            borderRadius: 12,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Period of Cancellation</th>
                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>Cancellation Charges</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCellStyle}>More than 45 days before departure</td>
                <td style={{ ...tableCellStyle, textAlign: "right", fontWeight: 600, color: "#1B2B6B" }}>
                  25% of the total tour cost
                </td>
              </tr>
              <tr style={{ background: "#FAFAF9" }}>
                <td style={tableCellStyle}>31–45 days before departure</td>
                <td style={{ ...tableCellStyle, textAlign: "right", fontWeight: 600, color: "#B45309" }}>
                  50% of the total tour cost
                </td>
              </tr>
              <tr>
                <td style={tableCellStyle}>30 days or less before departure</td>
                <td style={{ ...tableCellStyle, textAlign: "right", fontWeight: 700, color: "#DC2626" }}>
                  100% of the total tour cost
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cancellation Request */}
        <h2 style={sectionTitleStyle}>Cancellation Request</h2>
        <p style={paragraphStyle}>
          Cancellation requests must be submitted through the official communication channel specified by UV Holidays. The date and time on which the cancellation request is received by UV Holidays will be considered for determining the applicable cancellation charge.
        </p>

        {/* Cancellation Procedure */}
        <h2 style={sectionTitleStyle}>Cancellation Procedure</h2>
        <ul style={listStyle}>
          <li>Cancellation requests must be submitted through the official communication channel specified by UV Holidays.</li>
          <li>The cancellation request should include the relevant booking/reference number and the customer&apos;s name and contact details.</li>
          <li>Verbal or telephone requests alone will not constitute an effective cancellation unless acknowledged in writing by UV Holidays.</li>
          <li>The applicable cancellation charge will be determined based on the date and time the cancellation request is received.</li>
        </ul>

        {/* Refund Policy */}
        <h2 style={sectionTitleStyle}>Refund Policy</h2>
        <ul style={listStyle}>
          <li>Where a refund is applicable, the refundable amount will be calculated after deduction of the applicable cancellation charges and any applicable supplier-specific non-refundable charges.</li>
          <li>Approved refunds will normally be processed to the original payment method used for the booking.</li>
          <li>Refunds will normally be processed within <strong>7–14 working days</strong> from confirmation of the final refundable amount, subject to receipt of applicable refunds from suppliers and payment processors.</li>
          <li>The actual time taken for the refund to appear in the customer&apos;s account may vary depending on the customer&apos;s bank, payment gateway or other payment service provider.</li>
        </ul>

        {/* Note */}
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 12,
            padding: "16px 20px",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: f,
              fontSize: ".88rem",
              color: "#92400E",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong>Note:</strong> Supplier-specific non-refundable charges are governed by the relevant provisions in the UV Holidays Terms &amp; Conditions.
          </p>
        </div>

        {/* Contact Us */}
        <div
          style={{
            background: "#FAF8F4",
            border: "1px solid #E8E4DC",
            borderRadius: 14,
            padding: "20px 24px",
            marginTop: 20,
            fontFamily: f,
            fontSize: ".9rem",
            color: "#1B2B6B",
            lineHeight: 1.8,
          }}
        >
          <strong>UV Holidays — Tourism Division of Udayam International</strong>
          <br />
          Email:{" "}
          <a href="mailto:info@udayaminternational.com" style={{ color: "#2563EB", textDecoration: "underline" }}>
            info@udayaminternational.com
          </a>
          <br />
          Phone: 04651 – 225 236 ; 72 99 77 11 11
        </div>

        {/* Footer Navigation */}
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
          <div style={{ display: "flex", gap: 16 }}>
            <a
              href="/tour-terms-and-conditions"
              style={{
                color: "#1B2B6B",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Terms &amp; Conditions →
            </a>
            <a
              href="/privacy-policy"
              style={{
                color: "#1B2B6B",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Privacy Policy →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CancellationRefundPolicy

