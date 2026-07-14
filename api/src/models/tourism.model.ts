import { Schema, model } from "mongoose"

export type PackageType = "DOMESTIC" | "INTERNATIONAL"
export type TripType = "HONEYMOON" | "FAMILY" | "ADVENTURE" | "SOLO" | "GROUP" | "PILGRIMAGE"
export type DurationCategory = "1-3" | "4-7" | "8-14" | "15+"
export type DestinationRegion = "INDIA" | "EUROPE" | "SOUTH_EAST_ASIA" | "MIDDLE_EAST" | "AMERICAS" | "AFRICA" | "OCEANIA"
export interface IBadge {
    text: string
    variant: "domestic" | "intl" | "hot" | "sale" | "new"
}

export interface ITourism {
    title: string
    destination: string
    destinationRegion: DestinationRegion
    packageType: PackageType
    tripTypes: TripType[]

    // Pricing
    price: number
    strikePrice?: number
    discount?: string

    // Duration
    days: number
    nights: number
    durationCategory: DurationCategory

    // Group size
    minPax: number
    maxPax: number

    // Media
    imageUrl: string

    // Display badges
    badges: IBadge[]

    // Inclusions e.g. "Hotel", "Meals", "Houseboat", "Transfers"
    inclusions: string[]

    // Exclusions e.g. "Flights", "Tips", "Entry tickets"
    exclusions?: string[]

    // Custom display order (lower values displayed first)
    order?: number

    // SEO / detail
    description?: string
    highlights?: string[]
    itinerary?: { day: number; title: string; description: string }[]

    isActive: boolean
    isFeatured: boolean
    label?: string // e.g. "Top Pick", "Sale", "New"

    createdAt?: Date
    updatedAt?: Date
}

const badgeSchema = new Schema<IBadge>(
    {
        text: { type: String, required: true },
        variant: {
            type: String,
            enum: ["domestic", "intl", "hot", "sale", "new"],
            required: true,
        },
    },
    { _id: false }
)

const tourismSchema = new Schema<ITourism>(
    {
        title: { type: String, required: true, trim: true },
        destination: { type: String, required: true, trim: true },
        destinationRegion: {
            type: String,
            enum: ["INDIA", "EUROPE", "SOUTH_EAST_ASIA", "MIDDLE_EAST", "AMERICAS", "AFRICA", "OCEANIA"],
            required: true,
        },
        packageType: {
            type: String,
            enum: ["DOMESTIC", "INTERNATIONAL"],
            required: true,
        },
        tripTypes: [
            {
                type: String,
                enum: ["HONEYMOON", "FAMILY", "ADVENTURE", "SOLO", "GROUP", "PILGRIMAGE"],
            },
        ],

        price: { type: Number, required: true, min: 0 },
        strikePrice: { type: Number, min: 0 },
        discount: { type: String, trim: true },

        days: { type: Number, required: true, min: 1 },
        nights: { type: Number, required: true, min: 0 },
        durationCategory: {
            type: String,
            enum: ["1-3", "4-7", "8-14", "15+"],
            required: true,
        },

        minPax: { type: Number, required: true, default: 1 },
        maxPax: { type: Number, required: true, default: 10 },

        imageUrl: { type: String, required: true },


        badges: [badgeSchema],
        inclusions: [{ type: String, trim: true }],
        exclusions: [{ type: String, trim: true }],
        order: { type: Number, default: 0 },

        description: { type: String, trim: true },
        highlights: [{ type: String }],
        itinerary: [
            {
                day: { type: Number },
                title: { type: String },
                description: { type: String },
                _id: false,
            },
        ],

        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        label: { type: String, trim: true },
    },
    { timestamps: true }
)

// Indexes for filter queries
tourismSchema.index({ packageType: 1 })
tourismSchema.index({ destinationRegion: 1 })
tourismSchema.index({ tripTypes: 1 })
tourismSchema.index({ durationCategory: 1 })
tourismSchema.index({ price: 1 })
tourismSchema.index({ isActive: 1 })
tourismSchema.index({ isFeatured: -1, createdAt: -1 })
tourismSchema.index({ order: 1, createdAt: -1 })
tourismSchema.index({ title: "text", destination: "text", description: "text" })

export const TourismModel = model<ITourism>("tourism", tourismSchema)