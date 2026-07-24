import { t } from "elysia"

// ─── Reusable sub-schemas ────────────────────────────────────────────────────

const badgeSchema = t.Object({
    text: t.String({ minLength: 1 }),
    variant: t.Union([
        t.Literal("domestic"),
        t.Literal("intl"),
        t.Literal("hot"),
        t.Literal("sale"),
        t.Literal("new"),
    ]),
})

const itineraryDaySchema = t.Object({
    day: t.Number({ minimum: 1 }),
    title: t.String({ minLength: 1 }),
    description: t.String(),
})

const destinationRegionEnum = t.Union([
    t.Literal("INDIA"),
    t.Literal("EUROPE"),
    t.Literal("SOUTH_EAST_ASIA"),
    t.Literal("MIDDLE_EAST"),
    t.Literal("AMERICAS"),
    t.Literal("AFRICA"),
    t.Literal("OCEANIA"),
])

const tripTypeEnum = t.Union([
    t.Literal("HONEYMOON"),
    t.Literal("FAMILY"),
    t.Literal("ADVENTURE"),
    t.Literal("SOLO"),
    t.Literal("GROUP"),
    t.Literal("PILGRIMAGE"),
])

const durationCategoryEnum = t.Union([
    t.Literal("1-3"),
    t.Literal("4-7"),
    t.Literal("8-14"),
    t.Literal("15+"),
])

// ─── Create DTO ─────────────────────────────────────────────────────────────

export const createTourismDto = {
    // body: t.Object({
    //     title: t.String({ minLength: 2, maxLength: 200 }),
    //     destination: t.String({ minLength: 2, maxLength: 200 }),
    //     destinationRegion: destinationRegionEnum,
    //     packageType: t.Union([t.Literal("DOMESTIC"), t.Literal("INTERNATIONAL")]),
    //     tripTypes: t.Array(tripTypeEnum, { minItems: 1 }),

    //     price: t.Number({ minimum: 0 }),
    //     strikePrice: t.Optional(t.Number({ minimum: 0 })),
    //     discount: t.Optional(t.String()),

    //     days: t.Number({ minimum: 1 }),
    //     nights: t.Number({ minimum: 0 }),

    //     minPax: t.Optional(t.Number({ minimum: 1, default: 1 })),
    //     maxPax: t.Optional(t.Number({ minimum: 1, default: 10 })),

    //     // image comes as a File (multipart)
    //     imageUrl: t.File({ type: ["image/jpeg", "image/png", "image/webp"] }),

    //     badges: t.Array(badgeSchema),
    //     inclusions: t.Array(t.String()),

    //     description: t.Optional(t.String()),
    //     highlights: t.Optional(t.Array(t.String())),
    //     itinerary: t.Optional(t.Array(itineraryDaySchema)),

    //     isActive: t.Optional(t.Boolean({ default: true })),
    //     isFeatured: t.Optional(t.Boolean({ default: false })),
    //     label: t.Optional(t.String()),
    // }),
    // type: "multipart/form-data",
    detail: {
        summary: "Create a new Tourism Package",
        description: "Admin: Upload image + package details. Image stored in S3.",
    },
}

// ─── Update DTO ──────────────────────────────────────────────────────────────

export const updateTourismDto = {
    // body: t.Object({
    //     title: t.Optional(t.String({ minLength: 2, maxLength: 200 })),
    //     destination: t.Optional(t.String({ minLength: 2, maxLength: 200 })),
    //     destinationRegion: t.Optional(destinationRegionEnum),
    //     packageType: t.Optional(
    //         t.Union([t.Literal("DOMESTIC"), t.Literal("INTERNATIONAL")])
    //     ),
    //     tripTypes: t.Optional(t.Array(tripTypeEnum, { minItems: 1 })),

    //     price: t.Optional(t.Number({ minimum: 0 })),
    //     strikePrice: t.Optional(t.Number({ minimum: 0 })),
    //     discount: t.Optional(t.String()),

    //     days: t.Optional(t.Number({ minimum: 1 })),
    //     nights: t.Optional(t.Number({ minimum: 0 })),

    //     minPax: t.Optional(t.Number({ minimum: 1 })),
    //     maxPax: t.Optional(t.Number({ minimum: 1 })),

    //     // new image replaces old one
    //     imageUrl: t.Optional(
    //         t.File({ type: ["image/jpeg", "image/png", "image/webp"] })
    //     ),

    //     badges: t.Optional(t.Array(badgeSchema)),
    //     inclusions: t.Optional(t.Array(t.String())),

    //     description: t.Optional(t.String()),
    //     highlights: t.Optional(t.Array(t.String())),
    //     itinerary: t.Optional(t.Array(itineraryDaySchema)),

    //     isActive: t.Optional(t.Boolean()),
    //     isFeatured: t.Optional(t.Boolean()),
    //     label: t.Optional(t.String()),
    // }),
    // type: "multipart/form-data" as const,
    detail: {
        summary: "Update a Tourism Package",
        description: "Admin: Partial update. Upload new image only if replacing.",
    },
}

// ─── Query / filter DTO ──────────────────────────────────────────────────────

export const getTourismDto = {
    query: t.Object({
        // pagination
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),

        // search
        search: t.Optional(t.String()),

        // filters matching the UI sidebar
        packageType: t.Optional(
            t.Union([t.Literal("DOMESTIC"), t.Literal("INTERNATIONAL"), t.Literal("ALL")])
        ),
        bookingType: t.Optional(
            t.Union([t.Literal("STANDARD"), t.Literal("CUSTOMIZED"), t.Literal("ALL")])
        ),
        destinationRegions: t.Optional(t.String()), // comma-separated, e.g. "INDIA,EUROPE"
        tripTypes: t.Optional(t.String()),           // comma-separated
        durationCategories: t.Optional(t.String()),  // comma-separated, e.g. "1-3,4-7"

        // budget range
        minPrice: t.Optional(t.String()),
        maxPrice: t.Optional(t.String()),

        // visibility
        isActive: t.Optional(t.String()),   // "true" | "false"
        isFeatured: t.Optional(t.String()), // "true" | "false"

        // sort
        sortBy: t.Optional(
            t.Union([
                t.Literal("price_asc"),
                t.Literal("price_desc"),
                t.Literal("newest"),
                t.Literal("featured"),
            ])
        ),
    }),
    detail: {
        summary: "Get all Tourism Packages with filters",
        description:
            "Public / admin listing with sidebar filters: packageType, destinations, budget, duration, tripType.",
    },
}

// ─── Param DTO ───────────────────────────────────────────────────────────────

export const tourismParamDto = {
    params: t.Object({
        id: t.String({ minLength: 24, maxLength: 24 }),
    }),
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type CreateTourismSchema = typeof createTourismDto.detail
export type UpdateTourismSchema = typeof updateTourismDto.detail
export type GetTourismQuery = typeof getTourismDto.query.static