import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
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
import { Eye, Calendar, User, Sparkles } from 'lucide-react'
import { SearchInput } from '@/components/SearchInput'

interface CustomizedBookingsSearch {
  page?: number
  limit?: number
  search?: string
  status?: string
  startDate?: string
  endDate?: string
}

export const Route = createFileRoute('/bookings/customized')({
  validateSearch: (
    search: Record<string, unknown>,
  ): CustomizedBookingsSearch => ({
    page: search.page ? Number(search.page) : 1,
    limit: search.limit ? Number(search.limit) : 10,
    search: typeof search.search === 'string' ? search.search : undefined,
    status: typeof search.status === 'string' ? search.status : undefined,
    startDate:
      typeof search.startDate === 'string' ? search.startDate : undefined,
    endDate: typeof search.endDate === 'string' ? search.endDate : undefined,
  }),
  component: CustomizedBookingsComponent,
})

type Booking = {
  _id: string
  bookingNumber: string
  bookingType: 'CUSTOMIZED'
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
  status: string
  quotation?: {
    amount: number
    notes?: string
  }
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
  startDate: string
  endDate: string
}

function CustomizedBookingsComponent() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const page = searchParams.page ?? 1
  const limit = searchParams.limit ?? 10
  const filters: FilterState = {
    search: searchParams.search ?? '',
    status: searchParams.status ?? 'ALL',
    startDate: searchParams.startDate ?? '',
    endDate: searchParams.endDate ?? '',
  }

  const setPage = (p: number) => {
    navigate({ search: (prev) => ({ ...prev, page: p }) })
  }

  const setLimit = (l: number) => {
    navigate({ search: (prev) => ({ ...prev, limit: l, page: 1 }) })
  }

  const setFilter = (key: keyof FilterState, value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        [key]: value || undefined,
        page: 1,
      }),
    })
  }

  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    bookingType: 'CUSTOMIZED',
    ...(filters.search && { search: filters.search }),
    ...(filters.status !== 'ALL' && { status: filters.status }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-customized-bookings', queryParams],
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

  const formatTripType = (type?: string) => {
    if (!type) return null
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

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'COMPLETED':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      case 'ENQUIRY_RECEIVED':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'UNDER_REVIEW':
        return 'bg-sky-50 text-sky-700 border-sky-200'
      case 'QUOTATION_SHARED':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      case 'CUSTOMER_CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PAYMENT_PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'ENQUIRY_CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customized Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage custom enquiries, prepare quotations, and record offline or custom payments
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-muted/20 p-4 rounded-xl border">
        <SearchInput
          placeholder="Search booking #, traveller name, email, or mobile..."
          className="flex-1"
          value={filters.search}
          onChange={(v) => setFilter('search', v)}
        />

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
              <SelectItem value="ENQUIRY_RECEIVED">Enquiry Received</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="QUOTATION_SHARED">Quotation Shared</SelectItem>
              <SelectItem value="CUSTOMER_CONFIRMED">Customer Confirmed</SelectItem>
              <SelectItem value="PAYMENT_PENDING">Payment Pending</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ENQUIRY_CANCELLED">Enquiry Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">From:</span>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilter('startDate', e.target.value)}
              className="h-9 w-36 text-xs bg-background cursor-pointer"
            />
            <span className="text-xs text-muted-foreground font-medium">To:</span>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilter('endDate', e.target.value)}
              className="h-9 w-36 text-xs bg-background cursor-pointer"
            />
          </div>

          {(filters.search ||
            filters.status !== 'ALL' ||
            filters.startDate ||
            filters.endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate({
                    search: (prev) => ({
                      page: 1,
                      limit: prev.limit,
                    }),
                  })
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
              <TableHead>Date of Enquiry</TableHead>
              <TableHead>Travel Date & Pax</TableHead>
              <TableHead>Pricing / Quote</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  Failed to load bookings. Please try again.
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No customized bookings match your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking._id} className="hover:bg-muted/30">
                  {/* Booking # & Type */}
                  <TableCell className="font-mono text-xs font-semibold">
                    <div className="space-y-1">
                      <div className="text-primary font-bold">{booking.bookingNumber}</div>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border bg-purple-50 text-purple-700 border-purple-200">
                        <Sparkles className="w-3 h-3" /> Custom
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
                      {booking.travellerInfo.fullName}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {booking.travellerInfo.mobileNumber}
                    </div>
                  </TableCell>

                  {/* Date of Booking */}
                  <TableCell className="text-xs text-muted-foreground space-y-0.5">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {formatDate(booking.createdAt)}
                    </div>
                  </TableCell>

                  {/* Travel Date & Pax */}
                  <TableCell className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {formatDate(booking.travellerInfo.travelDate)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>👥 {booking.travellerInfo.numberOfPersons} Persons</span>
                      {booking.travellerInfo.travelType && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {formatTripType(booking.travellerInfo.travelType)}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Pricing */}
                  <TableCell className="text-sm font-semibold">
                    {booking.quotation?.amount ? (
                      <div>
                        <div className="text-blue-700 font-bold">
                          ₹{booking.quotation.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-normal">Quoted Price</div>
                      </div>
                    ) : (
                      <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Quote Pending
                      </span>
                    )}
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
                    <Link
                      to="/bookings/$id"
                      params={{ id: booking._id }}
                      search={(prev) => ({ ...prev, type: 'customized' })}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 h-8 text-xs cursor-pointer"
                      >
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
