import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface TestimonialsSearch {
  page?: number
  limit?: number
  isActive?: string
  type?: string
}

export const Route = createFileRoute('/testimonials/')({
  validateSearch: (search: Record<string, unknown>): TestimonialsSearch => ({
    page: search.page ? Number(search.page) : 1,
    limit: search.limit ? Number(search.limit) : 10,
    isActive: typeof search.isActive === 'string' ? search.isActive : undefined,
    type: typeof search.type === 'string' ? search.type : undefined,
  }),
  component: TestimonialsIndexComponent,
})

type Testimonial = {
  _id: string
  name: string
  avatarInitial?: string
  rating: number
  text: string
  trip: string
  isActive: boolean
  type?: string[]
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

function TestimonialsIndexComponent() {
  const queryClient = useQueryClient()
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const page = searchParams.page ?? 1
  const limit = searchParams.limit ?? 10
  const isActiveFilter = searchParams.isActive ?? 'all'
  const typeFilter = searchParams.type ?? 'all'

  const setPage = (p: number) => {
    navigate({ search: (prev) => ({ ...prev, page: p }) })
  }

  const setLimit = (l: number) => {
    navigate({ search: (prev) => ({ ...prev, limit: l, page: 1 }) })
  }

  const setIsActiveFilter = (v: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        isActive: v === 'all' ? undefined : v,
        page: 1,
      }),
    })
  }

  const setTypeFilter = (v: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        type: v === 'all' ? undefined : v,
        page: 1,
      }),
    })
  }

  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    ...(isActiveFilter !== 'all' && { isActive: isActiveFilter }),
    ...(typeFilter !== 'all' && { type: typeFilter }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['testimonials-admin', queryParams],
    queryFn: async () => {
      const res = await _axios.get('/testimonials/admin', {
        params: queryParams,
      })
      return res.data as { data: Testimonial[]; pagination: PaginationMeta }
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) =>
      _axios.patch(`/testimonials/${id}/toggle-active`),
    onSuccess: () => {
      toast.success('Testimonial status updated')
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] })
    },
    onError: () => {
      toast.error('Failed to update status')
    },
  })

  const testimonials = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Testimonials
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage client testimonials displayed on Home, Tourism, and Medical pages
          </p>
        </div>
        <Link to="/testimonials/add" search={(prev) => prev}>
          <Button className="gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <Select
          value={isActiveFilter}
          onValueChange={(v) => {
            setIsActiveFilter(v)
          }}
        >
          <SelectTrigger className="h-9 w-40 text-sm cursor-pointer">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="all">
              All Status
            </SelectItem>
            <SelectItem className="cursor-pointer" value="true">
              Active Only
            </SelectItem>
            <SelectItem className="cursor-pointer" value="false">
              Inactive Only
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v)
          }}
        >
          <SelectTrigger className="h-9 w-44 text-sm cursor-pointer">
            <SelectValue placeholder="Filter by Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="all">
              All Pages
            </SelectItem>
            <SelectItem className="cursor-pointer" value="home">
              Home Page
            </SelectItem>
            <SelectItem className="cursor-pointer" value="tourism">
              Tourism Page
            </SelectItem>
            <SelectItem className="cursor-pointer" value="medical">
              Medical Page
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16 text-center">Initial</TableHead>
              <TableHead className="w-48">Client Name</TableHead>
              <TableHead className="w-32">Rating</TableHead>
              <TableHead className="w-64">Trip Details</TableHead>
              <TableHead>Testimonial Message</TableHead>
              <TableHead className="w-36">Display In</TableHead>
              <TableHead className="w-20 text-center">Order</TableHead>
              <TableHead className="w-28">Status</TableHead>
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
                <TableCell
                  colSpan={9}
                  className="text-center py-12 text-muted-foreground"
                >
                  Failed to load testimonials. Try again.
                </TableCell>
              </TableRow>
            ) : testimonials.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-12 text-muted-foreground"
                >
                  No testimonials found. Adjust filters or{' '}
                  <Link
                    to="/testimonials/add"
                    className="text-primary underline underline-offset-2"
                  >
                    add one
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((t) => {
                const displayTypes = (!t.type || t.type.length === 0) ? ['home'] : t.type
                return (
                  <TableRow key={t._id} className="hover:bg-muted/30">
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold mx-auto">
                        {t.avatarInitial || t.name.charAt(0).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {t.name}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="text-amber-500 font-semibold">
                        {'★'.repeat(t.rating)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {t.trip}
                    </TableCell>
                    <TableCell className="text-sm py-3 max-w-md truncate">
                      {t.text}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {displayTypes.map((tp) => {
                          const badgeClasses =
                            tp === 'tourism'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                              : tp === 'medical'
                              ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300'
                          return (
                            <span
                              key={tp}
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeClasses} capitalize`}
                            >
                              {tp}
                            </span>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-sm text-muted-foreground">
                      {t.order ?? 0}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={t.isActive}
                        onCheckedChange={() => toggleMutation.mutate(t._id)}
                        disabled={toggleMutation.isPending}
                        title={t.isActive ? 'Active (Click to deactivate)' : 'Inactive (Click to activate)'}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to="/testimonials/$id/edit"
                        params={{ id: t._id }}
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
                    </TableCell>
                  </TableRow>
                )
              })
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
