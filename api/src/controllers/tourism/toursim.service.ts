import { Context } from "elysia"
import { CreateTourismSchema, UpdateTourismSchema, GetTourismQuery } from "./tourism.schema"
import { deleteFile, saveFile } from "@lib/file"
import { DurationCategory, TourismModel } from "@models/tourism.model"

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Derive duration bucket from number of days for indexed filtering */
const getDurationCategory = (days: number): DurationCategory => {
    if (days <= 3) return "1-3"
    if (days <= 7) return "4-7"
    if (days <= 14) return "8-14"
    return "15+"
}

/** Parse "true"/"false" query strings safely */
const parseBool = (val?: string) => {
    if (val === "true") return true
    if (val === "false") return false
    return undefined
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

export const createTouristPlace = async (
    ctx: Context<{ body: CreateTourismSchema }>
) => {
    const { body, set } = ctx

    try {
        // Upload main image
        const imageResult = await saveFile(body.imageUrl, "tourism", "covers")
        if (!imageResult.ok) {
            set.status = 500
            return { error: "Failed to upload cover image", status: false }
        }

        const place = await TourismModel.create({
            title: body.title,
            destination: body.destination,
            destinationRegion: body.destinationRegion,
            packageType: body.packageType,
            tripTypes: body.tripTypes,

            price: body.price,
            strikePrice: body.strikePrice,
            discount: body.discount,

            days: body.days,
            nights: body.nights,
            durationCategory: getDurationCategory(body.days),

            minPax: body.minPax ?? 1,
            maxPax: body.maxPax ?? 10,

            imageUrl: imageResult.filename,

            badges: body.badges,
            inclusions: body.inclusions,

            description: body.description,
            highlights: body.highlights,
            itinerary: body.itinerary,

            isActive: body.isActive ?? true,
            isFeatured: body.isFeatured ?? false,
            label: body.label,
        })

        set.status = 201
        return { message: "Tourism package created successfully", data: place, status: true }
    } catch (error: any) {
        console.error("Create Tourism Error", error)
        set.status = 500
        return { error: "Failed to create tourism package", status: false }
    }
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export const updateTouristPlace = async (
    ctx: Context<{ body: UpdateTourismSchema; params: { id: string } }>
) => {
    const { body, params, set } = ctx

    try {
        const existing = await TourismModel.findById(params.id)
        if (!existing) {
            set.status = 404
            return { error: "Tourism package not found", status: false }
        }

        const updateData: Record<string, any> = { ...body }

        // Replace cover image if a new one was sent
        if (body.imageUrl) {
            // Delete old image from S3
            await deleteFile(existing.imageUrl)

            const imageResult = await saveFile(body.imageUrl, "tourism", "covers")
            if (!imageResult.ok) {
                set.status = 500
                return { error: "Failed to upload new cover image", status: false }
            }
            updateData.imageUrl = imageResult.filename
        }
        delete updateData.image

        if (body.days !== undefined) {
            updateData.durationCategory = getDurationCategory(body.days)
        }

        const updated = await TourismModel.findByIdAndUpdate(
            params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )

        return { message: "Tourism package updated successfully", data: updated, status: true }
    } catch (error: any) {
        console.error("Update Tourism Error", error)
        set.status = 500
        return { error: "Failed to update tourism package", status: false }
    }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

export const deleteTouristPlace = async (
    ctx: Context<{ params: { id: string } }>
) => {
    const { params, set } = ctx

    try {
        const place = await TourismModel.findById(params.id)
        if (!place) {
            set.status = 404
            return { error: "Tourism package not found", status: false }
        }

        await TourismModel.findByIdAndDelete(params.id)

        return { message: "Tourism package deleted successfully", status: true }
    } catch (error: any) {
        console.error("Delete Tourism Error", error)
        set.status = 500
        return { error: "Failed to delete tourism package", status: false }
    }
}

// ─── DASHBOARD STATS ───────────────────────────────────────────────────────────

export const getTourismDashboardStats = async (ctx: Context) => {
    const { set } = ctx

    try {
        const [
            totalPackages,
            domesticPackages,
            internationalPackages,
            activePackages,
            inactivePackages
        ] = await Promise.all([
            TourismModel.countDocuments(),
            TourismModel.countDocuments({ packageType: "DOMESTIC" }),
            TourismModel.countDocuments({ packageType: "INTERNATIONAL" }),
            TourismModel.countDocuments({ isActive: true }),
            TourismModel.countDocuments({ isActive: false })
        ])

        return {
            status: true,
            data: {
                totalPackages,
                domesticPackages,
                internationalPackages,
                activePackages,
                inactivePackages
            }
        }
    } catch (error: any) {
        console.error("Get Tourism Dashboard Stats Error", error)
        set.status = 500
        return { error: "Failed to fetch tourism dashboard stats", status: false }
    }
}

// ─── GET ALL (with filters) ───────────────────────────────────────────────────

export const getAllTouristPlaces = async (
    ctx: Context<{ query: GetTourismQuery }>
) => {
    const { query, set } = ctx

    try {
        const page = Math.max(1, parseInt(query.page ?? "1"))
        const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? "12")))
        const skip = (page - 1) * limit

        const filter: Record<string, any> = {}

        // ── Package type filter (All / Domestic / Intl) ──────────────────────────
        if (query.packageType && query.packageType !== "ALL") {
            filter.packageType = query.packageType
        }

        // ── Destination region filter (multi-select checkboxes) ──────────────────
        if (query.destinationRegions) {
            const regions = query.destinationRegions
                .split(",")
                .map((r) => r.trim().toUpperCase())
                .filter(Boolean)
            if (regions.length) filter.destinationRegion = { $in: regions }
        }

        // ── Trip type filter (Honeymoon, Family, Adventure, Solo …) ─────────────
        if (query.tripTypes) {
            const types = query.tripTypes
                .split(",")
                .map((t) => t.trim().toUpperCase())
                .filter(Boolean)
            if (types.length) filter.tripTypes = { $in: types }
        }

        // ── Duration filter (1-3 Days / 4-7 Days / 8-14 Days / 15+ Days) ────────
        if (query.durationCategories) {
            const cats = query.durationCategories
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
            if (cats.length) filter.durationCategory = { $in: cats }
        }

        // ── Budget range filter (₹5,000 – ₹2,00,000 slider) ─────────────────────
        const minPrice = query.minPrice ? parseFloat(query.minPrice) : undefined
        const maxPrice = query.maxPrice ? parseFloat(query.maxPrice) : undefined
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {}
            if (minPrice !== undefined) filter.price.$gte = minPrice
            if (maxPrice !== undefined) filter.price.$lte = maxPrice
        }

        // ── Visibility filters (admin panel) ─────────────────────────────────────
        const isActive = parseBool(query.isActive)
        if (isActive !== undefined) filter.isActive = isActive

        const isFeatured = parseBool(query.isFeatured)
        if (isFeatured !== undefined) filter.isFeatured = isFeatured

        if (query.search?.trim()) {
            filter.title = {
                $regex: query.search.trim(),
                $options: "i",
            };
        }

        // ── Sorting ──────────────────────────────────────────────────────────────
        const sortMap: Record<string, Record<string, 1 | -1>> = {
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            newest: { createdAt: -1 },
            featured: { isFeatured: -1, createdAt: -1 },
        }
        const sort = sortMap[query.sortBy ?? "newest"] ?? { createdAt: -1 }

        const [data, total] = await Promise.all([
            TourismModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            TourismModel.countDocuments(filter),
        ])

        return {
            status: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        }
    } catch (error: any) {
        console.error("Get All Tourism Error", error)
        set.status = 500
        return { error: "Failed to fetch tourism packages", status: false }
    }
}

// ─── GET SINGLE ──────────────────────────────────────────────────────────────

export const getTouristPlaceById = async (
    ctx: Context<{ params: { id: string } }>
) => {
    const { params, set } = ctx

    try {
        const place = await TourismModel.findById(params.id).lean()
        if (!place) {
            set.status = 404
            return { error: "Tourism package not found", status: false }
        }
        return { status: true, data: place }
    } catch (error: any) {
        console.error("Get Tourism By ID Error", error)
        set.status = 500
        return { error: "Failed to fetch tourism package", status: false }
    }
}