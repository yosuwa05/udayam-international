
import { useRef, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, X, Plus, ImageIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'domestic' | 'intl' | 'hot' | 'sale' | 'new'

export type TourismFormValues = {
  title: string
  destination: string
  destinationRegion: string
  packageType: 'DOMESTIC' | 'INTERNATIONAL'
  bookingType: 'STANDARD' | 'CUSTOMIZED'
  tripTypes: string[]
  price?: number
  strikePrice?: number
  discount?: string
  days: number
  nights: number
  minPax: number
  maxPax: number
  imageUrl?: File
  badges: { text: string; variant: BadgeVariant }[]
  inclusions: string[]
  exclusions: string[]
  description?: string
  itineraryHighLight?: string
  highlights?: string[]
  itinerary?: { day: number; title: string; description: string }[]
  // isActive: boolean
  // isFeatured: boolean
  label?: string
  order?: number
  gstPercentage?: number
}

type Props = {
  defaultValues?: Partial<TourismFormValues>
  existingImageUrl?: string
  onSubmit: (data: TourismFormValues) => void
  isSubmitting: boolean
  submitLabel: string
  onCancel: () => void
}

export const BADGE_STYLES: Record<
  BadgeVariant,
  { bg: string; color: string; label: string }
> = {
  domestic: { bg: '#e8f5e9', color: '#2E7D32', label: 'Domestic' },
  intl: {
    bg: 'rgba(27,43,107,0.85)',
    color: '#ffffff',
    label: 'International',
  },
  hot: { bg: '#E53E3E', color: '#ffffff', label: 'Hot' },
  sale: { bg: '#F59E0B', color: '#ffffff', label: 'Sale' },
  new: { bg: '#1B2B6B', color: '#ffffff', label: 'New' },
}

// ─── Error helpers ──────────────────────────────────────────────────────────

// Red-border helper applied to native inputs/textareas when that field has an error.
// Uses explicit red-* utilities (not the semantic `destructive` token) with `!important`
// so it reliably wins over the shadcn component's own default border/ring classes.
const errCls = (hasError?: boolean) => cn(hasError && '')

// ─── Section wrapper ──────────────────────────────────────────────────────────

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

// ─── Field ────────────────────────────────────────────────────────────────────

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
      <Label className={cn('text-sm font-medium')}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function TourismForm({
  defaultValues,
  existingImageUrl,
  onSubmit,
  isSubmitting,
  submitLabel,
  onCancel,
}: Props) {
  const { data: regionsQuery } = useQuery({
    queryKey: ['regions-list'],
    queryFn: async () => {
      const res = await _axios.get('/regions', { params: { isActive: 'true' } })
      return res.data?.data || []
    },
  })

  const { data: tripTypesQuery } = useQuery({
    queryKey: ['trip-types-list'],
    queryFn: async () => {
      const res = await _axios.get('/trip-types', {
        params: { isActive: 'true' },
      })
      return res.data?.data || []
    },
  })

  const destinationRegions =
    regionsQuery?.map((r: any) => ({ value: r._id, label: r.name })) || []
  const tripTypesList =
    tripTypesQuery?.map((t: any) => ({ value: t._id, label: t.name })) || []
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TourismFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      packageType: 'DOMESTIC',
      bookingType: 'STANDARD',
      // isActive: true,
      // isFeatured: false,
      minPax: 1,
      maxPax: 10,
      tripTypes: [],
      badges: [],
      inclusions: [],
      exclusions: [],
      highlights: [],
      itinerary: [],
      order: 0,
      gstPercentage: 0,
      ...defaultValues,
    },
  })

  const [imagePreview, setImagePreview] = useState<string | null>(
    existingImageUrl ?? null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: 'itinerary',
  })

  const badges = watch('badges')
  const inclusions = watch('inclusions')
  const exclusions = watch('exclusions') ?? []
  const bookingType = watch('bookingType')

  const addBadge = () => {
    setValue('badges', [
      ...badges,
      { text: '', variant: 'domestic' as BadgeVariant },
    ])
  }

  const removeBadge = (i: number) => {
    setValue(
      'badges',
      badges.filter((_, idx) => idx !== i),
    )
  }

  const addInclusion = () => setValue('inclusions', [...inclusions, ''])
  const removeInclusion = (i: number) =>
    setValue(
      'inclusions',
      inclusions.filter((_, idx) => idx !== i),
    )

  const addExclusion = () => setValue('exclusions', [...exclusions, ''])
  const removeExclusion = (i: number) =>
    setValue(
      'exclusions',
      exclusions.filter((_, idx) => idx !== i),
    )

  const addItineraryDay = () =>
    appendItinerary({
      day: itineraryFields.length + 1,
      title: '',
      description: '',
    })
  const removeItineraryDay = (i: number) => removeItinerary(i)

  // Fires when the form passes validation.
  const handleValid = (data: TourismFormValues) => {
    const formattedData = {
      ...data,
      itinerary: data.itinerary?.map((item, idx) => ({
        ...item,
        day: idx + 1,
      })),
    }
    onSubmit(formattedData)
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(handleValid)}
      className="space-y-5"
      noValidate
    >
      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Package Title" required error={errors.title?.message}>
            <Input
              placeholder="e.g. Kerala Backwaters Bliss"
              className={errCls(!!errors.title)}
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters',
                },
              })}
            />
          </Field>

          <Field
            label="Destination"
            required
            error={errors.destination?.message}
          >
            <Input
              placeholder="e.g. Kerala, India"
              className={errCls(!!errors.destination)}
              {...register('destination', {
                required: 'Destination is required',
              })}
            />
          </Field>

          <Field
            label="Region"
            required
            error={errors.destinationRegion?.message}
          >
            <Controller
              name="destinationRegion"
              control={control}
              rules={{ required: 'Region is required' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={cn(
                      'cursor-pointer w-full',
                      errCls(!!errors.destinationRegion),
                    )}
                  >
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationRegions.map((r: any) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={r.value}
                        value={r.value}
                      >
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Package Type" required>
            <Controller
              name="packageType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex rounded-lg border overflow-hidden">
                  {(['DOMESTIC', 'INTERNATIONAL'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => field.onChange(t)}
                      className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        field.value === t
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {t === 'DOMESTIC' ? '🇮🇳 Domestic' : '✈️ International'}
                    </button>
                  ))}
                </div>
              )}
            />
          </Field>

          <Field label="Booking Type" required>
            <Controller
              name="bookingType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex rounded-lg border overflow-hidden">
                  {(['STANDARD', 'CUSTOMIZED'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => field.onChange(t)}
                      className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        field.value === t
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {t === 'STANDARD' ? 'Standard' : 'Customized'}
                    </button>
                  ))}
                </div>
              )}
            />
          </Field>
        </div>

        {/* <Field label="Label (optional)">
          <Input
            placeholder="e.g. Top Pick, Best Value"
            {...register('label')}
          />
        </Field> */}

        {/* Trip types */}
        <Field label="Trip Types" required error={errors.tripTypes?.message}>
          <Controller
            name="tripTypes"
            control={control}
            rules={{
              validate: (v) =>
                (v && v.length > 0) || 'Select at least one trip type',
            }}
            render={({ field }) => (
              <div
                className={cn(
                  'flex flex-wrap gap-2 rounded-lg border border-transparent p-2 -m-2 transition-colors',
                )}
              >
                {tripTypesList.map((t: any) => {
                  const active = field.value?.includes(t.value)
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        const next = active
                          ? field.value.filter((v) => v !== t.value)
                          : [...(field.value ?? []), t.value]
                        field.onChange(next)
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            )}
          />
        </Field>

        {/* Toggle flags */}
        {/* <div className="flex flex-wrap gap-6">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isActive"
                />
                <Label htmlFor="isActive" className="cursor-pointer text-sm">
                  Active
                </Label>
              </div>
            )}
          />
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isFeatured"
                />
                <Label htmlFor="isFeatured" className="cursor-pointer text-sm">
                  Featured
                </Label>
              </div>
            )}
          />
        </div> */}
      </Section>

      {/* Pricing & Duration */}
      <Section title="Pricing & Duration">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bookingType === 'STANDARD' && (
            <>
              <Field label="Price (₹)" required error={errors.price?.message}>
                <Input
                  type="number"
                  placeholder="18999"
                  className={errCls(!!errors.price)}
                  {...register('price', {
                    required:
                      bookingType === 'STANDARD' ? 'Price is required' : false,
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be ≥ 0' },
                  })}
                />
              </Field>
              <Field
                label="Strike Price (₹)"
                error={errors.strikePrice?.message}
              >
                <Input
                  type="number"
                  placeholder="22499"
                  className={errCls(!!errors.strikePrice)}
                  {...register('strikePrice', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be ≥ 0' },
                    validate: (v) => {
                      const price = watch('price')
                      if (v == null || Number.isNaN(v)) return true
                      if (price != null && v <= price) {
                        return 'Strike price must be greater than price'
                      }
                      return true
                    },
                  })}
                />
              </Field>
              <Field label="Discount Label">
                <Input placeholder="e.g. 15% OFF" {...register('discount')} />
              </Field>
            </>
          )}
          <Field label="Display Order" error={errors.order?.message}>
            <Input
              type="number"
              placeholder="0"
              className={errCls(!!errors.order)}
              {...register('order', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be ≥ 0' },
              })}
            />
          </Field>
          <Field label="GST (%)" error={errors.gstPercentage?.message}>
            <Input
              type="number"
              placeholder="e.g. 5"
              className={errCls(!!errors.gstPercentage)}
              {...register('gstPercentage', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be ≥ 0' },
                max: { value: 100, message: 'Must be ≤ 100' },
              })}
            />
          </Field>
          <Field label="Days" required error={errors.days?.message}>
            <Input
              type="number"
              placeholder="5"
              className={errCls(!!errors.days)}
              {...register('days', {
                required: 'Days required',
                valueAsNumber: true,
                min: { value: 1, message: 'Min 1' },
              })}
            />
          </Field>
          <Field label="Nights" required error={errors.nights?.message}>
            <Input
              type="number"
              placeholder="4"
              className={errCls(!!errors.nights)}
              {...register('nights', {
                required: 'Nights required',
                valueAsNumber: true,
                min: { value: 0, message: 'Min 0' },
              })}
            />
          </Field>
          <Field label="Min Pax" required error={errors.minPax?.message}>
            <Input
              type="number"
              placeholder="2"
              className={errCls(!!errors.minPax)}
              {...register('minPax', {
                required: 'Min pax is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Min 1' },
              })}
            />
          </Field>
          <Field label="Max Pax" required error={errors.maxPax?.message}>
            <Input
              type="number"
              placeholder="8"
              className={errCls(!!errors.maxPax)}
              {...register('maxPax', {
                required: 'Max pax is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Min 1' },
                validate: (v) => {
                  const min = watch('minPax')
                  if (v == null || Number.isNaN(v)) return true
                  if (min != null && v < min) {
                    return 'Max pax must be ≥ min pax'
                  }
                  return true
                },
              })}
            />
          </Field>
        </div>
      </Section>

      {/* Cover image */}
      <Section title="Cover Image">
        <Controller
          name="imageUrl"
          control={control}
          rules={{
            validate: (file) =>
              file || imagePreview ? true : 'Cover image is required',
          }}
          render={({ field }) => (
            <>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors',
                  imagePreview
                    ? 'p-2 border-primary/40'
                    : 'p-10 hover:border-primary/50 hover:bg-muted/30',
                  errors.imageUrl && 'border-red-500 bg-red-50',
                )}
              >
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-52 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-white text-sm font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Replace image
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={cn(
                        'w-12 h-12 rounded-full bg-muted flex items-center justify-center',
                        errors.imageUrl && 'bg-red-100',
                      )}
                    >
                      <ImageIcon
                        className={cn(
                          'w-5 h-5 text-muted-foreground',
                          errors.imageUrl && 'text-red-600',
                        )}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          errors.imageUrl && 'text-red-600',
                        )}
                      >
                        Click to upload cover image
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        JPG, PNG or WebP
                      </p>
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended Cover Image Size: 1400 px (Width) × 600 px (Height)
                · Max Size: 2MB
              </p>
              {errors.imageUrl?.message && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.imageUrl.message}
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  const MAX_SIZE = 2 * 1024 * 1024 // 2MB
                  if (file.size > MAX_SIZE) {
                    toast.error('Image size must be less than 2MB')
                    e.target.value = ''
                    return
                  }

                  field.onChange(file)
                  setImagePreview(URL.createObjectURL(file))
                }}
              />
            </>
          )}
        />
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="space-y-2">
          {badges.map((_, i) => {
            const textError = errors.badges?.[i]?.text?.message
            return (
              <div key={i} className="space-y-1">
                <div className="flex gap-2 items-start">
                  <Input
                    placeholder="Badge text"
                    className={cn('flex-1', errCls(!!textError))}
                    {...register(`badges.${i}.text`, {
                      required: 'Badge  cannot be empty',
                    })}
                  />
                  <Controller
                    name={`badges.${i}.variant`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-1.5 items-center p-1.5 border rounded-lg bg-muted/20 shrink-0">
                        {(Object.keys(BADGE_STYLES) as BadgeVariant[]).map(
                          (v) => {
                            const s = BADGE_STYLES[v]
                            const isSelected = field.value === v
                            return (
                              <button
                                key={v}
                                type="button"
                                onClick={() => field.onChange(v)}
                                style={{ backgroundColor: s.bg }}
                                className={cn(
                                  'w-6 h-6 rounded-full border transition-all duration-200 relative hover:scale-110 flex items-center justify-center cursor-pointer',
                                  isSelected
                                    ? 'ring-2 ring-primary ring-offset-2 scale-105 border-transparent'
                                    : 'border-muted-foreground/30 hover:border-muted-foreground/80',
                                )}
                                title={s.label}
                              >
                                {isSelected && (
                                  <span
                                    style={{ color: s.color }}
                                    className="text-[10px] font-bold select-none"
                                  >
                                    ✓
                                  </span>
                                )}
                              </button>
                            )
                          },
                        )}
                      </div>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 shrink-0 cursor-pointer"
                    onClick={() => removeBadge(i)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {textError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {textError}
                  </p>
                )}
              </div>
            )
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer"
            onClick={addBadge}
          >
            <Plus className="w-3.5 h-3.5" /> Add Badge
          </Button>
        </div>
      </Section>

      {/* Inclusions */}
      <Section title="Inclusions">
        <div className="space-y-2">
          {inclusions.map((_, i) => {
            const itemError = errors.inclusions?.[i]?.message
            return (
              <div key={i} className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. 🏨 Hotel"
                    className={errCls(!!itemError)}
                    {...register(`inclusions.${i}`, {
                      required: 'Inclusion cannot be empty',
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 shrink-0 cursor-pointer"
                    onClick={() => removeInclusion(i)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {itemError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {itemError}
                  </p>
                )}
              </div>
            )
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer"
            onClick={addInclusion}
          >
            <Plus className="w-3.5 h-3.5" /> Add Inclusion
          </Button>
        </div>
      </Section>

      {/* Exclusions */}
      <Section title="Exclusions">
        <div className="space-y-2">
          {exclusions.map((_, i) => {
            const itemError = errors.exclusions?.[i]?.message
            return (
              <div key={i} className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. ✈️ Flights"
                    className={errCls(!!itemError)}
                    {...register(`exclusions.${i}`, {
                      required: 'Exclusion cannot be empty',
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 shrink-0 cursor-pointer"
                    onClick={() => removeExclusion(i)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {itemError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {itemError}
                  </p>
                )}
              </div>
            )
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer"
            onClick={addExclusion}
          >
            <Plus className="w-3.5 h-3.5" /> Add Exclusion
          </Button>
        </div>
      </Section>

      {/* Description */}
      <Section title="Description">
        <Field label="Description" error={errors.description?.message}>
          <Textarea
            placeholder="Describe the package experience…"
            rows={4}
            className={errCls(!!errors.description)}
            {...register('description', {
              maxLength: {
                value: 2000,
                message: 'Description must be under 2000 characters',
              },
            })}
          />
        </Field>
      </Section>

      {/* Itinerary */}
      <Section title="Itinerary (optional)">
        <div className="space-y-3">
          {itineraryFields.map((field, i) => {
            const titleError = errors.itinerary?.[i]?.title?.message
            const descError = errors.itinerary?.[i]?.description?.message
            const hasRowError = !!titleError || !!descError
            return (
              <div
                key={field.id}
                className={cn(
                  'rounded-lg border p-4 space-y-3 bg-muted/20',
                  hasRowError && 'border-red-500 bg-red-50',
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wider',
                      hasRowError ? 'text-red-600' : 'text-muted-foreground',
                    )}
                  >
                    Day {i + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={() => removeItineraryDay(i)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <Input
                    placeholder="Day title"
                    className={errCls(!!titleError)}
                    {...register(`itinerary.${i}.title`, {
                      required: 'Day title cannot be empty',
                    })}
                  />
                  {titleError && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {titleError}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Textarea
                    placeholder="What happens this day…"
                    rows={2}
                    className={errCls(!!descError)}
                    {...register(`itinerary.${i}.description`, {
                      required: 'Day description cannot be empty',
                    })}
                  />
                  {descError && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {descError}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer"
            onClick={addItineraryDay}
          >
            <Plus className="w-3.5 h-3.5" /> Add Day
          </Button>
        </div>
      </Section>

      <Section title="Itinerary HighLight">
        <Field
          label="Itinerary HighLight"
          error={errors.itineraryHighLight?.message}
        >
          <Textarea
            placeholder="Describe the itinerary highlight"
            rows={4}
            className={errCls(!!errors.itineraryHighLight)}
            {...register('itineraryHighLight', {
              maxLength: {
                value: 2000,
                message: 'itineraryHighLight must be under 2000 characters',
              },
            })}
          />
        </Field>
      </Section>

      {/* Footer actions */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t py-4 px-4 -mx-4 flex justify-end gap-3 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer"
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
