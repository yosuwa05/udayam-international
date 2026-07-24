import { Context } from "elysia"
import { CouponModel } from "@models/coupon.model"
import { UserModel } from "@models/user.model"
import { TourismModel } from "@models/tourism.model"
import { BookingModel } from "@models/booking.model"
import { CouponUsageModel } from "@models/couponUsage.model"
import { DecodeUserPaseto } from "@lib/paseto"
import { saveFile, deleteFile } from "@lib/file"
import { GetCouponsQuery } from "./coupon.schema"
import { Types } from "mongoose"

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

// ─── CREATE ──────────────────────────────────────────────────────────────────

export const createCoupon = async (ctx: Context) => {
    const { body, set, store }: any = ctx
    const adminId = store.id

    try {
        const code = (body.couponCode ?? "").trim().toUpperCase()
        if (!code) {
            set.status = 400
            return { error: "Coupon code is required", status: false }
        }

        // Check if code exists & is not deleted
        const existing = await CouponModel.findOne({ couponCode: code, isDeleted: false })
        if (existing) {
            set.status = 400
            return { error: "Coupon code already exists", status: false }
        }

        // Upload banner image
        if (!body.bannerImage) {
            set.status = 400
            return { error: "Banner image is required", status: false }
        }
        const imageResult = await saveFile(body.bannerImage, "coupons", "banners")
        if (!imageResult.ok) {
            set.status = 500
            return { error: "Failed to upload banner image", status: false }
        }

        const discountValue = Number(body.discountValue)
        const minimumBookingAmount = Number(body.minimumBookingAmount ?? 0)
        const maximumDiscountAmount = body.maximumDiscountAmount !== undefined && body.maximumDiscountAmount !== "" 
            ? Number(body.maximumDiscountAmount) 
            : undefined

        const totalUsageLimit = Number(body.totalUsageLimit ?? 1)
        const perUserUsageLimit = Number(body.perUserUsageLimit ?? 1)

        const packageIds = parseJsonField(body.packageIds) ?? []
        const userIds = parseJsonField(body.userIds) ?? []

        const coupon = await CouponModel.create({
            title: body.title,
            description: body.description,
            couponCode: code,
            bannerImage: imageResult.filename,
            discountType: body.discountType,
            discountValue,
            minimumBookingAmount,
            maximumDiscountAmount,
            totalUsageLimit,
            perUserUsageLimit,
            usedCount: 0,
            applicableFor: body.applicableFor ?? "ALL",
            packageIds: packageIds.map((id: string) => new Types.ObjectId(id)),
            userType: body.userType ?? "ALL_USERS",
            userIds: userIds.map((id: string) => new Types.ObjectId(id)),
            validFrom: new Date(body.validFrom),
            validTo: new Date(body.validTo),
            status: body.status ?? "ACTIVE",
            isDeleted: false,
            createdBy: new Types.ObjectId(adminId),
            updatedBy: new Types.ObjectId(adminId),
        })

        set.status = 201
        return { message: "Coupon created successfully", data: coupon, status: true }
    } catch (error: any) {
        console.error("Create Coupon Error", error)
        set.status = 500
        return { error: "Failed to create coupon", status: false }
    }
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export const updateCoupon = async (ctx: Context<{ params: { id: string } }>) => {
    const { body, params, set, store }: any = ctx
    const adminId = store.id

    try {
        const existing = await CouponModel.findById(params.id)
        if (!existing || existing.isDeleted) {
            set.status = 404
            return { error: "Coupon not found", status: false }
        }

        const updateData: Record<string, any> = { ...body }

        // Parse list fields if present
        if (body.packageIds !== undefined) {
            const parsed = parseJsonField(body.packageIds) ?? []
            updateData.packageIds = parsed.map((id: string) => new Types.ObjectId(id))
        }
        if (body.userIds !== undefined) {
            const parsed = parseJsonField(body.userIds) ?? []
            updateData.userIds = parsed.map((id: string) => new Types.ObjectId(id))
        }

        if (body.couponCode !== undefined) {
            const code = body.couponCode.trim().toUpperCase()
            if (code !== existing.couponCode) {
                const dup = await CouponModel.findOne({ couponCode: code, isDeleted: false })
                if (dup) {
                    set.status = 400
                    return { error: "Coupon code already exists", status: false }
                }
                updateData.couponCode = code
            }
        }

        if (body.discountValue !== undefined) updateData.discountValue = Number(body.discountValue)
        if (body.minimumBookingAmount !== undefined) updateData.minimumBookingAmount = Number(body.minimumBookingAmount)
        if (body.maximumDiscountAmount !== undefined) {
            updateData.maximumDiscountAmount = body.maximumDiscountAmount !== "" ? Number(body.maximumDiscountAmount) : undefined
        }
        if (body.totalUsageLimit !== undefined) updateData.totalUsageLimit = Number(body.totalUsageLimit)
        if (body.perUserUsageLimit !== undefined) updateData.perUserUsageLimit = Number(body.perUserUsageLimit)

        if (body.validFrom !== undefined) updateData.validFrom = new Date(body.validFrom)
        if (body.validTo !== undefined) updateData.validTo = new Date(body.validTo)

        // Replace banner image if a new one was sent
        if (body.bannerImage && typeof body.bannerImage !== "string") {
            // Delete old image
            await deleteFile(existing.bannerImage)

            const imageResult = await saveFile(body.bannerImage, "coupons", "banners")
            if (!imageResult.ok) {
                set.status = 500
                return { error: "Failed to upload new banner image", status: false }
            }
            updateData.bannerImage = imageResult.filename
        } else {
            delete updateData.bannerImage
        }

        updateData.updatedBy = new Types.ObjectId(adminId)

        const updatedObj: Record<string, any> = { $set: updateData }
        if (body.maximumDiscountAmount === "") {
            updatedObj.$unset = { maximumDiscountAmount: "" }
            delete updateData.maximumDiscountAmount
        }

        const updated = await CouponModel.findByIdAndUpdate(
            params.id,
            updatedObj,
            { new: true, runValidators: true }
        )

        return { message: "Coupon updated successfully", data: updated, status: true }
    } catch (error: any) {
        console.error("Update Coupon Error", error)
        set.status = 500
        return { error: "Failed to update coupon", status: false }
    }
}

// ─── DELETE (Soft Delete) ────────────────────────────────────────────────────

export const deleteCoupon = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, set, store }: any = ctx
    const adminId = store.id

    try {
        const existing = await CouponModel.findById(params.id)
        if (!existing || existing.isDeleted) {
            set.status = 404
            return { error: "Coupon not found", status: false }
        }

        existing.isDeleted = true
        existing.updatedBy = new Types.ObjectId(adminId)
        await existing.save()

        return { message: "Coupon deleted successfully", status: true }
    } catch (error: any) {
        console.error("Delete Coupon Error", error)
        set.status = 500
        return { error: "Failed to delete coupon", status: false }
    }
}

