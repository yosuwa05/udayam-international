import { Context } from "elysia"
import { CreateTourismSchema, UpdateTourismSchema, GetTourismQuery } from "./tourism.schema"
import { deleteFile, saveFile } from "@lib/file"
import { DurationCategory, TourismModel } from "@models/tourism.model"
import { PaymentModel } from "@models/payment.model"
import { UserModel } from "@models/user.model"
import { BookingModel } from "@models/booking.model"
import { CouponModel } from "@models/coupon.model"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const parseJsonField = (field: any) => {
    if (typeof field === "string") {
        try {
            return JSON.parse(field)
        } catch {
            return field
        }
    }
    return field
}

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
    const { body, set }: any = ctx

    try {
        // Upload main image
        const imageResult = await saveFile(body.imageUrl, "tourism", "covers")
        if (!imageResult.ok) {
            set.status = 500
            return { error: "Failed to upload cover image", status: false }
        }

        const bookingType = (body.bookingType ?? "STANDARD").toUpperCase()

        const placeData: any = {
            title: body.title,
            destination: body.destination,
            destinationRegion: body.destinationRegion,
            packageType: body.packageType,
            bookingType,
            tripTypes: parseJsonField(body.tripTypes),

            days: body.days,
            nights: body.nights,
            durationCategory: getDurationCategory(body.days),

            minPax: body.minPax ?? 1,
            maxPax: body.maxPax ?? 10,

            imageUrl: imageResult.filename,

            badges: parseJsonField(body.badges),
            inclusions: parseJsonField(body.inclusions),
            exclusions: parseJsonField(body.exclusions),

            description: body.description,
            highlights: parseJsonField(body.highlights),
            itinerary: parseJsonField(body.itinerary),

            isActive: body.isActive ?? true,
            isFeatured: body.isFeatured ?? false,
            label: body.label,
            order: body.order !== undefined && body.order !== "" ? Number(body.order) : 0,
            gstPercentage: body.gstPercentage !== undefined && body.gstPercentage !== "" ? Number(body.gstPercentage) : 0,
        }

        if (bookingType === "STANDARD") {
            placeData.price = body.price
            placeData.strikePrice = body.strikePrice
            placeData.discount = body.discount
        }

        const place = await TourismModel.create(placeData)

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
    const { body, params, set }: any = ctx

    try {
        const existing = await TourismModel.findById(params.id)
        if (!existing || existing.isDeleted) {
            set.status = 404
            return { error: "Tourism package not found", status: false }
        }

        const updateData: Record<string, any> = { ...body }

        // Parse array/object fields if they are sent as JSON strings
        const jsonFields = ["tripTypes", "badges", "inclusions", "exclusions", "highlights", "itinerary"]
        for (const field of jsonFields) {
            if (body[field] !== undefined) {
                updateData[field] = parseJsonField(body[field])
            }
        }

        if (body.order !== undefined) {
            updateData.order = body.order !== "" ? Number(body.order) : 0
        }

        if (body.gstPercentage !== undefined) {
            updateData.gstPercentage = body.gstPercentage !== "" ? Number(body.gstPercentage) : 0
        }

        if (body.bookingType !== undefined) {
            updateData.bookingType = body.bookingType.toUpperCase()
        }

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

        // Handle price removal if customized
        const finalBookingType = updateData.bookingType ?? existing.bookingType
        const updateObj: Record<string, any> = {}

        if (finalBookingType === "CUSTOMIZED") {
            // Unset pricing fields
            updateObj.$unset = {
                price: "",
                strikePrice: "",
                discount: "",
            }
            // Delete them from $set so we don't accidentally set them to undefined/null or validation fails
            delete updateData.price
            delete updateData.strikePrice
            delete updateData.discount
        }

        updateObj.$set = updateData

        const updated = await TourismModel.findByIdAndUpdate(
            params.id,
            updateObj,
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
        if (!place || place.isDeleted) {
            set.status = 404
            return { error: "Tourism package not found", status: false }
        }

        place.isDeleted = true
        await place.save()

        return { message: "Tourism package deleted successfully", status: true }
    } catch (error: any) {
        console.error("Delete Tourism Error", error)
        set.status = 500
        return { error: "Failed to delete tourism package", status: false }
    }
}

// ─── DASHBOARD STATS ───────────────────────────────────────────────────────────

// export const getTourismDashboardStats = async (ctx: Context) => {
//     const { set } = ctx

//     try {
//         // 1. Fetch KPI metrics
//         const [
//             totalBookings,
//             revenueResult,
//             totalUsers,
//             activePackages
//         ] = await Promise.all([
//             PaymentModel.countDocuments({ status: "SUCCESS" }),
//             PaymentModel.aggregate([
//                 { $match: { status: "SUCCESS" } },
//                 { $group: { _id: null, total: { $sum: "$amount" } } }
//             ]),
//             UserModel.countDocuments(),
//             TourismModel.countDocuments({ isActive: true })
//         ])

//         const totalRevenue = revenueResult[0]?.total || 0

//         // 2. Fetch packages categories for pie chart matching
//         const domesticPackages = await TourismModel.find({ packageType: "DOMESTIC" }).select("_id").lean()
//         const domesticIds = domesticPackages.map(p => p._id)

//         const internationalPackages = await TourismModel.find({ packageType: "INTERNATIONAL" }).select("_id").lean()
//         const internationalIds = internationalPackages.map(p => p._id)

//         // 3. Count successful bookings by type/category
//         const [domesticCount, internationalCount, standardCount, customizedCount] = await Promise.all([
//             BookingModel.countDocuments({
//                 packageId: { $in: domesticIds },
//                 $or: [
//                     { bookingType: "STANDARD", status: { $in: ["PAYMENT_SUCCESS", "BOOKED", "CONFIRMED", "TRAVEL_STARTED", "COMPLETED"] } },
//                     { bookingType: "CUSTOMIZED", status: { $in: ["BOOKED", "COMPLETED"] } }
//                 ]
//             }),
//             BookingModel.countDocuments({
//                 packageId: { $in: internationalIds },
//                 $or: [
//                     { bookingType: "STANDARD", status: { $in: ["PAYMENT_SUCCESS", "BOOKED", "CONFIRMED", "TRAVEL_STARTED", "COMPLETED"] } },
//                     { bookingType: "CUSTOMIZED", status: { $in: ["BOOKED", "COMPLETED"] } }
//                 ]
//             }),
//             BookingModel.countDocuments({
//                 bookingType: "STANDARD",
//                 status: { $in: ["PAYMENT_SUCCESS", "BOOKED", "CONFIRMED", "TRAVEL_STARTED", "COMPLETED"] }
//             }),
//             BookingModel.countDocuments({
//                 bookingType: "CUSTOMIZED",
//                 status: { $in: ["BOOKED", "COMPLETED"] }
//             })
//         ])

//         // 4. Fetch the 10 most recent bookings
//         const recentBookings = await BookingModel.find()
//             .sort({ createdAt: -1 })
//             .limit(10)
//             .populate("packageId", "title destination packageType price bookingType")
//             .populate("userId", "fullName email mobile")
//             .lean()

//         return {
//             status: true,
//             data: {
//                 kpis: {
//                     totalBookings,
//                     totalRevenue,
//                     totalUsers,
//                     activePackages
//                 },
//                 pieChart: {
//                     domestic: domesticCount,
//                     international: internationalCount,
//                     standard: standardCount,
//                     customized: customizedCount
//                 },
//                 recentBookings
//             }
//         }
//     } catch (error: any) {
//         console.error("Get Tourism Dashboard Stats Error", error)
//         set.status = 500
//         return { error: "Failed to fetch tourism dashboard stats", status: false }
//     }
// }
export const getTourismDashboardStats = async (ctx: Context) => {
    const { set } = ctx

    try {
        // 1. Fetch KPI metrics including Standard & Customized Revenue breakdowns
        const [
            standardRevenueResult,
            customizedRevenueResult,
            totalUsers,
            activePackages
        ] = await Promise.all([
            BookingModel.aggregate([
                {
                    $match: {
                        bookingType: "STANDARD",
                        status: { $in: ["PAYMENT_SUCCESS", "BOOKED", "CONFIRMED", "TRAVEL_STARTED", "COMPLETED"] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$pricingDetails.finalAmount" },
                        count: { $sum: 1 }
                    }
                }
            ]),
            BookingModel.aggregate([
                {
                    $match: {
                        bookingType: "CUSTOMIZED",
                        status: { $nin: ["ENQUIRY_CANCELLED", "CANCELLED"] },
                        $or: [
                            { "quotation.amount": { $gt: 0 } },
                            { "pricingDetails.finalAmount": { $gt: 0 } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: {
                                $cond: [
                                    { $gt: ["$quotation.amount", 0] },
                                    "$quotation.amount",
                                    "$pricingDetails.finalAmount"
                                ]
                            }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            UserModel.countDocuments(),
            TourismModel.countDocuments({ isActive: true, isDeleted: false })
        ])

        const standardRevenue = standardRevenueResult[0]?.total || 0
        const standardBookingsCount = standardRevenueResult[0]?.count || 0
        const customizedRevenue = customizedRevenueResult[0]?.total || 0
        const customizedBookingsCount = customizedRevenueResult[0]?.count || 0
        const totalBookings = standardBookingsCount + customizedBookingsCount
        const totalRevenue = standardRevenue + customizedRevenue

        // 2. Fetch packages categories for pie chart matching
        const domesticPackages = await TourismModel.find({ packageType: "DOMESTIC", isDeleted: false }).select("_id").lean()
        const domesticIds = domesticPackages.map(p => p._id)

        const internationalPackages = await TourismModel.find({ packageType: "INTERNATIONAL", isDeleted: false }).select("_id").lean()
        const internationalIds = internationalPackages.map(p => p._id)

        // 3. Count successful bookings by type/category consistently
        const standardQuery = {
            bookingType: "STANDARD",
            status: { $in: ["PAYMENT_SUCCESS", "BOOKED", "CONFIRMED", "TRAVEL_STARTED", "COMPLETED"] }
        }
        const customizedQuery = {
            bookingType: "CUSTOMIZED",
            status: { $nin: ["ENQUIRY_CANCELLED", "CANCELLED"] },
            $or: [
                { "quotation.amount": { $gt: 0 } },
                { "pricingDetails.finalAmount": { $gt: 0 } }
            ]
        }

        const [domesticCount, internationalCount] = await Promise.all([
            BookingModel.countDocuments({
                packageId: { $in: domesticIds },
                $or: [standardQuery, customizedQuery]
            }),
            BookingModel.countDocuments({
                packageId: { $in: internationalIds },
                $or: [standardQuery, customizedQuery]
            })
        ])

        const standardCount = standardBookingsCount
        const customizedCount = customizedBookingsCount

        // 4. Fetch the 10 most recent bookings
        const recentBookings = await BookingModel.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("packageId", "title destination packageType price bookingType")
            .populate("userId", "fullName email mobile")
            .lean()

        return {
            status: true,
            data: {
                kpis: {
                    totalBookings,
                    totalRevenue,
                    standardRevenue,
                    customizedRevenue,
                    standardBookingsCount,
                    customizedBookingsCount,
                    totalUsers,
                    activePackages
                },
                revenueBreakdown: {
                    standard: {
                        total: standardRevenue,
                        count: standardBookingsCount
                    },
                    customized: {
                        total: customizedRevenue,
                        count: customizedBookingsCount
                    }
                },
                pieChart: {
                    domestic: domesticCount,
                    international: internationalCount,
                    standard: standardCount,
                    customized: customizedCount
                },
                recentBookings
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

        const filter: Record<string, any> = { isDeleted: false }

        // ── Package type filter (All / Domestic / Intl) ──────────────────────────
        if (query.packageType && query.packageType !== "ALL") {
            filter.packageType = query.packageType
        }

        // ── Booking type filter (All / Standard / Customized) ────────────────────
        if (query.bookingType && query.bookingType !== "ALL") {
            filter.bookingType = query.bookingType.toUpperCase()
        }

        // ── Destination region filter (multi-select checkboxes) ──────────────────
        if (query.destinationRegions) {
            const regions = query.destinationRegions
                .split(",")
                .map((r) => {
                    const trimmed = r.trim()
                    return trimmed.length === 24 ? trimmed.toLowerCase() : trimmed.toUpperCase()
                })
                .filter(Boolean)
            if (regions.length) filter.destinationRegion = { $in: regions }
        }

        // ── Trip type filter (Honeymoon, Family, Adventure, Solo …) ─────────────
        if (query.tripTypes) {
            const types = query.tripTypes
                .split(",")
                .map((t) => {
                    const trimmed = t.trim()
                    return trimmed.length === 24 ? trimmed.toLowerCase() : trimmed.toUpperCase()
                })
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
            filter.$or = [
                { bookingType: "CUSTOMIZED" },
                {
                    price: {
                        ...(minPrice !== undefined && { $gte: minPrice }),
                        ...(maxPrice !== undefined && { $lte: maxPrice }),
                    }
                }
            ]
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
            price_asc: { price: 1, order: 1 },
            price_desc: { price: -1, order: 1 },
            newest: { order: 1, createdAt: -1 },
            featured: { isFeatured: -1, order: 1, createdAt: -1 },
        }
        const sort = sortMap[query.sortBy ?? "newest"] ?? { order: 1, createdAt: -1 }

        const [data, total] = await Promise.all([
            TourismModel.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate("destinationRegion")
                .populate("tripTypes")
                .lean(),
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
        const place = await TourismModel.findById(params.id)
            .populate("destinationRegion")
            .populate("tripTypes")
            .lean()
        if (!place || place.isDeleted) {
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

// ─── TOGGLE ACTIVE ───────────────────────────────────────────────────────────

export const toggleActiveTouristPlace = async (
    ctx: Context<{ params: { id: string } }>
) => {
    const { params, set } = ctx

    try {
        const existing = await TourismModel.findById(params.id)
        if (!existing || existing.isDeleted) {
            set.status = 404
            return { error: "Tourism package not found", status: false }
        }

        existing.isActive = !existing.isActive
        await existing.save()

        // If the package was deactivated, remove it from all coupon packageIds
        if (!existing.isActive) {
            await CouponModel.updateMany(
                {
                    isDeleted: false,
                    applicableFor: "SELECTED",
                    packageIds: existing._id,
                },
                { $pull: { packageIds: existing._id } }
            )
        }

        return {
            message: `Tourism package status updated to ${existing.isActive ? "active" : "inactive"}`,
            data: existing,
            status: true,
        }
    } catch (error: any) {
        console.error("Toggle Active Tourism Error", error)
        set.status = 500
        return { error: "Failed to toggle active status", status: false }
    }
}

// ─── TOGGLE FEATURED ─────────────────────────────────────────────────────────

export const toggleFeaturedTouristPlace = async (
    ctx: Context<{ params: { id: string } }>
) => {
    const { params, set } = ctx

    try {
        const existing = await TourismModel.findById(params.id)
        if (!existing || existing.isDeleted) {
            set.status = 404
            return { error: "Tourism package not found", status: false }
        }

        existing.isFeatured = !existing.isFeatured
        await existing.save()

        return {
            message: "Tourism package featured status toggled successfully",
            data: existing,
            status: true,
        }
    } catch (error: any) {
        console.error("Toggle Featured Tourism Error", error)
        set.status = 500
        return { error: "Failed to toggle featured status", status: false }
    }
}

// ─── GET FEATURED ────────────────────────────────────────────────────────────

export const getFeaturedTouristPlaces = async (ctx: Context) => {
    const { set } = ctx

    try {
        const data = await TourismModel.find({ isFeatured: true, isActive: true, isDeleted: false })
            .sort({ order: 1, createdAt: -1 })
            .limit(10)
            .populate("destinationRegion")
            .populate("tripTypes")
            .lean()

        return {
            status: true,
            data,
        }
    } catch (error: any) {
        console.error("Get Featured Tourism Error", error)
        set.status = 500
        return { error: "Failed to fetch featured tourism packages", status: false }
    }
}