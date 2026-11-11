import { Types } from "mongoose"
import { PaymentPlanSettingsModel, IPaymentPlanSettings, IPaymentStageConfig } from "@models/paymentPlanSettings.model"
import { PaymentModel, IPayment } from "@models/payment.model"
import { BookingModel, IBooking } from "@models/booking.model"

// Default fallback payment plan settings matching user requirements
export const DEFAULT_PAYMENT_PLAN_SETTINGS: IPaymentPlanSettings = {
    currency: "INR",
    minimumAdvancePercentage: 10,
    maximumPaymentStages: 3,
    stages: [
        { stage: 1, minimumPercentage: 10, label: "Booking Advance" },
        { stage: 2, minimumPercentage: 40, label: "Second Payment" },
        { stage: 3, minimumPercentage: 0, label: "Final Payment" },
    ],
}

// ─── SAFE CURRENCY & PRECISION ARITHMETIC ────────────────────────────────────

/**
 * Rounds an amount to two decimal places safely avoiding floating point artifacts.
 */
export const roundCurrency = (amount: number): number => {
    if (!amount || isNaN(amount) || !isFinite(amount)) return 0
    return Math.round((amount + Number.EPSILON) * 100) / 100
}

/**
 * Converts a currency amount (e.g. ₹500.50) into paise (integer, e.g. 50050) for Razorpay.
 */
export const amountToPaise = (amount: number): number => {
    return Math.round(roundCurrency(amount) * 100)
}

/**
 * Converts paise back to currency amount.
 */
export const paiseToAmount = (paise: number): number => {
    return roundCurrency(paise / 100)
}

// ─── SINGLETON SETTINGS ACCESS ───────────────────────────────────────────────

/**
 * Retrieves the singleton payment plan settings document from the database.
 * If not yet created, creates and returns the default settings.
 */
export const getOrCreatePaymentPlanSettings = async (): Promise<IPaymentPlanSettings> => {
    let settings = await PaymentPlanSettingsModel.findOne().lean()
    if (!settings) {
        const created = await PaymentPlanSettingsModel.create(DEFAULT_PAYMENT_PLAN_SETTINGS)
        return created.toObject()
    }
    return settings
}

// ─── STAGE BREAKDOWN CALCULATION ─────────────────────────────────────────────

export interface ICalculatedStage {
    stage: number
    label: string
    minimumPercentage: number
    minimumAmount: number
    description: string
}

export interface IPaymentPlanCalculationResult {
    finalAmount: number
    currency: string
    maximumPaymentStages: number
    minimumAdvancePercentage: number
    minimumAdvanceAmount: number
    upfrontFullAmount: number
    stages: ICalculatedStage[]
}

/**
 * Calculates standard minimum stage breakdowns for a given final amount.
 */
export const calculatePaymentStages = (
    finalAmount: number,
    settings: IPaymentPlanSettings = DEFAULT_PAYMENT_PLAN_SETTINGS
): IPaymentPlanCalculationResult => {
    const cleanFinalAmount = roundCurrency(finalAmount)
    const minAdvancePct = settings.minimumAdvancePercentage || 10
    const minAdvanceAmount = roundCurrency((cleanFinalAmount * minAdvancePct) / 100)

    const calculatedStages: ICalculatedStage[] = (settings.stages || []).map((stage) => {
        let minPercentage = stage.minimumPercentage
        let minAmount = roundCurrency((cleanFinalAmount * minPercentage) / 100)
        let description = ""
        if (stage.stage === 1) {
            description = `Minimum ${stage.minimumPercentage}% (₹${minAmount.toLocaleString("en-IN")}) required at booking confirmation. You may also pay more up to 100%.`
        } else if (stage.stage === settings.maximumPaymentStages) {
            description = `Final settlement to clear the remaining balance.`
        } else if (stage.stage === 2) {
            description = `Second payment to ensure at least 50% cumulative booking total (min ${stage.minimumPercentage}% if 10% was paid initially, or ₹${minAmount.toLocaleString("en-IN")}). Dynamically calculated based on amount already paid.`
        } else {
            description = `Minimum ${stage.minimumPercentage}% (₹${minAmount.toLocaleString("en-IN")}). You may pay more or clear the remaining balance.`
        }

        return {
            stage: stage.stage,
            label: stage.label,
            minimumPercentage: minPercentage,
            minimumAmount: minAmount,
            description,
        }
    })

    return {
        finalAmount: cleanFinalAmount,
        currency: settings.currency || "INR",
        maximumPaymentStages: settings.maximumPaymentStages || 3,
        minimumAdvancePercentage: minAdvancePct,
        minimumAdvanceAmount: minAdvanceAmount,
        upfrontFullAmount: cleanFinalAmount,
        stages: calculatedStages,
    }
}