// ─── GET ALL ─────────────────────────────────────────────────────────────────

export const getAllCoupons = async (ctx: Context<{ query: GetCouponsQuery }>) => {
    const { query, set } = ctx

    try {
        const page = Math.max(1, parseInt(query.page ?? "1"))
        const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? "10")))
        const skip = (page - 1) * limit

        const filter: Record<string, any> = { isDeleted: false }

        // Filter status
        if (query.status && query.status !== "ALL") {
            filter.status = query.status
        }

        // Filter applicability
        if (query.applicableFor && query.applicableFor !== "ALL_TYPES") {
            filter.applicableFor = query.applicableFor
        }

        // Search text
        if (query.search?.trim()) {
            filter.$or = [
                { couponCode: { $regex: query.search.trim(), $options: "i" } },
                { title: { $regex: query.search.trim(), $options: "i" } },
                { description: { $regex: query.search.trim(), $options: "i" } },
            ]
        }

        // Sorting
        const sortMap: Record<string, Record<string, 1 | -1>> = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            discount_high: { discountValue: -1 },
            discount_low: { discountValue: 1 },
        }
        const sort = sortMap[query.sortBy ?? "newest"] ?? { createdAt: -1 }

        const [data, total] = await Promise.all([
            CouponModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            CouponModel.countDocuments(filter),
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
        console.error("Get All Coupons Error", error)
        set.status = 500
        return { error: "Failed to fetch coupons", status: false }
    }
}

// ─── GET SINGLE ──────────────────────────────────────────────────────────────

export const getCouponById = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, set } = ctx

    try {
        const coupon = await CouponModel.findOne({ _id: params.id, isDeleted: false }).lean()
        if (!coupon) {
            set.status = 404
            return { error: "Coupon not found", status: false }
        }
        return { status: true, data: coupon }
    } catch (error: any) {
        console.error("Get Coupon By ID Error", error)
        set.status = 500
        return { error: "Failed to fetch coupon", status: false }
    }
}
// ─── HELPER ENDPOINTS FOR ADMIN SELECTIONS ───────────────────────────────────

