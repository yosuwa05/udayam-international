import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { _axios } from '@/lib/axios'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Plus, Pencil, Trash2, Check, X, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface RegionsSearch {
  page?: number
  limit?: number
  search?: string
  isActive?: string
}

export const Route = createFileRoute('/regions/')({
  validateSearch: (search: Record<string, unknown>): RegionsSearch => ({
    page: search.page ? Number(search.page) : 1,
    limit: search.limit ? Number(search.limit) : 10,
    search: typeof search.search === 'string' ? search.search : undefined,
    isActive: typeof search.isActive === 'string' ? search.isActive : undefined,
  }),
  component: RegionsIndexComponent,
})

type Region = {
  _id: string
  name: string
  isActive: boolean
  order?: number
  createdAt: string
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
  isActive: string
}

function RegionsIndexComponent() {
  const queryClient = useQueryClient()
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const page = searchParams.page ?? 1
  const limit = searchParams.limit ?? 10

  const filters: FilterState = {
    search: searchParams.search ?? '',
    isActive: searchParams.isActive ?? 'all',
  }

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<Region | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Forms state
  const [newName, setNewName] = useState('')
  const [newIsActive, setNewIsActive] = useState(true)
  const [newOrder, setNewOrder] = useState<number>(0)

  const [editName, setEditName] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)
  const [editOrder, setEditOrder] = useState<number>(0)

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
    ...(filters.isActive !== 'all' && { isActive: filters.isActive }),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['regions', queryParams],
    queryFn: async () => {
      const res = await _axios.get('/regions', { params: queryParams })
      return res.data as { data: Region[]; pagination: PaginationMeta }
    },
  })

  const addMutation = useMutation({
    mutationFn: (body: { name: string; isActive: boolean; order: number }) =>
      _axios.post('/regions', body),
    onSuccess: (res: any) => {
      toast.success(res.data?.message || 'Region created successfully')
      setIsAddOpen(false)
      setNewName('')
      setNewIsActive(true)
      setNewOrder(0)
      queryClient.invalidateQueries({ queryKey: ['regions'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create region')
    },
  })

  const editMutation = useMutation({
    mutationFn: (body: {
      id: string
      name: string
      isActive: boolean
      order: number
    }) =>
      _axios.patch(`/regions/${body.id}`, {
        name: body.name,
        isActive: body.isActive,
        order: body.order,
      }),
    onSuccess: (res: any) => {
      toast.success(res.data?.message || 'Region updated successfully')
      setEditItem(null)
      setEditOrder(0)
      queryClient.invalidateQueries({ queryKey: ['regions'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update region')
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => _axios.patch(`/regions/${id}/toggle-active`),
    onSuccess: (res: any) => {
      toast.success(res.data?.message || 'Region status updated')
      queryClient.invalidateQueries({ queryKey: ['regions'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to toggle status')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => _axios.delete(`/regions/${id}`),
    onSuccess: (res: any) => {
      toast.success(res.data?.message || 'Region deleted successfully')
      setDeleteId(null)
      queryClient.invalidateQueries({ queryKey: ['regions'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete region')
    },
  })

  const regions = data?.data ?? []
  const pagination = data?.pagination

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleOpenEdit = (item: Region) => {
    setEditItem(item)
    setEditName(item.name)
    setEditIsActive(item.isActive)
    setEditOrder(item.order ?? 0)
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Regions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage available regions (e.g. Domestic, International, Europe) for
            packages
          </p>
        </div>
        <Button
          className="gap-2 shrink-0 cursor-pointer"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Region
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-muted/20 p-4 rounded-xl border">
        <SearchInput
          placeholder="Search regions by name..."
          className="max-w-[300px]"
          value={filters.search}
          onChange={(v) => setFilter('search', v)}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={filters.isActive}
            onValueChange={(v) => setFilter('isActive', v)}
          >
            <SelectTrigger className="h-9 w-40 text-sm bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active Only</SelectItem>
              <SelectItem value="false">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

          {(filters.search || filters.isActive !== 'all') && (
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
              className="text-xs h-9 cursor-pointer"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Region Name</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="w-20 text-center">Order</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  Failed to load regions. Please try again.
                </TableCell>
              </TableRow>
            ) : regions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  No regions found.
                </TableCell>
              </TableRow>
            ) : (
              regions.map((item) => (
                <TableRow key={item._id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-sm text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-sm text-muted-foreground">
                    {item.order ?? 0}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={() => toggleMutation.mutate(item._id)}
                      disabled={toggleMutation.isPending}
                      title={item.isActive ? 'Active (Click to deactivate)' : 'Inactive (Click to activate)'}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                        onClick={() => setDeleteId(item._id)}
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

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Add Region</DialogTitle>
            <DialogDescription>
              Create a new region selection for packages.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Region Name</Label>
              <Input
                id="name"
                placeholder="e.g. Europe, Asia, Domestic"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                placeholder="0"
                value={newOrder}
                onChange={(e) => setNewOrder(Number(e.target.value))}
              />
            </div>
            {/* <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-xs">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active Status
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable this region immediately
                </p>
              </div>
              <Switch
                id="isActive"
                checked={newIsActive}
                onCheckedChange={setNewIsActive}
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={addMutation.isPending || !newName.trim()}
              onClick={() =>
                addMutation.mutate({
                  name: newName,
                  isActive: newIsActive,
                  order: newOrder,
                })
              }
              className="cursor-pointer"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit Region</DialogTitle>
            <DialogDescription>
              Update name or status details for this region.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="editName">Region Name</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editOrder">Display Order</Label>
              <Input
                id="editOrder"
                type="number"
                placeholder="0"
                value={editOrder}
                onChange={(e) => setEditOrder(Number(e.target.value))}
              />
            </div>
            {/* <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-xs">
              <div className="space-y-0.5">
                <Label htmlFor="editIsActive" className="text-sm font-medium">
                  Active Status
                </Label>
                <p className="text-xs text-muted-foreground">
                  Availability state of this region
                </p>
              </div>
              <Switch
                id="editIsActive"
                checked={editIsActive}
                onCheckedChange={setEditIsActive}
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditItem(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={editMutation.isPending || !editName.trim()}
              onClick={() =>
                editItem &&
                editMutation.mutate({
                  id: editItem._id,
                  name: editName,
                  isActive: editIsActive,
                  order: editOrder,
                })
              }
              className="cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the region from storage. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
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
