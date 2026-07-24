import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Plus, Pencil, Trash2, Search, Check, X, Tag } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/coupons/')({
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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'ALL',
    applicableFor: 'ALL_TYPES',
    sortBy: 'newest',
  })

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    ...(filters.search && { search: filters.search }),
    ...(filters.status !== 'ALL' && { status: filters.status }),
    ...(filters.applicableFor !== 'ALL_TYPES' && { applicableFor: filters.applicableFor }),
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
        <Link to="/coupons/add">
          <Button className="gap-2 shrink-0 cursor-pointer">
            <Plus className="w-4 h-4" />
            Add Coupon
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-muted/20 p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search code, title or desc..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="pl-9 bg-background h-9 text-sm"
          />
        </div>

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

          {(filters.search || filters.status !== 'ALL' || filters.applicableFor !== 'ALL_TYPES') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({
                  search: '',
                  status: 'ALL',
                  applicableFor: 'ALL_TYPES',
                  sortBy: 'newest',
                })
                setPage(1)
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
              <TableHead>Validity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  Failed to load coupons. Please try again.
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
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
                  <TableCell className="text-xs text-muted-foreground space-y-0.5">
                    <div>From: {formatDate(coupon.validFrom)}</div>
                    <div>To: {formatDate(coupon.validTo)}</div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
                        coupon.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}
                    >
                      {coupon.status === 'ACTIVE' ? (
                        <>
                          <Check className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" /> Inactive
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to="/coupons/$id/edit" params={{ id: coupon._id }}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
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
