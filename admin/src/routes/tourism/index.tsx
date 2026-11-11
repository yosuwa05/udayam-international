import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermissions } from '@/lib/usePermissions'
import { SearchInput } from '@/components/SearchInput'
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

interface TourismSearch {
  page?: number
  limit?: number
  search?: string
  packageType?: string
  bookingType?: string
  destinationRegions?: string[]
  tripTypes?: string[]
  durationCategories?: string[]
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  isActive?: string
  isFeatured?: string
}

export const Route = createFileRoute('/tourism/')({
  validateSearch: (search: Record<string, unknown>): TourismSearch => ({
    page: search.page ? Number(search.page) : 1,
    limit: search.limit ? Number(search.limit) : 10,
    search: typeof search.search === 'string' ? search.search : undefined,
    packageType:
      typeof search.packageType === 'string' ? search.packageType : undefined,
    bookingType:
      typeof search.bookingType === 'string' ? search.bookingType : undefined,
    destinationRegions: Array.isArray(search.destinationRegions)
      ? (search.destinationRegions as string[])
      : typeof search.destinationRegions === 'string'
        ? [search.destinationRegions]
        : undefined,
    tripTypes: Array.isArray(search.tripTypes)
      ? (search.tripTypes as string[])
      : typeof search.tripTypes === 'string'
        ? [search.tripTypes]
        : undefined,
    durationCategories: Array.isArray(search.durationCategories)
      ? (search.durationCategories as string[])
      : typeof search.durationCategories === 'string'
        ? [search.durationCategories]
        : undefined,
    minPrice: typeof search.minPrice === 'string' ? search.minPrice : undefined,
    maxPrice: typeof search.maxPrice === 'string' ? search.maxPrice : undefined,
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
    isActive: typeof search.isActive === 'string' ? search.isActive : undefined,
    isFeatured:
      typeof search.isFeatured === 'string' ? search.isFeatured : undefined,
  }),
  component: RouteComponent,
})

// ─── Types ───────────────────────────────────────────────────────────────────

type Badge = { text: string; variant: string }
type TourismPackage = {
  [key: string]: any
  _id: string
  title: string
  destination: string
  destinationRegion: string
  packageType: 'DOMESTIC' | 'INTERNATIONAL'
  bookingType: 'STANDARD' | 'CUSTOMIZED'
  tripTypes: string[]
  price?: number
  strikePrice?: number
  discount?: string
  days: number
  nights: number
  durationCategory: string
  minPax: number
  maxPax: number
  imageUrl: string
  badges: Badge[]
  inclusions: string[]
  exclusions?: string[]
  isActive: boolean
  isFeatured: boolean
  label?: string
  order?: number
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
  [key: string]: any
  search: string
  packageType: string
  bookingType: string
  destinationRegions: string[]
  tripTypes: string[]
  durationCategories: string[]
  minPrice: string
  maxPrice: string
  sortBy: string
  isActive: string
  isFeatured: string
}

const DURATION_CATEGORIES = [
  { value: '1-3', label: '1–3 Days' },
  { value: '4-7', label: '4–7 Days' },
  { value: '8-14', label: '8–14 Days' },
  { value: '15+', label: '15+ Days' },
]

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  domestic: { bg: '#e8f5e9', color: '#2E7D32' },
  intl: { bg: 'rgba(27,43,107,0.85)', color: '#ffffff' },
  hot: { bg: '#E53E3E', color: '#ffffff' },
  sale: { bg: '#F59E0B', color: '#ffffff' },
  new: { bg: '#1B2B6B', color: '#ffffff' },
}

// ─── Component ───────────────────────────────────────────────────────────────