export const getApplicableUsers = async (ctx: Context) => {
    const { set, query }: any = ctx
    try {
        // If specific IDs are requested, return them directly
        if (query.ids) {
            const ids = parseJsonField(query.ids)
            if (Array.isArray(ids) && ids.length) {
                const objectIds = ids.map(id => new Types.ObjectId(id))
                const users = await UserModel.find({ _id: { $in: objectIds } }).select("fullName mobile email").lean()
                return { status: true, data: users }
            }
        }

        const page = Math.max(1, parseInt(query.page ?? "1"))
        const limit = Math.max(1, parseInt(query.limit ?? "10"))
        const skip = (page - 1) * limit
        const search = query.search?.trim()

        const filter: Record<string, any> = { status: "ACTIVE" }
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        }

        const [users, total] = await Promise.all([
            UserModel.find(filter).select("fullName mobile email").skip(skip).limit(limit).lean(),
            UserModel.countDocuments(filter)
        ])

        return {
            status: true,
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total
            }
        }
    } catch (error: any) {
        console.error("Get Applicable Users Error", error)
        set.status = 500
        return { error: "Failed to fetch users", status: false }
    }
}

export const getApplicablePackages = async (ctx: Context) => {
    const { set, query }: any = ctx
    try {
        // If specific IDs are requested, return them directly
        if (query.ids) {
            const ids = parseJsonField(query.ids)
            if (Array.isArray(ids) && ids.length) {
                const objectIds = ids.map(id => new Types.ObjectId(id))
                const packages = await TourismModel.find({ _id: { $in: objectIds } }).select("title destination packageType bookingType").lean()
                return { status: true, data: packages }
            }
        }

        const page = Math.max(1, parseInt(query.page ?? "1"))
        const limit = Math.max(1, parseInt(query.limit ?? "10"))
        const skip = (page - 1) * limit
        const search = query.search?.trim()

        const filter: Record<string, any> = { isActive: true }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { destination: { $regex: search, $options: "i" } }
            ]
        }

        const [packages, total] = await Promise.all([
            TourismModel.find(filter).select("title destination packageType bookingType").skip(skip).limit(limit).lean(),
            TourismModel.countDocuments(filter)
        ])

        return {
            status: true,
            data: packages,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total
            }
        }
    } catch (error: any) {
        console.error("Get Applicable Packages Error", error)
        set.status = 500
        return { error: "Failed to fetch packages", status: false }
    }
}

// ─── GET ACTIVE COUPONS FOR HOME SHOWCASE ────────────────────────────────────

export const getActiveCoupons = async (ctx: Context) => {
    const { cookie, set }: any = ctx
    try {
        const userToken = cookie.udayam_access_token_user?.value
        let userId: string | null = null

        if (userToken) {
            try {
                const payload = await DecodeUserPaseto(userToken)
                if (payload && payload.id) {
                    userId = payload.id
                }
            } catch (err) {
                // Ignore, treat as guest if token is invalid or expired
            }
        }

        const now = new Date()
        const candidateCoupons = await CouponModel.find({
            status: "ACTIVE",
            isDeleted: false,
            validFrom: { $lte: now },
            validTo: { $gte: now },
        }).populate("packageIds", "title destination imageUrl").lean()

        const eligibleCoupons: any[] = []

        for (const coupon of candidateCoupons) {
            // Check global usage limit
            if (coupon.usedCount >= coupon.totalUsageLimit) {
                continue
            }

            // If user is logged in, perform user-specific validations
            if (userId) {
                // Check per-user limit
                const userUsageCount = await CouponUsageModel.countDocuments({
                    couponId: coupon._id,
                    userId: new Types.ObjectId(userId),
                })
                if (userUsageCount >= coupon.perUserUsageLimit) {
                    continue
                }

                // Check user type applicability
                if (coupon.userType === "SELECTED_USERS") {
                    const userMatch = coupon.userIds.some((id) => id.toString() === userId)
                    if (!userMatch) {
                        continue
                    }
                } else if (coupon.userType === "NEW_USERS") {
                    const previousBookings = await BookingModel.countDocuments({
                        userId: new Types.ObjectId(userId),
                        status: { $in: ["BOOKED", "CONFIRMED", "COMPLETED"] },
                    })
                    if (previousBookings > 0) {
                        continue
                    }
                } else if (coupon.userType === "EXISTING_USERS") {
                    const previousBookings = await BookingModel.countDocuments({
                        userId: new Types.ObjectId(userId),
                        status: { $in: ["BOOKED", "CONFIRMED", "COMPLETED"] },
                    })
                    if (previousBookings === 0) {
                        continue
                    }
                }
            }

            eligibleCoupons.push(coupon)
        }

        return { status: true, data: eligibleCoupons }
    } catch (error: any) {
        console.error("Get Active Coupons Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch active coupons" }
    }
}

