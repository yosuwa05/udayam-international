import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'
import { CouponForm, type CouponFormValues } from '@/components/CouponForm'

export const Route = createFileRoute('/coupons/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

      if (values.discountType === 'PERCENTAGE' && values.maximumDiscountAmount !== undefined && values.maximumDiscountAmount !== '') {
        form.append('maximumDiscountAmount', String(values.maximumDiscountAmount))
      }

      // Arrays as JSON strings
      form.append('packageIds', JSON.stringify(values.packageIds ?? []))
      form.append('userIds', JSON.stringify(values.userIds ?? []))

      // File banner
      if (values.bannerImage) {
        form.append('bannerImage', values.bannerImage)
      }

      return _axios.post('/coupon', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      toast.success('Coupon created successfully')
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      navigate({ to: '/coupons' })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? 'Failed to create coupon')
    },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Page header */}
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
          <h1 className="text-2xl font-semibold tracking-tight">Add Coupon</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure and publish a new discount coupon
          </p>
        </div>
      </div>

      <CouponForm
        submitLabel="Create Coupon"
        isSubmitting={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data)}
        onCancel={() => navigate({ to: '/coupons' })}
      />
    </div>
  )
}