function RouteComponent() {
  const { data: regionsQuery } = useQuery({
    queryKey: ['regions-list'],
    queryFn: async () => {
      const res = await _axios.get('/regions', { params: { isActive: 'true' } })
      return res.data?.data || []
    },
  })

  const { data: tripTypesQuery } = useQuery({
    queryKey: ['trip-types-list'],
    queryFn: async () => {
      const res = await _axios.get('/trip-types', {
        params: { isActive: 'true' },
      })
      return res.data?.data || []
    },
  })

  const destinationRegions =
    regionsQuery?.map((r: any) => ({ value: r._id, label: r.name })) || []
  const tripTypesList =
    tripTypesQuery?.map((t: any) => ({ value: t._id, label: t.name })) || []

  const queryClient = useQueryClient()
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { canCreate, canEdit, canDelete } = usePermissions()
  const hasCreate = canCreate('/tourism')
  const hasEdit = canEdit('/tourism')
  const hasDelete = canDelete('/tourism')

  const page = searchParams.page ?? 1
  const limit = searchParams.limit ?? 10
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filters: FilterState = {
    search: searchParams.search ?? '',
    packageType: searchParams.packageType ?? 'ALL',
    bookingType: searchParams.bookingType ?? 'ALL',
    destinationRegions: searchParams.destinationRegions ?? [],
    tripTypes: searchParams.tripTypes ?? [],
    durationCategories: searchParams.durationCategories ?? [],
    minPrice: searchParams.minPrice ?? '',
    maxPrice: searchParams.maxPrice ?? '',
    sortBy: searchParams.sortBy ?? 'newest',
    isActive: searchParams.isActive ?? 'all',
    isFeatured: searchParams.isFeatured ?? 'all',
  }

  // Build query params
  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    ...(filters.search && { search: filters.search }),
    ...(filters.packageType !== 'ALL' && { packageType: filters.packageType }),
    ...(filters.bookingType !== 'ALL' && { bookingType: filters.bookingType }),
    ...(filters.destinationRegions.length && {
      destinationRegions: filters.destinationRegions.join(','),
    }),
    ...(filters.tripTypes.length && {
      tripTypes: filters.tripTypes.join(','),
    }),
    ...(filters.durationCategories.length && {
      durationCategories: filters.durationCategories.join(','),
    }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.isActive &&
      filters.isActive !== 'all' && { isActive: filters.isActive }),
    ...(filters.isFeatured &&
      filters.isFeatured !== 'all' && { isFeatured: filters.isFeatured }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tourism', queryParams],
    queryFn: async () => {
      const res = await _axios.get('/tourism', { params: queryParams })
      return res.data as { data: TourismPackage[]; pagination: PaginationMeta }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => _axios.delete(`/tourism/${id}`),
    onSuccess: () => {
      toast.success('Package deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tourism'] })
      setDeleteId(null)
    },
    onError: () => {
      toast.error('Failed to delete package')
      setDeleteId(null)
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => _axios.patch(`/tourism/${id}/toggle-active`),
    onSuccess: (res: any) => {
      toast.success(res.data?.message || 'Package status updated')
      queryClient.invalidateQueries({ queryKey: ['tourism'] })
    },
    onError: () => {
      toast.error('Failed to update package status')
    },
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => _axios.patch(`/tourism/${id}/toggle-featured`),
    onSuccess: () => {
      toast.success('Featured status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tourism'] })
    },
    onError: () => {
      toast.error('Failed to update featured status')
    },
  })

  const setPage = (p: number) => {
    navigate({ search: (prev) => ({ ...prev, page: p }) })
  }

  const setLimit = (l: number) => {
    navigate({ search: (prev) => ({ ...prev, limit: l, page: 1 }) })
  }

  const toggleMulti = (
    key: 'destinationRegions' | 'tripTypes' | 'durationCategories',
    value: string,
  ) => {
    const current = filters[key] || []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    navigate({
      search: (prev) => ({
        ...prev,
        [key]: next.length ? next : undefined,
        page: 1,
      }),
    })
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

  const clearFilters = () => {
    navigate({
      search: (prev) => ({
        page: 1,
        limit: prev.limit,
      }),
    })
  }

  const activeFilterCount = [
    filters.packageType !== 'ALL',
    filters.bookingType !== 'ALL',
    filters.destinationRegions.length > 0,
    filters.tripTypes.length > 0,
    filters.durationCategories.length > 0,
    filters.minPrice || filters.maxPrice,
    filters.isFeatured && filters.isFeatured !== 'all',
  ].filter(Boolean).length

  const packages = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Tourism Packages
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all travel packages
          </p>
        </div>
        {hasCreate && (
          <Link to="/tourism/add" search={(prev) => prev}>
            <Button className="gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Package
            </Button>
          </Link>
        )}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <SearchInput
          placeholder="Search packages…"
          className="flex-1 min-w-[220px] max-w-sm"
          value={filters.search}
          onChange={(v) => setFilter('search', v)}
        />

        {/* Package type tabs */}
        <div className="flex rounded-md border overflow-hidden text-sm">
          {(['ALL', 'DOMESTIC', 'INTERNATIONAL'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter('packageType', t)}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                filters.packageType === t
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {t === 'ALL'
                ? 'All Types'
                : t === 'DOMESTIC'
                  ? 'Domestic'
                  : 'Intl'}
            </button>
          ))}
        </div>

        {/* Booking type tabs */}
        <div className="flex rounded-md border overflow-hidden text-sm">
          {(['ALL', 'STANDARD', 'CUSTOMIZED'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter('bookingType', t)}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                filters.bookingType === t
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {t === 'ALL'
                ? 'All Booking'
                : t === 'STANDARD'
                  ? 'Standard'
                  : 'Customized'}
            </button>
          ))}
        </div>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(v) => setFilter('sortBy', v)}
        >
          <SelectTrigger className="h-9 w-36 text-sm cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer!" value="newest">
              Newest
            </SelectItem>
            <SelectItem className="cursor-pointer!" value="featured">
              Featured
            </SelectItem>
            <SelectItem className="cursor-pointer!" value="price_asc">
              Price: Low → High
            </SelectItem>
            <SelectItem className="cursor-pointer!" value="price_desc">
              Price: High → Low
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Featured Filter */}
        <Select
          value={filters.isFeatured}
          onValueChange={(v) => setFilter('isFeatured', v)}
        >
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer!" value="all">
              All Packages
            </SelectItem>
            <SelectItem className="cursor-pointer!" value="true">
              Featured Only
            </SelectItem>
            <SelectItem className="cursor-pointer!" value="false">
              Non-Featured
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Active status */}
        {/* <Select
          value={filters.isActive}
          onValueChange={(v) => setFilter('isActive', v)}
        >
          <SelectTrigger className="h-9 w-28 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
            <SelectItem value="">All status</SelectItem>
          </SelectContent>
        </Select> */}

        {/* Advanced filters toggle */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-9 cursor-pointer"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1 text-muted-foreground"
            onClick={clearFilters}
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced filter panel */}
      {showFilters && (
        <div className="rounded-xl border bg-muted/30 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Destinations */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Destinations
            </p>
            <div className="flex flex-wrap gap-1.5">
              {destinationRegions.map((r) => (
                <button
                  key={r.value}
                  onClick={() => toggleMulti('destinationRegions', r.value)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                    filters.destinationRegions.includes(r.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trip type */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Trip Type
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tripTypesList.map((t) => (
                <button
                  key={t.value}
                  onClick={() => toggleMulti('tripTypes', t.value)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                    filters.tripTypes.includes(t.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Duration
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_CATEGORIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => toggleMulti('durationCategories', d.value)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                    filters.durationCategories.includes(d.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Budget (₹ per person)
            </p>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Min"
                className="h-8 text-sm"
                value={filters.minPrice}
                onChange={(e) => setFilter('minPrice', e.target.value)}
                type="number"
              />
              <span className="text-muted-foreground text-sm">–</span>
              <Input
                placeholder="Max"
                className="h-8 text-sm"
                value={filters.maxPrice}
                onChange={(e) => setFilter('maxPrice', e.target.value)}
                type="number"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Package</TableHead>
              <TableHead className="hidden md:table-cell">
                Destination
              </TableHead>
              <TableHead className="hidden lg:table-cell">Duration</TableHead>
              <TableHead className="hidden lg:table-cell">Pax</TableHead>
              <TableHead className="hidden sm:table-cell w-16">Order</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Badges</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">Featured</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center py-12 text-muted-foreground"
                >
                  Failed to load packages. Try again.
                </TableCell>
              </TableRow>
            ) : packages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center py-12 text-muted-foreground"
                >
                  No packages found. Adjust filters or{' '}
                  <Link
                    to="/tourism/add"
                    className="text-primary underline underline-offset-2"
                  >
                    add one
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow key={pkg._id} className="hover:bg-muted/30">
                  <TableCell>
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="w-12 h-10 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="w-full max-w-62.5 truncate text-sm font-medium leading-tight">
                      {pkg.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span>
                        {pkg.packageType === 'DOMESTIC' ? '🇮🇳' : '✈️'}{' '}
                        {pkg.packageType}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span
                        className={
                          pkg.bookingType === 'CUSTOMIZED'
                            ? 'text-amber-600 font-semibold'
                            : 'text-blue-600 font-medium'
                        }
                      >
                        {pkg.bookingType ?? 'STANDARD'}
                      </span>
                      {pkg.isFeatured && (
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 ml-1" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {pkg.destination}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {pkg.days}D / {pkg.nights}N
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {pkg.minPax}–{pkg.maxPax}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {pkg.order ?? 0}
                  </TableCell>
                  <TableCell>
                    {pkg.bookingType === 'CUSTOMIZED' ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium border border-amber-200">
                        Customized
                      </span>
                    ) : (
                      <>
                        <div className="font-semibold text-sm">
                          ₹{pkg.price ? pkg.price.toLocaleString('en-IN') : '0'}
                        </div>
                        {pkg.strikePrice && (
                          <div className="text-xs line-through text-muted-foreground">
                            ₹{pkg.strikePrice.toLocaleString('en-IN')}
                          </div>
                        )}
                        {pkg.discount && (
                          <span className="text-xs text-green-600 font-medium">
                            {pkg.discount}%
                          </span>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {pkg.badges.map((b, i) => {
                        const s = BADGE_STYLES[b.variant] || {
                          bg: '#ccc',
                          color: '#fff',
                        }
                        return (
                          <span
                            key={i}
                            style={{
                              backgroundColor: s.bg,
                              color: s.color,
                            }}
                            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          >
                            {b.text}
                          </span>
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Switch
                      checked={pkg.isActive}
                      onCheckedChange={() => toggleActiveMutation.mutate(pkg._id)}
                      disabled={toggleActiveMutation.isPending || !hasEdit}
                      title={pkg.isActive ? 'Active (Click to deactivate)' : 'Inactive (Click to activate)'}
                    />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-muted cursor-pointer"
                      onClick={() => toggleFeaturedMutation.mutate(pkg._id)}
                      disabled={toggleFeaturedMutation.isPending || !hasEdit}
                      title="Toggle Featured"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors cursor-pointer ${
                          pkg.isFeatured
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {hasEdit && (
                        <Link
                          to="/tourism/$id/edit"
                          params={{ id: pkg._id }}
                          search={(prev) => prev}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            title="Edit Package"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                      {hasDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                          onClick={() => setDeleteId(pkg._id)}
                          title="Delete Package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
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

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this package?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the package and its images from storage.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
