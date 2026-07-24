import { Context } from "elysia"
import { Types } from "mongoose"
import crypto from "crypto"
import { BookingModel, BookingStatus } from "@models/booking.model"
import { PaymentModel } from "@models/payment.model"
import { CouponModel, ICoupon } from "@models/coupon.model"
import { CouponUsageModel } from "@models/couponUsage.model"
import { TourismModel } from "@models/tourism.model"
import { BookingStatusHistoryModel } from "@models/bookingStatusHistory.model"
import { RefundModel } from "@models/refund.model"
import { APP_CONSTANTS } from "constant"

// ─── HELPER: Coupon Validator Logic ──────────────────────────────────────────

export async function validateCouponHelper(params: {
    couponCode: string
    packageId: string
    bookingAmount: number
    userId: string
}) {
    const code = params.couponCode.trim().toUpperCase()
    const coupon = await CouponModel.findOne({ couponCode: code, isDeleted: false })

    if (!coupon) {
        return { valid: false, error: "Coupon code does not exist" }
    }

    if (coupon.status !== "ACTIVE") {
        return { valid: false, error: "Coupon is inactive" }
    }

    const now = new Date()
    if (now < new Date(coupon.validFrom) || now > new Date(coupon.validTo)) {
        return { valid: false, error: "Coupon is expired or not yet valid" }
    }

    if (coupon.usedCount >= coupon.totalUsageLimit) {
        return { valid: false, error: "Coupon total usage limit has been reached" }
    }

    // Check per-user limit
    const userUsageCount = await CouponUsageModel.countDocuments({
        couponId: coupon._id,
        userId: new Types.ObjectId(params.userId),
    })

    if (userUsageCount >= coupon.perUserUsageLimit) {
        return { valid: false, error: "You have reached your limit for this coupon" }
    }

    // Check minimum booking amount
    if (params.bookingAmount < coupon.minimumBookingAmount) {
        return {
            valid: false,
            error: `Minimum booking amount for this coupon is ₹${coupon.minimumBookingAmount.toLocaleString("en-IN")}`,
        }
    }

    // Check package applicability
    if (coupon.applicableFor === "SELECTED") {
        const pkgMatch = coupon.packageIds.some(
            (id) => id.toString() === params.packageId
        )
        if (!pkgMatch) {
            return { valid: false, error: "Coupon is not applicable for this package" }
        }
    }

    // Check user type applicability
    if (coupon.userType === "SELECTED_USERS") {
        const userMatch = coupon.userIds.some((id) => id.toString() === params.userId)
        if (!userMatch) {
            return { valid: false, error: "Coupon is not applicable for your user account" }
        }
    } else if (coupon.userType === "NEW_USERS") {
        const previousBookings = await BookingModel.countDocuments({
            userId: new Types.ObjectId(params.userId),
            status: { $in: ["BOOKED", "CONFIRMED", "COMPLETED"] },
        })
        if (previousBookings > 0) {
            return { valid: false, error: "Coupon is valid for new users only" }
        }
    } else if (coupon.userType === "EXISTING_USERS") {
        const previousBookings = await BookingModel.countDocuments({
            userId: new Types.ObjectId(params.userId),
            status: { $in: ["BOOKED", "CONFIRMED", "COMPLETED"] },
        })
        if (previousBookings === 0) {
            return { valid: false, error: "Coupon is valid for existing users only" }
        }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (params.bookingAmount * coupon.discountValue) / 100
        if (
            coupon.maximumDiscountAmount !== undefined &&
            coupon.maximumDiscountAmount > 0
        ) {
            discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount)
        }
    } else {
        discountAmount = coupon.discountValue
    }

    // Discount cannot exceed booking amount
    discountAmount = Math.min(discountAmount, params.bookingAmount)
    const finalAmount = params.bookingAmount - discountAmount

    return {
        valid: true,
        coupon,
        originalAmount: params.bookingAmount,
        discountAmount,
        finalAmount,
    }
}

// ─── 1. PUBLIC: Validate Coupon Endpoint ─────────────────────────────────────

