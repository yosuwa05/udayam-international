import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { SearchInput } from '@/components/SearchInput'
import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  Eye,
  Edit,
  Trash,
  Activity,
} from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/staff/')({
  component: StaffManagementComponent,
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

function StaffManagementComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Filters & Pagination
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'true' | 'false'>('all')

  // Modals state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  // Fetch Staff List
  const { data: staffData, isLoading, isError } = useQuery({
    queryKey: ['staff-list', page, limit, search, activeFilter],
    queryFn: async () => {
      const params: any = { page, limit }
      if (search.trim()) params.search = search.trim()
      if (activeFilter !== 'all') params.active = activeFilter
      const res = await _axios.get('/staff', { params })
      return res.data
    },
  })

  // Delete Staff Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await _axios.delete(`/staff/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Staff account deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['staff-list'] })
      setIsDeleteOpen(false)
      setSelectedStaff(null)
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || 'Failed to delete staff account'
      toast.error(msg)
    },
  })

  // Toggle Active Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await _axios.patch(`/staff/${id}/status`)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['staff-list'] })
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || 'Failed to update status'
      toast.error(msg)
    },
  })

  const openDeleteDialog = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setIsDeleteOpen(true)
  }

  const staffList = staffData?.data || []
  const pagination = staffData?.pagination

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Staff Management
            </h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Admin Only
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage staff accounts with custom role-based view, edit, and delete permissions for each layout route.
          </p>
        </div>

        <Button
          onClick={() => navigate({ to: '/staff/add' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm rounded-xl px-4 py-2 cursor-pointer"
        >
          <Plus size={18} />
          Add New Staff
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search by name or email..."
            value={search}
            onChange={(val) => {
              setSearch(val)
              setPage(1)
            }}
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs font-medium text-slate-600">Status:</span>
          {(['all', 'true', 'false'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter)
                setPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'true' ? 'Active' : 'Inactive'}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="w-[220px]">Staff Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-rose-500">
                  Failed to load staff accounts.
                </TableCell>
              </TableRow>
            ) : staffList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck className="h-10 w-10 text-slate-300" />
                    <p className="font-semibold text-slate-700">No staff accounts found</p>
                    <p className="text-xs text-slate-400">Click &ldquo;Add New Staff&rdquo; to create the first staff member account.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              staffList.map((staff: StaffMember) => {
                const viewCount = staff.permissions?.filter((p) => p.view).length || 0
                const createCount = staff.permissions?.filter((p) => p.create).length || 0
                const editCount = staff.permissions?.filter((p) => p.edit).length || 0
                const deleteCount = staff.permissions?.filter((p) => p.delete).length || 0

                return (
                  <TableRow key={staff._id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="font-medium text-slate-900">
                      <div
                        onClick={() =>
                          navigate({
                            to: '/staff/$id/activity',
                            params: { id: staff._id },
                          })
                        }
                        className="flex items-center gap-2.5 cursor-pointer group"
                        title="View Activity Timeline"
                      >
                        <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {staff.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {staff.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">{staff.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        STAFF
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Eye size={12} /> {viewCount} View
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                          <Plus size={12} /> {createCount} Create
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                          <Edit size={12} /> {editCount} Edit
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                          <Trash size={12} /> {deleteCount} Del
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={staff.active}
                          onCheckedChange={() => toggleStatusMutation.mutate(staff._id)}
                          className="cursor-pointer"
                        />
                        <span
                          className={`text-xs font-medium ${
                            staff.active ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {staff.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(staff.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate({
                              to: '/staff/$id/activity',
                              params: { id: staff._id },
                            })
                          }
                          className="h-8 w-8 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                          title="View Activity Timeline"
                        >
                          <Activity size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate({
                              to: '/staff/$id/edit',
                              params: { id: staff._id },
                            })
                          }
                          className="h-8 w-8 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                          title="Edit Staff & Permissions"
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(staff)}
                          className="h-8 w-8 text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete Staff"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
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

      {/* ── DELETE CONFIRMATION DIALOG ────────────────────────────────────── */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
              <Trash2 size={20} />
              Delete Staff Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete staff account{' '}
              <strong className="text-slate-900">{selectedStaff?.name}</strong> ({selectedStaff?.email})?
              This action cannot be undone and will immediately revoke their access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedStaff && deleteMutation.mutate(selectedStaff._id)}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
