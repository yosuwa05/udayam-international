import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { toast } from 'sonner'
import { TestimonialForm } from '@/components/TestimonialForm'
import type { TestimonialFormValues } from '@/components/TestimonialForm'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/testimonials/$id/edit')({
  component: EditTestimonialComponent,
})

function EditTestimonialComponent() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['testimonial', id],
    queryFn: async () => {
      const res = await _axios.get(`/testimonials/${id}`)
      return res.data.data as TestimonialFormValues
    },
  })

  const editMutation = useMutation({
    mutationFn: (updateData: TestimonialFormValues) =>
      _axios.patch(`/testimonials/${id}`, updateData),
    onSuccess: () => {
      toast.success('Testimonial updated successfully')
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] })
      queryClient.invalidateQueries({ queryKey: ['testimonial', id] })
      navigate({ to: '/testimonials' })
    },
    onError: () => {
      toast.error('Failed to update testimonial')
    },
  })

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Failed to load testimonial or testimonial not found.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Testimonial</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Modify testimonial details.
        </p>
      </div>

      <TestimonialForm
        defaultValues={data}
        onSubmit={(updateData) => editMutation.mutate(updateData)}
        isSubmitting={editMutation.isPending}
        submitLabel="Save Changes"
        onCancel={() => navigate({ to: '/testimonials' })}
      />
    </div>
  )
}