export const validateCoupon = async (ctx: Context) => {
    const { body, set, store }: any = ctx
    const userId = store.id

    if (!userId) {
        set.status = 401
        return { status: false, error: "Please log in to apply coupons" }
    }

    try {
        const { couponCode, packageId, bookingAmount } = body
        if (!couponCode || !packageId || bookingAmount === undefined) {
            set.status = 400
            return { status: false, error: "Missing required fields (couponCode, packageId, bookingAmount)" }
        }

        const result = await validateCouponHelper({
            couponCode,
            packageId,
            bookingAmount: Number(bookingAmount),
            userId,
        })

        if (!result.valid) {
            set.status = 400
            return { status: false, error: result.error }
        }

        return {
            status: true,
            message: "Coupon applied successfully",
            data: {
                couponCode: result.coupon!.couponCode,
                couponId: result.coupon!._id,
                title: result.coupon!.title,
                originalAmount: result.originalAmount,
                discountAmount: result.discountAmount,
                finalAmount: result.finalAmount,
            },
        }
    } catch (error: any) {
        console.error("Validate Coupon Error", error)
        set.status = 500
        return { status: false, error: "Failed to validate coupon" }
    }
}

// ─── 2. PUBLIC: Eligible Coupons For Package Endpoint ───────────────────────

export const getEligibleCouponsForPackage = async (ctx: Context<{ params: { packageId: string } }>) => {
    const { params, set, store }: any = ctx
    const userId = store.id

    try {
        const pkg = await TourismModel.findById(params.packageId)
        if (!pkg || !pkg.isActive) {
            set.status = 404
            return { status: false, error: "Package not found or inactive" }
        }

        if (pkg.bookingType === "CUSTOMIZED") {
            return { status: true, data: [] }
        }

        const now = new Date()
        const candidateCoupons = await CouponModel.find({
            status: "ACTIVE",
            isDeleted: false,
            validFrom: { $lte: now },
            validTo: { $gte: now },
            applicableFor: { $in: ["ALL", "STANDARD", "SELECTED"] },
        }).lean()

        const eligibleCoupons: any[] = []

        for (const coupon of candidateCoupons) {
            if (coupon.usedCount >= coupon.totalUsageLimit) continue

            // Selected package filter
            if (coupon.applicableFor === "SELECTED") {
                const isMatch = coupon.packageIds.some((id) => id.toString() === params.packageId)
                if (!isMatch) continue
            }

            // If user is logged in, check user limits & type
            if (userId) {
                const userUsage = await CouponUsageModel.countDocuments({
                    couponId: coupon._id,
                    userId: new Types.ObjectId(userId),
                })
                if (userUsage >= coupon.perUserUsageLimit) continue

                if (coupon.userType === "SELECTED_USERS") {
                    const isUserMatch = coupon.userIds.some((id) => id.toString() === userId)
                    if (!isUserMatch) continue
                }
            }

            eligibleCoupons.push({
                _id: coupon._id,
                title: coupon.title,
                description: coupon.description,
                couponCode: coupon.couponCode,
                bannerImage: coupon.bannerImage,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minimumBookingAmount: coupon.minimumBookingAmount,
                maximumDiscountAmount: coupon.maximumDiscountAmount,
                validTo: coupon.validTo,
            })
        }

        return { status: true, data: eligibleCoupons }
    } catch (error: any) {
        console.error("Get Eligible Coupons Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch eligible coupons" }
    }
}

// ─── 3. STANDARD BOOKING: Create Order & Init Booking ────────────────────────

