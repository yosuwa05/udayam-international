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
import { sendStandardBookingEmail, sendCustomizedEnquiryEmail } from "@lib/emailTemplates"
import {
    getOrCreatePaymentPlanSettings,
    validateInitialBookingPayment,
    validateSubsequentBookingPayment,
    getBookingPaymentSummary,
    calculatePaymentStages,
    roundCurrency,
    amountToPaise,
} from "@helper/paymentValidation.helper"
import { recordStaffActivity } from "@helper/staffLogger"


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
    console.log("now", now)
    console.log("coupon.validFrom", coupon.validFrom)
    console.log("coupon.validTo", coupon.validTo)
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
        if (!pkg || !pkg.isActive || pkg.isDeleted) {
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
        })
            .sort({ order: 1, createdAt: -1 })
            .lean()

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
        const { packageId, travellerInfo, couponCode, paymentAmount } = body
        if (!packageId || !travellerInfo || !travellerInfo.fullName || !travellerInfo.mobileNumber || !travellerInfo.email || !travellerInfo.numberOfPersons || !travellerInfo.travelDate) {
            set.status = 400
            return { status: false, error: "Missing required booking details" }
        }

        const pkg = await TourismModel.findById(packageId)
        if (!pkg || !pkg.isActive || pkg.isDeleted) {
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

        const gstPercentage = pkg.gstPercentage ?? 0
        const gstAmount = Math.round((finalAmount * gstPercentage) / 100)
        finalAmount = roundCurrency(finalAmount + gstAmount)

        // ── Validate payment stage and upfront amount ──
        const planSettings = await getOrCreatePaymentPlanSettings()
        const paymentValidation = validateInitialBookingPayment({
            finalAmount,
            paymentAmount,
            settings: planSettings,
        })

        if (!paymentValidation.isValid || paymentValidation.cleanAmount === undefined) {
            set.status = 400
            return { status: false, error: paymentValidation.error }
        }

        const payableAmount = paymentValidation.cleanAmount
        const isFullPayment = Boolean(paymentValidation.isFullPayment)
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
                amount: amountToPaise(payableAmount), // amount in paise
                currency: "INR",
                receipt: bookingNumber,
                notes: {
                    bookingNumber,
                    packageId,
                    userId,
                    couponCode: couponCode || "",
                    stage: "1",
                    stageLabel: paymentValidation.stageLabel,
                    isFullPayment: String(isFullPayment),
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
                gstAmount,
                gstPercentage,
                finalAmount,
                currency: "INR",
            },
            couponId: couponIdObj ? couponIdObj.toString() : null,
            initialPaymentAmount: payableAmount,
            isFullPayment,
            stage: 1,
            stageLabel: paymentValidation.stageLabel,
            planSettings: {
                maximumPaymentStages: planSettings.maximumPaymentStages,
                minimumAdvancePercentage: planSettings.minimumAdvancePercentage,
            },
        }

        // Create Payment record with pending payload
        await PaymentModel.create({
            razorpayOrderId,
            amount: payableAmount,
            currency: "INR",
            status: "CREATED",
            stage: 1,
            stageLabel: paymentValidation.stageLabel,
            isSubsequent: false,
            bookingPayload,
        })

        return {
            status: true,
            data: {
                bookingNumber,
                razorpayOrderId,
                amount: payableAmount,
                amountInPaise: amountToPaise(payableAmount),
                finalAmount,
                remainingAmount: Math.max(0, roundCurrency(finalAmount - payableAmount)),
                isFullPayment,
                stage: 1,
                stageLabel: paymentValidation.stageLabel,
                currency: "INR",
                keyId: razorpayKeyId,
                paymentPlan: calculatePaymentStages(finalAmount, planSettings),
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

    // ── CASE A: SUBSEQUENT PAYMENT VERIFICATION ──
    if (payment.isSubsequent || payment.bookingPayload?.isSubsequent) {
        // Idempotency: if already processed, return booking
        if (payment.status === "SUCCESS" && payment.bookingId) {
            const existingBooking = await BookingModel.findById(payment.bookingId)
            if (existingBooking) return existingBooking
        }

        if (!payment.bookingId) {
            throw new Error("Booking ID missing for subsequent payment")
        }

        payment.status = "SUCCESS"
        payment.razorpayPaymentId = razorpayPaymentId
        payment.razorpaySignature = razorpaySignature
        await payment.save()

        const booking = await BookingModel.findById(payment.bookingId)
        if (!booking) {
            throw new Error("Associated booking not found for payment")
        }

        // Add payment to booking.payments array
        if (!booking.payments) {
            booking.payments = []
        }
        if (!booking.payments.some((id: any) => id.toString() === payment._id.toString())) {
            booking.payments.push(payment._id as any)
        }
        booking.paymentId = payment._id

        // Recompute booking payment summary
        const summary = await getBookingPaymentSummary(booking)
        booking.paymentDetails = {
            totalPaidAmount: summary.totalPaidAmount,
            remainingAmount: summary.remainingAmount,
            paymentStatus: summary.paymentStatus,
            currentStage: summary.currentStageNumber - 1,
            maxStages: summary.maximumPaymentStages,
            isFullyPaid: summary.isFullyPaid,
        }

        if (summary.isFullyPaid && booking.status === "PARTIALLY_PAID") {
            booking.status = "CONFIRMED"
        }
        await booking.save()

        // Audit History Log
        await BookingStatusHistoryModel.create({
            bookingId: booking._id,
            fromStatus: booking.status,
            toStatus: booking.status,
            changedBy: booking.userId,
            notes: `Stage ${payment.stage || ""} (${payment.stageLabel || "Subsequent Payment"}) payment of ₹${payment.amount.toLocaleString("en-IN")} verified successfully (Payment ID: ${razorpayPaymentId}). Remaining balance: ₹${summary.remainingAmount.toLocaleString("en-IN")}. Payment Status: ${summary.paymentStatus}`,
        })

        return booking
    }

    // ── CASE B: INITIAL BOOKING PAYMENT VERIFICATION ──
    // Idempotency: If booking was already created for this payment and is marked SUCCESS, return it
    if (payment.bookingId && payment.status === "SUCCESS") {
        const existingBooking = await BookingModel.findById(payment.bookingId)
        if (existingBooking) return existingBooking
    }

    const payload = payment.bookingPayload
    if (!payload) {
        throw new Error("Booking payload missing from payment record")
    }

    const finalAmount = roundCurrency(payload.pricingDetails?.finalAmount || payment.amount)
    const paidAmount = roundCurrency(payment.amount)
    const remainingAmount = Math.max(0, roundCurrency(finalAmount - paidAmount))
    const isFullyPaid = remainingAmount <= 0
    const planSettings = await getOrCreatePaymentPlanSettings()

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
        paymentId: payment._id,
        payments: [payment._id],
        paymentDetails: {
            totalPaidAmount: paidAmount,
            remainingAmount,
            paymentStatus: isFullyPaid ? "FULLY_PAID" : "PARTIALLY_PAID",
            currentStage: 1,
            maxStages: payload.planSettings?.maximumPaymentStages || planSettings.maximumPaymentStages,
            isFullyPaid,
        },
    })

    // Update Payment record
    payment.status = "SUCCESS"
    payment.razorpayPaymentId = razorpayPaymentId
    payment.razorpaySignature = razorpaySignature
    payment.bookingId = booking._id
    await payment.save()

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
        notes: isFullyPaid
            ? `Full payment of ₹${paidAmount.toLocaleString("en-IN")} verified & booking confirmed (Payment ID: ${razorpayPaymentId})`
            : `Booking advance of ₹${paidAmount.toLocaleString("en-IN")} (Stage 1: ${payment.stageLabel || "Booking Advance"}) verified & booking confirmed (Payment ID: ${razorpayPaymentId}). Remaining balance: ₹${remainingAmount.toLocaleString("en-IN")}`,
    })

    // Trigger confirmation email in the background
    BookingModel.findById(booking._id)
        .populate("packageId")
        .then((populatedBooking) => {
            if (populatedBooking) {
                sendStandardBookingEmail(populatedBooking).catch((err) =>
                    console.error("Error sending standard booking email:", err)
                )
            }
        })
        .catch((err) => console.error("Error fetching booking for email:", err))

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

