import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type TestimonialFormValues = {
  name: string
  avatarInitial?: string
  rating: number
  text: string
  trip: string
  isActive: boolean
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

          <Field label="Avatar Initial (Optional)" error={errors.avatarInitial?.message}>
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

          <Field label="Trip Details / Subtitle" required error={errors.trip?.message}>
            <Input
              placeholder="e.g. Rajasthan Heritage Tour · 2025"
              {...register('trip', { required: 'Trip details are required' })}
            />
          </Field>
        </div>

        <Field label="Testimonial Message" required error={errors.text?.message}>
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
              {textValue.length}/400 characters {textValue.length < 250 && '(Min 250 required)'}
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
              <Label htmlFor="isActive" className="cursor-pointer text-sm font-medium">
                Active / Published
              </Label>
            </div>
          )}
        />
      </Section>

      <div className="flex justify-end gap-3 pb-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-28">
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
