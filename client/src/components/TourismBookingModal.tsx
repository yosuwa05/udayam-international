import React, { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { _axios } from "@/lib/axios"
import { useAuth } from "@/lib/useAuth"
import { toast } from "sonner"
import { loadRazorpayScript } from "@/lib/razorpay"
import { useNavigate } from "react-router-dom"
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Receipt,
  Users,
} from "lucide-react"

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
  gstPercentage?: number
  inclusions?: string[]
  exclusions?: string[]
}

interface TourismBookingModalProps {
  isOpen: boolean
  pkg: ApiPackage | null
  onClose: () => void
  onSuccess?: (booking: any) => void
}

type TravellerRow = {
  name: string
  age: number | ""
  gender: "MALE" | "FEMALE" | "OTHER" | ""
}

const emptyTraveller = (): TravellerRow => ({ name: "", age: "", gender: "" })

export const TourismBookingModal: React.FC<TourismBookingModalProps> = ({
  isOpen,
  pkg,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()
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
  const [travelType, setTravelType] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [travellers, setTravellers] = useState<TravellerRow[]>([
    emptyTraveller(),
  ])
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Multi-Stage Payment Option state ("FULL" | "ADVANCE" | "CUSTOM")
  const [paymentChoice, setPaymentChoice] = useState<"FULL" | "ADVANCE" | "CUSTOM">("FULL")
  const [customPaymentInput, setCustomPaymentInput] = useState<string>("")
  const [showStageBreakdown, setShowStageBreakdown] = useState<boolean>(true)

  // Fetch Payment Plan Settings from backend
  const { data: planSettings } = useQuery({
    queryKey: ["payment-plan-settings"],
    queryFn: async () => {
      const res = await _axios.get("/payment-plan-settings")
      return res.data?.data
    },
    staleTime: 5 * 60 * 1000,
  })

  // Fetch trip types
  const { data: tripTypesData } = useQuery({
    queryKey: ["public-trip-types-list"],
    queryFn: async () => {
      const res = await _axios.get("/trip-types", {
        params: { isActive: "true" },
      })
      return res.data?.data || []
    },
  })

  const fallbackTripTypes = [
    { value: "FAMILY", label: "Family" },
    { value: "HONEYMOON", label: "Honeymoon" },
    { value: "ADVENTURE", label: "Adventure" },
    { value: "SOLO", label: "Solo Travel" },
    { value: "GROUP", label: "Group" },
    { value: "PILGRIMAGE", label: "Pilgrimage" },
  ]

  const availableTripTypes =
    tripTypesData && tripTypesData.length > 0
      ? tripTypesData.map((t: any) => ({
          value: (t.name || "").toUpperCase().replace(/\s+/g, "_"),
          label: t.name,
        }))
      : fallbackTripTypes

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
    if (isOpen && pkg) {
      if (user) {
        setFullName(user.fullName || "")
        setEmail(user.email || "")
      } else {
        setFullName("")
        setEmail("")
      }
      setMobileNumber("")
      setNumberOfPersons(1)
      setTravelType("")
      setSpecialRequests("")
      setTravellers([emptyTraveller()])
      setStep("FORM")
      setAppliedCoupon(null)
      setCouponCodeInput("")
      setCouponError(null)
      setSuccessBooking(null)
      setPaymentChoice("FULL")
      setCustomPaymentInput("")
      setShowStageBreakdown(true)
    }
  }, [isOpen, pkg, user])

  // Sync travellers array size with numberOfPersons
  useEffect(() => {
    setTravellers((prev) => {
      const count = Math.max(1, numberOfPersons)
      if (prev.length === count) return prev
      if (prev.length < count) {
        const added = Array.from({ length: count - prev.length }).map(() =>
          emptyTraveller()
        )
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

  // ── Pricing Calculations ──
  const basePrice = pkg?.price || 0
  const subtotal = basePrice * numberOfPersons
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0
  const amountAfterDiscount = Math.max(0, subtotal - discountAmount)
  const gstPercentage = pkg?.gstPercentage || 0
  const gstAmount = Math.round((amountAfterDiscount * gstPercentage) / 100)
  const finalPayable = amountAfterDiscount + gstAmount

  // Multi-stage calculations
  const minAdvancePercentage = planSettings?.minimumAdvancePercentage ?? 10
  const minAdvanceAmount = Math.max(1, Math.round((finalPayable * minAdvancePercentage) / 100))

  const stage2Config = planSettings?.stages?.find((s: any) => s.stage === 2)
  const stage2MinPercentage = stage2Config?.minimumPercentage ?? 40
  const stage2NominalMinAmount = Math.round((finalPayable * stage2MinPercentage) / 100)

  // Current amount to pay today
  const payableToday = useMemo(() => {
    if (!pkg || pkg.bookingType === "CUSTOMIZED") return 0
    if (paymentChoice === "FULL") return finalPayable
    if (paymentChoice === "ADVANCE") return minAdvanceAmount
    if (paymentChoice === "CUSTOM") {
      const num = Number(customPaymentInput)
      if (isNaN(num) || num <= 0) return minAdvanceAmount
      return Math.min(finalPayable, Math.max(1, Math.round(num)))
    }
    return finalPayable
  }, [pkg, paymentChoice, finalPayable, minAdvanceAmount, customPaymentInput])

  const remainingAfterToday = Math.max(0, finalPayable - payableToday)
  const isFullPayment = payableToday >= finalPayable

  if (!isOpen || !pkg) return null

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
      setCouponError(
        err?.response?.data?.error || "This coupon can't be applied. Please check the coupon conditions"
      )
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

    // --- Contact details validation ---
    if (!fullName.trim()) {
      toast.error("Please enter your full name")
      return
    }
    if (!mobileNumber.trim()) {
      toast.error("Please enter your mobile number")
      return
    }
    if (mobileNumber.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address")
      return
    }
    if (!travelDate) {
      toast.error("Please select a travel date")
      return
    }
    if (!travelType) {
      toast.error("Please select a trip style")
      return
    }

    // --- Traveller list validation ---
    for (let i = 0; i < travellers.length; i++) {
      const t = travellers[i]
      if (!t.name.trim()) {
        toast.error(`Please enter the name for Traveller ${i + 1}`)
        return
      }
      if (
        t.age === "" ||
        t.age === null ||
        isNaN(Number(t.age)) ||
        Number(t.age) <= 0
      ) {
        toast.error(`Please enter a valid age for Traveller ${i + 1}`)
        return
      }
      if (!t.gender) {
        toast.error(`Please select a gender for Traveller ${i + 1}`)
        return
      }
    }

    // --- Payment validation for Standard bookings ---
    if (pkg.bookingType === "STANDARD") {
      if (paymentChoice === "CUSTOM") {
        const rawNum = Number(customPaymentInput)
        if (isNaN(rawNum) || rawNum <= 0) {
          toast.error("Please enter a valid custom payment amount")
          return
        }
        if (rawNum < minAdvanceAmount) {
          toast.error(
            `Minimum advance payment required is ₹${minAdvanceAmount.toLocaleString("en-IN")} (${minAdvancePercentage}%)`
          )
          return
        }
        if (rawNum > finalPayable) {
          toast.error(
            `Payment amount cannot exceed the total payable amount of ₹${finalPayable.toLocaleString("en-IN")}`
          )
          return
        }
      }
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the Terms & Conditions before proceeding")
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
        travellers: travellers.map((t) => ({
          name: t.name.trim(),
          age: Number(t.age),
          gender: t.gender,
        })),
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
        // Standard booking with multi-stage payment amount support
        const orderRes = await _axios.post("/booking/standard/create-order", {
          packageId: pkg._id,
          travellerInfo,
          couponCode: appliedCoupon?.couponCode,
          paymentAmount: payableToday,
        })

        if (!orderRes.data?.status || !orderRes.data?.data) {
          toast.error(
            orderRes.data?.error || "Failed to initialize booking order"
          )
          setIsSubmitting(false)
          return
        }

        const orderData = orderRes.data.data

        const loaded = await loadRazorpayScript()
        if (!loaded || !window.Razorpay) {
          toast.error(
            "Razorpay SDK failed to load. Please check your network connection."
          )
          setIsSubmitting(false)
          return
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amountInPaise,
          currency: "INR",
          name: "UV Holidays",
          description: `Booking: ${pkg.title} (${isFullPayment ? "100% Full Payment" : `Stage 1 Advance: ₹${payableToday.toLocaleString("en-IN")}`})`,
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await _axios.post(
                "/booking/standard/verify-payment",
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }
              )
              if (verifyRes.data?.status) {
                setSuccessBooking(verifyRes.data.data)
                setStep("SUCCESS")
                toast.success(
                  isFullPayment
                    ? "Full payment verified & Booking confirmed! 🎉"
                    : "Stage 1 advance verified & Booking confirmed! 🎉"
                )
                if (onSuccess) onSuccess(verifyRes.data.data)
              } else {
                toast.error(
                  verifyRes.data?.error || "Payment verification failed"
                )
              }
            } catch (err: any) {
              toast.error(
                err?.response?.data?.error || "Payment verification failed"
              )
            } finally {
              setIsSubmitting(false)
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false)
            },
          },
          prefill: {
            name: fullName,
            email: email,
            contact: mobileNumber,
          },
          config: {
            display: {
              blocks: {
                banks: {
                  name: "Pay via UPI, Cards, or Net Banking",
                  instruments: [
                    { method: "upi" },
                    { method: "card" },
                    { method: "netbanking" },
                  ],
                },
              },
              sequence: ["block.banks"],
              preferences: {
                show_default_blocks: false,
              },
            },
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
          maxWidth: 720,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 32px 80px rgba(15,26,66,0.25)",
          overflow: "hidden",
          maxHeight: "92vh",
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
              : "⚡ Instant Online Booking with Flexible Stages"}
          </div>
          <h2
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              lineHeight: 1.25,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              whiteSpace: "normal",
              overflowWrap: "break-word",
              wordBreak: "break-word",
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
            📍 {pkg.destination} &nbsp;•&nbsp; 🗓 {pkg.days} Days / {pkg.nights}{" "}
            Nights
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          {step === "SUCCESS" ? (
            <div style={{ textAlign: "center", padding: "24px 12px" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#E8F5E9",
                  color: "#2E7D32",
                  fontSize: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 10px 25px rgba(46,125,50,0.18)",
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "1.45rem",
                  fontWeight: 700,
                  color: "#1B2B6B",
                  marginBottom: 8,
                }}
              >
                {pkg.bookingType === "CUSTOMIZED"
                  ? "Enquiry Received!"
                  : isFullPayment
                  ? "Booking Confirmed & Fully Paid!"
                  : "Booking Confirmed with Advance!"}
              </h3>
              <p
                style={{
                  fontFamily: f,
                  fontSize: ".88rem",
                  color: "#5a5a7a",
                  marginBottom: 20,
                  maxWidth: 540,
                  marginInline: "auto",
                  lineHeight: 1.5,
                }}
              >
                {pkg.bookingType === "CUSTOMIZED"
                  ? "Thank you for reaching out! Our travel specialist will prepare a customized itinerary and quote for you within 24 hours."
                  : isFullPayment
                  ? "Your tour booking is 100% confirmed with full payment. We have sent confirmation details to your registered email and phone."
                  : "Your tour booking is confirmed with your Stage 1 advance payment! You can pay your remaining balance in flexible installments anytime from your My Bookings dashboard."}
              </p>

              {successBooking && (
                <div
                  style={{
                    background: "#FAF8F4",
                    border: "1px solid #E8E4DC",
                    borderRadius: 18,
                    padding: "18px 22px",
                    textAlign: "left",
                    marginBottom: 22,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #E8E4DC",
                      paddingBottom: 10,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: ".78rem",
                        color: "#9494b0",
                      }}
                    >
                      Booking Reference:
                    </span>
                    <strong
                      style={{
                        fontFamily: f,
                        fontSize: ".92rem",
                        color: "#1B2B6B",
                        letterSpacing: ".04em",
                      }}
                    >
                      {successBooking.bookingNumber}
                    </strong>
                  </div>

                  {/* Payment Details in Success Banner */}
                  {pkg.bookingType !== "CUSTOMIZED" && (
                    <div
                      style={{
                        background: isFullPayment ? "#F0FDF4" : "#FFFBEB",
                        border: isFullPayment ? "1px solid #BBF7D0" : "1px solid #FDE68A",
                        borderRadius: 12,
                        padding: "12px 14px",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontFamily: f,
                          fontSize: ".82rem",
                          fontWeight: 600,
                          color: isFullPayment ? "#166534" : "#92400E",
                          marginBottom: 4,
                        }}
                      >
                        <span>Amount Paid Today:</span>
                        <span>₹{(payableToday || 0).toLocaleString("en-IN")}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontFamily: f,
                          fontSize: ".82rem",
                          fontWeight: 700,
                          color: isFullPayment ? "#15803D" : "#B45309",
                        }}
                      >
                        <span>Payment Status:</span>
                        <span>
                          {isFullPayment
                            ? "100% Fully Paid"
                            : `Partially Paid (₹${remainingAfterToday.toLocaleString("en-IN")} Balance Pending)`}
                        </span>
                      </div>
                      {!isFullPayment && (
                        <p
                          style={{
                            fontFamily: f,
                            fontSize: ".74rem",
                            color: "#78350F",
                            marginTop: 6,
                            marginBottom: 0,
                            lineHeight: 1.4,
                          }}
                        >
                          📌 Note: You can make subsequent payments for the remaining ₹{remainingAfterToday.toLocaleString("en-IN")} in up to 2 more installments from your "My Bookings" page.
                        </p>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: ".78rem",
                        color: "#9494b0",
                      }}
                    >
                      Primary Traveller:
                    </span>
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: ".82rem",
                        fontWeight: 600,
                        color: "#1a1a2e",
                      }}
                    >
                      {successBooking.travellerInfo?.fullName}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: ".78rem",
                        color: "#9494b0",
                      }}
                    >
                      Travel Date:
                    </span>
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: ".82rem",
                        fontWeight: 600,
                        color: "#1a1a2e",
                      }}
                    >
                      {new Date(
                        successBooking.travellerInfo?.travelDate
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: ".78rem",
                        color: "#9494b0",
                      }}
                    >
                      Total Persons:
                    </span>
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: ".82rem",
                        fontWeight: 600,
                        color: "#1a1a2e",
                      }}
                    >
                      {successBooking.travellerInfo?.numberOfPersons} Pax
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    navigate("/my-bookings")
                  }}
                  style={{
                    fontFamily: f,
                    fontSize: ".84rem",
                    fontWeight: 700,
                    background: "#E8ECFA",
                    color: "#1B2B6B",
                    border: "none",
                    padding: "10px 22px",
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  View in My Bookings →
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    fontFamily: f,
                    fontSize: ".84rem",
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
            </div>
          ) : (
            <form
              onSubmit={handleSubmitBooking}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
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
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".78rem",
                      color: "#B45309",
                    }}
                  >
                    <strong>Customized Tour:</strong> Complete your details
                    below. No upfront payment required—our advisors will share a
                    custom quote.
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: f,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1.5px solid #E8E4DC",
                        borderRadius: 10,
                        fontFamily: f,
                        fontSize: ".85rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: f,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={mobileNumber}
                      onChange={(e) =>
                        setMobileNumber(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1.5px solid #E8E4DC",
                        borderRadius: 10,
                        fontFamily: f,
                        fontSize: ".85rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      style={{
                        display: "block",
                        fontFamily: f,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1.5px solid #E8E4DC",
                        borderRadius: 10,
                        fontFamily: f,
                        fontSize: ".85rem",
                        outline: "none",
                      }}
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: f,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      No. of Persons *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={pkg.maxPax || 50}
                      value={numberOfPersons}
                      onChange={(e) =>
                        setNumberOfPersons(
                          Math.max(1, parseInt(e.target.value || "1"))
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1.5px solid #E8E4DC",
                        borderRadius: 10,
                        fontFamily: f,
                        fontSize: ".85rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: f,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1.5px solid #E8E4DC",
                        borderRadius: 10,
                        fontFamily: f,
                        fontSize: ".85rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: f,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Trip Style *
                    </label>
                    <select
                      value={travelType}
                      onChange={(e) => setTravelType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1.5px solid #E8E4DC",
                        borderRadius: 10,
                        fontFamily: f,
                        fontSize: ".85rem",
                        outline: "none",
                        background: "#fff",
                      }}
                    >
                      <option value="" disabled hidden>
                        Select Trip Style
                      </option>
                      {availableTripTypes.map((item: any) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Dynamic Travellers List */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".72rem",
                      fontWeight: 700,
                      color: "#9494b0",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                    }}
                  >
                    3. Traveller Details ({travellers.length})
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTraveller}
                    style={{
                      fontFamily: f,
                      fontSize: ".75rem",
                      fontWeight: 700,
                      color: "#1B2B6B",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    + Add Traveller
                  </button>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {travellers.map((traveller, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#FAF8F4",
                        border: "1px solid #E8E4DC",
                        borderRadius: 12,
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: f,
                            fontSize: ".75rem",
                            fontWeight: 700,
                            color: "#1B2B6B",
                          }}
                        >
                          Traveller {index + 1}
                          {index === 0 && " (Primary)"}
                        </span>
                        {travellers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTraveller(index)}
                            style={{
                              fontFamily: f,
                              fontSize: ".72rem",
                              color: "#E53E3E",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Full Name *"
                            value={traveller.name}
                            onChange={(e) =>
                              handleTravellerChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              padding: "7px 10px",
                              border: "1.5px solid #E8E4DC",
                              borderRadius: 8,
                              fontFamily: f,
                              fontSize: ".82rem",
                              outline: "none",
                              background: "#fff",
                            }}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            required
                            min={1}
                            max={120}
                            placeholder="Age *"
                            value={traveller.age}
                            onChange={(e) =>
                              handleTravellerChange(
                                index,
                                "age",
                                e.target.value === ""
                                  ? ""
                                  : parseInt(e.target.value)
                              )
                            }
                            style={{
                              width: "100%",
                              padding: "7px 10px",
                              border: "1.5px solid #E8E4DC",
                              borderRadius: 8,
                              fontFamily: f,
                              fontSize: ".82rem",
                              outline: "none",
                              background: "#fff",
                            }}
                          />
                        </div>
                        <div>
                          <select
                            required
                            value={traveller.gender}
                            onChange={(e) =>
                              handleTravellerChange(
                                index,
                                "gender",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              padding: "7px 10px",
                              border: "1.5px solid #E8E4DC",
                              borderRadius: 8,
                              fontFamily: f,
                              fontSize: ".82rem",
                              outline: "none",
                              background: "#fff",
                            }}
                          >
                            <option value="" disabled hidden>
                              Gender *
                            </option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Special Requests */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: f,
                    fontSize: ".78rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Special Requests / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Dietary preferences, accessibility needs, room configurations..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1.5px solid #E8E4DC",
                    borderRadius: 10,
                    fontFamily: f,
                    fontSize: ".85rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* 5. Coupon & Pricing Summary (Standard Only) */}
              {pkg.bookingType === "STANDARD" && (
                <div
                  style={{
                    background: "#FAF8F4",
                    border: "1px solid #E8E4DC",
                    borderRadius: 14,
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".75rem",
                      fontWeight: 700,
                      color: "#1B2B6B",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    Coupon &amp; Price Breakdown
                  </div>

                  {/* Coupon Input or Applied Banner */}
                  {appliedCoupon ? (
                    <div
                      style={{
                        background: "#E8F5E9",
                        border: "1px solid #C8E6C9",
                        borderRadius: 10,
                        padding: "8px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>🎉</span>
                        <div>
                          <div
                            style={{
                              fontFamily: f,
                              fontSize: ".82rem",
                              fontWeight: 700,
                              color: "#2E7D32",
                            }}
                          >
                            Code: {appliedCoupon.couponCode}
                          </div>
                          <div
                            style={{
                              fontFamily: f,
                              fontSize: ".72rem",
                              color: "#388E3C",
                            }}
                          >
                            Saved ₹{appliedCoupon.discountAmount.toLocaleString("en-IN")} on your booking
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        style={{
                          fontFamily: f,
                          fontSize: ".75rem",
                          fontWeight: 700,
                          color: "#E53E3E",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full items-center gap-1 md:gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code..."
                        value={couponCodeInput}
                        onChange={(e) =>
                          setCouponCodeInput(e.target.value.toUpperCase())
                        }
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1.5px solid #E8E4DC",
                          borderRadius: 8,
                          fontFamily: f,
                          fontSize: ".82rem",
                          outline: "none",
                          textTransform: "uppercase",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={validatingCoupon || !couponCodeInput.trim()}
                        style={{
                          fontFamily: f,
                          fontSize: ".8rem",
                          fontWeight: 700,
                          background: "#1B2B6B",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: 8,
                          cursor: "pointer",
                          opacity:
                            validatingCoupon || !couponCodeInput.trim()
                              ? 0.6
                              : 1,
                        }}
                      >
                        {validatingCoupon ? "Validating…" : "Apply"}
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <div
                      style={{
                        fontFamily: f,
                        fontSize: ".75rem",
                        color: "#E53E3E",
                      }}
                    >
                      {couponError}
                    </div>
                  )}

                  {/* Price Summary Breakdown */}
                  <div
                    style={{
                      borderTop: "1px solid #E8E4DC",
                      paddingTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: f,
                        fontSize: ".78rem",
                        color: "#5a5a7a",
                      }}
                    >
                      <span>
                        Base Price (₹{basePrice.toLocaleString("en-IN")} ×{" "}
                        {numberOfPersons}):
                      </span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontFamily: f,
                          fontSize: ".78rem",
                          color: "#2E7D32",
                          fontWeight: 600,
                        }}
                      >
                        <span>Coupon Discount:</span>
                        <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {gstAmount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontFamily: f,
                          fontSize: ".78rem",
                          color: "#5a5a7a",
                        }}
                      >
                        <span>GST ({gstPercentage}%):</span>
                        <span>+ ₹{gstAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: f,
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#1B2B6B",
                        paddingTop: 4,
                        borderTop: "1.5px solid #1B2B6B",
                      }}
                    >
                      <span>Total Package Cost:</span>
                      <span>₹{finalPayable.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Multi-Stage Payment Option Selector (Standard Only) */}
              {pkg.bookingType === "STANDARD" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1.5px solid #1B2B6B22",
                    borderRadius: 16,
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: "0 6px 20px rgba(27,43,107,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8ECFA] text-[#1B2B6B]">
                        <CreditCard size={16} />
                      </span>
                      <div>
                        <div
                          style={{
                            fontFamily: f,
                            fontSize: ".82rem",
                            fontWeight: 700,
                            color: "#1B2B6B",
                            textTransform: "uppercase",
                            letterSpacing: ".05em",
                          }}
                        >
                          Choose Payment Option
                        </div>
                        <div
                          style={{
                            fontFamily: f,
                            fontSize: ".74rem",
                            color: "#6B7280",
                          }}
                        >
                          Pay in full now or confirm with a flexible advance (min {minAdvancePercentage}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Choices Cards */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {/* Option 1: Full Payment */}
                    <div
                      onClick={() => setPaymentChoice("FULL")}
                      style={{
                        border: paymentChoice === "FULL" ? "2px solid #1B2B6B" : "1.5px solid #E8E4DC",
                        background: paymentChoice === "FULL" ? "#F4F6FB" : "#fff",
                        borderRadius: 12,
                        padding: "12px 14px",
                        cursor: "pointer",
                        transition: "all .2s ease",
                        position: "relative",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontFamily: f,
                            fontSize: ".72rem",
                            fontWeight: 700,
                            color: "#1B2B6B",
                          }}
                        >
                          Pay Full (100%)
                        </span>
                        <input
                          type="radio"
                          name="paymentChoice"
                          checked={paymentChoice === "FULL"}
                          onChange={() => setPaymentChoice("FULL")}
                          style={{ accentColor: "#1B2B6B", cursor: "pointer" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Libre Baskerville', serif",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "#1B2B6B",
                          marginTop: 6,
                        }}
                      >
                        ₹{finalPayable.toLocaleString("en-IN")}
                      </div>
                      <div
                        style={{
                          fontFamily: f,
                          fontSize: ".7rem",
                          color: "#166534",
                          marginTop: 4,
                          fontWeight: 600,
                        }}
                      >
                        ✓ 0% Pending Balance
                      </div>
                    </div>

                    {/* Option 2: Minimum Advance (10%) */}
                    <div
                      onClick={() => setPaymentChoice("ADVANCE")}
                      style={{
                        border: paymentChoice === "ADVANCE" ? "2px solid #1B2B6B" : "1.5px solid #E8E4DC",
                        background: paymentChoice === "ADVANCE" ? "#F4F6FB" : "#fff",
                        borderRadius: 12,
                        padding: "12px 14px",
                        cursor: "pointer",
                        transition: "all .2s ease",
                        position: "relative",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontFamily: f,
                            fontSize: ".72rem",
                            fontWeight: 700,
                            color: "#1B2B6B",
                          }}
                        >
                          Advance ({minAdvancePercentage}%)
                        </span>
                        <input
                          type="radio"
                          name="paymentChoice"
                          checked={paymentChoice === "ADVANCE"}
                          onChange={() => setPaymentChoice("ADVANCE")}
                          style={{ accentColor: "#1B2B6B", cursor: "pointer" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Libre Baskerville', serif",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "#1B2B6B",
                          marginTop: 6,
                        }}
                      >
                        ₹{minAdvanceAmount.toLocaleString("en-IN")}
                      </div>
                      <div
                        style={{
                          fontFamily: f,
                          fontSize: ".7rem",
                          color: "#B45309",
                          marginTop: 4,
                          fontWeight: 600,
                        }}
                      >
                        ⚡ Reserve seats now
                      </div>
                    </div>

                    {/* Option 3: Custom Advance */}
                    <div
                      onClick={() => setPaymentChoice("CUSTOM")}
                      style={{
                        border: paymentChoice === "CUSTOM" ? "2px solid #1B2B6B" : "1.5px solid #E8E4DC",
                        background: paymentChoice === "CUSTOM" ? "#F4F6FB" : "#fff",
                        borderRadius: 12,
                        padding: "12px 14px",
                        cursor: "pointer",
                        transition: "all .2s ease",
                        position: "relative",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontFamily: f,
                            fontSize: ".72rem",
                            fontWeight: 700,
                            color: "#1B2B6B",
                          }}
                        >
                          Custom Amount
                        </span>
                        <input
                          type="radio"
                          name="paymentChoice"
                          checked={paymentChoice === "CUSTOM"}
                          onChange={() => setPaymentChoice("CUSTOM")}
                          style={{ accentColor: "#1B2B6B", cursor: "pointer" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Libre Baskerville', serif",
                          fontSize: ".95rem",
                          fontWeight: 700,
                          color: "#1B2B6B",
                          marginTop: 6,
                        }}
                      >
                        Choose Amount
                      </div>
                      <div
                        style={{
                          fontFamily: f,
                          fontSize: ".7rem",
                          color: "#4B5563",
                          marginTop: 4,
                        }}
                      >
                        Min ₹{minAdvanceAmount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {/* Custom Input Field when selected */}
                  {paymentChoice === "CUSTOM" && (
                    <div
                      style={{
                        background: "#FAF8F4",
                        border: "1px dashed #1B2B6B44",
                        borderRadius: 12,
                        padding: "12px 14px",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          style={{
                            fontFamily: f,
                            fontSize: ".76rem",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          Enter Advance Payment (₹):
                        </label>
                        <span
                          style={{
                            fontFamily: f,
                            fontSize: ".72rem",
                            color: "#6B7280",
                          }}
                        >
                          Min: ₹{minAdvanceAmount.toLocaleString("en-IN")} • Max: ₹{finalPayable.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">
                            ₹
                          </span>
                          <input
                            type="number"
                            min={minAdvanceAmount}
                            max={finalPayable}
                            placeholder={`e.g. ${Math.round(finalPayable * 0.25)}`}
                            value={customPaymentInput}
                            onChange={(e) => setCustomPaymentInput(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px 12px 8px 24px",
                              border: "1.5px solid #E8E4DC",
                              borderRadius: 8,
                              fontFamily: f,
                              fontSize: ".85rem",
                              outline: "none",
                              background: "#fff",
                            }}
                          />
                        </div>

                        {/* Quick Preset Buttons */}
                        <div className="flex gap-1">
                          {[25, 50, 75].map((pct) => {
                            const val = Math.round((finalPayable * pct) / 100)
                            return (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => setCustomPaymentInput(String(val))}
                                style={{
                                  fontFamily: f,
                                  fontSize: ".72rem",
                                  fontWeight: 600,
                                  background: "#fff",
                                  border: "1px solid #E8E4DC",
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  color: "#1B2B6B",
                                }}
                              >
                                {pct}%
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {Number(customPaymentInput) > 0 && Number(customPaymentInput) < minAdvanceAmount && (
                        <p
                          style={{
                            fontFamily: f,
                            fontSize: ".72rem",
                            color: "#E53E3E",
                            marginTop: 4,
                            marginBottom: 0,
                          }}
                        >
                          ⚠️ Amount must be at least ₹{minAdvanceAmount.toLocaleString("en-IN")} ({minAdvancePercentage}% advance).
                        </p>
                      )}
                      {Number(customPaymentInput) > finalPayable && (
                        <p
                          style={{
                            fontFamily: f,
                            fontSize: ".72rem",
                            color: "#E53E3E",
                            marginTop: 4,
                            marginBottom: 0,
                          }}
                        >
                          ⚠️ Amount cannot exceed total package cost ₹{finalPayable.toLocaleString("en-IN")}.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Stage Plan Breakdown Timeline */}
                  {!isFullPayment && (
                    <div
                      style={{
                        background: "#F7F5F0",
                        border: "1px solid #E8E4DC",
                        borderRadius: 12,
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        onClick={() => setShowStageBreakdown(!showStageBreakdown)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Layers size={14} className="text-[#1B2B6B]" />
                          <span
                            style={{
                              fontFamily: f,
                              fontSize: ".76rem",
                              fontWeight: 700,
                              color: "#1B2B6B",
                            }}
                          >
                            Flexible 3-Stage Payment Schedule
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: f,
                            fontSize: ".7rem",
                            color: "#6B7280",
                            textDecoration: "underline",
                          }}
                        >
                          {showStageBreakdown ? "Hide Details" : "View Breakdown"}
                        </span>
                      </div>

                      {showStageBreakdown && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            marginTop: 10,
                            paddingTop: 10,
                            borderTop: "1px dashed #E2E8F0",
                          }}
                        >
                          {/* Stage 1: Payable Today */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1B2B6B] text-[10px] font-bold text-white">
                                1
                              </span>
                              <span style={{ fontFamily: f, fontWeight: 600, color: "#1B2B6B" }}>
                                Stage 1: Booking Advance (Today)
                              </span>
                            </div>
                            <span style={{ fontFamily: f, fontWeight: 700, color: "#1B2B6B" }}>
                              ₹{payableToday.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {/* Stage 2: Second Payment */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                                2
                              </span>
                              <span style={{ fontFamily: f, color: "#4B5563" }}>
                                Stage 2: Second Payment (Min {stage2MinPercentage}%)
                              </span>
                            </div>
                            <span style={{ fontFamily: f, fontWeight: 600, color: "#4B5563" }}>
                              ~ ₹{Math.min(stage2NominalMinAmount, remainingAfterToday).toLocaleString("en-IN")}
                            </span>
                          </div>

                          {/* Stage 3: Final Settlement */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                                3
                              </span>
                              <span style={{ fontFamily: f, color: "#4B5563" }}>
                                Stage 3: Final Payment
                              </span>
                            </div>
                            <span style={{ fontFamily: f, fontWeight: 600, color: "#4B5563" }}>
                              Remaining Balance
                            </span>
                          </div>

                          <div
                            style={{
                              fontFamily: f,
                              fontSize: ".7rem",
                              color: "#6B7280",
                              background: "#fff",
                              borderRadius: 6,
                              padding: "6px 8px",
                              marginTop: 4,
                            }}
                          >
                            💡 Standard stages are minimums. You can pay more or clear your remaining balance (₹{remainingAfterToday.toLocaleString("en-IN")}) at any time from your My Bookings dashboard.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary of What Will Be Charged Now */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#F4F6FB",
                      borderRadius: 10,
                      padding: "8px 12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "#1B2B6B",
                      }}
                    >
                      Payable Now at Checkout:
                    </span>
                    <span
                      style={{
                        fontFamily: f,
                        fontSize: "1.05rem",
                        fontWeight: 800,
                        color: "#1B2B6B",
                      }}
                    >
                      ₹{payableToday.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}

              {/* Legal Notice */}
              <div
                style={{
                  background: "#F7F5F0",
                  border: "1px solid #E8E4DC",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: f,
                      fontSize: ".75rem",
                      fontWeight: 700,
                      color: "#1B2B6B",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      marginBottom: 4,
                    }}
                  >
                    Payment &amp; Legal Entity Notice
                  </div>
                  <p
                    style={{
                      fontFamily: f,
                      fontSize: ".78rem",
                      color: "#4B5563",
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    UV Holidays is a tourism brand of Udayam International.
                    Payments for bookings made through UV Holidays are processed
                    by Udayam International, and invoices, receipts and payment
                    records may be issued or displayed in the name of Udayam
                    International.
                  </p>
                </div>

                {/* Terms Checkbox */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    paddingTop: 10,
                    borderTop: "1px dashed #E2E8F0",
                  }}
                >
                  <input
                    type="checkbox"
                    id="agree-terms-checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{
                      marginTop: 3,
                      width: 16,
                      height: 16,
                      accentColor: "#1B2B6B",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />
                  <label
                    htmlFor="agree-terms-checkbox"
                    style={{
                      fontFamily: f,
                      fontSize: ".8rem",
                      color: "#374151",
                      lineHeight: 1.5,
                      cursor: "pointer",
                    }}
                  >
                    I understand and agree to the above and have read and
                    accepted the UV Holidays{" "}
                    <a
                      href="/tour-terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: "#1B2B6B",
                        fontWeight: 700,
                        textDecoration: "underline",
                      }}
                    >
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: "#1B2B6B",
                        fontWeight: 700,
                        textDecoration: "underline",
                      }}
                    >
                      Privacy Policy
                    </a>
                    . *
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  paddingTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{
                    fontFamily: f,
                    fontSize: ".82rem",
                    fontWeight: 600,
                    background: "#fff",
                    color: "#5a5a7a",
                    border: "1.5px solid #E8E4DC",
                    padding: "9px 20px",
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    fontFamily: f,
                    fontSize: ".82rem",
                    fontWeight: 700,
                    background: "#1B2B6B",
                    color: "#fff",
                    border: "none",
                    padding: "10px 28px",
                    borderRadius: 999,
                    cursor: "pointer",
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  {isSubmitting
                    ? "Processing…"
                    : pkg.bookingType === "CUSTOMIZED"
                    ? "Submit Enquiry →"
                    : isFullPayment
                    ? `Pay ₹${finalPayable.toLocaleString("en-IN")} & Book →`
                    : `Pay ₹${payableToday.toLocaleString("en-IN")} Advance & Confirm →`}
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
