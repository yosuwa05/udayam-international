import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { _axios } from "@/lib/axios"
import { useAuth } from "@/lib/useAuth"
import { toast } from "sonner"

export type ApiPackage = {
  _id: string
  title: string
  destination: string
  days: number
  nights: number
  price: number
  bookingType: "STANDARD" | "CUSTOMIZED"
  minPax: number
  maxPax: number
  isActive: boolean
}

interface TourismBookingModalProps {
  isOpen: boolean
  pkg: ApiPackage | null
  onClose: () => void
  onSuccess?: (booking: any) => void
}

declare global {
  interface Window {
    Razorpay?: any
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const TourismBookingModal: React.FC<TourismBookingModalProps> = ({
  isOpen,
  pkg,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth()
  const [step, setStep] = useState<"FORM" | "SUCCESS">("FORM")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successBooking, setSuccessBooking] = useState<any>(null)

  // Traveller Form state
  const [fullName, setFullName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [email, setEmail] = useState("")
  const [numberOfPersons, setNumberOfPersons] = useState(1)
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  })
  const [travelType, setTravelType] = useState("FAMILY")
  const [specialRequests, setSpecialRequests] = useState("")
  const [travellers, setTravellers] = useState<
    { name: string; age: number; gender: "MALE" | "FEMALE" | "OTHER" }[]
  >([{ name: "", age: 25, gender: "MALE" }])

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Lock background page scroll when modal is open
  useEffect(() => {
    if (isOpen && pkg) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, pkg])

  // Populate user defaults
  useEffect(() => {
    if (isOpen && pkg && user) {
      if (user.fullName) setFullName(user.fullName)
      if (user.mobile) setMobileNumber(user.mobile)
      if (user.email) setEmail(user.email)
      setTravellers([{ name: user.fullName || "", age: 30, gender: "MALE" }])
      setStep("FORM")
      setAppliedCoupon(null)
      setCouponCodeInput("")
      setCouponError(null)
      setSuccessBooking(null)
    }
  }, [isOpen, pkg, user])

  // Sync travellers array size with numberOfPersons
  useEffect(() => {
    setTravellers((prev) => {
      const count = Math.max(1, numberOfPersons)
      if (prev.length === count) return prev
      if (prev.length < count) {
        const added = Array.from({ length: count - prev.length }).map(() => ({
          name: "",
          age: 25,
          gender: "MALE" as const,
        }))
        return [...prev, ...added]
      } else {
        return prev.slice(0, count)
      }
    })
  }, [numberOfPersons])

  // Query eligible coupons
  const { data: eligibleCoupons = [] } = useQuery({
    queryKey: ["eligible-coupons", pkg?._id],
    queryFn: async () => {
      if (!pkg || pkg.bookingType === "CUSTOMIZED") return []
      const res = await _axios.get(`/booking/coupon/eligible/${pkg._id}`)
      return res.data?.data || []
    },
    enabled: !!isOpen && !!pkg && pkg?.bookingType !== "CUSTOMIZED",
  })

  if (!isOpen || !pkg) return null

  const basePrice = pkg.price || 0
  const subtotal = basePrice * numberOfPersons
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0
  const finalPayable = Math.max(0, subtotal - discountAmount)

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim()
    if (!code) {
      setCouponError("Please enter a coupon code")
      return
    }
    setValidatingCoupon(true)
    setCouponError(null)
    try {
      const res = await _axios.post("/booking/coupon/validate", {
        couponCode: code,
        packageId: pkg._id,
        bookingAmount: subtotal,
      })
      if (res.data?.status && res.data?.data) {
        setAppliedCoupon(res.data.data)
        setCouponCodeInput(res.data.data.couponCode)
        toast.success(
          `Coupon "${res.data.data.couponCode}" applied! You saved ₹${res.data.data.discountAmount.toLocaleString("en-IN")}`
        )
      } else {
        setCouponError(res.data?.error || "Failed to validate coupon")
      }
    } catch (err: any) {
      setCouponError(err?.response?.data?.error || "Invalid coupon code")
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCodeInput("")
    setCouponError(null)
  }

  const handleAddTraveller = () => {
    setNumberOfPersons((p) => p + 1)
  }

  const handleRemoveTraveller = (idx: number) => {
    if (numberOfPersons <= 1) return
    setNumberOfPersons((p) => p - 1)
  }

  const handleTravellerChange = (idx: number, field: string, val: any) => {
    setTravellers((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: val }
      return next
    })
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !mobileNumber.trim() || !email.trim() || !travelDate) {
      toast.error("Please fill in all required contact details")
      return
    }

    setIsSubmitting(true)
    try {
      const travellerInfo = {
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        numberOfPersons,
        travelDate,
        travelType,
        specialRequests: specialRequests.trim(),
        travellers,
      }

      if (pkg.bookingType === "CUSTOMIZED") {
        const res = await _axios.post("/booking/customized/enquire", {
          packageId: pkg._id,
          travellerInfo,
        })
        if (res.data?.status && res.data?.data) {
          setSuccessBooking(res.data.data)
          setStep("SUCCESS")
          toast.success("Enquiry submitted successfully!")
          if (onSuccess) onSuccess(res.data.data)
        } else {
          toast.error(res.data?.error || "Failed to submit enquiry")
        }
      } else {
        const orderRes = await _axios.post("/booking/standard/create-order", {
          packageId: pkg._id,
          travellerInfo,
          couponCode: appliedCoupon?.couponCode,
        })

        if (!orderRes.data?.status || !orderRes.data?.data) {
          toast.error(orderRes.data?.error || "Failed to initialize booking order")
          setIsSubmitting(false)
          return
        }

        const orderData = orderRes.data.data

        const loaded = await loadRazorpayScript()
        if (!loaded || !window.Razorpay) {
          toast.error("Razorpay SDK failed to load. Please check your network connection.")
          setIsSubmitting(false)
          return
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amountInPaise,
          currency: "INR",
          name: "Udayam Holidays",
          description: `Booking: ${pkg.title}`,
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await _axios.post("/booking/standard/verify-payment", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
              if (verifyRes.data?.status) {
                setSuccessBooking(verifyRes.data.data)
                setStep("SUCCESS")
                toast.success("Payment verified & Booking confirmed! 🎉")
                if (onSuccess) onSuccess(verifyRes.data.data)
              } else {
                toast.error(verifyRes.data?.error || "Payment verification failed")
              }
            } catch (err: any) {
              toast.error(err?.response?.data?.error || "Payment verification failed")
            } finally {
              setIsSubmitting(false)
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false)
              toast.info("Payment popup closed")
            },
          },
          prefill: {
            name: fullName,
            email: email,
            contact: mobileNumber,
          },
          theme: {
            color: "#1B2B6B",
          },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to process request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const f = "'Inter', sans-serif"

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 26, 66, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 32px 80px rgba(15,26,66,0.25)",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0F1B47 0%, #1B2B6B 100%)",
            color: "#fff",
            padding: "20px 24px",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              color: "#fff",
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>

          <div
            style={{
              fontFamily: f,
              fontSize: ".72rem",
              color: "#4ADE80",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".1em",
              marginBottom: 4,
            }}
          >
            {pkg.bookingType === "CUSTOMIZED"
              ? "✨ Customized Package Enquiry"
              : "⚡ Instant Online Booking"}
          </div>
          <h2
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {pkg.title}
          </h2>
          <div
            style={{
              fontFamily: f,
              fontSize: ".82rem",
              color: "rgba(255,255,255,0.75)",
              marginTop: 4,
            }}
          >
            📍 {pkg.destination} &nbsp;•&nbsp; 🗓 {pkg.days} Days / {pkg.nights} Nights
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          {step === "SUCCESS" ? (
            <div style={{ textAlign: "center", padding: "28px 12px" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "#E8F5E9",
                  color: "#2E7D32",
                  fontSize: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                  marginBottom: 8,
                }}
              >
                {pkg.bookingType === "CUSTOMIZED"
                  ? "Enquiry Received!"
                  : "Booking Confirmed!"}
              </h3>
              <p
                style={{
                  fontFamily: f,
                  fontSize: ".88rem",
                  color: "#5a5a7a",
                  marginBottom: 20,
                }}
              >
                {pkg.bookingType === "CUSTOMIZED"
                  ? "Thank you for reaching out! Our travel specialist will prepare a customized itinerary and quote for you within 24 hours."
                  : "Your travel booking is successfully placed upon verified payment! We've sent confirmation details to your registered email and phone."}
              </p>

              {successBooking && (
                <div
                  style={{
                    background: "#FAF8F4",
                    border: "1px solid #E8E4DC",
                    borderRadius: 16,
                    padding: "16px 20px",
                    textAlign: "left",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #E8E4DC",
                      paddingBottom: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontFamily: f, fontSize: ".78rem", color: "#9494b0" }}>
                      Booking Reference:
                    </span>
                    <strong style={{ fontFamily: f, fontSize: ".88rem", color: "#1B2B6B" }}>
                      {successBooking.bookingNumber}
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: f, fontSize: ".78rem", color: "#9494b0" }}>
                      Primary Traveller:
                    </span>
                    <span style={{ fontFamily: f, fontSize: ".82rem", fontWeight: 600, color: "#1a1a2e" }}>
                      {successBooking.travellerInfo?.fullName}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: f, fontSize: ".78rem", color: "#9494b0" }}>
                      Travel Date:
                    </span>
                    <span style={{ fontFamily: f, fontSize: ".82rem", fontWeight: 600, color: "#1a1a2e" }}>
                      {new Date(successBooking.travellerInfo?.travelDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: f, fontSize: ".78rem", color: "#9494b0" }}>
                      Total Persons:
                    </span>
                    <span style={{ fontFamily: f, fontSize: ".82rem", fontWeight: 600, color: "#1a1a2e" }}>
                      {successBooking.travellerInfo?.numberOfPersons} Pax
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                style={{
                  fontFamily: f,
                  fontSize: ".85rem",
                  fontWeight: 700,
                  background: "#1B2B6B",
                  color: "#fff",
                  border: "none",
                  padding: "10px 28px",
                  borderRadius: 999,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Customized Notice */}
              {pkg.bookingType === "CUSTOMIZED" && (
                <div
                  style={{
                    background: "rgba(217,119,6,0.08)",
                    border: "1px solid rgba(217,119,6,0.3)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 18 }}>📝</span>
                  <div style={{ fontFamily: f, fontSize: ".78rem", color: "#B45309" }}>
                    <strong>Customized Tour:</strong> Complete your details below. No upfront payment required—our advisors will share a custom quote.
                  </div>
                </div>
              )}

              {/* 1. Primary Contact Information */}
              <div>
                <div
                  style={{
                    fontFamily: f,
                    fontSize: ".72rem",
                    fontWeight: 700,
                    color: "#9494b0",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    marginBottom: 8,
                  }}
                >
                  1. Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label style={{ display: "block", fontFamily: f, fontSize: ".78rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E8E4DC", borderRadius: 10, fontFamily: f, fontSize: ".85rem", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: f, fontSize: ".78rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E8E4DC", borderRadius: 10, fontFamily: f, fontSize: ".85rem", outline: "none" }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label style={{ display: "block", fontFamily: f, fontSize: ".78rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E8E4DC", borderRadius: 10, fontFamily: f, fontSize: ".85rem", outline: "none" }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Trip Logistics */}
              <div>
                <div
                  style={{
                    fontFamily: f,
                    fontSize: ".72rem",
                    fontWeight: 700,
                    color: "#9494b0",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    marginBottom: 8,
                  }}
                >
                  2. Trip Logistics
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label style={{ display: "block", fontFamily: f, fontSize: ".78rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      No. of Persons *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={pkg.maxPax || 50}
                      value={numberOfPersons}
                      onChange={(e) => setNumberOfPersons(Math.max(1, parseInt(e.target.value || "1")))}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E8E4DC", borderRadius: 10, fontFamily: f, fontSize: ".85rem", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: f, fontSize: ".78rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E8E4DC", borderRadius: 10, fontFamily: f, fontSize: ".85rem", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: f, fontSize: ".78rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      Trip Style *
                    </label>
                    <select
                      value={travelType}
                      onChange={(e) => setTravelType(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E8E4DC", borderRadius: 10, fontFamily: f, fontSize: ".85rem", outline: "none", background: "#fff" }}
                    >
                      <option value="FAMILY">Family</option>
                      <option value="HONEYMOON">Honeymoon</option>
                      <option value="ADVENTURE">Adventure</option>
                      <option value="SOLO">Solo Travel</option>
                      <option value="GROUP">Group</option>
                      <option value="PILGRIMAGE">Pilgrimage</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Dynamic Travellers List */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontFamily: f, fontSize: ".72rem", fontWeight: 700, color: "#9494b0", textTransform: "uppercase", letterSpacing: ".08em" }}>
                    3. Traveller Details ({travellers.length} Pax)
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTraveller}
                    style={{ fontFamily: f, fontSize: ".75rem", fontWeight: 600, color: "#1B2B6B", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                  >
                    + Add Person
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 170, overflowY: "auto" }}>
                  {travellers.map((t, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
                      style={{ background: "#FAF8F4", padding: "8px 12px", borderRadius: 10, border: "1px solid #E8E4DC" }}
                    >
                      <input
                        type="text"
                        placeholder={`Person ${idx + 1} Name`}
                        value={t.name}
                        onChange={(e) => handleTravellerChange(idx, "name", e.target.value)}
                        style={{ padding: "6px 10px", border: "1px solid #E8E4DC", borderRadius: 6, fontFamily: f, fontSize: ".8rem", outline: "none" }}
                      />
                      <input
                        type="number"
                        min={1}
                        placeholder="Age"
                        value={t.age}
                        onChange={(e) => handleTravellerChange(idx, "age", parseInt(e.target.value || "0"))}
                        style={{ padding: "6px 10px", border: "1px solid #E8E4DC", borderRadius: 6, fontFamily: f, fontSize: ".8rem", outline: "none" }}
                      />
                      <select
                        value={t.gender}
                        onChange={(e) => handleTravellerChange(idx, "gender", e.target.value)}
                        style={{ padding: "6px 8px", border: "1px solid #E8E4DC", borderRadius: 6, fontFamily: f, fontSize: ".8rem", outline: "none", background: "#fff" }}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                      {travellers.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveTraveller(idx)}
                          style={{ background: "none", border: "none", color: "#E53E3E", cursor: "pointer", fontSize: 14, fontWeight: "bold" }}
                        >
                          × Remove
                        </button>
                      ) : (
                        <span />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label style={{ display: "block", fontFamily: f, fontSize: ".78rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Special Requests / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need veg food, airport pickup, wheelchair assistance..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E8E4DC", borderRadius: 10, fontFamily: f, fontSize: ".85rem", outline: "none" }}
                />
              </div>

              {/* 4. Coupons & Price Calculation (STANDARD Packages Only) */}
              {pkg.bookingType !== "CUSTOMIZED" && (
                <div style={{ background: "#F7F5F0", borderRadius: 16, padding: "14px 18px", border: "1px solid #E8E4DC", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontFamily: f, fontSize: ".72rem", fontWeight: 700, color: "#9494b0", textTransform: "uppercase", letterSpacing: ".08em" }}>
                    4. Coupons & Offers
                  </div>

                  {/* Eligible Coupons List */}
                  {eligibleCoupons.length > 0 && !appliedCoupon && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {eligibleCoupons.map((c: any) => (
                        <div
                          key={c._id}
                          onClick={() => handleApplyCoupon(c.couponCode)}
                          style={{ background: "#fff", border: "1px dashed #1B2B6B", borderRadius: 8, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <span style={{ fontSize: 12 }}>🏷️</span>
                          <span style={{ fontFamily: f, fontSize: ".75rem", fontWeight: 700, color: "#1B2B6B" }}>
                            {c.couponCode}
                          </span>
                          <span style={{ fontFamily: f, fontSize: ".7rem", color: "#2E7D32" }}>
                            ({c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual Coupon Form */}
                  {appliedCoupon ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#E8F5E9", border: "1px solid #A5D6A7", padding: "8px 12px", borderRadius: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>🎉</span>
                        <div>
                          <div style={{ fontFamily: f, fontSize: ".82rem", fontWeight: 700, color: "#2E7D32" }}>
                            Coupon Applied: {appliedCoupon.couponCode}
                          </div>
                          <div style={{ fontFamily: f, fontSize: ".72rem", color: "#1B5E20" }}>
                            You save ₹{appliedCoupon.discountAmount.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        style={{ fontFamily: f, fontSize: ".75rem", fontWeight: 600, color: "#E53E3E", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Enter coupon code..."
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #E8E4DC", borderRadius: 8, fontFamily: f, fontSize: ".82rem", outline: "none", textTransform: "uppercase" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={validatingCoupon || !couponCodeInput.trim()}
                        style={{ fontFamily: f, fontSize: ".8rem", fontWeight: 700, background: "#1B2B6B", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", opacity: validatingCoupon || !couponCodeInput.trim() ? 0.6 : 1 }}
                      >
                        {validatingCoupon ? "Validating…" : "Apply"}
                      </button>
                    </div>
                  )}

                  {couponError && <div style={{ fontFamily: f, fontSize: ".75rem", color: "#E53E3E" }}>{couponError}</div>}

                  {/* Price Summary */}
                  <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: f, fontSize: ".78rem", color: "#5a5a7a" }}>
                      <span>Base Price (₹{basePrice.toLocaleString("en-IN")} × {numberOfPersons}):</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: f, fontSize: ".78rem", color: "#2E7D32", fontWeight: 600 }}>
                        <span>Coupon Discount:</span>
                        <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: f, fontSize: "1rem", fontWeight: 700, color: "#1B2B6B", paddingTop: 4, borderTop: "1.5px solid #1B2B6B" }}>
                      <span>Total Payable:</span>
                      <span>₹{finalPayable.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{ fontFamily: f, fontSize: ".82rem", fontWeight: 600, background: "#fff", color: "#5a5a7a", border: "1.5px solid #E8E4DC", padding: "9px 20px", borderRadius: 999, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ fontFamily: f, fontSize: ".82rem", fontWeight: 700, background: "#1B2B6B", color: "#fff", border: "none", padding: "10px 28px", borderRadius: 999, cursor: "pointer", opacity: isSubmitting ? 0.6 : 1 }}
                >
                  {isSubmitting
                    ? "Processing…"
                    : pkg.bookingType === "CUSTOMIZED"
                      ? "Submit Enquiry →"
                      : `Pay ₹${finalPayable.toLocaleString("en-IN")} & Book →`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default TourismBookingModal
