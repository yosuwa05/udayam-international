import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchInput } from '@/components/SearchInput'
import {
  ArrowLeft,
  Activity,
  Clock,
  Mail,
  Calendar,
  RefreshCw,
  Edit3,
  Search,
  Filter,
  UserCheck,
} from 'lucide-react'

export const Route = createFileRoute('/staff/$id/activity')({
  component: StaffActivityTimelineComponent,
})

interface RoutePermission {
  route: string
  name: string
  view: boolean
  edit: boolean
  delete: boolean
}

interface StaffMember {
  _id: string
  name: string
  email: string
  role: string
  active: boolean
  permissions: RoutePermission[]
  createdAt: string
  updatedAt: string
}

interface StaffLog {
  _id: string
  staffId: string
  staffName: string
  staffEmail: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  module: string
  route: string
  recordId: string
  recordTitle?: string
  details?: string
  createdAt: string
  updatedAt: string
}

const AVAILABLE_MODULES = [
  'Trip Types',
  'Regions',
  'Tourism',
  'Coupons',
  'Testimonials',
  'Standard Bookings',
  'Customized Bookings',
  'Users',
]

function StaffActivityTimelineComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  // Filters & Pagination
  const [page, setPage] = useState(1)
  const [limit] = useState(25)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('ALL')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 1. Fetch Staff Profile Details
  const {
    data: staffData,
    isLoading: isLoadingStaff,
    isError: isErrorStaff,
  } = useQuery({
    queryKey: ['staff', id],
    queryFn: async () => {
      const res = await _axios.get(`/staff/${id}`)
      return res.data?.data as StaffMember
    },
    enabled: !!id,
  })

  // 2. Fetch Activity Logs for this Staff Member
  const {
    data: logsData,
    isLoading: isLoadingLogs,
    isError: isErrorLogs,
    refetch,
  } = useQuery({
    queryKey: [
      'staff-activity',
      id,
      page,
      limit,
      search,
      moduleFilter,
      actionFilter,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const params: any = {
        staffId: id,
        page,
        limit,
      }
      if (search.trim()) params.search = search.trim()
      if (moduleFilter !== 'ALL') params.module = moduleFilter
      if (actionFilter !== 'ALL') params.action = actionFilter
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const res = await _axios.get('/staff/logs', { params })
      return res.data
    },
    enabled: !!id,
  })

  const resetFilters = () => {
    setSearch('')
    setModuleFilter('ALL')
    setActionFilter('ALL')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const logs: StaffLog[] = logsData?.data || []
  const pagination = logsData?.pagination
  const totalCount = pagination?.total ?? 0

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'UPDATE':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getActionDotClass = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-500'
      case 'UPDATE':
        return 'bg-blue-500'
      case 'DELETE':
        return 'bg-rose-500'
      default:
        return 'bg-slate-400'
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
      {/* Compact Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/staff' })}
            className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
            title="Back to Staff Directory"
          >
            <ArrowLeft size={16} />
          </Button>

          {isLoadingStaff ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ) : isErrorStaff || !staffData ? (
            <p className="text-sm font-semibold text-rose-500">Failed to load staff details</p>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {staffData.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 leading-tight">
                    {staffData.name}
                  </h1>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    Staff
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                      staffData.active ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        staffData.active ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    {staffData.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{staffData.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
            {totalCount} Logged Actions
          </span>
          {staffData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate({
                  to: '/staff/$id/edit',
                  params: { id: staffData._id },
                })
              }
              className="h-8 text-xs px-2.5 cursor-pointer text-slate-700 hover:text-indigo-600"
            >
              <Edit3 size={13} className="mr-1" />
              Edit Permissions
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            className="h-8 w-8 text-slate-500 hover:text-indigo-600 cursor-pointer"
            title="Refresh Timeline"
          >
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      {/* Compact Filters Strip */}
      <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/90 flex flex-wrap items-center gap-2.5 text-xs">
        {/* Search */}
        <div className="w-full sm:w-56">
          <Input
            placeholder="Search action details..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="h-8 text-xs bg-white"
          />
        </div>

        {/* Module Filter */}
        <div className="w-36">
          <Select
            value={moduleFilter}
            onValueChange={(val) => {
              setModuleFilter(val)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-8 text-xs bg-white">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Modules</SelectItem>
              {AVAILABLE_MODULES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Filter */}
        <div className="w-32">
          <Select
            value={actionFilter}
            onValueChange={(val) => {
              setActionFilter(val)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-8 text-xs bg-white">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              <SelectItem value="CREATE">CREATE</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Inputs */}
        <div className="flex items-center gap-1.5">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              setPage(1)
            }}
            className="h-8 text-xs bg-white w-32"
          />
          <span className="text-slate-400">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              setPage(1)
            }}
            className="h-8 text-xs bg-white w-32"
          />
        </div>

        {/* Clear Filters */}
        {(search || moduleFilter !== 'ALL' || actionFilter !== 'ALL' || startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs text-slate-500 hover:text-slate-900 cursor-pointer ml-auto"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Redesigned Compact Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-indigo-600" />
            <span>Activity Timeline</span>
          </div>
          <span>Showing {logs.length} of {totalCount} events</span>
        </div>

        {isLoadingLogs ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2.5 flex-1">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : isErrorLogs ? (
          <div className="text-center py-8 text-rose-500 text-xs font-semibold">
            Failed to load activity timeline.
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-1">
            <Clock className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-sm text-slate-700">No activity recorded</p>
            <p className="text-xs text-slate-400">
              When this staff member creates, updates, or deletes records, actions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((item) => {
              const dateObj = new Date(item.createdAt)
              const formattedDate = dateObj.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
              const formattedTime = dateObj.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })

              return (
                <div
                  key={item._id}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Left: Action, Module & Details */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
                    {/* Small Status Dot */}
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${getActionDotClass(item.action)}`}
                    />

                    {/* Action Pill */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${getActionBadgeClass(
                        item.action
                      )}`}
                    >
                      {item.action}
                    </span>

                    {/* Module Tag */}
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                      {item.module}
                    </span>

                    {/* Human Readable Details */}
                    <span className="text-xs text-slate-800 font-medium truncate max-w-xl">
                      {item.details || `${item.action} on ${item.module}`}
                    </span>
                  </div>

                  {/* Right: Date & Time */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono shrink-0 sm:self-auto self-end">
                    <Calendar size={11} className="text-slate-400" />
                    <span>{formattedDate}</span>
                    <span className="text-slate-300">•</span>
                    <span>{formattedTime}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Compact Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-3 bg-slate-50/60 border-t border-slate-100">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
