import { Context } from "elysia"
import { Types } from "mongoose"
import { BookingModel } from "@models/booking.model"
import { PaymentModel } from "@models/payment.model"
import { UserModel } from "@models/user.model"
import { TourismModel } from "@models/tourism.model"
import {
    generateReceiptVoucherNumber,
    generateTaxInvoiceNumber,
    generateBookingConfirmationNumber,
} from "@helper/numberGenerator.helper"
import { generateReceiptVoucherPDF } from "@lib/receipt-generation/receipt-voucher"
import { generateTaxInvoicePDF } from "@lib/receipt-generation/tax-invoice"
import { uploadBufferToS3 } from "@lib/file"
import { recordStaffActivity } from "@helper/staffLogger"

/**
 * Helper to ensure a payment has a receipt voucher generated, uploaded to S3, and persisted.
 */
export async function generateAndSaveReceiptVoucher(paymentId: string | Types.ObjectId) {
    const payment = await PaymentModel.findById(paymentId)
    if (!payment) {
        throw new Error("Payment record not found")
    }

    if (!payment.bookingId) {
        throw new Error("Payment does not have an associated booking")
    }

    const booking = await BookingModel.findById(payment.bookingId)
    if (!booking) {
        throw new Error("Associated booking not found")
    }

    // Generate receipt voucher number if not yet generated
    if (!payment.receiptVoucherNumber) {
        payment.receiptVoucherNumber = await generateReceiptVoucherNumber(payment.createdAt || new Date())
    }

    const pkg = await TourismModel.findById(booking.packageId)
    const customer = await UserModel.findById(booking.userId)
    const allPayments = await PaymentModel.find({ bookingId: booking._id })

    // Generate PDF buffer
    const pdfBuffer = await generateReceiptVoucherPDF({
        payment,
        booking,
        customer,
        pkg,
        allPayments,
    })

    // Upload to S3
    const safeRvNumber = payment.receiptVoucherNumber.replace(/[^a-zA-Z0-9_-]/g, "-")
    const s3Key = `receipts/rv-${safeRvNumber}-${payment._id}.pdf`
    const uploadRes = await uploadBufferToS3(pdfBuffer, s3Key, "application/pdf")

    if (uploadRes.ok && uploadRes.url) {
        payment.paymentReceiptUrl = uploadRes.url
    }

    await payment.save()

    return {
        payment,
        booking,
        pdfBuffer,
        url: payment.paymentReceiptUrl,
        receiptVoucherNumber: payment.receiptVoucherNumber,
    }
}

/**
 * Controller: Get / Download Receipt Voucher for a Payment
 * GET /api/V1/receipt-download/receipt/:paymentId
 */
export async function getReceiptVoucherHandler(ctx: Context<{ params: { paymentId: string }; query: { download?: string } }>) {
    const { params, query, set, store }: any = ctx
    const userId = store.id
    const userRole = store.role

    try {
        if (!Types.ObjectId.isValid(params.paymentId)) {
            set.status = 400
            return { status: false, error: "Invalid payment ID" }
        }

        const payment = await PaymentModel.findById(params.paymentId)
        if (!payment) {
            set.status = 404
            return { status: false, error: "Payment not found" }
        }

        const booking = await BookingModel.findById(payment.bookingId)
        if (!booking) {
            set.status = 404
            return { status: false, error: "Associated booking not found" }
        }

        // Ownership authorization check for regular users
        if (userRole === "USER" && booking.userId.toString() !== userId) {
            set.status = 403
            return { status: false, error: "You are not authorized to view this receipt" }
        }

        // Generate and upload if URL is not yet present
        let result: any = null
        if (!payment.paymentReceiptUrl || !payment.receiptVoucherNumber) {
            result = await generateAndSaveReceiptVoucher(payment._id)
        }

        const receiptUrl = payment.paymentReceiptUrl || result?.url
        const rvNumber = payment.receiptVoucherNumber || result?.receiptVoucherNumber

        // If direct download requested, stream binary PDF
        if (query.download === "true") {
            const buffer = result?.pdfBuffer || (await (async () => {
                const res = await generateAndSaveReceiptVoucher(payment._id)
                return res.pdfBuffer
            })())

            set.headers["Content-Type"] = "application/pdf"
            set.headers["Content-Disposition"] = `inline; filename="Receipt-Voucher-${rvNumber?.replace(/[^a-zA-Z0-9_-]/g, "-") || payment._id}.pdf"`
            return buffer
        }

        return {
            status: true,
            data: {
                paymentId: payment._id,
                receiptVoucherNumber: rvNumber,
                receiptUrl,
                amount: payment.amount,
                paymentDate: payment.createdAt,
            },
        }
    } catch (error: any) {
        console.error("Get Receipt Voucher Error:", error)
        set.status = 500
        return { status: false, error: error.message || "Failed to retrieve receipt voucher" }
    }
}

