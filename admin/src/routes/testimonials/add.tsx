import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { toast } from 'sonner'
import { TestimonialForm } from '@/components/TestimonialForm'
import type { TestimonialFormValues } from '@/components/TestimonialForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/testimonials/add')({
  component: AddTestimonialComponent,
})

function AddTestimonialComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  return (
    <div className="p-6 max-w-4xl space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => navigate({ to: '/tourism' })}
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
        onCancel={() => navigate({ to: '/testimonials' })}
      />
    </div>
  )
}