// ─── BOOKING PAYMENT SUMMARY ─────────────────────────────────────────────────

export interface IBookingPaymentSummary {
    bookingId: string
    bookingNumber: string
    finalAmount: number
    currency: string
    totalPaidAmount: number
    remainingAmount: number
    paidPercentage: number
    isFullyPaid: boolean
    paymentStatus: "PENDING" | "PARTIALLY_PAID" | "FULLY_PAID"
    successfulPaymentsCount: number
    currentStageNumber: number
    maximumPaymentStages: number
    canMakeSubsequentPayment: boolean
    isFinalStage: boolean
    nextStageLabel: string
    nextStageMinimumPercentage: number
    nextStageMinimumAmount: number
    nextStageMaximumAmount: number
    successfulPayments: Array<{
        _id: string
        amount: number
        stage?: number
        stageLabel?: string
        razorpayPaymentId?: string
        receiptVoucherNumber?: string
        paymentReceiptUrl?: string
        paidAt?: Date
    }>
}

/**
 * Calculates current payment progress and next required/allowed amounts for a booking.
 */
export const getBookingPaymentSummary = async (
    booking: any,
    settings?: IPaymentPlanSettings
): Promise<IBookingPaymentSummary> => {
    const planSettings = settings || (await getOrCreatePaymentPlanSettings())
    const bookingId = booking._id?.toString() || ""
    const bookingNumber = booking.bookingNumber || ""
    const finalAmount = roundCurrency(booking.pricingDetails?.finalAmount || 0)
    const currency = booking.pricingDetails?.currency || planSettings.currency || "INR"

    // Fetch all successful payments for this booking
    const successfulPaymentsDocs = await PaymentModel.find({
        bookingId: booking._id,
        status: "SUCCESS",
    })
        .sort({ createdAt: 1 })
        .lean()

    const successfulPayments = successfulPaymentsDocs.map((p) => ({
        _id: p._id.toString(),
        amount: roundCurrency(p.amount),
        stage: p.stage,
        stageLabel: p.stageLabel,
        razorpayPaymentId: p.razorpayPaymentId,
        receiptVoucherNumber: p.receiptVoucherNumber,
        paymentReceiptUrl: p.paymentReceiptUrl,
        paidAt: p.updatedAt || p.createdAt,
    }))

    const totalPaidAmount = roundCurrency(
        successfulPayments.reduce((sum, p) => sum + p.amount, 0)
    )
    const remainingAmount = Math.max(0, roundCurrency(finalAmount - totalPaidAmount))
    const paidPercentage = finalAmount > 0 ? roundCurrency((totalPaidAmount / finalAmount) * 100) : 0
    const isFullyPaid = remainingAmount <= 0

    let paymentStatus: "PENDING" | "PARTIALLY_PAID" | "FULLY_PAID" = "PENDING"
    if (isFullyPaid) {
        paymentStatus = "FULLY_PAID"
    } else if (totalPaidAmount > 0) {
        paymentStatus = "PARTIALLY_PAID"
    }

    const successfulPaymentsCount = successfulPayments.length
    const maxStages = planSettings.maximumPaymentStages || 3
    const currentStageNumber = successfulPaymentsCount + 1
    const isFinalStage = currentStageNumber >= maxStages
    const canMakeSubsequentPayment = !isFullyPaid && successfulPaymentsCount < maxStages

    // Find stage config from settings
    const currentStageConfig = (planSettings.stages || []).find((s) => s.stage === currentStageNumber)

    let nextStageLabel = currentStageConfig?.label || (isFinalStage ? "Final Payment" : `Stage ${currentStageNumber} Payment`)
    let nextStageMinimumPercentage = currentStageConfig?.minimumPercentage ?? 0

    // Minimum amount calculation
    let nextStageMinimumAmount = 0
    if (canMakeSubsequentPayment) {
        if (isFinalStage) {
            // At the final stage, user MUST pay the full remaining balance
            nextStageMinimumAmount = remainingAmount
            nextStageMinimumPercentage = finalAmount > 0 ? roundCurrency((remainingAmount / finalAmount) * 100) : 100
        } else if (currentStageNumber === 2) {
            // Stage 2 requirement: Cumulative paid must reach at least 50% of the total booking amount
            const targetCumulativePct = 50
            const targetCumulativeAmount = roundCurrency((finalAmount * targetCumulativePct) / 100)
            const neededToReach50 = Math.max(0, roundCurrency(targetCumulativeAmount - totalPaidAmount))
            if (neededToReach50 > 0) {
                nextStageMinimumAmount = Math.min(neededToReach50, remainingAmount)
                nextStageMinimumPercentage = finalAmount > 0 ? roundCurrency((nextStageMinimumAmount / finalAmount) * 100) : 0
            } else {
                // User already paid >= 50% in stage 1, allow proceeding with nominal minimum
                nextStageMinimumAmount = Math.min(1, remainingAmount)
                nextStageMinimumPercentage = finalAmount > 0 ? roundCurrency((nextStageMinimumAmount / finalAmount) * 100) : 0
            }
        } else {
            // Stage minimum amount cannot exceed remaining balance
            const nominalMin = roundCurrency((finalAmount * nextStageMinimumPercentage) / 100)
            nextStageMinimumAmount = Math.min(nominalMin, remainingAmount)
        }
    }

    const nextStageMaximumAmount = remainingAmount

    return {
        bookingId,
        bookingNumber,
        finalAmount,
        currency,
        totalPaidAmount,
        remainingAmount,
        paidPercentage,
        isFullyPaid,
        paymentStatus,
        successfulPaymentsCount,
        currentStageNumber,
        maximumPaymentStages: maxStages,
        canMakeSubsequentPayment,
        isFinalStage,
        nextStageLabel,
        nextStageMinimumPercentage,
        nextStageMinimumAmount,
        nextStageMaximumAmount,
        successfulPayments,
    }
}

