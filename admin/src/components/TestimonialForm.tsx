import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const TYPE_OPTIONS = [
  { label: 'Home', value: 'home', desc: 'Main Home page' },
  { label: 'Tourism', value: 'tourism', desc: 'UV Holidays Tourism page' },
  { label: 'Medical', value: 'medical', desc: 'Medical Tourism page' },
] as const

export type TestimonialFormValues = {
  name: string
  avatarInitial?: string
  rating: number
  text: string
  trip: string
  isActive: boolean
  type: string[]
  order?: number
}

type Props = {
  defaultValues?: Partial<TestimonialFormValues>
  onSubmit: (data: TestimonialFormValues) => void
  isSubmitting: boolean
  submitLabel: string
  onCancel: () => void
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function TestimonialForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    defaultValues: {
      name: '',
      avatarInitial: '',
      rating: 5,
      text: '',
      trip: '',
      isActive: true,
      type: defaultValues?.type && defaultValues.type.length > 0 ? defaultValues.type : ['home'],
      order: 0,
      ...defaultValues,
    },
  })

  const textValue = watch('text', '')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Section title="Testimonial Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Client Name" required error={errors.name?.message}>
            <Input
              placeholder="e.g. Priya Menon"
              {...register('name', { required: 'Name is required' })}
            />
          </Field>

          <Field
            label="Avatar Initial (Optional)"
            error={errors.avatarInitial?.message}
          >
            <Input
              placeholder="e.g. P"
              maxLength={2}
              {...register('avatarInitial')}
            />
          </Field>

          <Field label="Rating" required error={errors.rating?.message}>
            <Controller
              name="rating"
              control={control}
              rules={{ required: 'Rating is required' }}
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} Star{r !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field
            label="Trip Details / Subtitle"
            required
            error={errors.trip?.message}
          >
            <Input
              placeholder="e.g. Rajasthan Heritage Tour · 2025"
              {...register('trip', { required: 'Trip details are required' })}
            />
          </Field>

          <Field label="Display Order" error={errors.order?.message}>
            <Input
              type="number"
              placeholder="0"
              {...register('order', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be ≥ 0' },
              })}
            />
          </Field>

          {/* Type Multi-Select Field */}
          <div className="md:col-span-2">
            <Field
              label="Display Pages / Type (Select Multiple)"
              required
              error={errors.type?.message}
            >
              <Controller
                name="type"
                control={control}
                rules={{
                  validate: (val) =>
                    (val && val.length > 0) || 'Please select at least one page type',
                }}
                render={({ field }) => {
                  const currentValues = Array.isArray(field.value) ? field.value : []
                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2.5">
                        {TYPE_OPTIONS.map((opt) => {
                          const isSelected = currentValues.includes(opt.value)
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  if (currentValues.length > 1) {
                                    field.onChange(currentValues.filter((v) => v !== opt.value))
                                  } else {
                                    toast.error('At least one page type must be selected')
                                  }
                                } else {
                                  field.onChange([...currentValues, opt.value])
                                }
                              }}
                              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                  : 'bg-background hover:bg-muted text-muted-foreground border-border'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-white/20 border-white/40'
                                    : 'border-muted-foreground/40'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <div className="text-left">
                                <span className="font-semibold">{opt.label}</span>
                                <span className="text-xs ml-1.5 opacity-80">({opt.desc})</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select which pages should show this testimonial. You can select Home, Tourism, and/or Medical.
                      </p>
                    </div>
                  )
                }}
              />
            </Field>
          </div>
        </div>

        <Field
          label="Testimonial Message"
          required
          error={errors.text?.message}
        >
          <div className="space-y-1.5">
            <Textarea
              placeholder="Write client testimonial message here..."
              rows={4}
              {...register('text', {
                required: 'Message is required',
                minLength: {
                  value: 250,
                  message: 'Message must be at least 250 characters',
                },
                maxLength: {
                  value: 400,
                  message: 'Message must be at most 400 characters',
                },
              })}
            />
            <div
              className={`text-right text-xs ${
                textValue.length < 250
                  ? 'text-amber-500 font-medium'
                  : textValue.length > 400
                    ? 'text-destructive font-semibold'
                    : 'text-green-600 font-medium'
              }`}
            >
              {textValue.length}/400 characters{' '}
              {textValue.length < 250 && '(Min 250 required)'}
            </div>
          </div>
        </Field>

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2 mt-4">
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="isActive"
              />
              <Label
                htmlFor="isActive"
                className="cursor-pointer text-sm font-medium"
              >
                Active / Published
              </Label>
            </div>
          )}
        />
      </Section>

      <div className="flex justify-end gap-3 pb-6">
        <Button
          className="cursor-pointer"
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-28 cursor-pointer"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
