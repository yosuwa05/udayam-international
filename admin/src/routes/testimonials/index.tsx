import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
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

export const Route = createFileRoute('/testimonials/')({
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

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isActiveFilter, setIsActiveFilter] = useState('all')

  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    ...(isActiveFilter !== 'all' && { isActive: isActiveFilter }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['testimonials-admin', queryParams],
    queryFn: async () => {
      const res = await _axios.get('/testimonials/admin', { params: queryParams })
      return res.data as { data: Testimonial[]; pagination: PaginationMeta }
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => _axios.patch(`/testimonials/${id}/toggle-active`),
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
          <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage client testimonials displayed on the homepage
          </p>
        </div>
        <Link to="/testimonials/add">
          <Button className="gap-2">
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
            setPage(1)
          }}
        >
          <SelectTrigger className="h-9 w-40 text-sm">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active Only</SelectItem>
            <SelectItem value="false">Inactive Only</SelectItem>
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
              <TableHead className="w-28">Status</TableHead>
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
                  Failed to load testimonials. Try again.
                </TableCell>
              </TableRow>
            ) : testimonials.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
              testimonials.map((t) => (
                <TableRow key={t._id} className="hover:bg-muted/30">
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold mx-auto">
                      {t.avatarInitial || t.name.charAt(0).toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{t.name}</TableCell>
                  <TableCell className="text-sm">
                    <span className="text-amber-500 font-semibold">
                      {'★'.repeat(t.rating)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.trip}</TableCell>
                  <TableCell className="text-sm py-3 max-w-md truncate">
                    {t.text}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleMutation.mutate(t._id)}
                      disabled={toggleMutation.isPending}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 cursor-pointer transition-colors ${
                        t.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {t.isActive ? (
                        <>
                          <Check className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" /> Inactive
                        </>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to="/testimonials/$id/edit" params={{ id: t._id }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-3.5 h-3.5" />
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
