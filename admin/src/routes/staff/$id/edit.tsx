import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'
import { StaffForm, type StaffFormValues } from '@/components/StaffForm'

export const Route = createFileRoute('/staff/$id/edit')({
  component: EditStaffRouteComponent,
})

function EditStaffRouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch single staff account details
  const {
    data: staffData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['staff', id],
    queryFn: async () => {
      const res = await _axios.get(`/staff/${id}`)
      return res.data?.data
    },
    enabled: !!id,
  })

  // Update staff mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: StaffFormValues) => {
      const res = await _axios.patch(`/staff/${id}`, payload)
      return res.data
    },
    onSuccess: () => {
      toast.success('Staff account updated successfully')
      queryClient.invalidateQueries({ queryKey: ['staff-list'] })
      queryClient.invalidateQueries({ queryKey: ['staff', id] })
      navigate({ to: '/staff' })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Failed to update staff account'
      toast.error(msg)
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer h-9 w-9 rounded-xl hover:bg-slate-100"
          onClick={() => navigate({ to: '/staff' })}
          title="Back to Staff List"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Staff Member & Permissions
            </h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Admin Only
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Update account information, credentials, and role-based route permissions.
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      ) : isError || !staffData ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-rose-500">
          Failed to load staff account details.
        </div>
      ) : (
        <StaffForm
          initialValues={staffData}
          onSubmit={(values) => updateMutation.mutate(values)}
          isLoading={updateMutation.isPending}
          isEdit
        />
      )}
    </div>
  )
}