// ─── INITIAL BOOKING PAYMENT VALIDATION ───────────────────────────────────────

export interface IValidateInitialPaymentResult {
    isValid: boolean
    error?: string
    cleanAmount?: number
    minRequiredAmount?: number
    maxAllowedAmount?: number
    isFullPayment?: boolean
    stageNumber: number
    stageLabel: string
}

/**
 * Validates initial booking payment during booking creation (Stage 1).
 * Requirements:
 * - Minimum 10% payment required at booking confirmation (or settings.minimumAdvancePercentage).
 * - Customer can pay any amount between minimum and 100%.
 * - 100% upfront is allowed and supported.
 * - If no amount passed, defaults to 100% upfront for seamless backwards-compatibility.
 */
export const validateInitialBookingPayment = (params: {
    finalAmount: number
    paymentAmount?: number | string | null
    settings?: IPaymentPlanSettings
}): IValidateInitialPaymentResult => {
    const settings = params.settings || DEFAULT_PAYMENT_PLAN_SETTINGS
    const finalAmount = roundCurrency(params.finalAmount)

    if (finalAmount <= 0) {
        return {
            isValid: false,
            error: "Total booking amount must be greater than zero.",
            stageNumber: 1,
            stageLabel: "Booking Advance",
        }
    }

    const minAdvancePct = settings.minimumAdvancePercentage ?? 10
    const minRequiredAmount = roundCurrency((finalAmount * minAdvancePct) / 100)
    const maxAllowedAmount = finalAmount

    // Default to 100% full upfront payment if not explicitly specified
    if (params.paymentAmount === undefined || params.paymentAmount === null || params.paymentAmount === "") {
        return {
            isValid: true,
            cleanAmount: finalAmount,
            minRequiredAmount,
            maxAllowedAmount,
            isFullPayment: true,
            stageNumber: 1,
            stageLabel: "Full Payment (100%)",
        }
    }

    const rawNum = Number(params.paymentAmount)
    if (isNaN(rawNum) || !isFinite(rawNum) || rawNum <= 0) {
        return {
            isValid: false,
            error: "Payment amount must be a valid positive number.",
            stageNumber: 1,
            stageLabel: "Booking Advance",
        }
    }

    const cleanAmount = roundCurrency(rawNum)

    // Cannot exceed final amount
    if (cleanAmount > maxAllowedAmount) {
        return {
            isValid: false,
            error: `Payment amount ₹${cleanAmount.toLocaleString("en-IN")} cannot exceed the total booking amount ₹${maxAllowedAmount.toLocaleString("en-IN")}.`,
            stageNumber: 1,
            stageLabel: "Booking Advance",
            minRequiredAmount,
            maxAllowedAmount,
        }
    }

    // Must satisfy minimum advance percentage
    if (cleanAmount < minRequiredAmount) {
        return {
            isValid: false,
            error: `A minimum advance of ${minAdvancePct}% (₹${minRequiredAmount.toLocaleString("en-IN")}) is required to confirm the booking.`,
            stageNumber: 1,
            stageLabel: "Booking Advance",
            minRequiredAmount,
            maxAllowedAmount,
        }
    }

    const isFullPayment = cleanAmount >= maxAllowedAmount
    const stage1Config = (settings.stages || []).find((s) => s.stage === 1)
    const stageLabel = isFullPayment ? "Full Payment (100%)" : stage1Config?.label || "Booking Advance"

    return {
        isValid: true,
        cleanAmount,
        minRequiredAmount,
        maxAllowedAmount,
        isFullPayment,
        stageNumber: 1,
        stageLabel,
    }
}

