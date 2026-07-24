import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { ArrowLeft, User, Phone, Mail, Calendar, Sparkles, Tag, CheckCircle2, Clock, DollarSign, FileText } from 'lucide-react'
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
  validateSearch: (search: Record<string, unknown>) => {
    return {
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

function BookingDetailsComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Quotation form state
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')

  // Status update state
  const [selectedStatus, setSelectedStatus] = useState('')
  const [statusNotes, setStatusNotes] = useState('')

  // Record transaction form state
  const [txAmount, setTxAmount] = useState('')
  const [txMode, setTxMode] = useState('UPI')

  const { data: bookingData, isLoading, isError } = useQuery({
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
        <Button variant="outline" onClick={() => navigate({ to: '/bookings' })}>
          Back to Bookings
        </Button>
      </div>
    )
  }

  const booking = bookingData
  const availableStatuses = booking.bookingType === 'CUSTOMIZED' ? CUSTOMIZED_STATUSES : STANDARD_STATUSES

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
            onClick={() => navigate({ to: '/bookings' })}
            className="cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono text-primary">{booking.bookingNumber}</h1>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border inline-flex items-center gap-1 ${
                  booking.bookingType === 'CUSTOMIZED'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {booking.bookingType === 'CUSTOMIZED' ? <Sparkles size={12} /> : <Tag size={12} />}
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
        {/* LEFT COLUMN: Customer Info & Package Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Package Info */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>📦</span> Package Details
            </h3>
            <div className="bg-muted/30 p-4 rounded-xl space-y-2 border">
              <div className="text-base font-bold text-primary">{booking.packageId?.title || 'Tour Package'}</div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div>📍 Destination: <strong className="text-foreground">{booking.packageId?.destination}</strong></div>
                <div>🗓 Duration: <strong className="text-foreground">{booking.packageId?.days}D / {booking.packageId?.nights}N</strong></div>
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
                <div className="text-muted-foreground flex items-center gap-1">Primary Contact Name:</div>
                <div className="font-semibold text-sm mt-0.5">{booking.travellerInfo?.fullName}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Phone size={12} /> Mobile Number:
                </div>
                <div className="font-mono font-semibold text-sm mt-0.5">{booking.travellerInfo?.mobileNumber}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Mail size={12} /> Email Address:
                </div>
                <div className="font-semibold text-sm mt-0.5">{booking.travellerInfo?.email}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} /> Travel Date & Style:
                </div>
                <div className="font-semibold text-sm mt-0.5">
                  {formatDate(booking.travellerInfo?.travelDate)} ({booking.travellerInfo?.travelType})
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
            {booking.travellerInfo?.travellers && booking.travellerInfo.travellers.length > 0 && (
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

          {/* Payment Transaction History & Progress */}
          {booking.bookingType === 'CUSTOMIZED' && (() => {
            const finalAmount = booking.pricingDetails?.finalAmount || 0
            const totalPaid = (booking.transactions || [])
              .reduce((sum: number, t: any) => sum + t.amount, 0)
            const pendingAmount = Math.max(0, finalAmount - totalPaid)
            const percentagePaid = finalAmount > 0 ? Math.round((totalPaid / finalAmount) * 100) : 0

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
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Total Amount</div>
                        <div className="text-xs font-semibold text-primary">₹{finalAmount.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold text-emerald-600">Paid</div>
                        <div className="text-xs font-semibold text-emerald-700">₹{totalPaid.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold text-amber-600">Pending</div>
                        <div className="text-xs font-semibold text-amber-700">₹{pendingAmount.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, percentagePaid)}%` }}
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
                          <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                            <td className="p-2.5 whitespace-nowrap">{formatDate(t.transactionDate)}</td>
                            <td className="p-2.5 font-medium">{t.paymentMode}</td>
                            <td className="p-2.5 font-semibold text-emerald-700">₹{t.amount.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No payment transactions recorded yet.</p>
                )}

                {/* Simplified Record Transaction Form */}
                {pendingAmount > 0 ? (
                  <div className="bg-muted/20 p-4 rounded-xl border space-y-3">
                    <h4 className="text-xs font-bold text-foreground">Record Payment Entry</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="txAmount" className="text-[10px] font-semibold text-muted-foreground">Amount (₹) *</Label>
                        <Input
                          id="txAmount"
                          type="number"
                          min={0.01}
                          max={pendingAmount}
                          step="any"
                          placeholder={`Max: ₹${pendingAmount.toLocaleString('en-IN')}`}
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="txMode" className="text-[10px] font-semibold text-muted-foreground">Payment Mode *</Label>
                        <Select value={txMode} onValueChange={setTxMode}>
                          <SelectTrigger id="txMode" className="h-8 text-xs bg-background">
                            <SelectValue placeholder="Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UPI">UPI</SelectItem>
                            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="ONLINE">Online</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      onClick={() => transactionMutation.mutate()}
                      disabled={transactionMutation.isPending || !txAmount || Number(txAmount) <= 0 || Number(txAmount) > pendingAmount}
                      className="w-full h-8 text-xs gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 size={12} />
                      {transactionMutation.isPending ? 'Recording...' : 'Record Payment'}
                    </Button>
                  </div>
                ) : finalAmount > 0 ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 justify-center">
                    <span>✅</span> Package Fully Paid
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-xs flex items-center gap-1.5 justify-center">
                    <span>⚠️</span> Please set quotation amount to record payments.
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
                      <div className="text-muted-foreground">{formatDateTime(item.createdAt)}</div>
                    </div>
                    {item.notes && <div className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">{item.notes}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No status changes recorded yet.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Pricing & Actions */}
        <div className="space-y-6">
          {/* Pricing & Coupon Card */}
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
                <div className="font-mono text-blue-900 font-semibold">{booking.couponId.couponCode}</div>
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

          {/* Quotation Manager (For Customized Packages) */}
          {booking.bookingType === 'CUSTOMIZED' && (() => {
            const hasTransactions = booking.transactions && booking.transactions.length > 0
            return (
              <div className="rounded-2xl border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" /> Prepare Quotation
                </h3>

                {hasTransactions && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <span>⚠️</span> Price Locked
                    </p>
                    <p>The final package amount cannot be edited because payment transactions have already been recorded.</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="quoteAmount" className="text-xs font-semibold">Quotation Amount (₹) *</Label>
                    <Input
                      id="quoteAmount"
                      type="number"
                      min={1}
                      disabled={hasTransactions}
                      placeholder="e.g. 45000"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="quoteNotes" className="text-xs font-semibold">Quotation Notes / Terms</Label>
                    <Textarea
                      id="quoteNotes"
                      rows={3}
                      disabled={hasTransactions}
                      placeholder="Include flight details, hotel categories, inclusions..."
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <Button
                    onClick={() => quotationMutation.mutate()}
                    disabled={quotationMutation.isPending || !quoteAmount || hasTransactions}
                    className="w-full h-9 text-xs gap-1.5 cursor-pointer bg-purple-700 hover:bg-purple-800 text-white"
                  >
                    <CheckCircle2 size={14} />
                    {quotationMutation.isPending ? 'Saving...' : 'Save & Share Quotation'}
                  </Button>
                </div>
              </div>
            )
          })()}

          {/* Booking Status Manager */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Update Booking Status
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-semibold">Select New Status *</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="status" className="h-9 text-xs bg-background">
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
                <Label htmlFor="statusNotes" className="text-xs font-semibold">Status Change Notes</Label>
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
