import React, { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { _axios } from "@/lib/axios"
import { useAuth } from "@/lib/useAuth"
import { useNavigate } from "react-router-dom"
import { pdf } from "@react-pdf/renderer"
import { BookingInvoicePDF } from "./BookingInvoicePDF"
import { loadRazorpayScript } from "@/lib/razorpay"
import { toast } from "sonner"
import {
  Calendar,
  MapPin,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Clock,
  FileText,
  X,
  Sparkles,
  Download,
  Loader2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Info,
  RotateCcw,
} from "lucide-react"

export const MyBookings: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBookingType, setSelectedBookingType] = useState<string>("ALL")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Selected booking detail modal state
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

  // Track which booking is being downloaded (PDF)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  // Subsequent Payment State (for making payments from detail modal or quick card modal)
  const [quickPaymentBooking, setQuickPaymentBooking] = useState<any | null>(null)
  const [subsequentChoice, setSubsequentChoice] = useState<"MIN" | "FULL" | "CUSTOM">("MIN")
  const [customSubsequentAmount, setCustomSubsequentAmount] = useState<string>("")
  const [isPayingSubsequent, setIsPayingSubsequent] = useState(false)

  // Detail Modal internal subsequent payment state
  const [detailPaymentChoice, setDetailPaymentChoice] = useState<"MIN" | "FULL" | "CUSTOM">("MIN")
  const [detailCustomAmount, setDetailCustomAmount] = useState<string>("")

  // Cancellation Request State
  const [cancelModalBooking, setCancelModalBooking] = useState<any | null>(null)
  const [cancelReasonCategory, setCancelReasonCategory] = useState<string>("Personal Emergency")
  const [cancelReason, setCancelReason] = useState<string>("")
  const [cancelUserNotes, setCancelUserNotes] = useState<string>("")
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false)

  // Prevent background page scroll when modal is active
  React.useEffect(() => {
    if (selectedBookingId || quickPaymentBooking || cancelModalBooking) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedBookingId, quickPaymentBooking, cancelModalBooking])

  // Query User Bookings List
  const { data: bookingsData, isLoading, isError } = useQuery({
    queryKey: ["my-bookings", page, limit, selectedBookingType, selectedStatus, searchQuery],
    queryFn: async () => {
      const res = await _axios.get("/booking/my-bookings", {
        params: {
          page,
          limit,
          bookingType: selectedBookingType !== "ALL" ? selectedBookingType : undefined,
          status: selectedStatus !== "ALL" ? selectedStatus : undefined,
          search: searchQuery.trim() || undefined,
        },
      })
      return res.data
    },
    enabled: !!user,
  })

  // Query Selected Single Booking Details (contains full paymentSummary from backend)
  const { data: bookingDetailsData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["my-booking-details", selectedBookingId],
    queryFn: async () => {
      if (!selectedBookingId) return null
      const res = await _axios.get(`/booking/my-bookings/${selectedBookingId}`)
      return res.data?.data
    },
    enabled: !!selectedBookingId,
  })

  // Query Payment Summary for Quick Payment Booking if needed
  const { data: quickBookingSummaryData } = useQuery({
    queryKey: ["booking-payment-summary", quickPaymentBooking?._id],
    queryFn: async () => {
      if (!quickPaymentBooking?._id) return null
      const res = await _axios.get(`/booking/${quickPaymentBooking._id}/payment-summary`)
      return res.data?.data
    },
    enabled: !!quickPaymentBooking?._id,
  })

  // Reset payment selection states when booking modal opens
  React.useEffect(() => {
    setSubsequentChoice("MIN")
    setCustomSubsequentAmount("")
    setDetailPaymentChoice("MIN")
    setDetailCustomAmount("")
  }, [quickPaymentBooking, selectedBookingId])

  // ── Download PDF handler ────────────────────────────────────────────────
  const handleDownloadPdf = async (bookingId: string, bookingNumber: string) => {
    if (downloadingId) return
    setDownloadingId(bookingId)
    try {
      const res = await _axios.get(`/booking/my-bookings/${bookingId}`)
      const bookingData = res.data?.data
      if (!bookingData) throw new Error("No booking data")

      const blob = await pdf(<BookingInvoicePDF booking={bookingData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Invoice-${bookingNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("PDF generation failed:", err)
      toast.error("Failed to generate invoice. Please try again.")
    } finally {
      setDownloadingId(null)
    }
  }

  // ── Handle Subsequent Installment Payment ────────────────────────────────
  const handleExecuteSubsequentPayment = async (
    bookingId: string,
    bookingNumber: string,
    amountToPay: number,
    stageNumber?: number,
    stageLabel?: string
  ) => {
    if (!amountToPay || isNaN(amountToPay) || amountToPay <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }

    setIsPayingSubsequent(true)
    try {
      const res = await _axios.post("/booking/standard/subsequent-payment", {
        bookingId,
        amount: amountToPay,
      })

      if (!res.data?.status || !res.data?.data) {
        toast.error(res.data?.error || "Failed to initialize installment payment")
        setIsPayingSubsequent(false)
        return
      }

      const orderData = res.data.data

      const loaded = await loadRazorpayScript()
      if (!loaded || !window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please check your network connection.")
        setIsPayingSubsequent(false)
        return
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amountInPaise,
        currency: "INR",
        name: "UV Holidays",
        description: `Installment: ${bookingNumber} (${orderData.stageLabel || `Stage ${orderData.stage}`})`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await _axios.post("/booking/standard/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            if (verifyRes.data?.status) {
              toast.success(
                `Payment of ₹${amountToPay.toLocaleString("en-IN")} for Stage ${orderData.stage} verified successfully! 🎉`
              )
              // Refresh both the list and any open detail query
              queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
              queryClient.invalidateQueries({ queryKey: ["my-booking-details"] })
              queryClient.invalidateQueries({ queryKey: ["booking-payment-summary"] })
              setQuickPaymentBooking(null)
            } else {
              toast.error(verifyRes.data?.error || "Payment verification failed")
            }
          } catch (err: any) {
            toast.error(err?.response?.data?.error || "Payment verification failed")
          } finally {
            setIsPayingSubsequent(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsPayingSubsequent(false)
          },
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        theme: {
          color: "#1B2B6B",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to initiate payment")
      setIsPayingSubsequent(false)
    }
  }

  // ── Handle Submit Cancellation Request ────────────────────────────────────
  const handleSubmitCancellationRequest = async () => {
    if (!cancelModalBooking) return
    if (!cancelReason.trim()) {
      toast.error("Please enter a reason for cancelling your booking")
      return
    }

    setIsSubmittingCancel(true)
    try {
      const res = await _axios.post(`/booking/${cancelModalBooking._id}/cancel-request`, {
        reason: cancelReason.trim(),
        reasonCategory: cancelReasonCategory,
        userNotes: cancelUserNotes.trim() || undefined,
      })

      if (res.data?.status) {
        toast.success(res.data?.message || "Cancellation request submitted for admin review")
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
        queryClient.invalidateQueries({ queryKey: ["my-booking-details", cancelModalBooking._id] })
        setCancelModalBooking(null)
      } else {
        toast.error(res.data?.error || "Failed to submit cancellation request")
      }
    } catch (err: any) {
      console.error("Cancellation Request Error:", err)
      toast.error(err?.response?.data?.error || "Failed to submit cancellation request")
    } finally {
      setIsSubmittingCancel(false)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8ECFA] text-[#1B2B6B]">
          <ShoppingBag size={32} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#0F1B47]">
          Sign In Required
        </h2>
        <p className="mt-2 max-w-md text-sm text-[#5a5a7a]">
          Please sign in to view your travel bookings, itinerary quotations, payment records, and booking status.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-full bg-[#1B2B6B] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
        >
          Return to Home
        </button>
      </div>
    )
  }

  const bookingsList = bookingsData?.data || []
  const pagination = bookingsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
      case "CONFIRMED":
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "PARTIALLY_PAID":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "QUOTATION_SHARED":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "ENQUIRY_RECEIVED":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "CANCELLATION_REQUESTED":
        return "bg-amber-100 text-amber-900 border-amber-300 font-bold"
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "CANCELLED":
      case "PAYMENT_FAILED":
        return "bg-rose-100 text-rose-800 border-rose-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] py-10 px-4 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8ECFA] px-3.5 py-1 text-xs font-bold text-[#1B2B6B]">
              <ShoppingBag size={14} /> My Travel Dashboard
            </div>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#0F1B47] md:text-3xl">
              My Travel Bookings &amp; Enquiries
            </h1>
            <p className="mt-1 text-xs text-gray-500 md:text-sm">
              Manage your tour bookings, track multiple payment stages, pay installments, and download invoices.
            </p>
          </div>

          <button
            onClick={() => navigate("/tourism")}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0F1B47] to-[#1B2B6B] px-6 py-3 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            <Sparkles size={16} /> Explore New Packages
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="mt-8 rounded-3xl bg-white p-5 shadow-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Search booking # or traveller..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10"
              />
            </div>

            {/* Booking Type Filter */}
            <div>
              <select
                value={selectedBookingType}
                onChange={(e) => {
                  setSelectedBookingType(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-medium text-gray-800 outline-none focus:border-[#1B2B6B]"
              >
                <option value="ALL">All Package Types</option>
                <option value="STANDARD">Standard (Online Booking)</option>
                <option value="CUSTOMIZED">Customized (Enquiry)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-medium text-gray-800 outline-none focus:border-[#1B2B6B]"
              >
                <option value="ALL">All Booking Statuses</option>
                <option value="BOOKED">BOOKED / CONFIRMED</option>
                <option value="PARTIALLY_PAID">PARTIALLY PAID (PENDING INSTALLMENT)</option>
                <option value="CANCELLATION_REQUESTED">CANCELLATION REQUESTED</option>
                <option value="ENQUIRY_RECEIVED">ENQUIRY RECEIVED</option>
                <option value="QUOTATION_SHARED">QUOTATION SHARED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>

            {/* Limit selector */}
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-medium text-gray-500">Show:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value))
                  setPage(1)
                }}
                className="rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-medium text-gray-800 outline-none"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Content Grid / Table */}
        <div className="mt-6">
          {isLoading ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1B2B6B] border-t-transparent"></div>
              <p className="mt-3 text-xs font-medium text-gray-500">Loading your travel bookings...</p>
            </div>
          ) : isError ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
              <p className="text-sm font-semibold text-rose-600">Failed to load bookings. Please try refreshing.</p>
            </div>
          ) : bookingsList.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F4] text-[#1B2B6B]">
                <FileText size={32} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0F1B47]">No Bookings Found</h3>
              <p className="mt-1 text-xs text-gray-500">
                {searchQuery || selectedBookingType !== "ALL" || selectedStatus !== "ALL"
                  ? "No bookings match your current filter parameters. Try resetting your search."
                  : "You have not placed any tour bookings or customized enquiries yet."}
              </p>
              <button
                onClick={() => navigate("/tourism")}
                className="mt-5 rounded-full bg-[#1B2B6B] px-6 py-2.5 text-xs font-bold text-white shadow-md"
              >
                Book Your First Package
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookingsList.map((bk: any) => {
                const pkg = bk.packageId

                // Payment multi-stage breakdown on card
                const finalAmount = bk.pricingDetails?.finalAmount || 0
                const totalPaid =
                  bk.paymentDetails?.totalPaidAmount ??
                  (["BOOKED", "CONFIRMED", "COMPLETED"].includes(bk.status) ? finalAmount : 0)
                const remainingAmount =
                  bk.paymentDetails?.remainingAmount ?? Math.max(0, finalAmount - totalPaid)
                const isPartiallyPaid =
                  remainingAmount > 0 && totalPaid > 0 && bk.bookingType === "STANDARD"
                const isFullyPaid =
                  remainingAmount <= 0 && totalPaid > 0 && bk.bookingType === "STANDARD"
                const currentStage = bk.paymentDetails?.currentStage || 1
                const maxStages = bk.paymentDetails?.maxStages || 3
                const paidPercentage =
                  finalAmount > 0 ? Math.min(100, Math.round((totalPaid / finalAmount) * 100)) : 0

                return (
                  <div
                    key={bk._id}
                    className="overflow-hidden rounded-3xl bg-white p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl md:p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Left: Package info & Details */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Package Thumbnail */}
                        <div className="h-24 w-full sm:w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                          {pkg?.imageUrl || pkg?.bannerImage ? (
                            <img
                              src={pkg.imageUrl || pkg.bannerImage}
                              alt={pkg?.title || "Tour Package"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#0F1B47] text-white font-serif text-xs font-bold">
                              UDAYAM
                            </div>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-0.5 text-[11px] font-bold border ${getStatusBadge(
                                bk.status
                              )}`}
                            >
                              {bk.status.replace(/_/g, " ")}
                            </span>

                            {/* Payment Status Badges */}
                            {bk.status === "CANCELLATION_REQUESTED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold">
                                <Clock size={11} className="text-amber-700" /> Cancellation Under Review
                              </span>
                            )}
                            {isPartiallyPaid && bk.status !== "CANCELLATION_REQUESTED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-xs">
                                <Clock size={11} /> Partially Paid (Stage {currentStage}/{maxStages})
                              </span>
                            )}
                            {isFullyPaid && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-bold">
                                <CheckCircle2 size={11} /> 100% Fully Paid
                              </span>
                            )}

                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                              {bk.bookingType === "CUSTOMIZED" ? "Customized Enquiry" : "Standard Package"}
                            </span>
                          </div>

                          <h3 className="mt-2 font-serif text-base font-bold text-[#0F1B47]">
                            {pkg?.title || "Custom Travel Package"}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin size={13} className="text-[#1B2B6B]" /> {pkg?.destination || "Multi-Destination"}
                            </span>
                            {pkg?.days && (
                              <span className="flex items-center gap-1">
                                <Clock size={13} className="text-[#1B2B6B]" /> {pkg.days} Days / {pkg.nights} Nights
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users size={13} className="text-[#1B2B6B]" /> {bk.travellerInfo?.numberOfPersons || 1} Pax
                            </span>
                          </div>

                          <div className="mt-2 text-[11px] text-gray-400 font-mono">
                            Ref: <strong>{bk.bookingNumber}</strong> • Date:{" "}
                            {new Date(bk.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing & Payment Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between border-t border-gray-100 pt-3 lg:border-t-0 lg:pt-0 gap-3">
                        <div className="text-left lg:text-right">
                          <span className="text-[11px] font-medium text-gray-400">Total Price:</span>
                          <p className="font-serif text-lg font-bold text-[#1B2B6B]">
                            {finalAmount ? `₹${finalAmount.toLocaleString("en-IN")}` : "Custom Quote"}
                          </p>

                          {/* Multi-Stage Payment Progress on Card */}
                          {bk.bookingType === "STANDARD" && isPartiallyPaid && (
                            <div className="mt-1 flex flex-col lg:items-end gap-1">
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className="text-emerald-700">
                                  Paid: ₹{totalPaid.toLocaleString("en-IN")}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-amber-700 font-bold">
                                  Pending: ₹{remainingAmount.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="w-44 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-emerald-500 to-[#1B2B6B] h-1.5 rounded-full"
                                  style={{ width: `${paidPercentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* "Pay Next Stage" button for partially paid standard bookings */}
                          {isPartiallyPaid && !["CANCELLED", "REFUNDED", "PAYMENT_FAILED", "CANCELLATION_REQUESTED"].includes(bk.status) && (
                            <button
                              onClick={() => setQuickPaymentBooking(bk)}
                              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                            >
                              <CreditCard size={14} /> Pay Next Stage
                            </button>
                          )}

                          {/* Request Cancellation button */}
                          {!["CANCELLED", "REFUNDED", "CANCELLATION_REQUESTED", "PAYMENT_FAILED", "COMPLETED", "ENQUIRY_CANCELLED"].includes(bk.status) && (
                            <button
                              onClick={() => {
                                setCancelModalBooking(bk)
                                setCancelReasonCategory("Personal Emergency")
                                setCancelReason("")
                                setCancelUserNotes("")
                              }}
                              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3.5 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 hover:text-rose-800"
                            >
                              <RotateCcw size={13} /> Cancel
                            </button>
                          )}

                          {/* View Full Details */}
                          <button
                            onClick={() => setSelectedBookingId(bk._id)}
                            className="flex items-center gap-2 rounded-xl bg-[#E8ECFA] px-4 py-2 text-xs font-bold text-[#1B2B6B] transition-colors hover:bg-[#1B2B6B] hover:text-white"
                          >
                            <Eye size={14} /> View Details
                          </button>

                          {/* Download Invoice or Official Tax Invoice */}
                          {bk.status === 'COMPLETED' ? (
                            <a
                              href={
                                bk.invoiceUrl ||
                                `${_axios.defaults.baseURL || '/api/V1'}/receipt-download/invoice/${bk._id}?download=true`
                              }
                              target="_blank"
                              rel="noreferrer"
                              title="Download Official GST Tax Invoice"
                              className="flex items-center gap-1.5 rounded-xl border border-teal-600 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 transition-all hover:bg-teal-700 hover:text-white"
                            >
                              <FileText size={14} /> Tax Invoice
                            </a>
                          ) : (
                            <button
                              onClick={() => handleDownloadPdf(bk._id, bk.bookingNumber)}
                              disabled={downloadingId === bk._id}
                              title="Download PDF Invoice"
                              className="flex items-center gap-2 rounded-xl border border-[#1B2B6B]/20 bg-white px-4 py-2 text-xs font-bold text-[#1B2B6B] transition-all hover:bg-[#1B2B6B] hover:text-white hover:border-[#1B2B6B] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {downloadingId === bk._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Download size={14} />
                              )}
                              {downloadingId === bk._id ? "Generating..." : "Invoice PDF"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md sm:flex-row">
            <span className="text-xs font-medium text-gray-500">
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total bookings)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`h-8 w-8 rounded-xl text-xs font-bold ${
                    page === idx + 1
                      ? "bg-[#1B2B6B] text-white"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 1. SINGLE BOOKING DETAIL MODAL (With Multi-Stage Payment Details) ── */}
      {selectedBookingId && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBookingId(null)
          }}
        >
          <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0F1B47] to-[#1B2B6B] px-6 py-4 text-white">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Booking Detail Overview
                </span>
                <h3 className="font-serif text-lg font-bold">
                  {bookingDetailsData?.bookingNumber || "Loading..."}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingDetail || !bookingDetailsData ? (
                <div className="py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1B2B6B] border-t-transparent"></div>
                  <p className="mt-2 text-xs text-gray-500">Loading booking information...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between rounded-2xl bg-[#FAF8F4] p-4 border border-gray-200">
                    <div>
                      <span className="text-xs text-gray-500">Booking Status</span>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold border ${getStatusBadge(
                            bookingDetailsData.status
                          )}`}
                        >
                          {bookingDetailsData.status.replace(/_/g, " ")}
                        </span>
                        {bookingDetailsData.paymentDetails?.paymentStatus === "PARTIALLY_PAID" && (
                          <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[11px] font-bold">
                            Stage {bookingDetailsData.paymentDetails.currentStage} of {bookingDetailsData.paymentDetails.maxStages}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Package Type</span>
                      <p className="text-xs font-bold text-[#0F1B47]">
                        {bookingDetailsData.bookingType === "CUSTOMIZED" ? "Customized Tour" : "Standard Package"}
                      </p>
                    </div>
                  </div>

                  {/* ── OFFICIAL GST TAX INVOICE (COMPLETED BOOKINGS) ── */}
                  {bookingDetailsData.status === "COMPLETED" && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-xs">Official GST Tax Invoice</p>
                          <p className="text-[11px] text-teal-700 mt-0.5">
                            {bookingDetailsData.taxInvoiceNumber
                              ? `Invoice No: ${bookingDetailsData.taxInvoiceNumber}`
                              : "Your booking is completed. You can download your official tax invoice."}
                          </p>
                        </div>
                      </div>
                      <a
                        href={
                          bookingDetailsData.invoiceUrl ||
                          `${_axios.defaults.baseURL || '/api/V1'}/receipt-download/invoice/${bookingDetailsData._id}?download=true`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all"
                      >
                        <FileText size={13} /> Download Tax Invoice
                      </a>
                    </div>
                  )}

                  {/* ── CANCELLATION REQUEST DETAILS & REFUND BANNER ── */}
                  {bookingDetailsData.cancellationRequest && (
                    <>
                      {/* Under Review */}
                      {bookingDetailsData.cancellationRequest.status === "PENDING" && (
                        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 shadow-xs space-y-2">
                          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                            <Clock size={16} className="text-amber-700" />
                            Cancellation Request Under Review
                          </div>
                          <p className="text-xs text-amber-800">
                            You have submitted a cancellation request for this booking. Our team is currently reviewing your request against package terms and calculating your eligible refund. Payment installments are temporarily paused.
                          </p>
                          <div className="rounded-xl bg-white/90 p-3 border border-amber-200 text-xs space-y-1">
                            <div>
                              <span className="text-gray-500">Reason Category: </span>
                              <span className="font-semibold text-gray-800">{bookingDetailsData.cancellationRequest.reasonCategory}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Reason: </span>
                              <span className="font-medium text-gray-800">"{bookingDetailsData.cancellationRequest.reason}"</span>
                            </div>
                            {bookingDetailsData.cancellationRequest.userNotes && (
                              <div className="text-[11px] text-gray-500 italic">
                                Notes: {bookingDetailsData.cancellationRequest.userNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Completed / Refund Settled */}
                      {bookingDetailsData.cancellationRequest.status === "COMPLETED" && (
                        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-5 shadow-xs space-y-3">
                          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                            <CheckCircle2 size={16} className="text-emerald-700" />
                            Cancellation Approved &amp; Refund Settled
                          </div>
                          <p className="text-xs text-emerald-800">
                            This booking was cancelled and your refund has been processed by our team.
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl bg-white p-3 border border-emerald-200 text-xs">
                            <div>
                              <span className="text-[11px] text-gray-400">Refund Amount:</span>
                              <div className="text-sm font-bold text-emerald-700">
                                ₹{Number(bookingDetailsData.cancellationRequest.adminRefundDetails?.refundAmount || 0).toLocaleString("en-IN")}
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] text-gray-400">Deduction / Fee:</span>
                              <div className="text-sm font-bold text-gray-700">
                                ₹{Number(bookingDetailsData.cancellationRequest.adminRefundDetails?.deductionAmount || 0).toLocaleString("en-IN")}
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] text-gray-400">Settlement Mode:</span>
                              <div className="text-xs font-semibold text-gray-800">
                                {bookingDetailsData.cancellationRequest.adminRefundDetails?.paymentMode?.replace(/_/g, " ")}
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] text-gray-400">Reference / UTR:</span>
                              <div className="text-xs font-mono text-gray-800 truncate">
                                {bookingDetailsData.cancellationRequest.adminRefundDetails?.transactionReference || "N/A"}
                              </div>
                            </div>
                          </div>
                          {bookingDetailsData.cancellationRequest.adminRefundDetails?.adminNotes && (
                            <div className="text-xs text-emerald-900 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                              <strong>Notes:</strong> {bookingDetailsData.cancellationRequest.adminRefundDetails.adminNotes}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Rejected */}
                      {bookingDetailsData.cancellationRequest.status === "REJECTED" && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs space-y-1">
                          <div className="flex items-center gap-2 font-bold text-rose-900">
                            <AlertCircle size={15} className="text-rose-600" />
                            Previous Cancellation Request Declined
                          </div>
                          <p className="text-rose-800">
                            Reason: "{bookingDetailsData.cancellationRequest.adminRejectionDetails?.rejectionReason}".
                            Your booking has been restored and remains active.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── MULTI-STAGE PAYMENT PLAN & PROGRESS SECTION (Standard Bookings) ── */}
                  {bookingDetailsData.bookingType === "STANDARD" && bookingDetailsData.paymentSummary && (
                    <div className="rounded-2xl border border-[#1B2B6B]/20 bg-white p-5 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8ECFA] text-[#1B2B6B]">
                            <Layers size={18} />
                          </span>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1B47]">
                              Payment Stages &amp; Balance Status
                            </h4>
                            <span className="text-[11px] text-gray-500">
                              {bookingDetailsData.paymentSummary.isFullyPaid
                                ? "All payment stages completed! 100% Paid"
                                : `Stage ${bookingDetailsData.paymentSummary.currentStageNumber - 1} of ${bookingDetailsData.paymentSummary.maximumPaymentStages} completed`}
                            </span>
                          </div>
                        </div>

                        {/* Progress percentage pill */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1B2B6B]">
                            {bookingDetailsData.paymentSummary.paidPercentage}% Paid
                          </span>
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="mt-4">
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-[#1B2B6B] to-[#1B2B6B] transition-all duration-500"
                            style={{ width: `${bookingDetailsData.paymentSummary.paidPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* 3 Metrics Cards */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl bg-[#FAF8F4] p-3 border border-gray-100 text-left">
                          <span className="text-[11px] font-medium text-gray-500">Total Amount</span>
                          <p className="font-serif text-base font-bold text-[#1B2B6B]">
                            ₹{bookingDetailsData.paymentSummary.finalAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100 text-left">
                          <span className="text-[11px] font-medium text-emerald-800">Total Paid</span>
                          <p className="font-serif text-base font-bold text-emerald-700">
                            ₹{bookingDetailsData.paymentSummary.totalPaidAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="rounded-xl bg-amber-50 p-3 border border-amber-100 text-left">
                          <span className="text-[11px] font-medium text-amber-800">Pending Balance</span>
                          <p className="font-serif text-base font-bold text-amber-700">
                            ₹{bookingDetailsData.paymentSummary.remainingAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Payment History Records Table */}
                      {bookingDetailsData.paymentSummary.successfulPayments?.length > 0 && (
                        <div className="mt-5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                            <Receipt size={13} /> Completed Payment Transactions ({bookingDetailsData.paymentSummary.successfulPayments.length})
                          </div>
                          <div className="overflow-hidden rounded-xl border border-gray-100 bg-[#FAF8F4] divide-y divide-gray-100 text-xs">
                            {bookingDetailsData.paymentSummary.successfulPayments.map((p: any, idx: number) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    {p.stage || idx + 1}
                                  </span>
                                  <div>
                                    <span className="font-bold text-gray-800">
                                      {p.stageLabel || `Stage ${p.stage || idx + 1} Payment`}
                                    </span>
                                    {p.razorpayPaymentId && (
                                      <p className="text-[10px] font-mono text-gray-400">
                                        ID: {p.razorpayPaymentId}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-2.5">
                                  <span className="text-[11px] text-gray-400">
                                    {p.paidAt ? new Date(p.paidAt).toLocaleString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }) : "Verified"}
                                  </span>
                                  <span className="font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-md text-xs">
                                    ₹{p.amount.toLocaleString("en-IN")}
                                  </span>
                                  <a
                                    href={
                                      p.paymentReceiptUrl ||
                                      `${_axios.defaults.baseURL || '/api/V1'}/receipt-download/receipt/${p._id || p.id}?download=true`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 transition-colors shadow-xs"
                                    title="Download Receipt Voucher PDF"
                                  >
                                    <FileText size={12} /> Receipt
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Pay Next Stage in Detail View */}
                      {bookingDetailsData.paymentSummary.canMakeSubsequentPayment &&
                        bookingDetailsData.paymentSummary.remainingAmount > 0 &&
                        !["CANCELLED", "REFUNDED", "PAYMENT_FAILED", "CANCELLATION_REQUESTED"].includes(bookingDetailsData.status) && (
                          <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#F4F6FB] to-[#FAF8F4] p-4 border border-[#1B2B6B]/20">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5 font-bold text-[#1B2B6B] text-xs uppercase tracking-wide">
                                <CreditCard size={15} /> Pay Next Stage: {bookingDetailsData.paymentSummary.nextStageLabel}
                              </div>
                              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                Stage {bookingDetailsData.paymentSummary.currentStageNumber} of {bookingDetailsData.paymentSummary.maximumPaymentStages}
                              </span>
                            </div>

                            {/* Stage Guidance Note */}
                            {bookingDetailsData.paymentSummary.isFinalStage ? (
                              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed mb-3">
                                ⚠️ <strong>Final Payment Stage:</strong> This is the final installment allowed (Stage 3). The remaining balance of ₹{bookingDetailsData.paymentSummary.remainingAmount.toLocaleString("en-IN")} must be cleared in full.
                              </p>
                            ) : (
                              <p className="text-xs text-gray-600 mb-3">
                                Minimum required for this stage is <strong>₹{bookingDetailsData.paymentSummary.nextStageMinimumAmount.toLocaleString("en-IN")}</strong> ({bookingDetailsData.paymentSummary.nextStageMinimumPercentage}%). You may also pay more or clear the full balance now.
                              </p>
                            )}

                            {/* Option selection tabs if not final stage */}
                            {!bookingDetailsData.paymentSummary.isFinalStage ? (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                                <button
                                  type="button"
                                  onClick={() => setDetailPaymentChoice("MIN")}
                                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                                    detailPaymentChoice === "MIN"
                                      ? "border-[#1B2B6B] bg-white shadow-sm ring-1 ring-[#1B2B6B]"
                                      : "border-gray-200 bg-white/70 hover:bg-white"
                                  }`}
                                >
                                  <div className="font-semibold text-gray-600">Stage Minimum</div>
                                  <div className="font-bold text-[#1B2B6B] text-sm mt-0.5">
                                    ₹{bookingDetailsData.paymentSummary.nextStageMinimumAmount.toLocaleString("en-IN")}
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDetailPaymentChoice("FULL")}
                                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                                    detailPaymentChoice === "FULL"
                                      ? "border-[#1B2B6B] bg-white shadow-sm ring-1 ring-[#1B2B6B]"
                                      : "border-gray-200 bg-white/70 hover:bg-white"
                                  }`}
                                >
                                  <div className="font-semibold text-gray-600">Clear Full Balance</div>
                                  <div className="font-bold text-emerald-700 text-sm mt-0.5">
                                    ₹{bookingDetailsData.paymentSummary.remainingAmount.toLocaleString("en-IN")}
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDetailPaymentChoice("CUSTOM")}
                                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                                    detailPaymentChoice === "CUSTOM"
                                      ? "border-[#1B2B6B] bg-white shadow-sm ring-1 ring-[#1B2B6B]"
                                      : "border-gray-200 bg-white/70 hover:bg-white"
                                  }`}
                                >
                                  <div className="font-semibold text-gray-600">Custom Amount</div>
                                  <div className="font-bold text-[#1B2B6B] text-sm mt-0.5">
                                    Any Amount
                                  </div>
                                </button>
                              </div>
                            ) : null}

                            {/* Custom input when selected */}
                            {detailPaymentChoice === "CUSTOM" && !bookingDetailsData.paymentSummary.isFinalStage && (
                              <div className="mb-3">
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Enter Amount to Pay (Min: ₹{bookingDetailsData.paymentSummary.nextStageMinimumAmount.toLocaleString("en-IN")} • Max: ₹{bookingDetailsData.paymentSummary.remainingAmount.toLocaleString("en-IN")}):
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                                    ₹
                                  </span>
                                  <input
                                    type="number"
                                    min={bookingDetailsData.paymentSummary.nextStageMinimumAmount}
                                    max={bookingDetailsData.paymentSummary.remainingAmount}
                                    value={detailCustomAmount}
                                    onChange={(e) => setDetailCustomAmount(e.target.value)}
                                    placeholder={`e.g. ${bookingDetailsData.paymentSummary.nextStageMinimumAmount}`}
                                    className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-7 pr-4 text-xs font-semibold text-gray-800 outline-none focus:border-[#1B2B6B]"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Trigger Button */}
                            {(() => {
                              let amountToPay = bookingDetailsData.paymentSummary.remainingAmount
                              if (!bookingDetailsData.paymentSummary.isFinalStage) {
                                if (detailPaymentChoice === "MIN") {
                                  amountToPay = bookingDetailsData.paymentSummary.nextStageMinimumAmount
                                } else if (detailPaymentChoice === "FULL") {
                                  amountToPay = bookingDetailsData.paymentSummary.remainingAmount
                                } else if (detailPaymentChoice === "CUSTOM") {
                                  amountToPay = Number(detailCustomAmount) || bookingDetailsData.paymentSummary.nextStageMinimumAmount
                                }
                              }

                              return (
                                <button
                                  type="button"
                                  disabled={isPayingSubsequent}
                                  onClick={() =>
                                    handleExecuteSubsequentPayment(
                                      bookingDetailsData._id,
                                      bookingDetailsData.bookingNumber,
                                      amountToPay,
                                      bookingDetailsData.paymentSummary.currentStageNumber,
                                      bookingDetailsData.paymentSummary.nextStageLabel
                                    )
                                  }
                                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F1B47] to-[#1B2B6B] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
                                >
                                  {isPayingSubsequent ? (
                                    <>
                                      <Loader2 size={16} className="animate-spin" /> Processing Payment...
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard size={16} /> Pay ₹{amountToPay.toLocaleString("en-IN")} Now via Razorpay →
                                    </>
                                  )}
                                </button>
                              )
                            })()}
                          </div>
                        )}
                    </div>
                  )}

                  {/* Primary Traveller Info */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1B47] mb-2">
                      Primary Traveller &amp; Contact
                    </h4>
                    <div className="grid grid-cols-1 gap-3 rounded-2xl bg-gray-50 p-4 sm:grid-cols-3 text-xs">
                      <div>
                        <span className="text-gray-400">Full Name:</span>
                        <p className="font-bold text-gray-800">{bookingDetailsData.travellerInfo?.fullName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Mobile Number:</span>
                        <p className="font-bold text-gray-800">{bookingDetailsData.travellerInfo?.mobileNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Email Address:</span>
                        <p className="font-bold text-gray-800">{bookingDetailsData.travellerInfo?.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Travel Date:</span>
                        <p className="font-bold text-gray-800">
                          {new Date(bookingDetailsData.travellerInfo?.travelDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Trip Style:</span>
                        <p className="font-bold text-gray-800">{bookingDetailsData.travellerInfo?.travelType}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Persons:</span>
                        <p className="font-bold text-gray-800">{bookingDetailsData.travellerInfo?.numberOfPersons} Pax</p>
                      </div>
                    </div>
                  </div>

                  {/* Individual Travellers List */}
                  {bookingDetailsData.travellerInfo?.travellers?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1B47] mb-2">
                        Traveller Details Breakdown ({bookingDetailsData.travellerInfo.travellers.length} Persons)
                      </h4>
                      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white overflow-hidden text-xs">
                        {bookingDetailsData.travellerInfo.travellers.map((t: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3">
                            <span className="font-medium text-gray-800">
                              {idx + 1}. {t.name || "Traveller"}
                            </span>
                            <span className="text-gray-500">
                              Age: <strong>{t.age}</strong> • Gender: <strong>{t.gender}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Details */}
                  {bookingDetailsData.pricingDetails && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1B47] mb-2">
                        Package Pricing Summary
                      </h4>
                      <div className="rounded-2xl border border-gray-200 bg-[#FAF8F4] p-4 text-xs">
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-600">Base Price:</span>
                          <span className="font-semibold text-gray-800">
                            ₹{bookingDetailsData.pricingDetails.originalAmount?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        {bookingDetailsData.pricingDetails.discountAmount > 0 && (
                          <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700 font-semibold">
                            <span>Coupon Discount:</span>
                            <span>-₹{bookingDetailsData.pricingDetails.discountAmount?.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        {bookingDetailsData.pricingDetails.gstAmount > 0 && (
                          <div className="flex justify-between py-1 border-b border-gray-200 text-gray-600">
                            <span>GST ({bookingDetailsData.pricingDetails.gstPercentage}%):</span>
                            <span>+₹{bookingDetailsData.pricingDetails.gstAmount?.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 text-sm font-bold text-[#1B2B6B]">
                          <span>Final Total Amount:</span>
                          <span>₹{bookingDetailsData.pricingDetails.finalAmount?.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Audit History Timeline */}
                  {bookingDetailsData.history?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1B47] mb-2">
                        Status Activity Timeline
                      </h4>
                      <div className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-4 text-xs">
                        {bookingDetailsData.history.map((h: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 border-l-2 border-[#1B2B6B] pl-3 py-1">
                            <div>
                              <p className="font-bold text-gray-800">
                                {h.fromStatus} → {h.toStatus}
                              </p>
                              {h.notes && <p className="text-gray-500 mt-0.5">{h.notes}</p>}
                              <span className="text-[10px] text-gray-400">
                                {new Date(h.createdAt).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-4 flex items-center justify-between">
              {bookingDetailsData &&
                !["CANCELLED", "REFUNDED", "CANCELLATION_REQUESTED", "PAYMENT_FAILED", "COMPLETED", "ENQUIRY_CANCELLED"].includes(bookingDetailsData.status) &&
                bookingDetailsData.cancellationRequest?.status !== "PENDING" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCancelModalBooking(bookingDetailsData)
                      setCancelReasonCategory("Personal Emergency")
                      setCancelReason("")
                      setCancelUserNotes("")
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                  >
                    <RotateCcw size={13} /> Request Cancellation
                  </button>
                )}
              <div className="ml-auto">
                <button
                  onClick={() => setSelectedBookingId(null)}
                  className="rounded-full bg-[#1B2B6B] px-6 py-2 text-xs font-bold text-white hover:bg-[#0F1B47] transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. QUICK SUBSEQUENT PAYMENT MODAL (Opened from List Card Button) ── */}
      {quickPaymentBooking && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isPayingSubsequent) setQuickPaymentBooking(null)
          }}
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0F1B47] to-[#1B2B6B] px-6 py-4 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Pay Tour Installment
                </span>
                <h3 className="font-serif text-base font-bold">
                  {quickPaymentBooking.packageId?.title || quickPaymentBooking.bookingNumber}
                </h3>
              </div>
              <button
                disabled={isPayingSubsequent}
                onClick={() => setQuickPaymentBooking(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {(() => {
                const summary = quickBookingSummaryData
                const finalAmount = quickPaymentBooking.pricingDetails?.finalAmount || 0
                const totalPaid =
                  summary?.totalPaidAmount ??
                  (quickPaymentBooking.paymentDetails?.totalPaidAmount || 0)
                const remainingAmount =
                  summary?.remainingAmount ??
                  (quickPaymentBooking.paymentDetails?.remainingAmount || Math.max(0, finalAmount - totalPaid))
                const nextMinAmount = summary?.nextStageMinimumAmount ?? Math.min(Math.round(finalAmount * 0.4), remainingAmount)
                const nextMinPct = summary?.nextStageMinimumPercentage ?? 40
                const isFinalStage = summary?.isFinalStage || false
                const stageNumber = summary?.currentStageNumber || (quickPaymentBooking.paymentDetails?.currentStage ? quickPaymentBooking.paymentDetails.currentStage + 1 : 2)
                const maxStages = summary?.maximumPaymentStages || quickPaymentBooking.paymentDetails?.maxStages || 3
                const stageLabel = summary?.nextStageLabel || (isFinalStage ? "Final Payment" : `Stage ${stageNumber} Payment`)

                let amountToCharge = remainingAmount
                if (!isFinalStage) {
                  if (subsequentChoice === "MIN") {
                    amountToCharge = nextMinAmount
                  } else if (subsequentChoice === "FULL") {
                    amountToCharge = remainingAmount
                  } else if (subsequentChoice === "CUSTOM") {
                    amountToCharge = Number(customSubsequentAmount) || nextMinAmount
                  }
                }

                return (
                  <div className="flex flex-col gap-4">
                    {/* Summary row */}
                    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#FAF8F4] p-4 text-xs">
                      <div>
                        <span className="text-gray-400">Total Price:</span>
                        <p className="font-bold text-[#1B2B6B]">₹{finalAmount.toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Paid:</span>
                        <p className="font-bold text-emerald-700">₹{totalPaid.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Remaining Balance:</span>
                        <span className="font-serif text-base font-bold text-amber-700">
                          ₹{remainingAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Stage Alert */}
                    {isFinalStage ? (
                      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                        ⚠️ <strong>Final Payment Stage (Stage {stageNumber} of {maxStages}):</strong> You must pay the full remaining balance of ₹{remainingAmount.toLocaleString("en-IN")}.
                      </div>
                    ) : (
                      <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-900 border border-blue-200">
                        💳 <strong>Stage {stageNumber} ({stageLabel}):</strong> Minimum required payment is ₹{nextMinAmount.toLocaleString("en-IN")} ({nextMinPct}%). You can also choose to clear the entire balance now.
                      </div>
                    )}

                    {/* Payment Options Selection */}
                    {!isFinalStage && (
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSubsequentChoice("MIN")}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            subsequentChoice === "MIN"
                              ? "border-[#1B2B6B] bg-white shadow-sm ring-1 ring-[#1B2B6B]"
                              : "border-gray-200 bg-gray-50 hover:bg-white"
                          }`}
                        >
                          <div className="font-semibold text-gray-500 text-[11px]">Minimum ({nextMinPct}%)</div>
                          <div className="font-bold text-[#1B2B6B] text-sm mt-0.5">
                            ₹{nextMinAmount.toLocaleString("en-IN")}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSubsequentChoice("FULL")}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            subsequentChoice === "FULL"
                              ? "border-[#1B2B6B] bg-white shadow-sm ring-1 ring-[#1B2B6B]"
                              : "border-gray-200 bg-gray-50 hover:bg-white"
                          }`}
                        >
                          <div className="font-semibold text-gray-500 text-[11px]">Clear Full</div>
                          <div className="font-bold text-emerald-700 text-sm mt-0.5">
                            ₹{remainingAmount.toLocaleString("en-IN")}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSubsequentChoice("CUSTOM")}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            subsequentChoice === "CUSTOM"
                              ? "border-[#1B2B6B] bg-white shadow-sm ring-1 ring-[#1B2B6B]"
                              : "border-gray-200 bg-gray-50 hover:bg-white"
                          }`}
                        >
                          <div className="font-semibold text-gray-500 text-[11px]">Custom</div>
                          <div className="font-bold text-[#1B2B6B] text-sm mt-0.5">
                            Choose
                          </div>
                        </button>
                      </div>
                    )}

                    {/* Custom Input */}
                    {subsequentChoice === "CUSTOM" && !isFinalStage && (
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Amount to Pay (Min: ₹{nextMinAmount.toLocaleString("en-IN")} • Max: ₹{remainingAmount.toLocaleString("en-IN")}):
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                            ₹
                          </span>
                          <input
                            type="number"
                            min={nextMinAmount}
                            max={remainingAmount}
                            value={customSubsequentAmount}
                            onChange={(e) => setCustomSubsequentAmount(e.target.value)}
                            placeholder={`e.g. ${nextMinAmount}`}
                            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-7 pr-4 text-xs font-semibold text-gray-800 outline-none focus:border-[#1B2B6B]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-2 flex gap-3">
                      <button
                        type="button"
                        disabled={isPayingSubsequent}
                        onClick={() => setQuickPaymentBooking(null)}
                        className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isPayingSubsequent}
                        onClick={() =>
                          handleExecuteSubsequentPayment(
                            quickPaymentBooking._id,
                            quickPaymentBooking.bookingNumber,
                            amountToCharge,
                            stageNumber,
                            stageLabel
                          )
                        }
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F1B47] to-[#1B2B6B] py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
                      >
                        {isPayingSubsequent ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard size={15} /> Pay ₹{amountToCharge.toLocaleString("en-IN")} →
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. CANCELLATION REQUEST DIALOG MODAL ── */}
      {cancelModalBooking && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingCancel) {
              setCancelModalBooking(null)
            }
          }}
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0F1B47] to-[#1B2B6B] p-5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold">Request Booking Cancellation</h3>
                  <p className="text-[11px] text-gray-300 font-mono">
                    Booking #{cancelModalBooking.bookingNumber}
                  </p>
                </div>
              </div>
              <button
                disabled={isSubmittingCancel}
                onClick={() => setCancelModalBooking(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Summary box */}
              <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Package:</span>
                  <span className="font-bold text-[#0F1B47] truncate max-w-[240px]">
                    {cancelModalBooking.packageId?.title || cancelModalBooking.package?.title || "Tour Package"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Paid So Far:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    ₹{Number(
                      cancelModalBooking.paymentDetails?.totalPaidAmount ||
                      cancelModalBooking.paymentSummary?.totalPaidAmount ||
                      0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Policy note */}
              <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
                ℹ️ <strong>Cancellation Review Process:</strong>
                <p className="mt-1">
                  Bookings are not cancelled immediately. Your request will be sent to our administration team for review against package terms and conditions. Once approved, the eligible refund will be manually processed and recorded.
                </p>
              </div>

              {/* Reason Category dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Reason Category *
                </label>
                <select
                  value={cancelReasonCategory}
                  onChange={(e) => setCancelReasonCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-semibold text-gray-800 outline-none focus:border-[#1B2B6B]"
                >
                  <option value="Personal Emergency">Personal Emergency</option>
                  <option value="Change of Travel Dates / Plans">Change of Travel Dates / Plans</option>
                  <option value="Health / Medical Reasons">Health / Medical Reasons</option>
                  <option value="Financial Constraints">Financial Constraints</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              {/* Reason textarea */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please describe why you wish to cancel this booking..."
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs font-normal text-gray-800 outline-none focus:border-[#1B2B6B] resize-none"
                />
              </div>

              {/* Additional notes / Bank details */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Refund Payout Details / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={cancelUserNotes}
                  onChange={(e) => setCancelUserNotes(e.target.value)}
                  placeholder="e.g. UPI ID: name@upi or Bank Account & IFSC"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-normal text-gray-800 outline-none focus:border-[#1B2B6B]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmittingCancel}
                  onClick={() => setCancelModalBooking(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  disabled={isSubmittingCancel}
                  onClick={handleSubmitCancellationRequest}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 py-2.5 text-xs font-bold text-white shadow-md hover:from-rose-700 hover:to-rose-800 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingCancel ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting Request...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={15} /> Submit Cancellation Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
