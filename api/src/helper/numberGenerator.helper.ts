import { SequenceModel } from "@models/sequence.model"
import { BookingModel } from "@models/booking.model"
import { PaymentModel } from "@models/payment.model"

/**
 * Calculates the Indian Financial Year string in "YY-YY" format (e.g. "26-27").
 * Indian Financial Year runs from 1st April to 31st March.
 */
export function getFinancialYear(date: Date = new Date()): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 1 to 12 (Jan = 1, Apr = 4, Nov = 11)

    const startYear = month >= 4 ? year : year - 1
    const endYear = startYear + 1

    const startYY = String(startYear).slice(-2)
    const endYY = String(endYear).slice(-2)

    return `${startYY}-${endYY}`
}

/**
 * Returns formatted 2-digit year, month, and day as YYMMDD (e.g. "261001").
 */
export function getFormattedYYMMDD(date: Date = new Date()): string {
    const yy = String(date.getFullYear()).slice(-2)
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yy}${mm}${dd}`
}

/**
 * Atomically increments and returns the next sequential integer for a given key.
 */
export async function getNextSequence(key: string): Promise<number> {
    const result = await SequenceModel.findOneAndUpdate(
        { key },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    return result.seq
}

/**
 * Confirmed Booking Reference Number Generator
 *
 * Format: UVH / CON / YYMMDD / Serial Number
 * Example: UVH / CON / 261001 / 001
 * CON represents Confirmed Booking.
 * Serial Number is 3-digit padded (001, 002, ...)
 */
export async function generateBookingConfirmationNumber(date: Date = new Date()): Promise<string> {
    const yymmdd = getFormattedYYMMDD(date)
    const key = `CONFIRMED_BOOKING_${yymmdd}`

    while (true) {
        const seq = await getNextSequence(key)
        const serial = String(seq).padStart(3, "0")
        const candidate = `UVH / CON / ${yymmdd} / ${serial}`

        // Guarantee uniqueness in database
        const exists = await BookingModel.exists({ bookingConfirmationNumber: candidate })
        if (!exists) {
            return candidate
        }
    }
}

/**
 * Receipt Voucher Number Generator
 *
 * Format: UI / UVH / RV / FY / Serial Number
 * Example: UI / UVH / RV / 26-27 / 00001
 * RV represents Receipt Voucher.
 * Serial Number is 5-digit padded (00001, 00002, ...)
 */
export async function generateReceiptVoucherNumber(date: Date = new Date()): Promise<string> {
    const fy = getFinancialYear(date)
    const key = `RECEIPT_VOUCHER_${fy}`

    while (true) {
        const seq = await getNextSequence(key)
        const serial = String(seq).padStart(5, "0")
        const candidate = `UI / UVH / RV / ${fy} / ${serial}`

        // Guarantee uniqueness in database
        const exists = await PaymentModel.exists({ receiptVoucherNumber: candidate })
        if (!exists) {
            return candidate
        }
    }
}

/**
 * Tax Invoice Number Generator
 *
 * Format: UI / UVH / TI / FY / Serial Number
 * Example: UI / UVH / TI / 26-27 / 00001
 * TI represents Tax Invoice.
 * Serial Number is 5-digit padded (00001, 00002, ...)
 */
export async function generateTaxInvoiceNumber(date: Date = new Date()): Promise<string> {
    const fy = getFinancialYear(date)
    const key = `TAX_INVOICE_${fy}`

    while (true) {
        const seq = await getNextSequence(key)
        const serial = String(seq).padStart(5, "0")
        const candidate = `UI / UVH / TI / ${fy} / ${serial}`

        // Guarantee uniqueness in database
        const exists = await BookingModel.exists({ taxInvoiceNumber: candidate })
        if (!exists) {
            return candidate
        }
    }
}

