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
import { Search, Eye, Calendar, User, Tag } from 'lucide-react'

export const Route = createFileRoute('/bookings/standard')({
  component: StandardBookingsComponent,
})

type Booking = {
  _id: string
  bookingNumber: string
  bookingType: 'STANDARD'
  packageId?: {
    title: string
    destination: string
    packageType: string
  }
  userId?: {
    fullName: string
    email: string
    mobile: string
  }
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

type FilterState = {
  search: string
  status: string
}

function StandardBookingsComponent() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'ALL',
  })

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    bookingType: 'STANDARD',
    ...(filters.search && { search: filters.search }),
    ...(filters.status !== 'ALL' && { status: filters.status }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-standard-bookings', queryParams],
    queryFn: async () => {
      const res = await _axios.get('/booking/admin/list', { params: queryParams })
      return res.data as { data: Booking[]; pagination: PaginationMeta }
    },
  })

  const bookings = data?.data ?? []
  const pagination = data?.pagination

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'BOOKED':
      case 'CONFIRMED':
      case 'PAYMENT_SUCCESS':
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'PAYMENT_PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'CANCELLED':
      case 'PAYMENT_FAILED':
        return 'bg-red-50 text-red-600 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Standard Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage online standard package bookings and payment statuses
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-muted/20 p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search booking #, traveller name, email, or mobile..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="pl-9 bg-background h-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(v) => setFilter('status', v)}
          >
            <SelectTrigger className="h-9 w-48 text-sm bg-background">
              <SelectValue placeholder="Booking Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PAYMENT_PENDING">Payment Pending</SelectItem>
              <SelectItem value="BOOKED">Booked / Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="PAYMENT_FAILED">Payment Failed</SelectItem>
            </SelectContent>
          </Select>

          {(filters.search || filters.status !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({ search: '', status: 'ALL' })
                setPage(1)
              }}
              className="text-xs h-9"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Booking #</TableHead>
              <TableHead>Package & Destination</TableHead>
              <TableHead>Traveller Contact</TableHead>
              <TableHead>Travel Date & Pax</TableHead>
              <TableHead>Pricing</TableHead>
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
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Failed to load bookings. Please try again.
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No standard bookings match your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking._id} className="hover:bg-muted/30">
                  {/* Booking # & Type */}
                  <TableCell className="font-mono text-xs font-semibold">
                    <div className="space-y-1">
                      <div className="text-primary font-bold">{booking.bookingNumber}</div>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Tag className="w-3 h-3" /> Standard
                      </span>
                    </div>
                  </TableCell>

                  {/* Package */}
                  <TableCell>
                    <div className="text-sm font-medium max-w-[200px] truncate">
                      {booking.packageId?.title || 'Tour Package'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      📍 {booking.packageId?.destination || 'Destination'}
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="text-sm font-medium flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      {booking.travellerInfo?.fullName}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {booking.travellerInfo?.mobileNumber}
                    </div>
                  </TableCell>

                  {/* Travel Date & Pax */}
                  <TableCell className="text-xs text-muted-foreground space-y-0.5">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {formatDate(booking.travellerInfo?.travelDate)}
                    </div>
                    <div>👥 {booking.travellerInfo?.numberOfPersons} Persons</div>
                  </TableCell>

                  {/* Pricing */}
                  <TableCell className="text-sm font-semibold">
                    <div>
                      <div>₹{booking.pricingDetails?.finalAmount?.toLocaleString('en-IN')}</div>
                      {booking.pricingDetails?.discountAmount > 0 && (
                        <div className="text-[10px] text-green-600 font-normal">
                          Discount: -₹{booking.pricingDetails.discountAmount.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium border inline-block ${getStatusBadgeStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status.replace(/_/g, ' ')}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Link to="/bookings/$id" params={{ id: booking._id }} search={{ type: 'standard' }}>
                      <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs cursor-pointer">
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