export const createStandardBookingOrder = async (ctx: Context) => {
    const { body, set, store }: any = ctx
    const userId = store.id

    if (!userId) {
        set.status = 401
        return { status: false, error: "Authentication required to book a package" }
    }

    try {
        const { packageId, travellerInfo, couponCode } = body
        if (!packageId || !travellerInfo || !travellerInfo.fullName || !travellerInfo.mobileNumber || !travellerInfo.email || !travellerInfo.numberOfPersons || !travellerInfo.travelDate) {
            set.status = 400
            return { status: false, error: "Missing required booking details" }
        }

        const pkg = await TourismModel.findById(packageId)
        if (!pkg || !pkg.isActive) {
            set.status = 404
            return { status: false, error: "Package not found or inactive" }
        }

        if (pkg.bookingType !== "STANDARD" || !pkg.price) {
            set.status = 400
            return { status: false, error: "This package requires a custom enquiry rather than direct booking" }
        }

        const numPersons = Number(travellerInfo.numberOfPersons)
        const originalAmount = pkg.price * numPersons
        let discountAmount: any = 0
        let finalAmount: any = originalAmount
        let couponIdObj: Types.ObjectId | undefined = undefined

        if (couponCode && couponCode.trim()) {
            const val = await validateCouponHelper({
                couponCode: couponCode.trim(),
                packageId,
                bookingAmount: originalAmount,
                userId,
            })
            if (!val.valid) {
                set.status = 400
                return { status: false, error: val.error }
            }
            discountAmount = val.discountAmount
            finalAmount = val.finalAmount
            couponIdObj = val.coupon!._id
        }

        const bookingNumber = `UV-STD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

        // Create Production Razorpay Order via REST API
        const razorpayKeyId = APP_CONSTANTS.RAZORPAY_KEY_ID
        const razorpayKeySecret = APP_CONSTANTS.RAZORPAY_KEY_SECRET

        if (!razorpayKeyId || !razorpayKeySecret) {
            set.status = 500
            return { status: false, error: "Razorpay credentials are not configured on the server" }
        }

        const authHeader = "Basic " + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64")
        const rpRes = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify({
                amount: Math.round(finalAmount * 100), // amount in paise
                currency: "INR",
                receipt: bookingNumber,
                notes: {
                    bookingNumber,
                    packageId,
                    userId,
                    couponCode,
                },
            }),
        })

        const rpData = await rpRes.json()
        if (!rpRes.ok || !rpData || !rpData.id) {
            console.error("Razorpay Order Creation API Error", rpData)
            set.status = 500
            return {
                status: false,
                error: rpData?.error?.description || "Failed to create Razorpay order",
            }
        }

        const razorpayOrderId = rpData.id

        // Store booking metadata in Payment record (defer Booking creation until payment verification)
        const bookingPayload = {
            bookingNumber,
            packageId,
            userId,
            travellerInfo: {
                fullName: travellerInfo.fullName,
                mobileNumber: travellerInfo.mobileNumber,
                email: travellerInfo.email,
                numberOfPersons: numPersons,
                travelDate: new Date(travellerInfo.travelDate),
                travelType: travellerInfo.travelType || "FAMILY",
                specialRequests: travellerInfo.specialRequests,
                travellers: travellerInfo.travellers || [],
            },
            pricingDetails: {
                originalAmount,
                discountAmount,
                finalAmount,
                currency: "INR",
            },
            couponId: couponIdObj ? couponIdObj.toString() : null,
        }

        // Create Payment record with pending payload
        await PaymentModel.create({
            razorpayOrderId,
            amount: finalAmount,
            currency: "INR",
            status: "CREATED",
            bookingPayload,
        })

        return {
            status: true,
            data: {
                bookingNumber,
                razorpayOrderId,
                amount: finalAmount,
                amountInPaise: Math.round(finalAmount * 100),
                currency: "INR",
                keyId: razorpayKeyId,
            },
        }
    } catch (error: any) {
        console.error("Create Standard Booking Order Error", error)
        set.status = 500
        return { status: false, error: "Failed to create booking order" }
    }
}

// ─── HELPER: Idempotently Create Booking on Payment Verification ──────────────

export const confirmBookingFromPaymentPayload = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature?: string
) => {
    const payment = await PaymentModel.findOne({ razorpayOrderId })
    if (!payment) {
        throw new Error("Payment record not found")
    }

    // Idempotency: If booking was already created for this payment, return it
    if (payment.bookingId) {
        const existingBooking = await BookingModel.findById(payment.bookingId)
        if (existingBooking) return existingBooking
    }

    const payload = payment.bookingPayload
    if (!payload) {
        throw new Error("Booking payload missing from payment record")
    }

    // Create Booking Document strictly on Payment Success
    const booking = await BookingModel.create({
        bookingNumber: payload.bookingNumber,
        packageId: new Types.ObjectId(payload.packageId),
        userId: new Types.ObjectId(payload.userId),
        bookingType: "STANDARD",
        travellerInfo: payload.travellerInfo,
        pricingDetails: payload.pricingDetails,
        couponId: payload.couponId ? new Types.ObjectId(payload.couponId) : undefined,
        status: "BOOKED",
    })

    // Update Payment record
    payment.status = "SUCCESS"
    payment.razorpayPaymentId = razorpayPaymentId
    payment.razorpaySignature = razorpaySignature
    payment.bookingId = booking._id
    await payment.save()

    booking.paymentId = payment._id
    await booking.save()

    // Consume Coupon if applicable
    if (booking.couponId) {
        const coupon = await CouponModel.findById(booking.couponId)
        if (coupon) {
            coupon.usedCount += 1
            await coupon.save()

            await CouponUsageModel.create({
                couponId: coupon._id,
                bookingId: booking._id,
                userId: new Types.ObjectId(payload.userId),
                userEmail: booking.travellerInfo.email,
                userMobile: booking.travellerInfo.mobileNumber,
                discountAmount: booking.pricingDetails.discountAmount,
                usedAt: new Date(),
            })
        }
    }

    // Audit History Log
    await BookingStatusHistoryModel.create({
        bookingId: booking._id,
        fromStatus: "INITIATED",
        toStatus: "BOOKED",
        changedBy: new Types.ObjectId(payload.userId),
        notes: `Payment verified & booking created successfully (Payment ID: ${razorpayPaymentId})`,
    })

    return booking
}

// ─── 4. STANDARD BOOKING: Verify Payment Endpoint ─────────────────────────────

export const verifyStandardPayment = async (ctx: Context) => {
    const { body, set, store }: any = ctx
    const userId = store.id

    if (!userId) {
        set.status = 401
        return { status: false, error: "Authentication required" }
    }

    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body
        if (!razorpayOrderId || !razorpayPaymentId) {
            set.status = 400
            return { status: false, error: "Missing required payment verification fields" }
        }

        const payment = await PaymentModel.findOne({ razorpayOrderId })
        if (!payment) {
            set.status = 404
            return { status: false, error: "Payment record not found" }
        }

        const razorpayKeySecret = APP_CONSTANTS.RAZORPAY_KEY_SECRET
        if (!razorpayKeySecret || !razorpaySignature) {
            set.status = 400
            return { status: false, error: "Razorpay signature and secret are required for verification" }
        }

        // Verify Signature via HMAC SHA256
        const generatedSignature = crypto
            .createHmac("sha256", razorpayKeySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex")

        if (generatedSignature !== razorpaySignature) {
            payment.status = "FAILED"
            payment.failureReason = "Invalid signature verification"
            await payment.save()

            set.status = 400
            return { status: false, error: "Payment verification failed due to signature mismatch" }
        }

        // Signature is valid! Idempotently create booking document
        const booking = await confirmBookingFromPaymentPayload(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        )

        return {
            status: true,
            message: "Payment verified and booking confirmed!",
            data: booking,
        }
    } catch (error: any) {
        console.error("Verify Standard Payment Error", error)
        set.status = 500
        return { status: false, error: "Failed to verify payment" }
    }
}

// ─── 4b. RAZORPAY WEBHOOK: Handle Webhook Notifications ───────────────────────

export const handleRazorpayWebhook = async (ctx: Context) => {
    const { request, body, set }: any = ctx

    try {
        const webhookSecret = APP_CONSTANTS.RAZORPAY_WEBHOOK_SECRET || APP_CONSTANTS.RAZORPAY_KEY_SECRET
        const signature = request.headers.get("x-razorpay-signature") || ""

        if (webhookSecret && signature) {
            const rawBody = typeof body === "string" ? body : JSON.stringify(body)
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(rawBody)
                .digest("hex")

            if (expectedSignature !== signature) {
                set.status = 400
                return { status: false, error: "Invalid webhook signature" }
            }
        }

        const event = typeof body === "string" ? JSON.parse(body) : body
        const eventName = event?.event

        // 1. PAYMENT CAPTURED / ORDER PAID -> Confirm Booking
        if (eventName === "payment.captured" || eventName === "order.paid") {
            const paymentEntity = event?.payload?.payment?.entity
            const razorpayOrderId = paymentEntity?.order_id
            const razorpayPaymentId = paymentEntity?.id

            if (razorpayOrderId && razorpayPaymentId) {
                await confirmBookingFromPaymentPayload(razorpayOrderId, razorpayPaymentId, signature)
            }
        }

        // 2. PAYMENT FAILED -> Log Failure
        else if (eventName === "payment.failed") {
            const paymentEntity = event?.payload?.payment?.entity
            const razorpayOrderId = paymentEntity?.order_id
            const failureReason = paymentEntity?.error_description || "Payment failed on Razorpay"

            if (razorpayOrderId) {
                const payment = await PaymentModel.findOne({ razorpayOrderId })
                if (payment) {
                    payment.status = "FAILED"
                    payment.failureReason = failureReason
                    await payment.save()

                    if (payment.bookingId) {
                        const booking = await BookingModel.findById(payment.bookingId)
                        if (booking) {
                            const oldStatus = booking.status
                            booking.status = "PAYMENT_FAILED"
                            await booking.save()

                            await BookingStatusHistoryModel.create({
                                bookingId: booking._id,
                                fromStatus: oldStatus,
                                toStatus: "PAYMENT_FAILED",
                                notes: `Razorpay Webhook: Payment failed (${failureReason})`,
                            })
                        }
                    }
                }
            }
        }

        // 3. REFUND CREATED / PROCESSED -> Update Refund & Booking Status
        else if (eventName === "refund.processed" || eventName === "refund.created") {
            const refundEntity = event?.payload?.refund?.entity
            const razorpayPaymentId = refundEntity?.payment_id
            const razorpayRefundId = refundEntity?.id
            const refundAmountInPaise = refundEntity?.amount || 0
            const refundAmount = refundAmountInPaise / 100

            if (razorpayPaymentId) {
                const payment = await PaymentModel.findOne({ razorpayPaymentId })
                if (payment) {
                    payment.status = "REFUNDED"
                    await payment.save()

                    if (payment.bookingId) {
                        const booking = await BookingModel.findById(payment.bookingId)
                        if (booking) {
                            const oldStatus = booking.status
                            booking.status = "REFUNDED"
                            await booking.save()

                            await BookingStatusHistoryModel.create({
                                bookingId: booking._id,
                                fromStatus: oldStatus,
                                toStatus: "REFUNDED",
                                notes: `Razorpay Webhook: Refund processed (Refund ID: ${razorpayRefundId})`,
                            })

                            await RefundModel.create({
                                bookingId: booking._id,
                                paymentId: payment._id,
                                amount: refundAmount || payment.amount,
                                reason: "Razorpay Webhook Refund Notification",
                                status: "SUCCESS",
                                razorpayRefundId,
                            })
                        }
                    }
                }
            }
        }

        return { status: true, message: "Webhook processed successfully" }
    } catch (error: any) {
        console.error("Razorpay Webhook Error", error)
        set.status = 500
        return { status: false, error: "Failed to process webhook" }
    }
}

// ─── 5. CUSTOMIZED BOOKING: Create Enquiry Endpoint ─────────────────────────

export const createCustomizedEnquiry = async (ctx: Context) => {
    const { body, set, store }: any = ctx
    const userId = store.id

    if (!userId) {
        set.status = 401
        return { status: false, error: "Authentication required to submit an enquiry" }
    }

    try {
        const { packageId, travellerInfo } = body
        if (!packageId || !travellerInfo || !travellerInfo.fullName || !travellerInfo.mobileNumber || !travellerInfo.email || !travellerInfo.numberOfPersons || !travellerInfo.travelDate) {
            set.status = 400
            return { status: false, error: "Missing required enquiry details" }
        }

        const pkg = await TourismModel.findById(packageId)
        if (!pkg || !pkg.isActive) {
            set.status = 404
            return { status: false, error: "Package not found or inactive" }
        }

        const bookingNumber = `UV-CUST-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

        const booking = await BookingModel.create({
            bookingNumber,
            packageId: new Types.ObjectId(packageId),
            userId: new Types.ObjectId(userId),
            bookingType: "CUSTOMIZED",
            travellerInfo: {
                fullName: travellerInfo.fullName,
                mobileNumber: travellerInfo.mobileNumber,
                email: travellerInfo.email,
                numberOfPersons: Number(travellerInfo.numberOfPersons),
                travelDate: new Date(travellerInfo.travelDate),
                travelType: travellerInfo.travelType || "FAMILY",
                specialRequests: travellerInfo.specialRequests,
                travellers: travellerInfo.travellers || [],
            },
            pricingDetails: {
                originalAmount: 0,
                discountAmount: 0,
                finalAmount: 0,
                currency: "INR",
            },
            status: "ENQUIRY_RECEIVED",
        })

        await BookingStatusHistoryModel.create({
            bookingId: booking._id,
            fromStatus: "INITIATED",
            toStatus: "ENQUIRY_RECEIVED",
            changedBy: new Types.ObjectId(userId),
            notes: "Customized package enquiry submitted by user",
        })

        return {
            status: true,
            message: "Enquiry submitted successfully! Our travel consultant will contact you shortly.",
            data: booking,
        }
    } catch (error: any) {
        console.error("Create Customized Enquiry Error", error)
        set.status = 500
        return { status: false, error: "Failed to submit enquiry" }
    }
}

