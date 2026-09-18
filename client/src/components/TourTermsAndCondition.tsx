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

export const TourTermsAndConditions: React.FC = () => {
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
            TERMS &amp; CONDITIONS
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
            These Terms &amp; Conditions apply to all tour packages, bookings and travel-related services arranged through UV Holidays.
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
          <strong>UV Holidays</strong> is a tourism brand of <strong>Udayam International</strong>. These Terms &amp; Conditions apply to all tour packages, bookings and travel-related services arranged through UV Holidays.
        </p>

        <h2 style={{ ...sectionTitleStyle, marginTop: 10 }}>1. Booking &amp; Confirmation</h2>
        <p style={paragraphStyle}>
          All bookings are subject to availability and confirmation. A quotation, itinerary or provisional reservation does not constitute a confirmed booking until the required payment has been received and the booking has been confirmed by UV Holidays. The confirmed services will be as specified in the applicable quotation, itinerary, invoice or booking confirmation.
        </p>

        <h2 style={sectionTitleStyle}>2. Tour Price &amp; Inclusions</h2>
        <p style={paragraphStyle}>
          The tour price and inclusions will be as specified in the applicable quotation or booking confirmation. Any service, activity or expense not specifically included in the confirmed package will be payable separately by the customer. Prices are subject to availability and may change before booking confirmation due to changes in supplier rates, taxes, government charges, exchange rates or other applicable costs.
        </p>

        <h2 style={sectionTitleStyle}>3. Customer Responsibilities</h2>
        <p style={paragraphStyle}>The customer is responsible for:</p>
        <ul style={listStyle}>
          <li>Providing accurate and complete information;</li>
          <li>Providing correct passenger and travel-document details;</li>
          <li>Maintaining valid passports and required travel documents;</li>
          <li>Obtaining required visas, permits and travel authorisations;</li>
          <li>Making payments within the specified timelines;</li>
          <li>Complying with applicable laws and regulations; and</li>
          <li>Following the rules and conditions of airlines, hotels and other service providers.</li>
        </ul>
        <p style={paragraphStyle}>
          UV Holidays shall not be responsible for consequences arising from incorrect or incomplete information provided by the customer.
        </p>

        <h2 style={sectionTitleStyle}>4. Changes to Bookings</h2>
        <p style={paragraphStyle}>
          Requests to change travel dates, passenger details, hotels, transportation, activities or other confirmed services are subject to availability. Changes may be subject to additional charges, amendment fees and supplier-specific conditions. Any additional cost arising from a customer-requested change shall be payable by the customer.
        </p>

        <h2 style={sectionTitleStyle}>5. Flights &amp; Airline Services</h2>
        <p style={paragraphStyle}>
          Flight schedules, routes, baggage allowances, delays, cancellations and rescheduling are subject to the applicable airline's terms and conditions. UV Holidays does not control airline schedules or operational decisions. Where an airline changes, delays or cancels a flight, UV Holidays will make reasonable efforts to assist the customer with the relevant airline or service provider. Any rebooking, credit or refund will be subject to the applicable airline and supplier terms.
        </p>

        <h2 style={sectionTitleStyle}>6. Hotels &amp; Accommodation</h2>
        <p style={paragraphStyle}>
          Hotel accommodation is subject to availability and the terms and conditions of the relevant accommodation provider. Check-in and check-out times are determined by the respective hotel. Special requests, including room preferences, adjoining rooms, early check-in or late checkout, are subject to availability unless specifically confirmed in writing.
        </p>

        <h2 style={sectionTitleStyle}>7. Visa &amp; Travel Documents</h2>
        <p style={paragraphStyle}>
          Customers are responsible for obtaining and maintaining valid passports, visas, permits and other required travel documents. Where UV Holidays provides visa assistance, such assistance will be limited to the services specifically agreed with the customer. Visa approval is solely at the discretion of the relevant embassy, consulate or government authority. UV Holidays does not guarantee visa approval. Visa fees and applicable processing charges may be non-refundable.
        </p>

        <h2 style={sectionTitleStyle}>8. Special Packages &amp; Promotional Offers</h2>
        <p style={paragraphStyle}>
          Special packages, discounts and promotional offers may be subject to specific terms communicated at the time of booking. Unless otherwise stated, promotional offers cannot be combined with other discounts or offers. Special or promotional packages may have conditions that differ from standard packages, which will be communicated to the customer before booking.
        </p>

        <h2 style={sectionTitleStyle}>9. No-Show</h2>
        <p style={paragraphStyle}>
          If a customer fails to report for a scheduled flight, hotel check-in, transfer, tour activity or other confirmed service without prior notice, the booking may be treated as a No-Show. No-show bookings may be subject to the applicable supplier terms and charges.
        </p>
        <p style={paragraphStyle}>
          Failure to use one component of a travel itinerary does not automatically entitle the customer to a refund for that unused component or other components of the booking.
        </p>

        <h2 style={sectionTitleStyle}>10. Travel Insurance</h2>
        <p style={paragraphStyle}>
          Customers are strongly advised to obtain appropriate travel insurance covering, where relevant, medical expenses, trip cancellation, trip interruption, baggage loss or delay, travel delays and other travel-related risks. Customers are responsible for reviewing the coverage, exclusions and conditions of their insurance policy.
        </p>

        <h2 style={sectionTitleStyle}>11. Supplier-Specific Non-Refundable Charges</h2>
        <p style={paragraphStyle}>
          Tour packages may include services provided by airlines, hotels, visa providers, transport operators, activity providers and other third-party suppliers. Such suppliers may impose their own cancellation, amendment and non-refundable charges. Where actual non-refundable charges imposed by such suppliers exceed the standard cancellation charges stated in the Cancellation &amp; Refund Policy, the actual non-refundable amount may be deducted from the customer's refund, subject to the applicable booking terms and applicable law. Where applicable, such charges will be communicated to the customer in accordance with the relevant supplier terms and conditions.
        </p>

        <h2 style={sectionTitleStyle}>12. Third-Party Service Providers</h2>
        <p style={paragraphStyle}>
          Certain travel services may be provided by independent third-party suppliers, including airlines, hotels, transport operators, visa providers and activity providers. Such services are subject to the terms and conditions of the respective service providers. UV Holidays will make reasonable efforts to coordinate these services but does not control the independent operations, schedules or policies of third-party suppliers.
        </p>

        <h2 style={sectionTitleStyle}>13. Force Majeure</h2>
        <p style={paragraphStyle}>
          UV Holidays shall not be responsible for failure, delay or alteration of travel services caused by circumstances beyond its reasonable control, including natural disasters, severe weather, war, civil unrest, strikes, government restrictions, public-health emergencies, airline disruptions, airport closures or similar circumstances. In such circumstances, UV Holidays will make reasonable efforts to assist customers with available alternatives, rescheduling or other options, subject to supplier terms and applicable law.
        </p>

        <h2 style={sectionTitleStyle}>14. Payment &amp; Legal Entity</h2>
        <p style={paragraphStyle}>
          UV Holidays is a tourism brand of Udayam International. Bookings and payments made through UV Holidays are processed by Udayam International. Accordingly, invoices, receipts, payment confirmations and other transaction records may be issued or displayed in the name of Udayam International.
        </p>
        <p style={paragraphStyle}>
          Payment terms and schedules are governed by the separate Payment Schedule for Tour Booking.
        </p>

        <h2 style={sectionTitleStyle}>15. Privacy</h2>
        <p style={paragraphStyle}>
          The collection, use, storage and protection of personal information are governed by the separate UV Holidays Privacy Policy.
        </p>

        <h2 style={sectionTitleStyle}>16. Customer Support &amp; Complaints</h2>
        <p style={paragraphStyle}>
          Customers may contact UV Holidays through the official contact details published on the website for booking assistance, amendments, payment-related queries, complaints or other travel-related matters.
        </p>

        <h2 style={sectionTitleStyle}>17. Governing Law &amp; Jurisdiction</h2>
        <p style={paragraphStyle}>
          These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with these Terms &amp; Conditions, bookings or services provided through UV Holidays shall be subject to the jurisdiction of the competent courts having jurisdiction over the relevant place of business of Udayam International in Kanyakumari District, Tamil Nadu, subject to applicable law.
        </p>

        <h2 style={sectionTitleStyle}>18. Amendments to Terms &amp; Conditions</h2>
        <p style={paragraphStyle}>
          UV Holidays may update these Terms &amp; Conditions from time to time to reflect changes in its services, business practices or applicable legal requirements. The updated version will be published on the Udayam International website. Changes will not retrospectively alter the agreed terms of a confirmed booking, except where required by applicable law or agreed with the customer.
        </p>

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
            href="/privacy-policy"
            style={{
              color: "#1B2B6B",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            View Privacy Policy →
          </a>
        </div>
      </div>
    </div>
  )
}

export default TourTermsAndConditions
