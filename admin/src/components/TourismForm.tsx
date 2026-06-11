import { useRef, useState } from 'react'
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
import { Upload, X, Plus, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'domestic' | 'intl' | 'hot' | 'sale' | 'new'

export type TourismFormValues = {
  title: string
  destination: string
  destinationRegion: string
  packageType: 'DOMESTIC' | 'INTERNATIONAL'
  tripTypes: string[]
  price: number
  strikePrice?: number
  discount?: string
  days: number
  nights: number
  minPax: number
  maxPax: number
  imageUrl?: File
  badges: { text: string; variant: BadgeVariant }[]
  inclusions: string[]
  description?: string
  highlights?: string[]
  itinerary?: { day: number; title: string; description: string }[]
  isActive: boolean
  isFeatured: boolean
  label?: string
}

type Props = {
  defaultValues?: Partial<TourismFormValues>
  existingImageUrl?: string
  onSubmit: (data: TourismFormValues) => void
  isSubmitting: boolean
  submitLabel: string
  onCancel: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DESTINATION_REGIONS = [
  { value: 'INDIA', label: 'India' },
  { value: 'EUROPE', label: 'Europe' },
  { value: 'SOUTH_EAST_ASIA', label: 'South-East Asia' },
  { value: 'MIDDLE_EAST', label: 'Middle East' },
  { value: 'AMERICAS', label: 'Americas' },
  { value: 'AFRICA', label: 'Africa' },
  { value: 'OCEANIA', label: 'Oceania' },
]

const TRIP_TYPES = [
  { value: 'HONEYMOON', label: '💑 Honeymoon' },
  { value: 'FAMILY', label: '👨‍👩‍👧 Family' },
  { value: 'ADVENTURE', label: '🧗 Adventure' },
  { value: 'SOLO', label: '🎒 Solo Travel' },
  { value: 'GROUP', label: '👥 Group' },
  { value: 'PILGRIMAGE', label: '🛕 Pilgrimage' },
]

const BADGE_VARIANTS: { value: BadgeVariant; label: string }[] = [
  { value: 'domestic', label: 'Domestic' },
  { value: 'intl', label: 'International' },
  { value: 'hot', label: '🔥 Hot' },
  { value: 'sale', label: '🏷 Sale' },
  { value: 'new', label: '✨ New' },
]

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
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
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
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TourismFormValues>({
    defaultValues: {
      packageType: 'DOMESTIC',
      isActive: true,
      isFeatured: false,
      minPax: 1,
      maxPax: 10,
      tripTypes: [],
      badges: [],
      inclusions: [],
      highlights: [],
      itinerary: [],
      ...defaultValues,
    },
  })

  const [imagePreview, setImagePreview] = useState<string | null>(
    existingImageUrl ?? null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tripTypes = watch('tripTypes')
  const badges = watch('badges')
  const inclusions = watch('inclusions')
  const highlights = watch('highlights') ?? []
  const itinerary = watch('itinerary') ?? []

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setValue('imageUrl', file)
    setImagePreview(URL.createObjectURL(file))
  }

  const toggleTripType = (val: string) => {
    setValue(
      'tripTypes',
      tripTypes.includes(val)
        ? tripTypes.filter((t) => t !== val)
        : [...tripTypes, val],
    )
  }

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

  const addHighlight = () => setValue('highlights', [...highlights, ''])
  const removeHighlight = (i: number) =>
    setValue(
      'highlights',
      highlights.filter((_, idx) => idx !== i),
    )

  const addItineraryDay = () =>
    setValue('itinerary', [
      ...itinerary,
      { day: itinerary.length + 1, title: '', description: '' },
    ])
  const removeItineraryDay = (i: number) =>
    setValue(
      'itinerary',
      itinerary.filter((_, idx) => idx !== i),
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Package Title" required error={errors.title?.message}>
            <Input
              placeholder="e.g. Kerala Backwaters Bliss"
              {...register('title', { required: 'Title is required' })}
            />
          </Field>

          <Field
            label="Destination"
            required
            error={errors.destination?.message}
          >
            <Input
              placeholder="e.g. Kerala, India"
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESTINATION_REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
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
        </div>

        <Field label="Label (optional)">
          <Input
            placeholder="e.g. Top Pick, Best Value"
            {...register('label')}
          />
        </Field>

        {/* Trip types */}
        <Field label="Trip Types" required>
          <div className="flex flex-wrap gap-2">
            {TRIP_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => toggleTripType(t.value)}
                className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-colors cursor-pointer ${
                  tripTypes.includes(t.value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Toggle flags */}
        <div className="flex flex-wrap gap-6">
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
        </div>
      </Section>

      {/* Pricing & Duration */}
      <Section title="Pricing & Duration">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Price (₹)" required error={errors.price?.message}>
            <Input
              type="number"
              placeholder="18999"
              {...register('price', {
                required: 'Price is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Must be ≥ 0' },
              })}
            />
          </Field>
          <Field label="Strike Price (₹)" error={errors.strikePrice?.message}>
            <Input
              type="number"
              placeholder="22499"
              {...register('strikePrice', { valueAsNumber: true })}
            />
          </Field>
          <Field label="Discount Label">
            <Input placeholder="e.g. 15% OFF" {...register('discount')} />
          </Field>
          <div /> {/* spacer */}
          <Field label="Days" required error={errors.days?.message}>
            <Input
              type="number"
              placeholder="5"
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
              {...register('nights', {
                required: 'Nights required',
                valueAsNumber: true,
                min: { value: 0, message: 'Min 0' },
              })}
            />
          </Field>
          <Field label="Min Pax" error={errors.minPax?.message}>
            <Input
              type="number"
              placeholder="2"
              {...register('minPax', { valueAsNumber: true, min: 1 })}
            />
          </Field>
          <Field label="Max Pax" error={errors.maxPax?.message}>
            <Input
              type="number"
              placeholder="8"
              {...register('maxPax', { valueAsNumber: true, min: 1 })}
            />
          </Field>
        </div>
      </Section>

      {/* Cover image */}
      <Section title="Cover Image">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors',
            imagePreview
              ? 'p-2 border-primary/40'
              : 'p-10 hover:border-primary/50 hover:bg-muted/30',
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
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Click to upload cover image
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  JPG, PNG or WebP
                </p>
              </div>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleImageChange}
        />
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="space-y-2">
          {badges.map((_, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="Badge text"
                className="flex-1"
                {...register(`badges.${i}.text`)}
              />
              <Controller
                name={`badges.${i}.variant`}
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BADGE_VARIANTS.map((v) => (
                        <SelectItem key={v.value} value={v.value}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive shrink-0"
                onClick={() => removeBadge(i)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={addBadge}
          >
            <Plus className="w-3.5 h-3.5" /> Add Badge
          </Button>
        </div>
      </Section>

      {/* Inclusions */}
      <Section title="Inclusions">
        <div className="space-y-2">
          {inclusions.map((_, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="e.g. 🏨 Hotel"
                {...register(`inclusions.${i}`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive shrink-0"
                onClick={() => removeInclusion(i)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={addInclusion}
          >
            <Plus className="w-3.5 h-3.5" /> Add Inclusion
          </Button>
        </div>
      </Section>

      {/* Description */}
      <Section title="Description & Highlights">
        <Field label="Description">
          <Textarea
            placeholder="Describe the package experience…"
            rows={4}
            {...register('description')}
          />
        </Field>

        <Field label="Highlights">
          <div className="space-y-2">
            {highlights.map((_, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="e.g. Sunset cruise on the backwaters"
                  {...register(`highlights.${i}`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() => removeHighlight(i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={addHighlight}
            >
              <Plus className="w-3.5 h-3.5" /> Add Highlight
            </Button>
          </div>
        </Field>
      </Section>

      {/* Itinerary */}
      <Section title="Itinerary (optional)">
        <div className="space-y-3">
          {itinerary.map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-4 space-y-3 bg-muted/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Day {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => removeItineraryDay(i)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Input
                placeholder="Day title"
                {...register(`itinerary.${i}.title`)}
              />
              <Textarea
                placeholder="What happens this day…"
                rows={2}
                {...register(`itinerary.${i}.description`)}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={addItineraryDay}
          >
            <Plus className="w-3.5 h-3.5" /> Add Day
          </Button>
        </div>
      </Section>

      {/* Footer actions */}
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