// ─── SUBSEQUENT PAYMENT VALIDATION ───────────────────────────────────────────

export interface IValidateSubsequentPaymentResult {
    isValid: boolean
    error?: string
    cleanAmount?: number
    summary?: IBookingPaymentSummary
    remainingAfterThisPayment?: number
    isFullPayment?: boolean
    stageNumber: number
    stageLabel: string
    isFinalStage: boolean
}

/**
 * Validates subsequent payment attempts against an existing booking.
 * Requirements:
 * - Customers shall be able to make subsequent payments against the same booking.
 * - Standard payment stages are minimum payment stages and NOT fixed installments.
 * - Customers are allowed to pay more than minimum at any stage.
 * - Fewer payment stages supported (e.g. 10% + 90%).
 * - Maximum number of payment stages is 3 (enforced strictly).
 * - At final stage (Stage 3), user must clear the entire remaining balance.
 */
export const validateSubsequentBookingPayment = async (params: {
    booking: any
    paymentAmount: number | string
    settings?: IPaymentPlanSettings
}): Promise<IValidateSubsequentPaymentResult> => {
    const settings = params.settings || (await getOrCreatePaymentPlanSettings())
    const booking = params.booking

    if (!booking) {
        return {
            isValid: false,
            error: "Booking not found.",
            stageNumber: 0,
            stageLabel: "",
            isFinalStage: false,
        }
    }

    if (booking.bookingType !== "STANDARD") {
        return {
            isValid: false,
            error: "Multi-stage online payments are only applicable for Standard package bookings.",
            stageNumber: 0,
            stageLabel: "",
            isFinalStage: false,
        }
    }

    const blockedStatuses = ["CANCELLED", "REFUNDED", "PAYMENT_FAILED", "COMPLETED"]
    if (blockedStatuses.includes(booking.status)) {
        return {
            isValid: false,
            error: `Cannot make payment for a booking with status '${booking.status}'.`,
            stageNumber: 0,
            stageLabel: "",
            isFinalStage: false,
        }
    }

    const summary = await getBookingPaymentSummary(booking, settings)

    if (summary.isFullyPaid) {
        return {
            isValid: false,
            error: "This booking is already fully paid. No further payments are required.",
            summary,
            stageNumber: summary.currentStageNumber,
            stageLabel: summary.nextStageLabel,
            isFinalStage: summary.isFinalStage,
        }
    }

    if (!summary.canMakeSubsequentPayment) {
        return {
            isValid: false,
            error: `The maximum number of payment stages (${summary.maximumPaymentStages}) has already been reached for this booking. Please contact support.`,
            summary,
            stageNumber: summary.currentStageNumber,
            stageLabel: summary.nextStageLabel,
            isFinalStage: summary.isFinalStage,
        }
    }

    const rawNum = Number(params.paymentAmount)
    if (isNaN(rawNum) || !isFinite(rawNum) || rawNum <= 0) {
        return {
            isValid: false,
            error: "Payment amount must be a valid positive number.",
            summary,
            stageNumber: summary.currentStageNumber,
            stageLabel: summary.nextStageLabel,
            isFinalStage: summary.isFinalStage,
        }
    }

    const cleanAmount = roundCurrency(rawNum)

    // Check 1: Cannot exceed remaining balance
    if (cleanAmount > summary.remainingAmount) {
        return {
            isValid: false,
            error: `Payment amount ₹${cleanAmount.toLocaleString("en-IN")} exceeds the remaining pending balance of ₹${summary.remainingAmount.toLocaleString("en-IN")}.`,
            summary,
            stageNumber: summary.currentStageNumber,
            stageLabel: summary.nextStageLabel,
            isFinalStage: summary.isFinalStage,
        }
    }

    // Check 2: If final stage (e.g. Stage 3 of 3), customer MUST pay the full remaining amount
    if (summary.isFinalStage) {
        if (cleanAmount < summary.remainingAmount) {
            return {
                isValid: false,
                error: `Stage ${summary.currentStageNumber} is the final allowed payment stage. You must pay the full remaining balance of ₹${summary.remainingAmount.toLocaleString("en-IN")}.`,
                summary,
                stageNumber: summary.currentStageNumber,
                stageLabel: summary.nextStageLabel,
                isFinalStage: true,
            }
        }
    } else {
        // Not the final stage: check stage minimum amount
        if (cleanAmount < summary.nextStageMinimumAmount) {
            if (summary.currentStageNumber === 2) {
                const targetCumulativeAmount = roundCurrency((summary.finalAmount * 50) / 100)
                return {
                    isValid: false,
                    error: `Stage 2 requires cumulative payments to reach at least 50% of the total booking amount (₹${targetCumulativeAmount.toLocaleString("en-IN")}). You have already paid ₹${summary.totalPaidAmount.toLocaleString("en-IN")} (${summary.paidPercentage}%), so you must pay at least ₹${summary.nextStageMinimumAmount.toLocaleString("en-IN")} (${summary.nextStageMinimumPercentage}%) to proceed.`,
                    summary,
                    stageNumber: summary.currentStageNumber,
                    stageLabel: summary.nextStageLabel,
                    isFinalStage: false,
                }
            }
            return {
                isValid: false,
                error: `Minimum payment for Stage ${summary.currentStageNumber} (${summary.nextStageLabel}) is ₹${summary.nextStageMinimumAmount.toLocaleString("en-IN")} (${summary.nextStageMinimumPercentage}%).`,
                summary,
                stageNumber: summary.currentStageNumber,
                stageLabel: summary.nextStageLabel,
                isFinalStage: false,
            }
        }
    }

    const remainingAfterThisPayment = Math.max(0, roundCurrency(summary.remainingAmount - cleanAmount))
    const isFullPayment = remainingAfterThisPayment <= 0

    return {
        isValid: true,
        cleanAmount,
        summary,
        remainingAfterThisPayment,
        isFullPayment,
        stageNumber: summary.currentStageNumber,
        stageLabel: summary.nextStageLabel,
        isFinalStage: summary.isFinalStage,
    }
}

