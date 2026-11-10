import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pagination } from '@/components/Pagination'
import { SearchInput } from '@/components/SearchInput'

interface CancellationSearch {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export const Route = createFileRoute('/bookings/cancellations/')({
  validateSearch: (search: Record<string, unknown>): CancellationSearch => ({
    page: search.page ? Number(search.page) : 1,
    limit: search.limit ? Number(search.limit) : 10,
    search: typeof search.search === 'string' ? search.search : undefined,
    status: typeof search.status === 'string' ? search.status : undefined,
  }),
  component: CancellationRequestsListComponent,
})

function CancellationRequestsListComponent() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const page = searchParams.page || 1
  const limit = searchParams.limit || 10
  const search = searchParams.search || ''
  const status = searchParams.status || 'ALL'

  // Query cancellation requests list
  const { data: listResponse, isLoading, isError } = useQuery({
    queryKey: ['admin-cancellation-requests', page, limit, status, search],
    queryFn: async () => {
      const res = await _axios.get('/booking/admin/cancellation-requests', {
        params: {
          page,
          limit,
          status: status !== 'ALL' ? status : undefined,
          search: search || undefined,
        },
      })
      return res.data?.data
    },
  })

  const requests = listResponse?.requests || []
  const counts = listResponse?.counts || { total: 0, pending: 0, completed: 0, rejected: 0 }
  const pagination = listResponse?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-primary" /> Booking Cancellation Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Review user-submitted booking cancellations, calculate deduction charges, and record manual refund settlements.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate({ search: (prev) => ({ ...prev, status: 'ALL', page: 1 }) })}
          className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-sm ${
            status === 'ALL'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Requests
            </span>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{counts.total}</div>
          <p className="mt-1 text-xs text-muted-foreground">All time cancellation requests</p>
        </div>

        <div
          onClick={() => navigate({ search: (prev) => ({ ...prev, status: 'PENDING', page: 1 }) })}
          className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-sm ${
            status === 'PENDING'
              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20'
              : 'border-border bg-card hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pending Review
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {counts.pending}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Requires admin approval & refund calculation</p>
        </div>

        <div
          onClick={() => navigate({ search: (prev) => ({ ...prev, status: 'COMPLETED', page: 1 }) })}
          className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-sm ${
            status === 'COMPLETED'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-border bg-card hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Cancelled &amp; Refunded
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {counts.completed}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Approved and payout recorded</p>
        </div>

        <div
          onClick={() => navigate({ search: (prev) => ({ ...prev, status: 'REJECTED', page: 1 }) })}
          className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-sm ${
            status === 'REJECTED'
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20'
              : 'border-border bg-card hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Rejected Requests
            </span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {counts.rejected}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Declined; bookings remain active</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search booking # or reason..."
            value={search}
            onChange={(val) =>
              navigate({ search: (prev) => ({ ...prev, search: val || undefined, page: 1 }) })
            }
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Tabs / Selector */}
          <Select
            value={status}
            onValueChange={(val) =>
              navigate({ search: (prev) => ({ ...prev, status: val, page: 1 }) })
            }
          >
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses ({counts.total})</SelectItem>
              <SelectItem value="PENDING">Pending Review ({counts.pending})</SelectItem>
              <SelectItem value="COMPLETED">Completed ({counts.completed})</SelectItem>
              <SelectItem value="REJECTED">Rejected ({counts.rejected})</SelectItem>
            </SelectContent>
          </Select>

          {/* Limit selector */}
          <Select
            value={String(limit)}
            onValueChange={(val) =>
              navigate({ search: (prev) => ({ ...prev, limit: Number(val), page: 1 }) })
            }
          >
            <SelectTrigger className="w-[110px] h-9 text-xs">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[160px] text-xs font-bold">Booking #</TableHead>
              <TableHead className="text-xs font-bold">Customer</TableHead>
              <TableHead className="text-xs font-bold">Tour Package</TableHead>
              <TableHead className="text-xs font-bold text-right">Paid Amount</TableHead>
              <TableHead className="text-xs font-bold">Cancellation Reason</TableHead>
              <TableHead className="text-xs font-bold">Requested On</TableHead>
              <TableHead className="text-xs font-bold text-center">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-xs text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span>Loading cancellation requests...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-xs text-rose-500 font-semibold">
                  Failed to load cancellation requests. Please try refreshing the page.
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-xs text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
                    <p className="font-semibold text-foreground">No cancellation requests found</p>
                    <p className="text-muted-foreground">
                      {status !== 'ALL'
                        ? `There are no requests with status '${status}'.`
                        : 'No cancellation requests have been submitted yet.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req: any) => {
                const isPending = req.status === 'PENDING'
                const isCompleted = req.status === 'COMPLETED'
                const isRejected = req.status === 'REJECTED'

                return (
                  <TableRow key={req._id} className="hover:bg-muted/40 transition-colors">
                    {/* Booking Number */}
                    <TableCell className="font-mono text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to="/bookings/$id"
                          params={{ id: req.bookingId?._id || req.bookingId }}
                          search={{ type: req.bookingType === 'CUSTOMIZED' ? 'customized' : 'standard' }}
                          className="hover:underline text-primary"
                        >
                          {req.bookingNumber}
                        </Link>
                      </div>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-semibold ${
                            req.bookingType === 'CUSTOMIZED'
                              ? 'border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-950/20'
                              : 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/20'
                          }`}
                        >
                          {req.bookingType}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Customer */}
                    <TableCell className="text-xs">
                      <div className="font-semibold text-foreground">
                        {req.userId?.fullName || 'Customer'}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{req.userId?.mobile}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                        {req.userId?.email}
                      </div>
                    </TableCell>

                    {/* Package */}
                    <TableCell className="text-xs">
                      <div className="font-semibold text-foreground max-w-[200px] truncate" title={req.packageId?.title}>
                        {req.packageId?.title || 'Tour Package'}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {req.packageId?.destination || 'N/A'}
                      </div>
                    </TableCell>

                    {/* Total Paid Amount */}
                    <TableCell className="text-xs text-right">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{Number(req.totalPaidAmount || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        of ₹{Number(req.totalBookingAmount || 0).toLocaleString('en-IN')}
                      </div>
                    </TableCell>

                    {/* Cancellation Reason */}
                    <TableCell className="text-xs max-w-[240px]">
                      <div className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground mb-1">
                        {req.reasonCategory || 'General'}
                      </div>
                      <p className="truncate text-foreground font-medium" title={req.reason}>
                        {req.reason}
                      </p>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                      <div className="text-[10px]">
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="text-center">
                      {isPending && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300">
                          Pending Review
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300">
                          Refunded
                        </Badge>
                      )}
                      {isRejected && (
                        <Badge className="bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300">
                          Declined
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions -> Navigate to dedicated cancellation detail page */}
                    <TableCell className="text-right whitespace-nowrap">
                      {isPending ? (
                        <Link
                          to="/bookings/cancellations/$id"
                          params={{ id: req._id }}
                        >
                          <Button
                            size="sm"
                            className="h-8 text-xs font-semibold gap-1 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" /> Review &amp; Settle
                          </Button>
                        </Link>
                      ) : (
                        <Link
                          to="/bookings/cancellations/$id"
                          params={{ id: req._id }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of{' '}
              {pagination.total} requests
            </p>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) =>
                navigate({ search: (prev) => ({ ...prev, page: newPage }) })
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CancellationRequestsListComponent