/**
 * Helper to ensure a booking has a Tax Invoice generated, uploaded to S3, and persisted.
 */
export async function generateAndSaveTaxInvoice(bookingId: string | Types.ObjectId) {
    const booking = await BookingModel.findById(bookingId)
    if (!booking) {
        throw new Error("Booking record not found")
    }

    // Idempotent: If already generated and S3 URL is present, return existing
    if (booking.invoiceUrl && booking.taxInvoiceNumber) {
        return {
            booking,
            taxInvoiceNumber: booking.taxInvoiceNumber,
            invoiceUrl: booking.invoiceUrl,
        }
    }

    // Ensure booking confirmation reference is generated
    if (!booking.bookingConfirmationNumber) {
        booking.bookingConfirmationNumber = await generateBookingConfirmationNumber()
    }

    // Generate Tax Invoice Number if not already present
    if (!booking.taxInvoiceNumber) {
        booking.taxInvoiceNumber = await generateTaxInvoiceNumber()
    }

    // Fetch all successful payments for this booking
    const payments = await PaymentModel.find({
        bookingId: booking._id,
        status: "SUCCESS",
    }).sort({ createdAt: 1 })

    // Ensure every successful payment has a receipt voucher number
    for (const p of payments) {
        if (!p.receiptVoucherNumber) {
            p.receiptVoucherNumber = await generateReceiptVoucherNumber(p.createdAt || new Date())
            await p.save()
        }
    }

    const pkg = await TourismModel.findById(booking.packageId)
    const customer = await UserModel.findById(booking.userId)

    // Generate Tax Invoice PDF buffer
    const pdfBuffer = await generateTaxInvoicePDF({
        booking,
        payments,
        customer,
        pkg,
        invoiceDate: new Date(),
    })

    // Upload to S3
    const safeInvNumber = booking.taxInvoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-")
    const s3Key = `invoices/invoice-${safeInvNumber}-${booking._id}.pdf`
    const uploadRes = await uploadBufferToS3(pdfBuffer, s3Key, "application/pdf")

    if (uploadRes.ok && uploadRes.url) {
        booking.invoiceUrl = uploadRes.url
    }

    await booking.save()

    return {
        booking,
        pdfBuffer,
        taxInvoiceNumber: booking.taxInvoiceNumber,
        invoiceUrl: booking.invoiceUrl,
    }
}

/**
 * Controller: Generate Tax Invoice for a Booking (Admin)
 * POST /api/V1/receipt-download/invoice/:bookingId/generate
 */
export async function generateTaxInvoiceHandler(ctx: Context<{ params: { bookingId: string } }>) {
    const { params, set, store }: any = ctx
    const adminId = store.id

    try {
        if (!Types.ObjectId.isValid(params.bookingId)) {
            set.status = 400
            return { status: false, error: "Invalid booking ID" }
        }

        const booking = await BookingModel.findById(params.bookingId)
        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        const isStandard = booking.bookingType === "STANDARD"

        if (isStandard) {
            // For standard package: full payment (100%) must be completed
            const isFullyPaid =
                booking.paymentDetails?.isFullyPaid ||
                (booking.paymentDetails?.remainingAmount === 0 && (booking.paymentDetails?.totalPaidAmount || 0) > 0)

            if (!isFullyPaid) {
                set.status = 400
                return {
                    status: false,
                    error: `For standard packages, the tax invoice can only be generated after full payment (100%) is completed. Remaining balance is ₹${booking.paymentDetails?.remainingAmount ?? 0}.`,
                }
            }
        } else {
            // For customized package: keep existing flow (booking must be COMPLETED)
            if (booking.status !== "COMPLETED") {
                set.status = 400
                return {
                    status: false,
                    error: `Tax Invoice can only be generated for COMPLETED bookings. Current status is ${booking.status.replace(/_/g, " ")}.`,
                }
            }
        }

        const result = await generateAndSaveTaxInvoice(booking._id)

        // Staff audit log
        await recordStaffActivity(ctx, {
            action: "CREATE",
            module: booking.bookingType === "CUSTOMIZED" ? "Customized Bookings" : "Standard Bookings",
            route: booking.bookingType === "CUSTOMIZED" ? "/bookings/customized" : "/bookings/standard",
            recordId: booking._id.toString(),
            recordTitle: booking.bookingNumber,
            updatedData: {
                taxInvoiceNumber: result.taxInvoiceNumber,
                invoiceUrl: result.invoiceUrl,
            },
            details: `Generated Tax Invoice ${result.taxInvoiceNumber} for booking ${booking.bookingNumber}`,
        })

        return {
            status: true,
            message: "Tax invoice generated successfully",
            data: {
                bookingId: booking._id,
                taxInvoiceNumber: result.taxInvoiceNumber,
                invoiceUrl: result.invoiceUrl,
            },
        }
    } catch (error: any) {
        console.error("Generate Tax Invoice Error:", error)
        set.status = 500
        return { status: false, error: error.message || "Failed to generate tax invoice" }
    }
}