// ─── 6. USER: Get My Bookings Endpoint ──────────────────────────────────────

export const getMyBookings = async (ctx: Context) => {
    const { query, set, store }: any = ctx
    const userId = store.id

    if (!userId) {
        set.status = 401
        return { status: false, error: "Authentication required" }
    }

    try {
        const page = Math.max(1, parseInt(query.page ?? "1"))
        const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "10")))
        const skip = (page - 1) * limit

        const filter: Record<string, any> = { userId: new Types.ObjectId(userId) }

        if (query.bookingType && query.bookingType !== "ALL") {
            filter.bookingType = query.bookingType
        }

        if (query.status && query.status !== "ALL") {
            filter.status = query.status
        }

        if (query.search?.trim()) {
            const regex = new RegExp(query.search.trim(), "i")
            filter.$or = [
                { bookingNumber: regex },
                { "travellerInfo.fullName": regex },
                { "travellerInfo.email": regex },
                { "travellerInfo.mobileNumber": regex },
            ]
        }

        const [bookings, total] = await Promise.all([
            BookingModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("packageId", "title destination imageUrl packageType bookingType days nights price bannerImage")
                .populate("paymentId")
                .lean(),
            BookingModel.countDocuments(filter),
        ])

        return {
            status: true,
            data: bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        }
    } catch (error: any) {
        console.error("Get My Bookings Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch user bookings" }
    }
}

