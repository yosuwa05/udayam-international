import { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { toast } from 'sonner'
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Building2,
  Receipt,
  Check,
  X,
  Loader2,
  ExternalLink,
  CreditCard,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePermissions } from '@/lib/usePermissions'

export const Route = createFileRoute('/bookings/cancellations/$id')({
  component: CancellationRequestDetailComponent,
})

function CancellationRequestDetailComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { canEdit } = usePermissions()
  const userCanEdit = canEdit('/bookings/cancellations')

  const [activeTab, setActiveTab] = useState<'APPROVE' | 'REJECT'>('APPROVE')

  // Approval Form State
  const [refundAmount, setRefundAmount] = useState<string>('')
  const [paymentMode, setPaymentMode] = useState<string>('BANK_TRANSFER')
  const [transactionReference, setTransactionReference] = useState<string>('')
  const [refundDate, setRefundDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [adminNotes, setAdminNotes] = useState<string>('')

  // Rejection Form State
  const [rejectionReason, setRejectionReason] = useState<string>('')

  // Fetch cancellation request detail
  const {
    data: request,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-cancellation-detail', id],
    queryFn: async () => {
      const res = await _axios.get(`/booking/admin/cancellation-requests/${id}`)
      return res.data?.data
    },
    enabled: !!id,
  })

  // Pre-fill default refund amount once data is loaded
  useEffect(() => {
    if (request && refundAmount === '' && request.status === 'PENDING') {
      setRefundAmount(String(request.totalPaidAmount || 0))
    }
  }, [request, refundAmount])

  // Mutation to process request (Accept/Reject)
  const processMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await _axios.post(
        `/booking/admin/cancellation-requests/${id}/process`,
        payload
      )
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Cancellation request processed successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-cancellation-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin-cancellation-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail'] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to process cancellation request')
    },
  })

  const handleApprove = () => {
    const num = Number(refundAmount)
    if (isNaN(num) || num < 0) {
      toast.error('Please enter a valid refund amount')
      return
    }
    if (num > (request?.totalPaidAmount || 0)) {
      toast.error(
        `Refund amount cannot exceed total paid amount (₹${(request?.totalPaidAmount || 0).toLocaleString('en-IN')})`
      )
      return
    }

    processMutation.mutate({
      action: 'ACCEPT',
      refundAmount: num,
      paymentMode,
      transactionReference: transactionReference.trim() || undefined,
      refundDate,
      adminNotes: adminNotes.trim() || undefined,
    })
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for declining the cancellation request')
      return
    }

    processMutation.mutate({
      action: 'REJECT',
      rejectionReason: rejectionReason.trim(),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading cancellation request...</p>
      </div>
    )
  }

  if (isError || !request) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm font-semibold text-rose-600">
          Cancellation request not found or failed to load.
        </p>
        <Link to="/bookings/cancellations">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" /> Back to Cancellation Requests
          </Button>
        </Link>
      </div>
    )
  }

  const isPending = request.status === 'PENDING'
  const isCompleted = request.status === 'COMPLETED'
  const isRejected = request.status === 'REJECTED'

  const totalBookingPrice = Number(request.totalBookingAmount || 0)
  const totalPaidAmount = Number(request.totalPaidAmount || 0)
  const remainingBalance = Math.max(0, totalBookingPrice - totalPaidAmount)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link to="/bookings/cancellations">
            <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono text-primary">
                {request.bookingNumber}
              </h1>
              <Badge
                variant="outline"
                className={`text-[10px] uppercase font-bold ${
                  request.bookingType === 'CUSTOMIZED'
                    ? 'border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-950/20'
                    : 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/20'
                }`}
              >
                {request.bookingType}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Requested on{' '}
              {request.createdAt
                ? new Date(request.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Status:</span>
          {isPending && (
            <Badge className="bg-amber-100 text-amber-900 border-amber-300 px-3 py-1 text-xs font-bold">
              Pending Review
            </Badge>
          )}
          {isCompleted && (
            <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 px-3 py-1 text-xs font-bold">
              Cancelled &amp; Refund Settled
            </Badge>
          )}
          {isRejected && (
            <Badge className="bg-rose-100 text-rose-900 border-rose-300 px-3 py-1 text-xs font-bold">
              Declined
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =================================================================== */}
        {/* LEFT COLUMN: Booking Details, Customer, Reason, Payment History     */}
        {/* =================================================================== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Cancellation Reason Card */}
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  Customer Cancellation Reason
                </h3>
              </div>
              <Badge variant="outline" className="text-xs border-amber-300 text-amber-800 bg-amber-100/50">
                {request.reasonCategory || 'General Emergency'}
              </Badge>
            </div>
            <div className="bg-card p-4 rounded-xl border border-amber-200/70 dark:border-amber-900/30 text-sm font-medium text-foreground">
              "{request.reason}"
            </div>
            {request.userNotes && (
              <p className="text-xs text-muted-foreground italic px-1">
                Additional payout / user notes: <strong>{request.userNotes}</strong>
              </p>
            )}
          </div>

          {/* Customer Contact & Package Info in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="bg-card border border-border p-4 rounded-2xl space-y-2 shadow-xs">
              <div className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary">
                <User className="h-4 w-4" /> Customer Information
              </div>
              <div className="text-xs space-y-1 pt-1">
                <p className="text-foreground">
                  <span className="text-muted-foreground">Name:</span>{' '}
                  <strong>{request.userId?.fullName || 'N/A'}</strong>
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Phone:</span>{' '}
                  <strong>{request.userId?.mobile || 'N/A'}</strong>
                </p>
                <p className="text-foreground truncate" title={request.userId?.email}>
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <strong>{request.userId?.email || 'N/A'}</strong>
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Travellers:</span>{' '}
                  <strong>{request.bookingId?.travellerInfo?.numberOfPersons || 1} Pax</strong>
                </p>
              </div>
            </div>

            {/* Tour Package Details */}
            <div className="bg-card border border-border p-4 rounded-2xl space-y-2 shadow-xs">
              <div className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary">
                <Building2 className="h-4 w-4" /> Tour Package Details
              </div>
              <div className="text-xs space-y-1 pt-1">
                <p className="text-foreground font-semibold truncate" title={request.packageId?.title}>
                  {request.packageId?.title || 'Tour Package'}
                </p>
                <p className="text-muted-foreground">
                  <span>Destination:</span> <strong>{request.packageId?.destination || 'N/A'}</strong>
                </p>
                <p className="text-muted-foreground">
                  <span>Package Type:</span> <strong>{request.packageId?.packageType || 'N/A'}</strong>
                </p>
                <div className="pt-1">
                  <Link
                    to="/bookings/$id"
                    params={{ id: request.bookingId?._id || request.bookingId }}
                    search={{ type: request.bookingType === 'CUSTOMIZED' ? 'customized' : 'standard' }}
                    className="text-primary hover:underline inline-flex items-center gap-1 font-semibold text-xs"
                    target="_blank"
                  >
                    Open Booking Details <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Transaction History Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs space-y-3 p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-primary" /> Customer Payment Transaction Records
              </h3>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Total Paid: ₹{totalPaidAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              {request.bookingId?.bookingType === 'CUSTOMIZED' ? (
                // Customized offline transactions
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Payment Mode</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.bookingId?.transactions && request.bookingId.transactions.length > 0 ? (
                      request.bookingId.transactions.map((tx: any, idx: number) => (
                        <tr key={idx} className="border-b border-border last:border-0">
                          <td className="p-3">
                            {new Date(tx.transactionDate || tx.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="p-3 font-semibold">{tx.paymentMode}</td>
                          <td className="p-3 text-right font-bold text-emerald-600">
                            ₹{Number(tx.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-muted-foreground">{tx.notes || '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          No transactions recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                // Standard online payments
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Payment / Order ID</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.bookingId?.payments && request.bookingId.payments.length > 0 ? (
                      request.bookingId.payments.map((p: any, idx: number) => (
                        <tr key={idx} className="border-b border-border last:border-0">
                          <td className="p-3 text-muted-foreground">
                            {new Date(p.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            {p.razorpayPaymentId || p.razorpayOrderId || p._id}
                          </td>
                          <td className="p-3">
                            <Badge
                              className={
                                p.status === 'SUCCESS'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-muted text-muted-foreground'
                              }
                            >
                              {p.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right font-bold text-emerald-600">
                            ₹{Number(p.amount || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          Total paid recorded: ₹{totalPaidAmount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: Financial Summary & Admin Resolution Form            */}
        {/* =================================================================== */}
        <div className="space-y-6">
          {/* Financial Breakdown Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary">
              <CreditCard className="h-4 w-4" /> Booking Financial Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Final Package Amount</span>
                <span className="font-bold text-foreground">
                  ₹{totalBookingPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Total Paid Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  ₹{totalPaidAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Unpaid / Balance</span>
                <span className="font-bold text-amber-600">
                  ₹{remainingBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* Admin Resolution Section                                          */}
          {/* ================================================================= */}
          {isPending ? (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider">
                  Admin Resolution &amp; Settlement
                </h3>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant={activeTab === 'APPROVE' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('APPROVE')}
                    className="text-xs h-7 px-2.5"
                  >
                    <Check className="h-3 w-3 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTab === 'REJECT' ? 'destructive' : 'outline'}
                    onClick={() => setActiveTab('REJECT')}
                    className="text-xs h-7 px-2.5"
                  >
                    <X className="h-3 w-3 mr-1" /> Decline
                  </Button>
                </div>
              </div>

              {activeTab === 'APPROVE' ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-900/40 text-[11px] leading-relaxed">
                    💡 <strong>Offline Refund Processing:</strong> Calculate the refund per cancellation terms. Transfer the amount manually via bank or UPI, then record the settlement details below. Confirming marks the booking as <strong>CANCELLED</strong> and payment as <strong>REFUNDED</strong>.
                  </div>

                  {/* Preset helpers */}
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                      Quick Percentage Calculation:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => setRefundAmount(String(totalPaidAmount))}
                      >
                        100% (₹{totalPaidAmount.toLocaleString('en-IN')})
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => setRefundAmount(String(Math.round(totalPaidAmount * 0.75)))}
                      >
                        75% (₹{Math.round(totalPaidAmount * 0.75).toLocaleString('en-IN')})
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => setRefundAmount(String(Math.round(totalPaidAmount * 0.5)))}
                      >
                        50% (₹{Math.round(totalPaidAmount * 0.5).toLocaleString('en-IN')})
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => setRefundAmount('0')}
                      >
                        0% (No Refund)
                      </Button>
                    </div>
                  </div>

                  {/* Refund Amount Input & Deduction */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Refund Amount to Pay User (₹) *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max={totalPaidAmount}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="Enter refund amount"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Deduction / Cancellation Charge
                      </label>
                      <div className="h-9 px-3 flex items-center rounded-md bg-muted border border-border text-xs font-semibold text-foreground">
                        ₹{Math.max(0, totalPaidAmount - (Number(refundAmount) || 0)).toLocaleString('en-IN')}
                        <span className="ml-1 text-[11px] text-muted-foreground font-normal">
                          deducted from ₹{totalPaidAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Settlement Mode *
                      </label>
                      <Select value={paymentMode} onValueChange={setPaymentMode}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</SelectItem>
                          <SelectItem value="UPI">UPI (GPay / PhonePe / Paytm)</SelectItem>
                          <SelectItem value="CASH">Cash Settlement</SelectItem>
                          <SelectItem value="ONLINE">Online Gateway</SelectItem>
                          <SelectItem value="OTHER">Other / Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Transaction Ref / UTR #
                      </label>
                      <Input
                        value={transactionReference}
                        onChange={(e) => setTransactionReference(e.target.value)}
                        placeholder="e.g. UTR987654321"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Settlement Date
                      </label>
                      <Input
                        type="date"
                        value={refundDate}
                        onChange={(e) => setRefundDate(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Admin Settlement Notes
                      </label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="e.g. 25% cancellation charge applied per package policy."
                        className="text-xs min-h-[60px]"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleApprove}
                    disabled={processMutation.isPending || !userCanEdit}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 mt-2 cursor-pointer"
                  >
                    {processMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Processing Refund...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Confirm &amp; Mark Refunded
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                /* REJECT TAB */
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900/40 text-[11px] leading-relaxed">
                    ⚠️ <strong>Declining Request:</strong> Declining will revert the booking status back to <strong>{request.previousBookingStatus}</strong> and reject the cancellation.
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Reason for Declining *
                    </label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="State the reason why cancellation cannot be accepted..."
                      className="text-xs min-h-[90px]"
                    />
                  </div>

                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={processMutation.isPending || !userCanEdit}
                    className="w-full font-bold text-xs h-10 cursor-pointer"
                  >
                    {processMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1.5" /> Decline Request &amp; Restore Booking
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : isCompleted ? (
            /* COMPLETED CARD */
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Cancellation Completed &amp; Refund Settled
              </div>

              <div className="space-y-2.5 text-xs bg-card p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Refund Paid:</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    ₹{Number(request.adminRefundDetails?.refundAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Deduction / Fee:</span>
                  <span className="font-bold text-foreground">
                    ₹{Number(request.adminRefundDetails?.deductionAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Settlement Mode:</span>
                  <span className="font-semibold text-foreground">
                    {request.adminRefundDetails?.paymentMode?.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Transaction Ref / UTR:</span>
                  <span className="font-mono font-medium text-foreground truncate max-w-[140px]">
                    {request.adminRefundDetails?.transactionReference || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Settlement Date:</span>
                  <span className="font-medium text-foreground">
                    {request.adminRefundDetails?.refundDate
                      ? new Date(request.adminRefundDetails.refundDate).toLocaleDateString('en-IN')
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Processed By:</span>
                  <span className="font-medium text-foreground">
                    {request.adminRefundDetails?.processedByName || 'Admin'}
                  </span>
                </div>
              </div>

              {request.adminRefundDetails?.adminNotes && (
                <div className="text-xs text-muted-foreground bg-card p-3 rounded-xl border border-border">
                  <strong>Notes:</strong> {request.adminRefundDetails.adminNotes}
                </div>
              )}

              <Link
                to="/bookings/$id"
                params={{ id: request.bookingId?._id || request.bookingId }}
                search={{ type: request.bookingType === 'CUSTOMIZED' ? 'customized' : 'standard' }}
                className="w-full inline-flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow-xs"
              >
                View Full Booking Page <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            /* REJECTED CARD */
            <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                <XCircle className="h-5 w-5 text-rose-600" />
                Cancellation Request Declined
              </div>

              <div className="bg-card p-4 rounded-xl border border-rose-200 dark:border-rose-900/30 text-xs space-y-2">
                <span className="text-muted-foreground font-semibold">Decline Reason:</span>
                <p className="font-medium text-foreground">
                  "{request.adminRejectionDetails?.rejectionReason}"
                </p>
                <div className="pt-2 border-t border-border flex justify-between text-[11px] text-muted-foreground">
                  <span>
                    Declined by: <strong>{request.adminRejectionDetails?.rejectedByName || 'Admin'}</strong>
                  </span>
                  <span>
                    Booking status: <strong>{request.previousBookingStatus}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CancellationRequestDetailComponent