// ─── SETTINGS PAYLOAD VALIDATION ─────────────────────────────────────────────

export interface IValidateSettingsPayloadResult {
    isValid: boolean
    error?: string
    sanitizedData?: Partial<IPaymentPlanSettings>
}

/**
 * Validates admin update payload for payment plan settings.
 * Ensures:
 * - minimumAdvancePercentage is between 1 and 100
 * - maximumPaymentStages is between 1 and 5 (default 3)
 * - stages are sequential and well-formed
 * - stage minimum percentages are valid numbers >= 0
 * - Stage 1 minimum percentage >= minimumAdvancePercentage
 * - Total minimum percentages do not exceed 100
 */
export const validatePaymentPlanSettingsPayload = (body: any): IValidateSettingsPayloadResult => {
    if (!body || typeof body !== "object") {
        return { isValid: false, error: "Settings payload must be a JSON object" }
    }

    const currency = body.currency ? String(body.currency).trim().toUpperCase() : "INR"

    const minAdvance = body.minimumAdvancePercentage !== undefined
        ? Number(body.minimumAdvancePercentage)
        : 10

    if (isNaN(minAdvance) || minAdvance <= 0 || minAdvance > 100) {
        return {
            isValid: false,
            error: "Minimum advance percentage must be a number between 1 and 100.",
        }
    }

    const maxStages = body.maximumPaymentStages !== undefined
        ? Number(body.maximumPaymentStages)
        : 3

    if (isNaN(maxStages) || !Number.isInteger(maxStages) || maxStages < 1 || maxStages > 5) {
        return {
            isValid: false,
            error: "Maximum payment stages must be an integer between 1 and 5.",
        }
    }

    let sanitizedStages: IPaymentStageConfig[] = []

    if (body.stages !== undefined) {
        if (!Array.isArray(body.stages)) {
            return { isValid: false, error: "Stages must be an array." }
        }

        if (body.stages.length === 0) {
            return { isValid: false, error: "At least one stage must be defined." }
        }

        if (body.stages.length > maxStages) {
            return {
                isValid: false,
                error: `Number of stages (${body.stages.length}) cannot exceed maximumPaymentStages (${maxStages}).`,
            }
        }

        let totalMinPercentage = 0

        for (let i = 0; i < body.stages.length; i++) {
            const stageItem = body.stages[i]
            const expectedStageNum = i + 1

            if (typeof stageItem !== "object" || stageItem === null) {
                return { isValid: false, error: `Stage item at index ${i} is invalid.` }
            }

            const stageNum = Number(stageItem.stage)
            if (stageNum !== expectedStageNum) {
                return {
                    isValid: false,
                    error: `Stage numbers must be sequential starting at 1. Expected stage ${expectedStageNum}, received ${stageNum}.`,
                }
            }

            const minPct = Number(stageItem.minimumPercentage)
            if (isNaN(minPct) || minPct < 0 || minPct > 100) {
                return {
                    isValid: false,
                    error: `Stage ${stageNum} minimum percentage must be between 0 and 100.`,
                }
            }

            const label = String(stageItem.label || "").trim()
            if (!label) {
                return {
                    isValid: false,
                    error: `Stage ${stageNum} must have a non-empty label.`,
                }
            }

            if (stageNum === 1 && minPct < minAdvance) {
                return {
                    isValid: false,
                    error: `Stage 1 minimum percentage (${minPct}%) cannot be less than the minimum advance percentage (${minAdvance}%).`,
                }
            }

            totalMinPercentage += minPct

            sanitizedStages.push({
                stage: stageNum,
                minimumPercentage: roundCurrency(minPct),
                label,
            })
        }

        if (totalMinPercentage > 100) {
            return {
                isValid: false,
                error: `Sum of minimum percentages across stages (${totalMinPercentage}%) cannot exceed 100%.`,
            }
        }
    } else {
        sanitizedStages = DEFAULT_PAYMENT_PLAN_SETTINGS.stages
    }

    return {
        isValid: true,
        sanitizedData: {
            currency,
            minimumAdvancePercentage: roundCurrency(minAdvance),
            maximumPaymentStages: maxStages,
            stages: sanitizedStages,
        },
    }
}

