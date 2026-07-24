import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { _axios } from "@/lib/axios"
import { useAuth } from "@/lib/useAuth"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  MapPin,
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  X,
  Sparkles,
} from "lucide-react"

export const MyBookings: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBookingType, setSelectedBookingType] = useState<string>("ALL")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Selected booking detail modal state
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

  // Prevent background page scroll when detail modal is active
  React.useEffect(() => {
    if (selectedBookingId) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedBookingId])

  // Query User Bookings
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

  // Query Selected Single Booking Details
  const { data: bookingDetailsData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["my-booking-details", selectedBookingId],
    queryFn: async () => {
      if (!selectedBookingId) return null
      const res = await _axios.get(`/booking/my-bookings/${selectedBookingId}`)
      return res.data?.data
    },
    enabled: !!selectedBookingId,
  })

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
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "QUOTATION_SHARED":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "ENQUIRY_RECEIVED":
        return "bg-amber-100 text-amber-800 border-amber-300"
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

  const f = "'Inter', sans-serif"

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
              My Travel Bookings & Enquiries
            </h1>
            <p className="mt-1 text-xs text-gray-500 md:text-sm">
              Manage all your standard tour bookings, customized package quotations, and status history.
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

                      {/* Right: Pricing & Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between border-t border-gray-100 pt-3 lg:border-t-0 lg:pt-0 gap-3">
                        <div className="text-left lg:text-right">
                          <span className="text-[11px] font-medium text-gray-400">Total Price:</span>
                          <p className="font-serif text-lg font-bold text-[#1B2B6B]">
                            {bk.pricingDetails?.finalAmount
                              ? `₹${bk.pricingDetails.finalAmount.toLocaleString("en-IN")}`
                              : "Custom Quote"}
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedBookingId(bk._id)}
                          className="flex items-center gap-2 rounded-xl bg-[#E8ECFA] px-4 py-2 text-xs font-bold text-[#1B2B6B] transition-colors hover:bg-[#1B2B6B] hover:text-white"
                        >
                          <Eye size={14} /> View Full Details
                        </button>
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

      {/* ── SINGLE BOOKING DETAIL MODAL ── */}
      {selectedBookingId && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBookingId(null)
          }}
        >
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
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
                      <div className="mt-1">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold border ${getStatusBadge(
                            bookingDetailsData.status
                          )}`}
                        >
                          {bookingDetailsData.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Package Type</span>
                      <p className="text-xs font-bold text-[#0F1B47]">
                        {bookingDetailsData.bookingType === "CUSTOMIZED" ? "Customized Tour" : "Standard Package"}
                      </p>
                    </div>
                  </div>

                  {/* Primary Traveller Info */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1B47] mb-2">
                      Primary Traveller & Contact
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
                        Payment & Pricing Summary
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
                        <div className="flex justify-between pt-2 text-sm font-bold text-[#1B2B6B]">
                          <span>Final Amount Payable:</span>
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
            <div className="border-t border-gray-100 p-4 text-right">
              <button
                onClick={() => setSelectedBookingId(null)}
                className="rounded-full bg-[#1B2B6B] px-6 py-2 text-xs font-bold text-white"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
