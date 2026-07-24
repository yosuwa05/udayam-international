import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'
import { CouponForm, type CouponFormValues } from '@/components/CouponForm'

export const Route = createFileRoute('/coupons/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch existing coupon
  const {
    data: coupon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['coupons', id],
    queryFn: async () => {
      const res = await _axios.get(`/coupon/${id}`)
      return res.data?.data
    },
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: async (values: CouponFormValues) => {
      const form = new FormData()

      // Scalar fields
      const scalars: (keyof CouponFormValues)[] = [
        'title',
        'description',
        'couponCode',
        'discountType',
        'discountValue',
        'minimumBookingAmount',
        'totalUsageLimit',
        'perUserUsageLimit',
        'validFrom',
        'validTo',
        'status',
        'applicableFor',
        'userType',
      ]

      for (const key of scalars) {
        const val = values[key]
        if (val !== undefined && val !== '') {
          form.append(key, String(val))
        }
      }

      if (values.discountType === 'PERCENTAGE') {
        form.append('maximumDiscountAmount', String(values.maximumDiscountAmount ?? ''))
      } else {
        // Clear/unset if it's fixed amount
        form.append('maximumDiscountAmount', '')
      }

      // Arrays as JSON strings
      form.append('packageIds', JSON.stringify(values.packageIds ?? []))
      form.append('userIds', JSON.stringify(values.userIds ?? []))

      // Only append banner if a new file was selected
      if (values.bannerImage instanceof File) {
        form.append('bannerImage', values.bannerImage)
      }

      return _axios.patch(`/coupon/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      toast.success('Coupon updated successfully')
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      queryClient.invalidateQueries({ queryKey: ['coupons', id] })
      navigate({ to: '/coupons' })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? 'Failed to update coupon')
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

  if (isError || !coupon) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-center space-y-3">
        <p className="text-muted-foreground">Could not load this coupon.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/coupons' })}>
          Back to list
        </Button>
      </div>
    )
  }

  // Map API fields to form values
  const defaultValues: Partial<CouponFormValues> = {
    title: coupon.title,
    description: coupon.description ?? '',
    couponCode: coupon.couponCode,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minimumBookingAmount: coupon.minimumBookingAmount,
    maximumDiscountAmount: coupon.maximumDiscountAmount ?? '',
    totalUsageLimit: coupon.totalUsageLimit,
    perUserUsageLimit: coupon.perUserUsageLimit,
    applicableFor: coupon.applicableFor ?? 'ALL',
    packageIds: coupon.packageIds ?? [],
    userType: coupon.userType ?? 'ALL_USERS',
    userIds: coupon.userIds ?? [],
    validFrom: coupon.validFrom,
    validTo: coupon.validTo,
    status: coupon.status ?? 'ACTIVE',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/coupons' })}
          className="cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Coupon</h1>
          <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-xs">
            {coupon.couponCode}
          </p>
        </div>
      </div>

      <CouponForm
        defaultValues={defaultValues}
        existingBannerImageUrl={coupon.bannerImage}
        submitLabel="Save Changes"
        isSubmitting={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data)}
        onCancel={() => navigate({ to: '/coupons' })}
      />
    </div>
  )
}
