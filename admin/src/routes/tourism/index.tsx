import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MapPin,
  Plus,
  Search,
  Pencil,
  Trash2,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/tourism/')({
  component: RouteComponent,
})

// ─── Types ───────────────────────────────────────────────────────────────────

type Badge = { text: string; variant: string }
type TourismPackage = {
  _id: string
  title: string
  destination: string
  destinationRegion: string
  packageType: 'DOMESTIC' | 'INTERNATIONAL'
  tripTypes: string[]
  price: number
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
  search: string
  packageType: string
  destinationRegions: string[]
  tripTypes: string[]
  durationCategories: string[]
  minPrice: string
  maxPrice: string
  sortBy: string
  isActive: string
  isFeatured: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DESTINATION_REGIONS = [
  { value: 'INDIA', label: 'India' },
  { value: 'EUROPE', label: 'Europe' },
  { value: 'SOUTH_EAST_ASIA', label: 'South-East Asia' },
  { value: 'MIDDLE_EAST', label: 'Middle East' },
  { value: 'AMERICAS', label: 'Americas' },
  { value: 'AFRICA', label: 'Africa' },
  { value: 'OCEANIA', label: 'Oceania' },
]

const TRIP_TYPES = [
  { value: 'HONEYMOON', label: 'Honeymoon' },
  { value: 'FAMILY', label: 'Family' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'SOLO', label: 'Solo Travel' },
  { value: 'GROUP', label: 'Group' },
  { value: 'PILGRIMAGE', label: 'Pilgrimage' },
]

const DURATION_CATEGORIES = [
  { value: '1-3', label: '1–3 Days' },
  { value: '4-7', label: '4–7 Days' },
  { value: '8-14', label: '8–14 Days' },
  { value: '15+', label: '15+ Days' },
]

const BADGE_COLOR: Record<string, string> = {
  domestic: 'bg-blue-100 text-blue-700',
  intl: 'bg-purple-100 text-purple-700',
  hot: 'bg-orange-100 text-orange-700',
  sale: 'bg-green-100 text-green-700',
  new: 'bg-pink-100 text-pink-700',
}

// ─── Component ───────────────────────────────────────────────────────────────

function RouteComponent() {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    packageType: 'ALL',
    destinationRegions: [],
    tripTypes: [],
    durationCategories: [],
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    isActive: 'true',
    isFeatured: 'all',
  })

  // Build query params
  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    ...(filters.search && { search: filters.search }),
    ...(filters.packageType !== 'ALL' && { packageType: filters.packageType }),
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
    ...(filters.isActive && { isActive: filters.isActive }),
    ...(filters.isFeatured && filters.isFeatured !== 'all' && { isFeatured: filters.isFeatured }),
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

  const toggleMulti = (
    key: 'destinationRegions' | 'tripTypes' | 'durationCategories',
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }))
    setPage(1)
  }

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      packageType: 'ALL',
      destinationRegions: [],
      tripTypes: [],
      durationCategories: [],
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      isActive: 'true',
      isFeatured: 'all',
    })
    setPage(1)
  }

  const activeFilterCount = [
    filters.packageType !== 'ALL',
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
        <Link to="/tourism/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Package
          </Button>
        </Link>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search packages…"
            className="pl-9 h-9"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
          />
        </div>

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
              {t === 'ALL' ? 'All' : t === 'DOMESTIC' ? 'Domestic' : 'Intl'}
            </button>
          ))}
        </div>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(v) => setFilter('sortBy', v)}
        >
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price_asc">Price: Low → High</SelectItem>
            <SelectItem value="price_desc">Price: High → Low</SelectItem>
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
            <SelectItem value="all">All Packages</SelectItem>
            <SelectItem value="true">Featured Only</SelectItem>
            <SelectItem value="false">Non-Featured</SelectItem>
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
          className="gap-1.5 h-9"
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
              {DESTINATION_REGIONS.map((r) => (
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
              {TRIP_TYPES.map((t) => (
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
                    <div className="font-medium text-sm leading-tight">
                      {pkg.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      {pkg.packageType === 'DOMESTIC' ? '🇮🇳' : '✈️'}
                      {pkg.packageType}
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
                    <div className="font-semibold text-sm">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </div>
                    {pkg.strikePrice && (
                      <div className="text-xs line-through text-muted-foreground">
                        ₹{pkg.strikePrice.toLocaleString('en-IN')}
                      </div>
                    )}
                    {pkg.discount && (
                      <span className="text-xs text-green-600 font-medium">
                        {pkg.discount}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {pkg.badges.map((b, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${BADGE_COLOR[b.variant] ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        pkg.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-muted"
                      onClick={() => toggleFeaturedMutation.mutate(pkg._id)}
                      disabled={toggleFeaturedMutation.isPending}
                      title="Toggle Featured"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          pkg.isFeatured
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to="/tourism/$id/edit" params={{ id: pkg._id }}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(pkg._id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
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
