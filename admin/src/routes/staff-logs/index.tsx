import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  Activity,
  Calendar,
  Filter,
  Eye,
  RefreshCw,
  Clock,
  User,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode,
  FileText,
  CheckCircle2,
  Trash2,
  Edit3,
  PlusCircle,
} from 'lucide-react'

export const Route = createFileRoute('/staff-logs/')({
  component: StaffLogsComponent,
})

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
  previousData?: any
  updatedData?: any
  details?: string
  ipAddress?: string
  userAgent?: string
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

function StaffLogsComponent() {
  const navigate = useNavigate()

  // Filters & Pagination
  const [page, setPage] = useState(1)
  const [limit] = useState(15)
  const [search, setSearch] = useState('')
  const [staffFilter, setStaffFilter] = useState('ALL')
  const [moduleFilter, setModuleFilter] = useState('ALL')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Detail Modal State
  const [selectedLog, setSelectedLog] = useState<StaffLog | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Fetch Staff accounts for dropdown filter
  const { data: staffListData } = useQuery({
    queryKey: ['staff-dropdown'],
    queryFn: async () => {
      const res = await _axios.get('/staff', { params: { limit: 100 } })
      return res.data?.data || []
    },
  })

  // Fetch Activity Logs
  const { data: logsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['staff-logs', page, limit, search, staffFilter, moduleFilter, actionFilter, startDate, endDate],
    queryFn: async () => {
      const params: any = { page, limit }
      if (search.trim()) params.search = search.trim()
      if (staffFilter !== 'ALL') params.staffId = staffFilter
      if (moduleFilter !== 'ALL') params.module = moduleFilter
      if (actionFilter !== 'ALL') params.action = actionFilter
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const res = await _axios.get('/staff/logs', { params })
      return res.data
    },
  })

  const resetFilters = () => {
    setSearch('')
    setStaffFilter('ALL')
    setModuleFilter('ALL')
    setActionFilter('ALL')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const openLogDetails = (log: StaffLog) => {
    setSelectedLog(log)
    setIsDetailOpen(true)
  }

  const logsList: StaffLog[] = logsData?.data || []
  const pagination = logsData?.pagination

  const renderActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <PlusCircle size={12} /> CREATE
          </span>
        )
      case 'UPDATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Edit3 size={12} /> UPDATE
          </span>
        )
      case 'DELETE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Trash2 size={12} /> DELETE
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {action}
          </span>
        )
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Staff Activity Audit Logs
            </h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Audit System
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and track all create, update, and delete actions performed by staff across trip styles, regions, tourism packages, bookings, coupons, and users.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-xl text-slate-700 hover:text-indigo-600 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={15} />
          Refresh Logs
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Search Query */}
          <div className="col-span-1 sm:col-span-2">
            <Label className="text-xs font-semibold text-slate-600 mb-1 block">Search Details</Label>
            <SearchInput
              placeholder="Search title, details, staff..."
              value={search}
              onChange={(val) => {
                setSearch(val)
                setPage(1)
              }}
            />
          </div>

          {/* Filter by Staff */}
          <div>
            <Label className="text-xs font-semibold text-slate-600 mb-1 block">Staff Member</Label>
            <Select
              value={staffFilter}
              onValueChange={(val) => {
                setStaffFilter(val)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full bg-white text-xs h-9">
                <SelectValue placeholder="All Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Staff</SelectItem>
                {(staffListData || []).map((s: any) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name || s.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Module */}
          <div>
            <Label className="text-xs font-semibold text-slate-600 mb-1 block">Module</Label>
            <Select
              value={moduleFilter}
              onValueChange={(val) => {
                setModuleFilter(val)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full bg-white text-xs h-9">
                <SelectValue placeholder="All Modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Modules</SelectItem>
                {AVAILABLE_MODULES.map((mod) => (
                  <SelectItem key={mod} value={mod}>
                    {mod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Action */}
          <div>
            <Label className="text-xs font-semibold text-slate-600 mb-1 block">Action</Label>
            <Select
              value={actionFilter}
              onValueChange={(val) => {
                setActionFilter(val)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full bg-white text-xs h-9">
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

          {/* Reset button */}
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="w-full h-9 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Date Range Row */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-200/70 text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Calendar size={13} /> Date Range:
          </span>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setPage(1)
              }}
              className="h-8 text-xs bg-white w-36"
            />
            <span className="text-slate-400">to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setPage(1)
              }}
              className="h-8 text-xs bg-white w-36"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="w-[170px]">Date & Time</TableHead>
              <TableHead className="w-[180px]">Staff Member</TableHead>
              <TableHead className="w-[110px]">Action</TableHead>
              <TableHead className="w-[140px]">Module</TableHead>
              <TableHead>Record / Title</TableHead>
              <TableHead>Summary / Details</TableHead>
              <TableHead className="text-right w-[100px]">Inspect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-rose-500">
                  Failed to load activity logs.
                </TableCell>
              </TableRow>
            ) : logsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Activity className="h-10 w-10 text-slate-300" />
                    <p className="font-semibold text-slate-700">No activity logs recorded yet</p>
                    <p className="text-xs text-slate-400">
                      When staff members create, update, or delete records, their activities will appear here automatically.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logsList.map((log) => {
                const dateObj = new Date(log.createdAt)
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
                  <TableRow key={log._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Timestamp */}
                    <TableCell className="text-xs font-medium text-slate-700">
                      <div>
                        <p className="font-semibold text-slate-900">{formattedDate}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {formattedTime}
                        </p>
                      </div>
                    </TableCell>

                    {/* Staff */}
                    <TableCell className="text-xs">
                      <div
                        onClick={() =>
                          navigate({
                            to: '/staff/$id/activity',
                            params: { id: log.staffId },
                          })
                        }
                        className="cursor-pointer group"
                        title="View Staff Activity Timeline"
                      >
                        <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {log.staffName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono truncate max-w-[160px]">
                          {log.staffEmail}
                        </p>
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell>{renderActionBadge(log.action)}</TableCell>

                    {/* Module */}
                    <TableCell className="text-xs">
                      <span className="font-semibold text-slate-800">{log.module}</span>
                      <p className="text-[10px] text-slate-400 font-mono">{log.route}</p>
                    </TableCell>

                    {/* Record Title */}
                    <TableCell className="text-xs">
                      <p className="font-semibold text-slate-900 truncate max-w-[200px]">
                        {log.recordTitle || '—'}
                      </p>
                      {log.recordId && (
                        <p className="text-[10px] text-slate-400 font-mono">
                          ID: {log.recordId}
                        </p>
                      )}
                    </TableCell>

                    {/* Details */}
                    <TableCell className="text-xs text-slate-600">
                      <p className="line-clamp-2">{log.details || '—'}</p>
                    </TableCell>

                    {/* Action button */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openLogDetails(log)}
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 cursor-pointer"
                        title="View Detailed Snapshot & Changes"
                      >
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* ── AUDIT LOG DETAILS MODAL ───────────────────────────────────────── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-600" />
              Activity Audit Log Details
            </DialogTitle>
            <DialogDescription>
              Detailed audit trail and data snapshots for this staff action.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6 pt-2">
              {/* Snapshot Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Staff Member
                  </span>
                  <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedLog.staffName}</p>
                  <p className="text-xs text-slate-500 font-mono truncate">{selectedLog.staffEmail}</p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Action Performed
                  </span>
                  <div className="mt-1">{renderActionBadge(selectedLog.action)}</div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Module & Route
                  </span>
                  <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedLog.module}</p>
                  <p className="text-xs text-slate-500 font-mono">{selectedLog.route}</p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Timestamp
                  </span>
                  <p className="font-bold text-sm text-slate-900 mt-0.5">
                    {new Date(selectedLog.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Record Summary */}
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <p className="text-xs font-semibold text-indigo-900">
                  Target Record: <span className="font-normal text-indigo-800">{selectedLog.recordTitle || selectedLog.recordId || 'N/A'}</span>
                </p>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Summary: {selectedLog.details}
                </p>
                {selectedLog.ipAddress && (
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    IP Address: {selectedLog.ipAddress}
                  </p>
                )}
              </div>

              {/* Data Diff: Previous Data vs Updated Data */}
              {selectedLog.action === 'UPDATE' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Previous Data */}
                  <div className="border border-rose-200 rounded-xl bg-rose-50/20 overflow-hidden">
                    <div className="px-3.5 py-2.5 bg-rose-100/60 border-b border-rose-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                        <FileText size={14} /> Previous Data (Before Update)
                      </span>
                    </div>
                    <div className="p-3 text-xs font-mono max-h-72 overflow-y-auto">
                      {selectedLog.previousData ? (
                        <pre className="text-slate-800 whitespace-pre-wrap text-[11px]">
                          {JSON.stringify(selectedLog.previousData, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-slate-400 italic">No previous snapshot available</p>
                      )}
                    </div>
                  </div>

                  {/* Updated Data */}
                  <div className="border border-emerald-200 rounded-xl bg-emerald-50/20 overflow-hidden">
                    <div className="px-3.5 py-2.5 bg-emerald-100/60 border-b border-emerald-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Updated Data (After Update)
                      </span>
                    </div>
                    <div className="p-3 text-xs font-mono max-h-72 overflow-y-auto">
                      {selectedLog.updatedData ? (
                        <pre className="text-slate-800 whitespace-pre-wrap text-[11px]">
                          {JSON.stringify(selectedLog.updatedData, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-slate-400 italic">No updated snapshot available</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : selectedLog.action === 'CREATE' ? (
                <div className="border border-emerald-200 rounded-xl bg-emerald-50/20 overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-emerald-100/60 border-b border-emerald-200">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Created Document Snapshot
                    </span>
                  </div>
                  <div className="p-3 text-xs font-mono max-h-80 overflow-y-auto">
                    <pre className="text-slate-800 whitespace-pre-wrap text-[11px]">
                      {JSON.stringify(selectedLog.updatedData || selectedLog.previousData, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="border border-rose-200 rounded-xl bg-rose-50/20 overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-rose-100/60 border-b border-rose-200">
                    <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                      <Trash2 size={14} /> Deleted Document Snapshot (Before Removal)
                    </span>
                  </div>
                  <div className="p-3 text-xs font-mono max-h-80 overflow-y-auto">
                    <pre className="text-slate-800 whitespace-pre-wrap text-[11px]">
                      {JSON.stringify(selectedLog.previousData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