export const getMyBookingDetails = async (ctx: Context) => {
    const { params, set, store }: any = ctx
    const userId = store.id

    if (!userId) {
        set.status = 401
        return { status: false, error: "Authentication required" }
    }

    try {
        const booking = await BookingModel.findOne({
            _id: new Types.ObjectId(params.id),
            userId: new Types.ObjectId(userId),
        })
            .populate("packageId")
            .populate("paymentId")
            .populate("couponId")
            .lean()

        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        const history = await BookingStatusHistoryModel.find({ bookingId: booking._id })
            .sort({ createdAt: -1 })
            .lean()

        return {
            status: true,
            data: {
                ...booking,
                history,
            },
        }
    } catch (error: any) {
        console.error("Get My Booking Details Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch booking details" }
    }
}

// ─── 7. ADMIN: Get All Bookings Endpoint (Filter & Pagination) ───────────────

export const getAdminBookings = async (ctx: Context) => {
    const { query, set }: any = ctx

    try {
        const page = Math.max(1, parseInt(query.page ?? "1"))
        const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "10")))
        const skip = (page - 1) * limit

        const filter: Record<string, any> = {}

        if (query.bookingType && query.bookingType !== "ALL") {
            filter.bookingType = query.bookingType
        }

        if (query.status && query.status !== "ALL") {
            filter.status = query.status
        }

        if (query.search?.trim()) {
            const searchRegex = { $regex: query.search.trim(), $options: "i" }
            filter.$or = [
                { bookingNumber: searchRegex },
                { "travellerInfo.fullName": searchRegex },
                { "travellerInfo.mobileNumber": searchRegex },
                { "travellerInfo.email": searchRegex },
            ]
        }

        if (query.startDate || query.endDate) {
            filter.createdAt = {}
            if (query.startDate) filter.createdAt.$gte = new Date(query.startDate)
            if (query.endDate) filter.createdAt.$lte = new Date(query.endDate)
        }

        const [bookings, total] = await Promise.all([
            BookingModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("packageId", "title destination packageType price")
                .populate("userId", "fullName email mobile")
                .lean(),
            BookingModel.countDocuments(filter),
        ])

        return {
            status: true,
            data: bookings,
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
        console.error("Get Admin Bookings Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch admin bookings" }
    }
}

