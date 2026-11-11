import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'
import { CouponForm, type CouponFormValues } from '@/components/CouponForm'
import { usePermissions } from '@/lib/usePermissions'

export const Route = createFileRoute('/coupons/add')({
  validateSearch: (search: Record<string, unknown>) => search,
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { canCreate } = usePermissions()
  const hasCreate = canCreate('/coupons')

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
        'order',
        'applicableFor',
        'userType',
      ]

      for (const key of scalars) {
        const val = values[key]
        if (val !== undefined) {
          form.append(key, String(val))
        }
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
      console.log(err)
      toast.error(err?.error ?? 'Failed to create coupon')
    },
  })

  if (!hasCreate) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-3">
        <ShieldAlert className="h-10 w-10 text-rose-600 mx-auto" />
        <h2 className="text-base font-bold text-rose-950">Access Restricted</h2>
        <p className="text-xs text-rose-700">
          You do not have permission to create new coupons. Please contact an administrator.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/coupons', search: (prev) => prev })}
          className="cursor-pointer"
        >
          Back to Coupons
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/coupons', search: (prev) => prev })}
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
        onCancel={() => navigate({ to: '/coupons', search: (prev) => prev })}
      />
    </div>
  )
}
