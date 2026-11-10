import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Tag,
  CheckCircle2,
  Clock,
  IndianRupee,
  FileText,
  Receipt,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Lock,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'
import { usePermissions } from '@/lib/usePermissions'

export const Route = createFileRoute('/bookings/$id')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      ...search,
      type: (search.type as string) || '',
    }
  },
  component: BookingDetailsComponent,
})

const STANDARD_STATUSES = [
  'PAYMENT_PENDING',
  'PAYMENT_PROCESSING',
  'PAYMENT_SUCCESS',
  'BOOKED',
  'CONFIRMED',
  'TRAVEL_STARTED',
  'COMPLETED',
  'CANCELLED',
  'PAYMENT_FAILED',
  'REFUND_PENDING',
  'REFUND_PROCESSING',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
  'CANCELLATION_REQUESTED',
]

const CUSTOMIZED_STATUSES = [
  'ENQUIRY_RECEIVED',
  'UNDER_REVIEW',
  'QUOTATION_SHARED',
  'CUSTOMER_CONFIRMED',
  'PAYMENT_PENDING',
  'BOOKED',
  'COMPLETED',
  'ENQUIRY_CANCELLED',
  'CANCELLATION_REQUESTED',
]

function BookingDetailsComponent() {
  const { id } = Route.useParams()
  const { type } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { canEdit } = usePermissions()

  // Quotation form state
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')

  // Status update state
  const [selectedStatus, setSelectedStatus] = useState('')
  const [statusNotes, setStatusNotes] = useState('')

  // Record transaction form state
  const [txAmount, setTxAmount] = useState('')
  const [txMode, setTxMode] = useState('UPI')

  const {
    data: bookingData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-booking-detail', id],
    queryFn: async () => {
      const res = await _axios.get(`/booking/admin/${id}`)
      return res.data?.data
    },
    enabled: !!id,
  })

  // Pre-fill quotation and status forms
  useEffect(() => {
    if (bookingData) {
      if (bookingData.quotation?.amount) {
        setQuoteAmount(bookingData.quotation.amount.toString())
      } else if (bookingData.pricingDetails?.finalAmount) {
        setQuoteAmount(bookingData.pricingDetails.finalAmount.toString())
      }
      setQuoteNotes(bookingData.quotation?.notes || '')
      setSelectedStatus(bookingData.status || '')
    }
  }, [bookingData])

  // Quotation Mutation
  const quotationMutation = useMutation({
    mutationFn: async () => {
      return _axios.patch(`/booking/admin/${id}/quotation`, {
        amount: Number(quoteAmount),
        notes: quoteNotes,
      })
    },
    onSuccess: () => {
      toast.success('Quotation updated and shared successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to update quotation')
    },
  })

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: async () => {
      return _axios.patch(`/booking/admin/${id}/status`, {
        status: selectedStatus,
        notes: statusNotes,
      })
    },
    onSuccess: () => {
      toast.success('Booking status updated successfully!')
      setStatusNotes('')
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to update status')
    },
  })

  // Transaction Mutation
  const transactionMutation = useMutation({
    mutationFn: async () => {
      return _axios.post(`/booking/admin/${id}/transaction`, {
        amount: Number(txAmount),
        paymentMode: txMode,
      })
    },
    onSuccess: () => {
      toast.success('Payment transaction recorded successfully!')
      setTxAmount('')
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to record transaction')
    },
  })

  // Generate Tax Invoice Mutation
  const generateInvoiceMutation = useMutation({
    mutationFn: async () => {
      const res = await _axios.post(`/receipt-download/invoice/${id}/generate`)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Tax Invoice generated successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      if (data?.data?.invoiceUrl) {
        window.open(data.data.invoiceUrl, '_blank')
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to generate tax invoice')
    },
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !bookingData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-3">
        <p className="text-muted-foreground">
          Booking record could not be found.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            const lowerType = type?.toLowerCase()
            if (lowerType === 'customized') {
              navigate({ to: '/bookings/customized', search: (prev) => prev })
            } else {
              navigate({ to: '/bookings/standard', search: (prev) => prev })
            }
          }}
        >
          Back to Bookings
        </Button>
      </div>
    )
  }

  const booking = bookingData
  const isCustomized = booking.bookingType === 'CUSTOMIZED'
  const currentRoute = isCustomized
    ? '/bookings/customized'
    : '/bookings/standard'
  const userCanEdit = canEdit(currentRoute)

  const TERMINAL_STATUSES = [
    'CANCELLED',
    'COMPLETED',
    'ENQUIRY_CANCELLED',
    'REFUNDED',
  ]
  const isTerminalStatus = TERMINAL_STATUSES.includes(booking.status)
  const isCancellationRequested = booking.status === 'CANCELLATION_REQUESTED'
  const isStatusLocked =
    isTerminalStatus || isCancellationRequested || !userCanEdit

  const availableStatuses =
    booking.bookingType === 'CUSTOMIZED'
      ? CUSTOMIZED_STATUSES
      : STANDARD_STATUSES

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTripType = (type?: string) => {
    if (!type) return '-'
    const map: Record<string, { label: string; icon: string }> = {
      FAMILY: { label: 'Family', icon: '👨‍👩‍👧' },
      HONEYMOON: { label: 'Honeymoon', icon: '💑' },
      ADVENTURE: { label: 'Adventure', icon: '🧗' },
      SOLO: { label: 'Solo Travel', icon: '🎒' },
      GROUP: { label: 'Group', icon: '👥' },
      PILGRIMAGE: { label: 'Pilgrimage', icon: '🛕' },
    }
    const match = map[type.toUpperCase()]
    if (match) {
      return `${match.icon} ${match.label}`
    }
    return type.replace(/_/g, ' ')
  }

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'BOOKED':
      case 'CONFIRMED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'PAYMENT_SUCCESS':
      case 'CUSTOMER_CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'COMPLETED':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      case 'PAYMENT_PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'PAYMENT_PROCESSING':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'TRAVEL_STARTED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'CANCELLATION_REQUESTED':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
      case 'CANCELLED':
      case 'ENQUIRY_CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'PAYMENT_FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'REFUND_PENDING':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'REFUND_PROCESSING':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'PARTIALLY_REFUNDED':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'REFUNDED':
        return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'ENQUIRY_RECEIVED':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'UNDER_REVIEW':
        return 'bg-sky-50 text-sky-700 border-sky-200'
      case 'QUOTATION_SHARED':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const lowerType = type?.toLowerCase()
              if (
                lowerType === 'customized' ||
                booking?.bookingType === 'CUSTOMIZED'
              ) {
                navigate({
                  to: '/bookings/customized',
                  search: (prev) => prev,
                })
              } else {
                navigate({ to: '/bookings/standard', search: (prev) => prev })
              }
            }}
            className="cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono text-primary">
                {booking.bookingNumber}
              </h1>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border inline-flex items-center gap-1 ${
                  booking.bookingType === 'CUSTOMIZED'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {booking.bookingType === 'CUSTOMIZED' ? (
                  <Sparkles size={12} />
                ) : (
                  <Tag size={12} />
                )}
                {booking.bookingType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Created on {formatDateTime(booking.createdAt)}
            </p>
            {booking.bookingConfirmationNumber && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Booking Ref:
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {booking.bookingConfirmationNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            Status:
          </span>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusBadgeStyle(booking.status)}`}
          >
            {booking.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Cancellation Request Banner */}
      {booking.status === 'CANCELLATION_REQUESTED' &&
        booking.cancellationRequest?.status === 'PENDING' && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-700 dark:text-amber-300">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm">
                  Cancellation Request Pending Review
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Customer submitted a cancellation request: "
                  {booking.cancellationRequest?.reason || 'Reason provided'}".
                  Total paid:{' '}
                  <strong>
                    ₹
                    {Number(
                      booking.cancellationRequest?.totalPaidAmount ||
                        booking.paymentDetails?.totalPaidAmount ||
                        0,
                    ).toLocaleString('en-IN')}
                  </strong>
                  .
                </p>
              </div>
            </div>
            <Link
              to="/bookings/cancellations/$id"
              params={{
                id:
                  booking.cancellationRequest?._id ||
                  booking.cancellationRequestId,
              }}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Review &amp; Settle Refund <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

      {/* Completed Cancellation Banner */}
      {booking.cancellationRequest?.status === 'COMPLETED' && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm">
                Booking Cancelled &amp; Refund Settled
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                Refund amount:{' '}
                <strong>
                  ₹
                  {Number(
                    booking.cancellationRequest?.adminRefundDetails
                      ?.refundAmount || 0,
                  ).toLocaleString('en-IN')}
                </strong>{' '}
                paid via{' '}
                {booking.cancellationRequest?.adminRefundDetails?.paymentMode}{' '}
                (Ref:{' '}
                {booking.cancellationRequest?.adminRefundDetails
                  ?.transactionReference || 'N/A'}
                ).
              </p>
            </div>
          </div>
          <Link
            to="/bookings/cancellations/$id"
            params={{
              id:
                booking.cancellationRequest?._id ||
                booking.cancellationRequestId,
            }}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline"
          >
            View Refund Record <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Completed Booking Tax Invoice Banner */}
      {booking.status === 'COMPLETED' && (
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 text-teal-950 dark:text-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 dark:bg-teal-900/50 rounded-xl text-teal-700 dark:text-teal-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Official GST Tax Invoice</p>
              <p className="text-xs text-teal-800 dark:text-teal-300 mt-0.5">
                {booking.invoiceUrl ? (
                  <>
                    Invoice Reference:{' '}
                    <strong className="font-mono font-bold">
                      {booking.taxInvoiceNumber}
                    </strong>
                  </>
                ) : (
                  'This tour booking is completed. You can now generate the official GST Tax Invoice.'
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {booking.invoiceUrl ? (
              <a
                href={booking.invoiceUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <FileText className="h-3.5 w-3.5" /> Download Tax Invoice
              </a>
            ) : (
              <Button
                onClick={() => generateInvoiceMutation.mutate()}
                disabled={generateInvoiceMutation.isPending}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                {generateInvoiceMutation.isPending ? (
                  'Generating...'
                ) : (
                  <>
                    <FileText className="h-3.5 w-3.5" /> Generate Tax Invoice
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Customer Info & Package Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Package Info */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>📦</span> Package Details
            </h3>
            <div className="bg-muted/30 p-4 rounded-xl space-y-2 border">
              <div className="text-base font-bold text-primary truncate">
                {booking.packageId?.title || 'Tour Package'}
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div>
                  📍 Destination:{' '}
                  <strong className="text-foreground">
                    {booking.packageId?.destination}
                  </strong>
                </div>
                <div>
                  🗓 Duration:{' '}
                  <strong className="text-foreground">
                    {booking.packageId?.days}D / {booking.packageId?.nights}N
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Traveller Details */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Contact & Traveller
              Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-muted/20 p-4 rounded-xl border">
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  Primary Contact Name:
                </div>
                <div className="font-semibold text-sm mt-0.5">
                  {booking.travellerInfo?.fullName}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Phone size={12} /> Mobile Number:
                </div>
                <div className="font-mono font-semibold text-sm mt-0.5">
                  {booking.travellerInfo?.mobileNumber}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Mail size={12} /> Email Address:
                </div>
                <div className="font-semibold text-sm mt-0.5">
                  {booking.travellerInfo?.email}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} /> Travel Date & Style:
                </div>
                <div className="font-semibold text-sm mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{formatDate(booking.travellerInfo?.travelDate)}</span>
                  {booking.travellerInfo?.travelType && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {formatTripType(booking.travellerInfo?.travelType)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {booking.travellerInfo?.specialRequests && (
              <div className="bg-amber-50/50 border border-amber-200 p-3.5 rounded-xl text-xs space-y-1">
                <div className="font-semibold text-amber-800 flex items-center gap-1">
                  <span>📌</span> Special Requests:
                </div>
                <div className="text-amber-900">
                  {booking.travellerInfo.specialRequests}
                </div>
              </div>
            )}

            {/* Travellers List */}
            {booking.travellerInfo?.travellers &&
              booking.travellerInfo.travellers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Individual Travellers (
                    {booking.travellerInfo.travellers.length} Pax):
                  </div>
                  <div className="border rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-muted/50 border-b text-muted-foreground">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Age</th>
                          <th className="p-2.5">Gender</th>
                        </tr>
                      </thead>
                      <tbody>
                        {booking.travellerInfo.travellers.map(
                          (t: any, i: number) => (
                            <tr
                              key={i}
                              className="border-b last:border-0 hover:bg-muted/20"
                            >
                              <td className="p-2.5 text-muted-foreground">
                                {i + 1}
                              </td>
                              <td className="p-2.5 font-medium">
                                {t.name || '-'}
                              </td>
                              <td className="p-2.5">{t.age} years</td>
                              <td className="p-2.5 uppercase font-mono">
                                {t.gender}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>

          {/* Payment Transaction History & Progress */}
          {booking.bookingType === 'CUSTOMIZED' &&
            (() => {
              const finalAmount = booking.pricingDetails?.finalAmount || 0
              const totalPaid = (booking.transactions || []).reduce(
                (sum: number, t: any) => sum + t.amount,
                0,
              )
              const pendingAmount = Math.max(0, finalAmount - totalPaid)
              const percentagePaid =
                finalAmount > 0
                  ? Math.round((totalPaid / finalAmount) * 100)
                  : 0

              return (
                <div className="rounded-2xl border bg-card p-5 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span>💳</span> Payment Transaction History
                    </h3>
                    {finalAmount > 0 && (
                      <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        Progress: {percentagePaid}% Paid
                      </span>
                    )}
                  </div>

                  {/* Progress Stats Summary */}
                  {finalAmount > 0 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3 text-center bg-muted/20 p-3 rounded-xl border">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">
                            Total Amount
                          </div>
                          <div className="text-xs font-semibold text-primary">
                            ₹{finalAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold text-emerald-600">
                            Paid
                          </div>
                          <div className="text-xs font-semibold text-emerald-700">
                            ₹{totalPaid.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold text-amber-600">
                            Pending
                          </div>
                          <div className="text-xs font-semibold text-amber-700">
                            ₹{pendingAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, percentagePaid)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction list table */}
                  {booking.transactions && booking.transactions.length > 0 ? (
                    <div className="border rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b text-muted-foreground">
                          <tr>
                            <th className="p-2.5">Date</th>
                            <th className="p-2.5">Payment Mode</th>
                            <th className="p-2.5">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {booking.transactions.map((t: any, i: number) => (
                            <tr
                              key={i}
                              className="border-b last:border-0 hover:bg-muted/20"
                            >
                              <td className="p-2.5 whitespace-nowrap">
                                {formatDate(t.transactionDate)}
                              </td>
                              <td className="p-2.5 font-medium">
                                {t.paymentMode}
                              </td>
                              <td className="p-2.5 font-semibold text-emerald-700">
                                ₹{t.amount.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No payment transactions recorded yet.
                    </p>
                  )}

                  {/* Simplified Record Transaction Form */}
                  {['CANCELLED', 'ENQUIRY_CANCELLED'].includes(
                    booking.status,
                  ) ? (
                    <div className="bg-muted/50 border border-border text-muted-foreground p-3.5 rounded-xl text-xs font-medium flex items-center gap-1.5 justify-center">
                      <Lock size={13} /> Payments cannot be recorded for
                      cancelled bookings.
                    </div>
                  ) : pendingAmount > 0 ? (
                    <div className="bg-muted/20 p-4 rounded-xl border space-y-3">
                      <h4 className="text-xs font-bold text-foreground">
                        Record Payment Entry
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label
                            htmlFor="txAmount"
                            className="text-[10px] font-semibold text-muted-foreground"
                          >
                            Amount (₹) *
                          </Label>
                          <Input
                            id="txAmount"
                            type="number"
                            min={0.01}
                            max={pendingAmount}
                            step="any"
                            disabled={!userCanEdit}
                            placeholder={`Max: ₹${pendingAmount.toLocaleString('en-IN')}`}
                            value={txAmount}
                            onChange={(e) => setTxAmount(e.target.value)}
                            className="h-8 text-xs bg-background"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor="txMode"
                            className="text-[10px] font-semibold text-muted-foreground"
                          >
                            Payment Mode *
                          </Label>
                          <Select
                            value={txMode}
                            onValueChange={setTxMode}
                            disabled={!userCanEdit}
                          >
                            <SelectTrigger
                              id="txMode"
                              className="h-8 text-xs bg-background"
                              disabled={!userCanEdit}
                            >
                              <SelectValue placeholder="Mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UPI">UPI</SelectItem>
                              <SelectItem value="BANK_TRANSFER">
                                Bank Transfer
                              </SelectItem>
                              <SelectItem value="CASH">Cash</SelectItem>
                              <SelectItem value="ONLINE">Online</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        onClick={() => transactionMutation.mutate()}
                        disabled={
                          !userCanEdit ||
                          transactionMutation.isPending ||
                          !txAmount ||
                          Number(txAmount) <= 0 ||
                          Number(txAmount) > pendingAmount
                        }
                        className="w-full h-8 text-xs gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 size={12} />
                        {transactionMutation.isPending
                          ? 'Recording...'
                          : !userCanEdit
                            ? 'No Edit Permission'
                            : 'Record Payment'}
                      </Button>
                    </div>
                  ) : finalAmount > 0 ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 justify-center">
                      <span>✅</span> Package Fully Paid
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-xs flex items-center gap-1.5 justify-center">
                      <span>⚠️</span> Please set quotation amount to record
                      payments.
                    </div>
                  )}
                </div>
              )
            })()}

          {/* Status Audit History Timeline */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Status History Timeline
            </h3>

            {booking.statusHistory && booking.statusHistory.length > 0 ? (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                {booking.statusHistory.map((item: any, i: number) => (
                  <div key={i} className="relative space-y-1">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-semibold text-primary">
                        {item.fromStatus} → {item.toStatus}
                      </div>
                      <div className="text-muted-foreground">
                        {formatDateTime(item.createdAt)}
                      </div>
                    </div>
                    {item.notes && (
                      <div className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
                        {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No status changes recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Pricing & Actions */}
        <div className="space-y-6">
          {/* Pricing & Coupon Card */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" /> Pricing & Payment
            </h3>

            <div className="space-y-2 text-xs border-b pb-3">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Base Amount ({booking.travellerInfo?.numberOfPersons} Pax):
                </span>
                <span>
                  ₹
                  {booking.pricingDetails?.originalAmount?.toLocaleString(
                    'en-IN',
                  )}
                </span>
              </div>
              {booking.pricingDetails?.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon Discount:</span>
                  <span>
                    - ₹
                    {booking.pricingDetails.discountAmount.toLocaleString(
                      'en-IN',
                    )}
                  </span>
                </div>
              )}
              {booking.pricingDetails?.gstAmount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>GST ({booking.pricingDetails.gstPercentage}%):</span>
                  <span>
                    + ₹
                    {booking.pricingDetails.gstAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t">
                <span>Final Payable Amount:</span>
                <span>
                  ₹
                  {booking.pricingDetails?.finalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {booking.couponId && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs space-y-1">
                <div className="font-bold text-blue-800 flex items-center gap-1">
                  <Tag size={12} /> Coupon Applied:
                </div>
                <div className="font-mono text-blue-900 font-semibold">
                  {booking.couponId.couponCode}
                </div>
              </div>
            )}

            {booking.paymentSummary?.successfulPayments?.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Receipt size={13} className="text-primary" /> Receipt Vouchers
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {booking.paymentSummary.successfulPayments.length} Payment{booking.paymentSummary.successfulPayments.length > 1 ? 's' : ''}
                  </span>
                </div>
                {booking.paymentSummary.successfulPayments.map((p: any, idx: number) => (
                  <div key={idx} className="bg-muted/30 p-3 rounded-xl text-xs space-y-1.5 border">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        {p.stageLabel || `Stage ${p.stage || idx + 1}`}
                      </span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {p.receiptVoucherNumber && (
                      <div className="text-[11px]">
                        <span className="text-muted-foreground">RV: </span>
                        <span className="font-mono font-bold text-foreground">
                          {p.receiptVoucherNumber}
                        </span>
                      </div>
                    )}
                    {p.razorpayPaymentId && (
                      <div className="text-muted-foreground font-mono text-[10px] truncate">
                        ID: {p.razorpayPaymentId}
                      </div>
                    )}
                    <div className="pt-1.5 border-t flex justify-end">
                      <a
                        href={
                          p.paymentReceiptUrl ||
                          `${_axios.defaults.baseURL || '/api/V1'}/receipt-download/receipt/${p._id}?download=true`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        <FileText size={12} /> View Receipt Voucher
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : booking.paymentId ? (
              <div className="bg-muted/30 p-3.5 rounded-xl text-xs space-y-2 border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    Razorpay Payment Record:
                  </span>
                  <span className="font-bold text-green-700 text-[11px] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    {booking.paymentId.status}
                  </span>
                </div>
                {booking.paymentId.receiptVoucherNumber && (
                  <div className="text-[11px]">
                    <span className="text-muted-foreground">RV No.: </span>
                    <span className="font-mono font-bold text-foreground">
                      {booking.paymentId.receiptVoucherNumber}
                    </span>
                  </div>
                )}
                <div className="text-muted-foreground font-mono text-[11px] truncate">
                  Order ID: {booking.paymentId.razorpayOrderId}
                </div>
                {booking.paymentId.razorpayPaymentId && (
                  <div className="text-muted-foreground font-mono text-[11px] truncate">
                    Payment ID: {booking.paymentId.razorpayPaymentId}
                  </div>
                )}
                <div className="pt-1.5 border-t flex justify-end">
                  <a
                    href={
                      booking.paymentId.paymentReceiptUrl ||
                      `${_axios.defaults.baseURL || '/api/V1'}/receipt-download/receipt/${booking.paymentId._id || booking.paymentId}?download=true`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <FileText size={13} /> View / Download Receipt Voucher
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          {/* Quotation Manager (For Customized Packages) */}
          {booking.bookingType === 'CUSTOMIZED' &&
            (() => {
              const hasTransactions =
                booking.transactions && booking.transactions.length > 0
              const isQuotationLocked =
                hasTransactions ||
                isTerminalStatus ||
                isCancellationRequested ||
                !userCanEdit

              return (
                <div className="rounded-2xl border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" /> Prepare
                      Quotation
                    </h3>
                    {(hasTransactions || isTerminalStatus) && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  {hasTransactions && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs space-y-1">
                      <p className="font-semibold flex items-center gap-1">
                        <span>⚠️</span> Price Locked
                      </p>
                      <p>
                        The final package amount cannot be edited because
                        payment transactions have already been recorded.
                      </p>
                    </div>
                  )}

                  {isTerminalStatus && !hasTransactions && (
                    <div className="bg-muted/50 border border-border text-muted-foreground p-3 rounded-xl text-xs space-y-1">
                      <p className="font-semibold flex items-center gap-1 text-foreground">
                        <Lock className="w-3.5 h-3.5" /> Quotation Locked
                      </p>
                      <p className="text-[11px]">
                        Quotation cannot be edited because this booking is{' '}
                        {booking.status.replace(/_/g, ' ')}.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="quoteAmount"
                        className="text-xs font-semibold"
                      >
                        Quotation Amount (₹) *
                      </Label>
                      <Input
                        id="quoteAmount"
                        type="number"
                        min={1}
                        disabled={isQuotationLocked}
                        placeholder="e.g. 45000"
                        value={quoteAmount}
                        onChange={(e) => setQuoteAmount(e.target.value)}
                        className="h-9 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="quoteNotes"
                        className="text-xs font-semibold"
                      >
                        Quotation Notes / Terms
                      </Label>
                      <Textarea
                        id="quoteNotes"
                        rows={3}
                        disabled={isQuotationLocked}
                        placeholder="Include flight details, hotel categories, inclusions..."
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        className="text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    <Button
                      onClick={() => quotationMutation.mutate()}
                      disabled={
                        quotationMutation.isPending ||
                        !quoteAmount ||
                        isQuotationLocked
                      }
                      className="w-full h-9 text-xs gap-1.5 cursor-pointer bg-purple-700 hover:bg-purple-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 size={14} />
                      {quotationMutation.isPending
                        ? 'Saving...'
                        : isTerminalStatus
                          ? 'Quotation Locked'
                          : !userCanEdit
                            ? 'No Edit Permission'
                            : 'Save & Share Quotation'}
                    </Button>
                  </div>
                </div>
              )
            })()}

          {/* Booking Status Manager */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Update Booking Status
              </h3>
              {/* {isTerminalStatus && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                  <Lock className="w-3 h-3" /> Status Finalized
                </span>
              )} */}
              {isCancellationRequested && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  <RotateCcw className="w-3 h-3" /> Review Pending
                </span>
              )}
            </div>

            {isCancellationRequested && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Cancellation Request Pending
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  This booking has an open cancellation request awaiting review.
                  Please use the <strong>Review &amp; Settle Refund</strong>{' '}
                  button above to approve or reject the request.
                </p>
              </div>
            )}

            {!userCanEdit && !isTerminalStatus && !isCancellationRequested && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-center gap-1.5">
                <ShieldAlert size={14} className="shrink-0" />
                <span>
                  You have view-only access. You cannot update the status of
                  this booking.
                </span>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-semibold">
                  Select New Status *
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  disabled={isStatusLocked}
                >
                  <SelectTrigger
                    id="status"
                    className="h-9 text-xs bg-background disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isStatusLocked}
                  >
                    <SelectValue placeholder="Choose status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="statusNotes" className="text-xs font-semibold">
                  Status Change Notes
                </Label>
                <Textarea
                  id="statusNotes"
                  rows={2}
                  placeholder="Reason for status change or internal notes..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isStatusLocked}
                />
              </div>

              <Button
                onClick={() => statusMutation.mutate()}
                disabled={
                  isStatusLocked ||
                  statusMutation.isPending ||
                  !selectedStatus ||
                  selectedStatus === booking.status
                }
                className="w-full h-9 text-xs gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {statusMutation.isPending ? (
                  'Updating...'
                ) : isTerminalStatus ? (
                  <>
                    <Lock size={14} /> Update Status
                  </>
                ) : isCancellationRequested ? (
                  <>
                    <RotateCcw size={14} /> Cancellation Pending Review
                  </>
                ) : !userCanEdit ? (
                  'View Only (No Permission)'
                ) : (
                  'Update Status'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