// ─── 8. ADMIN: Get Booking Details Endpoint ──────────────────────────────────

export const getBookingDetails = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, set }: any = ctx

    try {
        const booking = await BookingModel.findById(params.id)
            .populate("packageId")
            .populate("userId", "fullName email mobile profileImage")
            .populate("couponId")
            .populate("paymentId")
            .lean()

        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking record not found" }
        }

        const statusHistory = await BookingStatusHistoryModel.find({ bookingId: booking._id })
            .sort({ createdAt: 1 })
            .lean()

        return {
            status: true,
            data: {
                ...booking,
                statusHistory,
            },
        }
    } catch (error: any) {
        console.error("Get Booking Details Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch booking details" }
    }
}

// ─── 9. ADMIN: Prepare / Update Quotation Endpoint ───────────────────────────

export const updateCustomizedQuotation = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, body, set, store }: any = ctx
    const adminId = store.id

    try {
        const { amount, notes, validUntil, status } = body
        if (amount === undefined || amount <= 0) {
            set.status = 400
            return { status: false, error: "Valid quotation amount is required" }
        }

        const booking = await BookingModel.findById(params.id)
        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        if (booking.bookingType !== "CUSTOMIZED") {
            set.status = 400
            return { status: false, error: "Quotations can only be updated for customized bookings" }
        }

        const oldStatus = booking.status
        const nextStatus = status || "QUOTATION_SHARED"

        booking.quotation = {
            amount: Number(amount),
            notes,
            sharedAt: new Date(),
            validUntil: validUntil ? new Date(validUntil) : undefined,
        }
        booking.pricingDetails.originalAmount = Number(amount)
        booking.pricingDetails.finalAmount = Number(amount)
        booking.status = nextStatus

        await booking.save()

        await BookingStatusHistoryModel.create({
            bookingId: booking._id,
            fromStatus: oldStatus,
            toStatus: nextStatus,
            changedBy: new Types.ObjectId(adminId),
            notes: `Quotation updated to ₹${Number(amount).toLocaleString("en-IN")}. ${notes || ""}`,
        })

        return {
            status: true,
            message: "Quotation updated successfully",
            data: booking,
        }
    } catch (error: any) {
        console.error("Update Quotation Error", error)
        set.status = 500
        return { status: false, error: "Failed to update quotation" }
    }
}

