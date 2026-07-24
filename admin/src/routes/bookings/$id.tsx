import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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
  DollarSign,
  FileText,
  Lock,
  Plus,
  IndianRupee,
  Receipt,
  TrendingUp,
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

export const Route = createFileRoute('/bookings/$id')({
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
]

const PAYMENT_METHODS = [
  { value: 'CASH', label: '💵 Cash' },
  { value: 'UPI', label: '📲 UPI' },
  { value: 'BANK_TRANSFER', label: '🏦 Bank Transfer / NEFT / RTGS' },
  { value: 'CHEQUE', label: '📄 Cheque' },
  { value: 'OTHER', label: '🔄 Other' },
]

function BookingDetailsComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Quotation form state
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [quoteValidUntil, setQuoteValidUntil] = useState('')

  // Status update state
  const [selectedStatus, setSelectedStatus] = useState('')
  const [statusNotes, setStatusNotes] = useState('')

  // Final Package Amount state
  const [finalAmountInput, setFinalAmountInput] = useState('')

  // Add Transaction form state
  const [txnAmount, setTxnAmount] = useState('')
  const [txnMethod, setTxnMethod] = useState('')
  const [txnRef, setTxnRef] = useState('')
  const [txnNotes, setTxnNotes] = useState('')

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

  // Quotation Mutation
  const quotationMutation = useMutation({
    mutationFn: async () =>
      _axios.patch(`/booking/admin/${id}/quotation`, {
        amount: Number(quoteAmount),
        notes: quoteNotes,
        validUntil: quoteValidUntil || undefined,
      }),
    onSuccess: () => {
      toast.success('Quotation updated and shared successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings-customized'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to update quotation')
    },
  })

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: async () =>
      _axios.patch(`/booking/admin/${id}/status`, {
        status: selectedStatus,
        notes: statusNotes,
      }),
    onSuccess: () => {
      toast.success('Booking status updated successfully!')
      setStatusNotes('')
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings-customized'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to update status')
    },
  })

  // Final Package Amount Mutation
  const finalAmountMutation = useMutation({
    mutationFn: async () =>
      _axios.patch(`/booking/admin/${id}/final-amount`, {
        finalPackageAmount: Number(finalAmountInput),
      }),
    onSuccess: () => {
      toast.success('Final package amount saved!')
      setFinalAmountInput('')
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings-customized'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to save final amount')
    },
  })

  // Add Transaction Mutation
  const addTransactionMutation = useMutation({
    mutationFn: async () =>
      _axios.post(`/booking/admin/${id}/transactions`, {
        amount: Number(txnAmount),
        method: txnMethod,
        referenceNumber: txnRef || undefined,
        notes: txnNotes || undefined,
      }),
    onSuccess: (res) => {
      const d = res.data?.data
      toast.success(
        d
          ? `₹${Number(txnAmount).toLocaleString('en-IN')} recorded. Balance: ₹${d.balance.toLocaleString('en-IN')}`
          : 'Payment transaction recorded!'
      )
      setTxnAmount('')
      setTxnMethod('')
      setTxnRef('')
      setTxnNotes('')
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings-customized'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to record transaction')
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
        <p className="text-muted-foreground">Booking record could not be found.</p>
        <Button
          variant="outline"
          onClick={() =>
            navigate({
              to:
                bookingData?.bookingType === 'CUSTOMIZED'
                  ? '/bookings/customized'
                  : '/bookings/standard',
            })
          }
        >
          Back to Bookings
        </Button>
      </div>
    )
  }

  const booking = bookingData
  const availableStatuses =
    booking.bookingType === 'CUSTOMIZED' ? CUSTOMIZED_STATUSES : STANDARD_STATUSES
  const isCustomized = booking.bookingType === 'CUSTOMIZED'
  const transactions: any[] = booking.paymentTransactions ?? []
  const hasTransactions = transactions.length > 0
  const totalPaid = transactions.reduce((s: number, t: any) => s + (t.amount ?? 0), 0)
  const balance =
    booking.finalPackageAmount !== undefined
      ? booking.finalPackageAmount - totalPaid
      : null

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate({
                to: isCustomized ? '/bookings/customized' : '/bookings/standard',
              })
            }
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
                  isCustomized
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {isCustomized ? <Sparkles size={12} /> : <Tag size={12} />}
                {booking.bookingType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Created on {formatDateTime(booking.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Status:</span>
          <span className="text-xs px-3 py-1 rounded-full font-semibold border bg-blue-50 text-blue-700 border-blue-200">
            {booking.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          {/* Package Info */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>📦</span> Package Details
            </h3>
            <div className="bg-muted/30 p-4 rounded-xl space-y-2 border">
              <div className="text-base font-bold text-primary">
                {booking.packageId?.title || 'Tour Package'}
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div>
                  📍 Destination:{' '}
                  <strong className="text-foreground">{booking.packageId?.destination}</strong>
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
              <User className="w-4 h-4 text-primary" /> Contact & Traveller Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-muted/20 p-4 rounded-xl border">
              <div>
                <div className="text-muted-foreground">Primary Contact Name:</div>
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
                <div className="font-semibold text-sm mt-0.5">
                  {formatDate(booking.travellerInfo?.travelDate)} (
                  {booking.travellerInfo?.travelType})
                </div>
              </div>
            </div>

            {booking.travellerInfo?.specialRequests && (
              <div className="bg-amber-50/50 border border-amber-200 p-3.5 rounded-xl text-xs space-y-1">
                <div className="font-semibold text-amber-800 flex items-center gap-1">
                  <span>📌</span> Special Requests:
                </div>
                <div className="text-amber-900">{booking.travellerInfo.specialRequests}</div>
              </div>
            )}

            {/* Travellers List */}
            {booking.travellerInfo?.travellers &&
              booking.travellerInfo.travellers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Individual Travellers ({booking.travellerInfo.travellers.length} Pax):
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
                        {booking.travellerInfo.travellers.map((t: any, i: number) => (
                          <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                            <td className="p-2.5 text-muted-foreground">{i + 1}</td>
                            <td className="p-2.5 font-medium">{t.name || '-'}</td>
                            <td className="p-2.5">{t.age} years</td>
                            <td className="p-2.5 uppercase font-mono">{t.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>

          {/* ── CUSTOMIZED: Payment Transactions Panel ── */}
          {isCustomized && (
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-purple-600" /> Payment Transactions
                </h3>
                {booking.finalPackageAmount && (
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex flex-col items-end">
                      <span className="text-muted-foreground">Package Amount</span>
                      <span className="font-bold text-sm text-foreground">
                        ₹{booking.finalPackageAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-muted-foreground">Paid</span>
                      <span className="font-bold text-sm text-green-700">
                        ₹{totalPaid.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {balance !== null && (
                      <div className="flex flex-col items-end">
                        <span className="text-muted-foreground">Balance Due</span>
                        <span
                          className={`font-bold text-sm ${balance > 0 ? 'text-amber-600' : 'text-green-600'}`}
                        >
                          ₹{balance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {booking.finalPackageAmount && booking.finalPackageAmount > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Payment progress</span>
                    <span>
                      {Math.min(100, Math.round((totalPaid / booking.finalPackageAmount) * 100))}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-green-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (totalPaid / booking.finalPackageAmount) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Transactions table */}
              {hasTransactions ? (
                <div className="border rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b text-muted-foreground">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5">Method</th>
                        <th className="p-2.5">Reference</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t: any, i: number) => (
                        <tr key={t._id || i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="p-2.5 text-muted-foreground">{i + 1}</td>
                          <td className="p-2.5 font-mono whitespace-nowrap">
                            {formatDateTime(t.recordedAt)}
                          </td>
                          <td className="p-2.5 font-bold text-green-700">
                            ₹{t.amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
                              {t.method}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono text-muted-foreground">
                            {t.referenceNumber || '—'}
                          </td>
                          <td className="p-2.5 text-muted-foreground max-w-[140px] truncate">
                            {t.notes || '—'}
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
            </div>
          )}

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
                      <div className="text-muted-foreground">{formatDateTime(item.createdAt)}</div>
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

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Pricing & Payment */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" /> Pricing & Payment
            </h3>

            <div className="space-y-2 text-xs border-b pb-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Base Amount ({booking.travellerInfo?.numberOfPersons} Pax):</span>
                <span>₹{booking.pricingDetails?.originalAmount?.toLocaleString('en-IN')}</span>
              </div>
              {booking.pricingDetails?.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon Discount:</span>
                  <span>- ₹{booking.pricingDetails.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t">
                <span>Final Payable Amount:</span>
                <span>₹{booking.pricingDetails?.finalAmount?.toLocaleString('en-IN')}</span>
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

            {booking.paymentId && (
              <div className="bg-muted/30 p-3 rounded-xl text-xs space-y-1.5 border">
                <div className="font-semibold text-foreground">Razorpay Payment Record:</div>
                <div className="text-muted-foreground font-mono text-[11px] truncate">
                  Order ID: {booking.paymentId.razorpayOrderId}
                </div>
                {booking.paymentId.razorpayPaymentId && (
                  <div className="text-muted-foreground font-mono text-[11px] truncate">
                    Payment ID: {booking.paymentId.razorpayPaymentId}
                  </div>
                )}
                <div className="flex items-center gap-1 text-[11px]">
                  <span>Status:</span>
                  <span className="font-bold text-green-700">{booking.paymentId.status}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── CUSTOMIZED: Final Package Amount Panel ── */}
          {isCustomized && (
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-purple-600" /> Final Package Amount
                {hasTransactions && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </h3>

              {booking.finalPackageAmount && (
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs">
                  <div className="text-purple-700 font-semibold text-base">
                    ₹{booking.finalPackageAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-purple-500 text-[10px] mt-0.5">
                    Confirmed package price
                  </div>
                </div>
              )}

              {hasTransactions ? (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  The final package amount is locked because payment transactions have already been
                  recorded.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="finalAmount" className="text-xs font-semibold">
                      {booking.finalPackageAmount
                        ? 'Update Package Amount (₹)'
                        : 'Set Final Amount (₹) *'}
                    </Label>
                    <Input
                      id="finalAmount"
                      type="number"
                      min={1}
                      placeholder="e.g. 45000"
                      value={finalAmountInput}
                      onChange={(e) => setFinalAmountInput(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <Button
                    onClick={() => finalAmountMutation.mutate()}
                    disabled={finalAmountMutation.isPending || !finalAmountInput || Number(finalAmountInput) <= 0}
                    className="w-full h-9 text-xs gap-1.5 cursor-pointer bg-purple-700 hover:bg-purple-800 text-white"
                  >
                    <CheckCircle2 size={14} />
                    {finalAmountMutation.isPending
                      ? 'Saving...'
                      : booking.finalPackageAmount
                        ? 'Update Amount'
                        : 'Confirm Final Amount'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── CUSTOMIZED: Add Transaction Panel ── */}
          {isCustomized && (
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" /> Record Payment
              </h3>

              {!booking.finalPackageAmount ? (
                <p className="text-xs text-muted-foreground italic">
                  Set the final package amount above before recording payment transactions.
                </p>
              ) : balance !== null && balance <= 0 ? (
                <div className="bg-green-50 border border-green-200 p-3 rounded-xl text-xs text-green-700 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Full payment received! No balance remaining.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="txnAmount" className="text-xs font-semibold">
                      Amount Received (₹) *
                    </Label>
                    <Input
                      id="txnAmount"
                      type="number"
                      min={1}
                      max={balance ?? undefined}
                      placeholder={balance !== null ? `Max ₹${balance.toLocaleString('en-IN')}` : 'Amount'}
                      value={txnAmount}
                      onChange={(e) => setTxnAmount(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="txnMethod" className="text-xs font-semibold">
                      Payment Method *
                    </Label>
                    <Select value={txnMethod} onValueChange={setTxnMethod}>
                      <SelectTrigger id="txnMethod" className="h-9 text-xs bg-background cursor-pointer">
                        <SelectValue placeholder="Select method..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value} className="cursor-pointer text-xs">
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="txnRef" className="text-xs font-semibold">
                      Reference Number (Optional)
                    </Label>
                    <Input
                      id="txnRef"
                      type="text"
                      placeholder="UTR / Cheque No / Transaction ID"
                      value={txnRef}
                      onChange={(e) => setTxnRef(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="txnNotes" className="text-xs font-semibold">
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="txnNotes"
                      rows={2}
                      placeholder="Any additional notes about this payment..."
                      value={txnNotes}
                      onChange={(e) => setTxnNotes(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <Button
                    onClick={() => addTransactionMutation.mutate()}
                    disabled={
                      addTransactionMutation.isPending ||
                      !txnAmount ||
                      Number(txnAmount) <= 0 ||
                      !txnMethod
                    }
                    className="w-full h-9 text-xs gap-1.5 cursor-pointer bg-green-700 hover:bg-green-800 text-white"
                  >
                    <TrendingUp size={14} />
                    {addTransactionMutation.isPending ? 'Recording...' : 'Record Payment'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Quotation Manager (For Customized Packages) */}
          {isCustomized && (
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" /> Prepare Quotation
              </h3>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="quoteAmount" className="text-xs font-semibold">
                    Quotation Amount (₹) *
                  </Label>
                  <Input
                    id="quoteAmount"
                    type="number"
                    min={1}
                    placeholder="e.g. 45000"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="quoteValidUntil" className="text-xs font-semibold">
                    Valid Until (Optional)
                  </Label>
                  <Input
                    id="quoteValidUntil"
                    type="date"
                    value={quoteValidUntil}
                    onChange={(e) => setQuoteValidUntil(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="quoteNotes" className="text-xs font-semibold">
                    Quotation Notes / Terms
                  </Label>
                  <Textarea
                    id="quoteNotes"
                    rows={3}
                    placeholder="Include flight details, hotel categories, inclusions..."
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <Button
                  onClick={() => quotationMutation.mutate()}
                  disabled={quotationMutation.isPending || !quoteAmount}
                  className="w-full h-9 text-xs gap-1.5 cursor-pointer bg-purple-700 hover:bg-purple-800 text-white"
                >
                  <CheckCircle2 size={14} />
                  {quotationMutation.isPending ? 'Saving...' : 'Save & Share Quotation'}
                </Button>
              </div>
            </div>
          )}

          {/* Booking Status Manager */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Update Booking Status
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-semibold">
                  Select New Status *
                </Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="status" className="h-9 text-xs bg-background cursor-pointer">
                    <SelectValue placeholder="Choose status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((st) => (
                      <SelectItem key={st} value={st} className="cursor-pointer">
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
                  className="text-xs"
                />
              </div>

              <Button
                onClick={() => statusMutation.mutate()}
                disabled={statusMutation.isPending || !selectedStatus}
                className="w-full h-9 text-xs gap-1.5 cursor-pointer"
              >
                {statusMutation.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