// ─── 4a. STANDARD BOOKING: Create Subsequent Payment Order ───────────────────

export const createSubsequentBookingPaymentOrder = async (ctx: Context) => {
    const { body, set, store }: any = ctx
    const userId = store.id

    if (!userId) {
        set.status = 401
        return { status: false, error: "Authentication required" }
    }

    try {
        const { bookingId, amount } = body
        if (!bookingId || amount === undefined || amount === null) {
            set.status = 400
            return { status: false, error: "bookingId and payment amount are required" }
        }

        const booking = await BookingModel.findOne({
            _id: new Types.ObjectId(bookingId),
            userId: new Types.ObjectId(userId),
        })

        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found or does not belong to your account" }
        }

        const planSettings = await getOrCreatePaymentPlanSettings()

        const validation = await validateSubsequentBookingPayment({
            booking,
            paymentAmount: amount,
            settings: planSettings,
        })

        if (!validation.isValid || validation.cleanAmount === undefined) {
            set.status = 400
            return { status: false, error: validation.error }
        }

        const payableAmount = validation.cleanAmount
        const stageNumber = validation.stageNumber
        const stageLabel = validation.stageLabel
        const receipt = `UV-SUB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

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
                amount: amountToPaise(payableAmount),
                currency: "INR",
                receipt,
                notes: {
                    bookingId: booking._id.toString(),
                    bookingNumber: booking.bookingNumber,
                    userId,
                    stage: String(stageNumber),
                    stageLabel,
                    isSubsequent: "true",
                },
            }),
        })

        const rpData = await rpRes.json()
        if (!rpRes.ok || !rpData || !rpData.id) {
            console.error("Razorpay Subsequent Order Creation Error", rpData)
            set.status = 500
            return {
                status: false,
                error: rpData?.error?.description || "Failed to create Razorpay order for subsequent payment",
            }
        }

        const razorpayOrderId = rpData.id

        // Create Payment record for this subsequent stage
        await PaymentModel.create({
            bookingId: booking._id,
            razorpayOrderId,
            amount: payableAmount,
            currency: "INR",
            status: "CREATED",
            stage: stageNumber,
            stageLabel,
            isSubsequent: true,
            bookingPayload: {
                bookingId: booking._id.toString(),
                stage: stageNumber,
                stageLabel,
                amount: payableAmount,
                isSubsequent: true,
            },
        })

        return {
            status: true,
            message: `Order created for Stage ${stageNumber} (${stageLabel}) payment`,
            data: {
                bookingId: booking._id,
                bookingNumber: booking.bookingNumber,
                razorpayOrderId,
                amount: payableAmount,
                amountInPaise: amountToPaise(payableAmount),
                currency: "INR",
                keyId: razorpayKeyId,
                stage: stageNumber,
                stageLabel,
                isFinalStage: validation.isFinalStage,
                remainingAfterThisPayment: validation.remainingAfterThisPayment,
            },
        }
    } catch (error: any) {
        console.error("Create Subsequent Payment Order Error", error)
        set.status = 500
        return { status: false, error: "Failed to create subsequent payment order" }
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
                            if (payment.isSubsequent) {
                                // For subsequent payments, the core booking remains confirmed; log failure history
                                await BookingStatusHistoryModel.create({
                                    bookingId: booking._id,
                                    fromStatus: booking.status,
                                    toStatus: booking.status,
                                    notes: `Razorpay Webhook: Subsequent payment of ₹${payment.amount} for Stage ${payment.stage || ""} failed (${failureReason})`,
                                })
                            } else {
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
        if (!pkg || !pkg.isActive || pkg.isDeleted) {
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
                gstAmount: 0,
                gstPercentage: pkg.gstPercentage ?? 0,
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

        // Trigger customized enquiry email in the background
        BookingModel.findById(booking._id)
            .populate("packageId")
            .then((populatedBooking) => {
                if (populatedBooking) {
                    sendCustomizedEnquiryEmail(populatedBooking).catch((err) =>
                        console.error("Error sending customized enquiry email:", err)
                    )
                }
            })
            .catch((err) => console.error("Error fetching booking for email:", err))

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
                .populate("payments")
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
            .populate("payments")
            .populate("couponId")
            .lean()

        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        const [history, paymentSummary] = await Promise.all([
            BookingStatusHistoryModel.find({ bookingId: booking._id })
                .sort({ createdAt: -1 })
                .lean(),
            getBookingPaymentSummary(booking),
        ])

        return {
            status: true,
            data: {
                ...booking,
                paymentSummary,
                history,
            },
        }
    } catch (error: any) {
        console.error("Get My Booking Details Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch booking details" }
    }
}

// ─── 6b. USER & ADMIN: Get Booking Payment Plan Summary Endpoint ─────────────

export const getBookingPaymentSummaryHandler = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, set, store }: any = ctx
    const userId = store.id
    const userRole = store.role

    try {
        const booking = await BookingModel.findById(params.id).lean()
        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        // Only the owner or an admin can access this summary
        if (userRole !== "ADMIN" && booking.userId.toString() !== userId) {
            set.status = 403
            return { status: false, error: "Access denied to this booking" }
        }

        const settings = await getOrCreatePaymentPlanSettings()
        const summary = await getBookingPaymentSummary(booking, settings)

        return {
            status: true,
            data: summary,
        }
    } catch (error: any) {
        console.error("Get Booking Payment Summary Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch payment summary" }
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
            if (query.startDate) {
                const start = new Date(query.startDate)
                if (!isNaN(start.getTime())) {
                    start.setUTCHours(0, 0, 0, 0)
                    filter.createdAt.$gte = start
                }
            }
            if (query.endDate) {
                const end = new Date(query.endDate)
                if (!isNaN(end.getTime())) {
                    end.setUTCHours(23, 59, 59, 999)
                    filter.createdAt.$lte = end
                }
            }
            if (Object.keys(filter.createdAt).length === 0) {
                delete filter.createdAt
            }
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
            .populate("payments")
            .lean()

        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking record not found" }
        }

        const [statusHistory, paymentSummary] = await Promise.all([
            BookingStatusHistoryModel.find({ bookingId: booking._id })
                .sort({ createdAt: 1 })
                .lean(),
            getBookingPaymentSummary(booking),
        ])

        return {
            status: true,
            data: {
                ...booking,
                paymentSummary,
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
        const { amount, notes, status } = body
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

        if (booking.transactions && booking.transactions.length > 0) {
            set.status = 400
            return { status: false, error: "Final package amount cannot be updated after payment transactions have been recorded" }
        }

        const oldStatus = booking.status
        const nextStatus = status || "QUOTATION_SHARED"

        const pkg = await TourismModel.findById(booking.packageId)
        const gstPercentage = pkg?.gstPercentage ?? 0
        const baseAmount = Number(amount)
        const gstAmount = Math.round((baseAmount * gstPercentage) / 100)
        const finalAmount = baseAmount + gstAmount

        booking.quotation = {
            amount: baseAmount,
            notes,
            sharedAt: new Date(),
        }
        booking.pricingDetails.originalAmount = baseAmount
        booking.pricingDetails.gstPercentage = gstPercentage
        booking.pricingDetails.gstAmount = gstAmount
        booking.pricingDetails.finalAmount = finalAmount
        booking.status = nextStatus

        await booking.save()

        await BookingStatusHistoryModel.create({
            bookingId: booking._id,
            fromStatus: oldStatus,
            toStatus: nextStatus,
            changedBy: new Types.ObjectId(adminId),
            notes: `Quotation updated to ₹${Number(amount).toLocaleString("en-IN")}. ${notes || ""}`,
        })

        await recordStaffActivity(ctx, {
            action: "UPDATE",
            module: "Customized Bookings",
            route: "/bookings/customized",
            recordId: params.id,
            recordTitle: booking.bookingNumber,
            previousData: { status: oldStatus, pricingDetails: booking.pricingDetails },
            updatedData: { status: nextStatus, finalAmount },
            details: `Updated quotation to ₹${Number(amount).toLocaleString("en-IN")} for booking ${booking.bookingNumber}`,
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

        const isCustom = booking.bookingType === "CUSTOMIZED"
        await recordStaffActivity(ctx, {
            action: "UPDATE",
            module: isCustom ? "Customized Bookings" : "Standard Bookings",
            route: isCustom ? "/bookings/customized" : "/bookings/standard",
            recordId: params.id,
            recordTitle: booking.bookingNumber,
            previousData: { status: oldStatus },
            updatedData: { status },
            details: `Updated booking status from ${oldStatus} to ${status} for ${booking.bookingNumber}`,
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

// ─── 11. ADMIN: Record Customized Payment Transaction Endpoint ────────────────

export const recordCustomizedTransaction = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, body, set, store }: any = ctx
    const adminId = store.id

    try {
        const { amount, paymentMode, notes } = body

        if (amount === undefined || amount <= 0) {
            set.status = 400
            return { status: false, error: "Amount must be greater than zero" }
        }

        if (!paymentMode || !["CASH", "BANK_TRANSFER", "UPI", "ONLINE", "OTHER"].includes(paymentMode)) {
            set.status = 400
            return { status: false, error: "Valid payment mode is required" }
        }

        const booking = await BookingModel.findById(params.id)
        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        if (booking.bookingType !== "CUSTOMIZED") {
            set.status = 400
            return { status: false, error: "Transactions can only be recorded for customized bookings" }
        }

        const finalAmount = booking.pricingDetails?.finalAmount || 0
        if (finalAmount <= 0) {
            set.status = 400
            return { status: false, error: "Please set the final package amount before recording payment transactions" }
        }

        // Calculate total paid amount
        const totalPaid = (booking.transactions || [])
            .reduce((sum: number, t: any) => sum + t.amount, 0)

        const pendingAmount = finalAmount - totalPaid
        if (Number(amount) > pendingAmount) {
            set.status = 400
            return {
                status: false,
                error: `Payment amount ₹${Number(amount).toLocaleString("en-IN")} exceeds the remaining pending amount of ₹${pendingAmount.toLocaleString("en-IN")}`,
            }
        }

        // Append transaction
        const newTransaction = {
            amount: Number(amount),
            paymentMode,
            transactionDate: new Date(),
            notes: notes?.trim() || undefined,
        }

        if (!booking.transactions) {
            booking.transactions = []
        }
        booking.transactions.push(newTransaction as any)

        // If the pending amount is fully paid, we can optionally check but let's keep status update manual or auto.
        // It says "defaulty create date in backend show the pending and percentage and progress".
        await booking.save()

        // Create Status History entry (timeline record)
        await BookingStatusHistoryModel.create({
            bookingId: booking._id,
            fromStatus: booking.status,
            toStatus: booking.status,
            changedBy: new Types.ObjectId(adminId),
            notes: `Recorded payment entry of ₹${Number(amount).toLocaleString("en-IN")} via ${paymentMode}.${notes ? ` Notes: ${notes}` : ""}`,
        })

        await recordStaffActivity(ctx, {
            action: "UPDATE",
            module: "Customized Bookings",
            route: "/bookings/customized",
            recordId: params.id,
            recordTitle: booking.bookingNumber,
            updatedData: { newTransaction, totalPaid: totalPaid + Number(amount), pendingAmount: pendingAmount - Number(amount) },
            details: `Recorded payment of ₹${Number(amount).toLocaleString("en-IN")} (${paymentMode}) for ${booking.bookingNumber}`,
        })

        return {
            status: true,
            message: "Payment recorded successfully",
            data: booking,
        }
    } catch (error: any) {
        console.error("Record Transaction Error", error)
        set.status = 500
        return { status: false, error: "Failed to record transaction" }
    }
}
