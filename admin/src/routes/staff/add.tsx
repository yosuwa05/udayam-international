import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'
import { StaffForm, type StaffFormValues } from '@/components/StaffForm'

export const Route = createFileRoute('/staff/add')({
  component: AddStaffRouteComponent,
})

function AddStaffRouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async (payload: StaffFormValues) => {
      const res = await _axios.post('/staff', payload)
      return res.data
    },
    onSuccess: () => {
      toast.success('Staff account created successfully')
      queryClient.invalidateQueries({ queryKey: ['staff-list'] })
      navigate({ to: '/staff' })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Failed to create staff account'
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
              Create New Staff Member
            </h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Admin Only
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure staff credentials and assign customized View, Edit, and Delete access per layout route.
          </p>
        </div>
      </div>

      {/* Staff Form */}
      <StaffForm
        onSubmit={(values) => createMutation.mutate(values)}
        isLoading={createMutation.isPending}
      />
    </div>
  )
}