/**
 * Controller: Get / Download Tax Invoice for a Booking
 * GET /api/V1/receipt-download/invoice/:bookingId
 */
export async function getTaxInvoiceHandler(ctx: Context<{ params: { bookingId: string }; query: { download?: string } }>) {
    const { params, query, set, store }: any = ctx
    const userId = store.id
    const userRole = store.role

    try {
        if (!Types.ObjectId.isValid(params.bookingId)) {
            set.status = 400
            return { status: false, error: "Invalid booking ID" }
        }

        const booking = await BookingModel.findById(params.bookingId)
        if (!booking) {
            set.status = 404
            return { status: false, error: "Booking not found" }
        }

        // Ownership authorization check for regular users
        if (userRole === "USER" && booking.userId.toString() !== userId) {
            set.status = 403
            return { status: false, error: "You are not authorized to view this invoice" }
        }

        const isStandard = booking.bookingType === "STANDARD"
        const isStandardFullyPaid =
            isStandard &&
            (booking.paymentDetails?.isFullyPaid ||
                (booking.paymentDetails?.remainingAmount === 0 && (booking.paymentDetails?.totalPaidAmount || 0) > 0))

        // Auto-generate if not yet generated and criteria are satisfied:
        // 1. Standard: 100% full payment completed
        // 2. Customized: Booking status is COMPLETED
        if (!booking.invoiceUrl) {
            if (isStandard && isStandardFullyPaid) {
                await generateAndSaveTaxInvoice(booking._id)
            } else if (!isStandard && booking.status === "COMPLETED") {
                await generateAndSaveTaxInvoice(booking._id)
            }
        }

        const updatedBooking = await BookingModel.findById(booking._id)
        if (!updatedBooking?.invoiceUrl) {
            set.status = 404
            return {
                status: false,
                error: isStandard
                    ? `Tax Invoice for standard packages is generated automatically once full payment (100%) is completed. Remaining balance is ₹${booking.paymentDetails?.remainingAmount ?? 0}.`
                    : booking.status !== "COMPLETED"
                    ? "Tax Invoice for customized bookings is generated once the booking is completed."
                    : "Tax invoice has not been generated for this booking yet.",
            }
        }

        // If stream download requested
        if (query.download === "true") {
            const payments = await PaymentModel.find({
                bookingId: updatedBooking._id,
                status: "SUCCESS",
            }).sort({ createdAt: 1 })

            const pkg = await TourismModel.findById(updatedBooking.packageId)
            const customer = await UserModel.findById(updatedBooking.userId)

            const buffer = await generateTaxInvoicePDF({
                booking: updatedBooking,
                payments,
                customer,
                pkg,
            })

            set.headers["Content-Type"] = "application/pdf"
            set.headers["Content-Disposition"] = `inline; filename="Tax-Invoice-${updatedBooking.taxInvoiceNumber?.replace(/[^a-zA-Z0-9_-]/g, "-") || updatedBooking.bookingNumber}.pdf"`
            return buffer
        }

        return {
            status: true,
            data: {
                bookingId: updatedBooking._id,
                taxInvoiceNumber: updatedBooking.taxInvoiceNumber,
                invoiceUrl: updatedBooking.invoiceUrl,
                status: updatedBooking.status,
            },
        }
    } catch (error: any) {
        console.error("Get Tax Invoice Error:", error)
        set.status = 500
        return { status: false, error: error.message || "Failed to retrieve tax invoice" }
    }
}

