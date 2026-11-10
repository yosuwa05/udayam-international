import { t } from "elysia"

export const receiptDownloadSchema = {
    getReceipt: {
        detail: {
            summary: "Get or download Receipt Voucher PDF for a payment",
            tags: ["Receipt & Invoice"],
        },
        params: t.Object({
            paymentId: t.String(),
        }),
        query: t.Optional(
            t.Object({
                download: t.Optional(t.String()),
            })
        ),
    },
    generateInvoice: {
        detail: {
            summary: "Generate Tax Invoice for a completed booking (Admin)",
            tags: ["Receipt & Invoice"],
        },
        params: t.Object({
            bookingId: t.String(),
        }),
    },
    getInvoice: {
        detail: {
            summary: "Get or download Tax Invoice PDF for a booking",
            tags: ["Receipt & Invoice"],
        },
        params: t.Object({
            bookingId: t.String(),
        }),
        query: t.Optional(
            t.Object({
                download: t.Optional(t.String()),
            })
        ),
    },
}