// ─── 10. ADMIN: Update Booking Status Endpoint ───────────────────────────────

export const updateBookingStatus = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, body, set, store }: any = ctx
    const adminId = store.id

    try {
        const { status, notes } = body
        if (!status) {
            set.status = 400
            return { status: false, error: "New status is required" }
        }

        const booking = await BookingModel.findById(params.id)
        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        const oldStatus = booking.status
        booking.status = status as BookingStatus
        await booking.save()

        await BookingStatusHistoryModel.create({
            bookingId: booking._id,
            fromStatus: oldStatus,
            toStatus: status,
            changedBy: new Types.ObjectId(adminId),
            notes: notes || `Booking status changed from ${oldStatus} to ${status}`,
        })

        return {
            status: true,
            message: "Booking status updated successfully",
            data: booking,
        }
    } catch (error: any) {
        console.error("Update Booking Status Error", error)
        set.status = 500
        return { status: false, error: "Failed to update booking status" }
    }
}

// ─── 11. ADMIN: Set Final Package Amount for Customized Booking ───────────────

export const setCustomizedFinalAmount = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, body, set, store }: any = ctx
    const adminId = store.id

    try {
        const { finalPackageAmount } = body

        if (finalPackageAmount === undefined || finalPackageAmount === null) {
            set.status = 400
            return { status: false, error: "finalPackageAmount is required" }
        }

        const amount = Number(finalPackageAmount)
        if (isNaN(amount) || amount <= 0) {
            set.status = 400
            return { status: false, error: "finalPackageAmount must be a positive number" }
        }

        const booking = await BookingModel.findById(params.id)
        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        if (booking.bookingType !== "CUSTOMIZED") {
            set.status = 400
            return { status: false, error: "Final package amount can only be set for customized bookings" }
        }

        // Lock: once any payment transaction exists, the amount cannot be changed
        if (booking.paymentTransactions && booking.paymentTransactions.length > 0) {
            set.status = 403
            return {
                status: false,
                error: "Final package amount cannot be changed after payment transactions have been recorded",
            }
        }

        booking.finalPackageAmount = amount
        booking.pricingDetails.finalAmount = amount
        booking.pricingDetails.originalAmount = amount
        await booking.save()

        await BookingStatusHistoryModel.create({
            bookingId: booking._id,
            fromStatus: booking.status,
            toStatus: booking.status,
            changedBy: new Types.ObjectId(adminId),
            notes: `Final package amount set to ₹${amount.toLocaleString("en-IN")} by admin`,
        })

        return {
            status: true,
            message: "Final package amount saved successfully",
            data: { finalPackageAmount: booking.finalPackageAmount },
        }
    } catch (error: any) {
        console.error("Set Final Package Amount Error", error)
        set.status = 500
        return { status: false, error: "Failed to set final package amount" }
    }
}

