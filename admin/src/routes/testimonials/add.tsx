import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { toast } from 'sonner'
import { TestimonialForm } from '@/components/TestimonialForm'
import type { TestimonialFormValues } from '@/components/TestimonialForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { usePermissions } from '@/lib/usePermissions'

export const Route = createFileRoute('/testimonials/add')({
  validateSearch: (search: Record<string, unknown>) => search,
  component: AddTestimonialComponent,
})

function AddTestimonialComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { canCreate } = usePermissions()
  const hasCreate = canCreate('/testimonials')

  const addMutation = useMutation({
    mutationFn: (data: TestimonialFormValues) =>
      _axios.post('/testimonials', data),
    onSuccess: () => {
      toast.success('Testimonial created successfully')
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] })
      navigate({ to: '/testimonials' })
    },
    onError: () => {
      toast.error('Failed to create testimonial')
    },
  })

  if (!hasCreate) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-3">
        <ShieldAlert className="h-10 w-10 text-rose-600 mx-auto" />
        <h2 className="text-base font-bold text-rose-950">Access Restricted</h2>
        <p className="text-xs text-rose-700">
          You do not have permission to create new testimonials. Please contact an administrator.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/testimonials', search: (prev) => prev })}
          className="cursor-pointer"
        >
          Back to Testimonials
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => navigate({ to: '/testimonials', search: (prev) => prev })}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Add Testimonial
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 px-10">
          Add a new client review/testimonial.
        </p>
      </div>

      <TestimonialForm
        onSubmit={(data) => addMutation.mutate(data)}
        isSubmitting={addMutation.isPending}
        submitLabel="Create Testimonial"
        onCancel={() => navigate({ to: '/testimonials', search: (prev) => prev })}
      />
    </div>
  )
}
