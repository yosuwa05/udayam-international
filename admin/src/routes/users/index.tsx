import { createFileRoute } from '@tanstack/react-router'
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
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Search,
  User as UserIcon,
  Shield,
  Ban,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react'

export const Route = createFileRoute('/users/')({
  component: AdminUsersComponent,
})

type UserRecord = {
  _id: string
  fullName: string
  email?: string
  mobile?: string
  countryCode?: string
  loginType: 'MOBILE' | 'GOOGLE'
  profileImage?: string
  isMobileVerified: boolean
  isEmailVerified: boolean
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED'
  lastLoginAt?: string
  createdAt: string
}

type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type FilterState = {
  search: string
  loginType: string
  status: string
}

function AdminUsersComponent() {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    loginType: 'ALL',
    status: 'ALL',
  })

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
    ...(filters.search && { search: filters.search }),
    ...(filters.loginType !== 'ALL' && { loginType: filters.loginType }),
    ...(filters.status !== 'ALL' && { status: filters.status }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', queryParams],
    queryFn: async () => {
      const res = await _axios.get('/user-auth/admin/users', {
        params: queryParams,
      })
      return res.data as { data: UserRecord[]; pagination: PaginationMeta }
    },
  })

  const users = data?.data ?? []
  const pagination = data?.pagination

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: 'ACTIVE' | 'BLOCKED'
    }) => {
      const res = await _axios.patch(`/user-auth/admin/users/${id}/status`, {
        status,
      })
      return res.data
    },
    onSuccess: (res) => {
      toast.success(res.message || 'User status updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to update user status')
    },
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
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
          <h1 className="text-2xl font-semibold tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            View registered customer accounts, check verification statuses, and
            manage access permissions
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-muted/20 p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by full name, email, or mobile number..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="pl-9 bg-background h-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Login Type Filter */}
          <Select
            value={filters.loginType}
            onValueChange={(v) => setFilter('loginType', v)}
          >
            <SelectTrigger className="h-9 w-44 text-sm bg-background">
              <SelectValue placeholder="Login Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Login Methods</SelectItem>
              <SelectItem value="GOOGLE">Google OAuth</SelectItem>
              <SelectItem value="MOBILE">Mobile OTP</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(v) => setFilter('status', v)}
          >
            <SelectTrigger className="h-9 w-44 text-sm bg-background">
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Account Statuses</SelectItem>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="BLOCKED">BLOCKED</SelectItem>
              <SelectItem value="DELETED">DELETED</SelectItem>
            </SelectContent>
          </Select>

          {(filters.search ||
            filters.loginType !== 'ALL' ||
            filters.status !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({ search: '', loginType: 'ALL', status: 'ALL' })
                setPage(1)
              }}
              className="text-xs h-9"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Customer Account</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
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
                  Failed to load users list. Please try again.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                >
                  No user accounts match your search or filter parameters.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u._id} className="hover:bg-muted/30">
                  {/* User Profile */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden border">
                        {u.profileImage ? (
                          <img
                            src={u.profileImage}
                            alt={u.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (u.fullName?.[0] || 'U').toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">
                          {u.fullName || 'Unnamed User'}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          ID: {u._id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="text-xs">
                    {u.email ? (
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        {u.email}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not provided
                      </span>
                    )}
                  </TableCell>

                  {/* Mobile */}
                  <TableCell className="text-xs font-mono">
                    {u.mobile ? (
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        {u.countryCode || '+91'} {u.mobile}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic font-sans">
                        Not provided
                      </span>
                    )}
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(u.createdAt)}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    {u.status === 'ACTIVE' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: u._id,
                            status: 'BLOCKED',
                          })
                        }
                        className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 gap-1.5 cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" /> Block
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: u._id,
                            status: 'ACTIVE',
                          })
                        }
                        className="h-8 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unblock
                      </Button>
                    )}
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
