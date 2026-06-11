import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'
import { TourismForm, type TourismFormValues } from '@/components/TourismForm'

export const Route = createFileRoute('/tourism/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch existing package
  const {
    data: pkg,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tourism', id],
    queryFn: async () => {
      const res = await _axios.get(`/tourism/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: async (values: TourismFormValues) => {
      const form = new FormData()

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

      form.append('tripTypes', JSON.stringify(values.tripTypes))
      form.append('badges', JSON.stringify(values.badges))
      form.append('inclusions', JSON.stringify(values.inclusions))
      if (values.highlights?.length) {
        form.append('highlights', JSON.stringify(values.highlights))
      }
      if (values.itinerary?.length) {
        form.append('itinerary', JSON.stringify(values.itinerary))
      }

      // Only append image if a new file was selected
      if (values.imageUrl instanceof File) {
        form.append('imageUrl', values.imageUrl)
      }

      return _axios.patch(`/tourism/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      toast.success('Package updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tourism'] })
      queryClient.invalidateQueries({ queryKey: ['tourism', id] })
      navigate({ to: '/tourism' })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? 'Failed to update package')
    },
  })

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError || !pkg) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-center space-y-3">
        <p className="text-muted-foreground">Could not load this package.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/tourism' })}>
          Back to list
        </Button>
      </div>
    )
  }

  // Map API shape → form default values
  const defaultValues: Partial<TourismFormValues> = {
    title: pkg.title,
    destination: pkg.destination,
    destinationRegion: pkg.destinationRegion,
    packageType: pkg.packageType,
    tripTypes: pkg.tripTypes ?? [],
    price: pkg.price,
    strikePrice: pkg.strikePrice,
    discount: pkg.discount ?? '',
    days: pkg.days,
    nights: pkg.nights,
    minPax: pkg.minPax,
    maxPax: pkg.maxPax,
    badges: pkg.badges ?? [],
    inclusions: pkg.inclusions ?? [],
    description: pkg.description ?? '',
    highlights: pkg.highlights ?? [],
    itinerary: pkg.itinerary ?? [],
    isActive: pkg.isActive,
    isFeatured: pkg.isFeatured,
    label: pkg.label ?? '',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/tourism' })}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Package
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-xs">
            {pkg.title}
          </p>
        </div>
      </div>

      <TourismForm
        defaultValues={defaultValues}
        existingImageUrl={pkg.imageUrl}
        submitLabel="Save Changes"
        isSubmitting={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data)}
        onCancel={() => navigate({ to: '/tourism' })}
      />
    </div>
  )
}
