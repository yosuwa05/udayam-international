import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
import { Skeleton } from '@/components/ui/skeleton'
import { usePermissions } from '@/lib/usePermissions'
import { Plus, Pencil, Trash2, Check, X, Tag } from 'lucide-react'
import { SearchInput } from '@/components/SearchInput'
import { toast } from 'sonner'

interface CouponsSearch {
  page?: number
  limit?: number
  search?: string
  status?: string
  applicableFor?: string
  sortBy?: string
}

export const Route = createFileRoute('/coupons/')({
  validateSearch: (search: Record<string, unknown>): CouponsSearch => ({
    page: search.page ? Number(search.page) : 1,
    limit: search.limit ? Number(search.limit) : 10,
    search: typeof search.search === 'string' ? search.search : undefined,
    status: typeof search.status === 'string' ? search.status : undefined,
    applicableFor:
      typeof search.applicableFor === 'string'
        ? search.applicableFor
        : undefined,
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
  }),
  component: CouponsIndexComponent,
})

type Coupon = {
  _id: string
  title: string
  couponCode: string
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  totalUsageLimit: number
  perUserUsageLimit: number
  usedCount: number
  status: 'ACTIVE' | 'INACTIVE'
  validFrom: string
  validTo: string
  applicableFor: 'ALL' | 'STANDARD' | 'CUSTOMIZED' | 'SELECTED'
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
  status: string
  applicableFor: string
  sortBy: string
}

function CouponsIndexComponent() {
  const queryClient = useQueryClient()
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { canCreate, canEdit, canDelete } = usePermissions()
  const hasCreate = canCreate('/coupons')
  const hasEdit = canEdit('/coupons')
  const hasDelete = canDelete('/coupons')

  const page = searchParams.page ?? 1
  const limit = searchParams.limit ?? 10

  const filters: FilterState = {
    search: searchParams.search ?? '',
    status: searchParams.status ?? 'ALL',
    applicableFor: searchParams.applicableFor ?? 'ALL_TYPES',
    sortBy: searchParams.sortBy ?? 'newest',
  }

  const [deleteId, setDeleteId] = useState<string | null>(null)

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
    ...(filters.search && { search: filters.search }),
    ...(filters.status !== 'ALL' && { status: filters.status }),
    ...(filters.applicableFor !== 'ALL_TYPES' && {
      applicableFor: filters.applicableFor,
    }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['coupons', queryParams],
    queryFn: async () => {
      const res = await _axios.get('/coupon', { params: queryParams })
      return res.data as { data: Coupon[]; pagination: PaginationMeta }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => _axios.delete(`/coupon/${id}`),
    onSuccess: () => {
      toast.success('Coupon deleted successfully')
      setDeleteId(null)
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete coupon')
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => _axios.patch(`/coupon/${id}/toggle-active`),
    onSuccess: (res: any) => {
      toast.success(res.data?.message || 'Coupon status updated')
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update coupon status')
    },
  })

  const coupons = data?.data ?? []
  const pagination = data?.pagination

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coupons & Offers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, manage, and configure discount coupons for users and packages
          </p>
        </div>
        {hasCreate && (
          <Link to="/coupons/add" search={(prev) => prev}>
            <Button className="gap-2 shrink-0 cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Coupon
            </Button>
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-muted/20 p-4 rounded-xl border">
        <SearchInput
          placeholder="Search code, title or desc..."
          className="flex-1"
          value={filters.search}
          onChange={(v) => setFilter('search', v)}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={filters.status}
            onValueChange={(v) => setFilter('status', v)}
          >
            <SelectTrigger className="h-9 w-40 text-sm bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.applicableFor}
            onValueChange={(v) => setFilter('applicableFor', v)}
          >
            <SelectTrigger className="h-9 w-40 text-sm bg-background">
              <SelectValue placeholder="Applicability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_TYPES">All Packages</SelectItem>
              <SelectItem value="ALL">General (All)</SelectItem>
              <SelectItem value="STANDARD">Standard Only</SelectItem>
              <SelectItem value="CUSTOMIZED">Customized Only</SelectItem>
              <SelectItem value="SELECTED">Selected Packages</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(v) => setFilter('sortBy', v)}
          >
            <SelectTrigger className="h-9 w-40 text-sm bg-background">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="discount_high">Highest Discount</SelectItem>
              <SelectItem value="discount_low">Lowest Discount</SelectItem>
            </SelectContent>
          </Select>

          {(filters.search ||
            filters.status !== 'ALL' ||
            filters.applicableFor !== 'ALL_TYPES') && (
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

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Coupon Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage (Per User / Total)</TableHead>
              <TableHead>Used Count</TableHead>
              <TableHead className="text-center w-16">Order</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  Failed to load coupons. Please try again.
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  No coupons found.{' '}
                  <Link to="/coupons/add" className="text-primary underline underline-offset-2">
                    Create one now
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon._id} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-sm text-primary">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      <Tag className="w-3.5 h-3.5" />
                      {coupon.couponCode}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-sm max-w-[200px] truncate">
                    {coupon.title}
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    {coupon.discountType === 'PERCENTAGE'
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue.toLocaleString('en-IN')} OFF`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {coupon.perUserUsageLimit} / {coupon.totalUsageLimit}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {coupon.usedCount}
                  </TableCell>
                  <TableCell className="text-center font-medium text-sm text-muted-foreground">
                    {coupon.order ?? 0}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground space-y-0.5">
                    <div>From: {formatDate(coupon.validFrom)}</div>
                    <div>To: {formatDate(coupon.validTo)}</div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={coupon.status === 'ACTIVE'}
                      onCheckedChange={() => toggleActiveMutation.mutate(coupon._id)}
                      disabled={toggleActiveMutation.isPending}
                      title={coupon.status === 'ACTIVE' ? 'Active (Click to deactivate)' : 'Inactive (Click to activate)'}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/coupons/$id/edit"
                        params={{ id: coupon._id }}
                        search={(prev) => prev}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                        onClick={() => setDeleteId(coupon._id)}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the coupon. Users will no longer be able to use this coupon
              code for package bookings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