// ─── 12. ADMIN: Add Payment Transaction to Customized Booking ────────────────

const VALID_PAYMENT_METHODS = ["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"]

export const addCustomizedPaymentTransaction = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, body, set, store }: any = ctx
    const adminId = store.id

    try {
        const { amount, method, referenceNumber, notes } = body

        // Validate required fields
        if (amount === undefined || amount === null) {
            set.status = 400
            return { status: false, error: "Transaction amount is required" }
        }
        const txnAmount = Number(amount)
        if (isNaN(txnAmount) || txnAmount <= 0) {
            set.status = 400
            return { status: false, error: "Transaction amount must be a positive number" }
        }

        if (!method || !VALID_PAYMENT_METHODS.includes(method)) {
            set.status = 400
            return {
                status: false,
                error: `Payment method must be one of: ${VALID_PAYMENT_METHODS.join(", ")}`,
            }
        }

        const booking = await BookingModel.findById(params.id)
        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        if (booking.bookingType !== "CUSTOMIZED") {
            set.status = 400
            return { status: false, error: "Payment transactions can only be added to customized bookings" }
        }

        // Ensure final package amount is set first
        if (!booking.finalPackageAmount || booking.finalPackageAmount <= 0) {
            set.status = 400
            return {
                status: false,
                error: "Please set the final package amount before recording payment transactions",
            }
        }

        // Prevent duplicate reference numbers on the same booking
        if (referenceNumber && referenceNumber.trim()) {
            const refTrimmed = referenceNumber.trim()
            const dupRef = booking.paymentTransactions.some(
                (t: any) => t.referenceNumber && t.referenceNumber.toLowerCase() === refTrimmed.toLowerCase()
            )
            if (dupRef) {
                set.status = 400
                return {
                    status: false,
                    error: `A transaction with reference number "${refTrimmed}" already exists for this booking`,
                }
            }
        }

        // Prevent over-payment (sum + new amount > finalPackageAmount)
        const totalPaid = booking.paymentTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
        if (totalPaid + txnAmount > booking.finalPackageAmount) {
            set.status = 400
            return {
                status: false,
                error: `This transaction (₹${txnAmount.toLocaleString("en-IN")}) would exceed the final package amount of ₹${booking.finalPackageAmount.toLocaleString("en-IN")}. Total already recorded: ₹${totalPaid.toLocaleString("en-IN")}`,
            }
        }

        // Append the transaction
        const newTransaction = {
            amount: txnAmount,
            method,
            referenceNumber: referenceNumber?.trim() || undefined,
            notes: notes?.trim() || undefined,
            recordedBy: new Types.ObjectId(adminId),
            recordedAt: new Date(),
        }
        booking.paymentTransactions.push(newTransaction as any)

        await booking.save()

        // Log to status history for the timeline
        await BookingStatusHistoryModel.create({
            bookingId: booking._id,
            fromStatus: booking.status,
            toStatus: booking.status,
            changedBy: new Types.ObjectId(adminId),
            notes: `Payment recorded: ₹${txnAmount.toLocaleString("en-IN")} via ${method}${referenceNumber ? ` (Ref: ${referenceNumber.trim()})` : ""}. Total paid: ₹${(totalPaid + txnAmount).toLocaleString("en-IN")} / ₹${booking.finalPackageAmount.toLocaleString("en-IN")}`,
        })

        return {
            status: true,
            message: "Payment transaction recorded successfully",
            data: {
                transaction: booking.paymentTransactions[booking.paymentTransactions.length - 1],
                totalPaid: totalPaid + txnAmount,
                finalPackageAmount: booking.finalPackageAmount,
                balance: booking.finalPackageAmount - (totalPaid + txnAmount),
            },
        }
    } catch (error: any) {
        console.error("Add Payment Transaction Error", error)
        set.status = 500
        return { status: false, error: "Failed to record payment transaction" }
    }
}
