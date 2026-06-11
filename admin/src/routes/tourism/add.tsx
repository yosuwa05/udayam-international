import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'
import { TourismForm, type TourismFormValues } from '@/components/TourismForm'

export const Route = createFileRoute('/tourism/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: TourismFormValues) => {
      const form = new FormData()

      // Scalar fields
      const scalars: (keyof TourismFormValues)[] = [
        'title',
        'destination',
        'destinationRegion',
        'packageType',
        'price',
        'days',
        'nights',
        'minPax',
        'maxPax',
        'discount',
        'label',
        'description',
        'isActive',
        'isFeatured',
      ]
      for (const key of scalars) {
        const val = values[key]
        if (val !== undefined && val !== '') {
          form.append(key, String(val))
        }
      }

      if (values.strikePrice !== undefined) {
        form.append('strikePrice', String(values.strikePrice))
      }

      // Arrays as JSON strings
      form.append('tripTypes', JSON.stringify(values.tripTypes))
      form.append('badges', JSON.stringify(values.badges))
      form.append('inclusions', JSON.stringify(values.inclusions))
      if (values.highlights?.length) {
        form.append('highlights', JSON.stringify(values.highlights))
      }
      if (values.itinerary?.length) {
        form.append('itinerary', JSON.stringify(values.itinerary))
      }

      // File
      if (values.imageUrl) {
        form.append('imageUrl', values.imageUrl)
      }

      return _axios.post('/tourism', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      toast.success('Package created successfully')
      queryClient.invalidateQueries({ queryKey: ['tourism'] })
      navigate({ to: '/tourism' })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? 'Failed to create package')
    },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/tourism' })}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Add Package</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new travel package
          </p>
        </div>
      </div>

      <TourismForm
        submitLabel="Create Package"
        isSubmitting={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data)}
        onCancel={() => navigate({ to: '/tourism' })}
      />
    </div>
  )
}
