import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Eye, Calendar, User, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/bookings/customized/')({
  component: CustomizedBookingsComponent,
})

type Booking = {
  _id: string
  bookingNumber: string
  bookingType: 'STANDARD' | 'CUSTOMIZED'
  packageId?: { title: string; destination: string; packageType: string }
  userId?: { fullName: string; email: string; mobile: string }
  travellerInfo: {
    fullName: string
    mobileNumber: string
    email: string
    numberOfPersons: number
    travelDate: string
    travelType: string
  }
  pricingDetails: {
    originalAmount: number
    discountAmount: number
    finalAmount: number
    currency: string
  }
  status: string
  quotation?: { amount: number; notes?: string }
  finalPackageAmount?: number
  paymentTransactions?: { amount: number }[]
  createdAt: string
}

type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const CUSTOMIZED_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ENQUIRY_RECEIVED', label: 'Enquiry Received' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'QUOTATION_SHARED', label: 'Quotation Shared' },
  { value: 'CUSTOMER_CONFIRMED', label: 'Customer Confirmed' },
  { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
  { value: 'BOOKED', label: 'Booked' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ENQUIRY_CANCELLED', label: 'Enquiry Cancelled' },
]

function getStatusStyle(status: string) {
  switch (status) {
    case 'BOOKED':
    case 'COMPLETED':
    case 'CUSTOMER_CONFIRMED':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'ENQUIRY_RECEIVED':
    case 'UNDER_REVIEW':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'QUOTATION_SHARED':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'PAYMENT_PENDING':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'ENQUIRY_CANCELLED':
      return 'bg-red-50 text-red-600 border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

function CustomizedBookingsComponent() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')

  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    bookingType: 'CUSTOMIZED',
    ...(search && { search }),
    ...(status !== 'ALL' && { status }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-bookings-customized', queryParams],
    queryFn: async () => {
      const res = await _axios.get('/booking/admin/list', { params: queryParams })
      return res.data as { data: Booking[]; pagination: PaginationMeta }
    },
  })

  const bookings = data?.data ?? []
  const pagination = data?.pagination

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '-'

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Customized Bookings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage custom enquiries, quotations, and manual payment transactions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-muted/20 p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search booking #, name, email or mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9 bg-background h-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-9 w-52 text-sm bg-background cursor-pointer">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              {CUSTOMIZED_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || status !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatus('ALL')
                setPage(1)
              }}
              className="text-xs h-9 cursor-pointer"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Booking #</TableHead>
              <TableHead>Package & Destination</TableHead>
              <TableHead>Traveller Contact</TableHead>
              <TableHead>Travel Date & Pax</TableHead>
              <TableHead>Package Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                >
                  Failed to load bookings. Please try again.
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                >
                  No customized bookings match your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const totalPaid =
                  booking.paymentTransactions?.reduce((s, t) => s + t.amount, 0) ?? 0
                const balance =
                  booking.finalPackageAmount !== undefined
                    ? booking.finalPackageAmount - totalPaid
                    : null

                return (
                  <TableRow key={booking._id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold text-purple-700">
                      {booking.bookingNumber}
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-medium max-w-[200px] truncate">
                        {booking.packageId?.title || 'Tour Package'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        📍 {booking.packageId?.destination || '-'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-medium flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        {booking.travellerInfo?.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {booking.travellerInfo?.mobileNumber}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground space-y-0.5">
                      <div className="flex items-center gap-1 font-medium text-foreground">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatDate(booking.travellerInfo?.travelDate)}
                      </div>
                      <div>👥 {booking.travellerInfo?.numberOfPersons} Persons</div>
                    </TableCell>

                    <TableCell className="text-sm">
                      {booking.finalPackageAmount ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-foreground">
                            ₹{booking.finalPackageAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-green-600 font-medium">
                            Paid: ₹{totalPaid.toLocaleString('en-IN')}
                          </div>
                          {balance !== null && balance > 0 && (
                            <div className="text-[10px] text-amber-600 font-medium">
                              Due: ₹{balance.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      ) : booking.quotation?.amount ? (
                        <div>
                          <div className="text-blue-700 font-bold">
                            ₹{booking.quotation.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Quoted</div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Pending Quote
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border inline-block ${getStatusStyle(booking.status)}`}
                      >
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <Link to="/bookings/$id" params={{ id: booking._id }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-xs cursor-pointer border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={limit}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => {
            setLimit(l)
            setPage(1)
          }}
        />
      )}
    </div>
  )
}
