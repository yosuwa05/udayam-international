import { Elysia } from "elysia"
import { userAndAdminOnly, adminOnly } from "@lib/authGuard"
import { receiptDownloadSchema } from "./receipt-download.schema"
import {
    getReceiptVoucherHandler,
    generateTaxInvoiceHandler,
    getTaxInvoiceHandler,
} from "./receipt-download.service"

export const receiptDownloadRouter = new Elysia({
    prefix: "/receipt-download",
    tags: ["Receipt & Tax Invoice"],
})
    // Get / Download Receipt Voucher for a Payment (User or Admin)
    .get("/receipt/:paymentId", getReceiptVoucherHandler, {
        beforeHandle: userAndAdminOnly,
        schema: receiptDownloadSchema.getReceipt,
    })

    // Generate Tax Invoice for a Completed Booking (Admin only)
    .post("/invoice/:bookingId/generate", generateTaxInvoiceHandler, {
        beforeHandle: adminOnly,
        schema: receiptDownloadSchema.generateInvoice,
    })

    // Get / Download Tax Invoice for a Booking (User or Admin)
    .get("/invoice/:bookingId", getTaxInvoiceHandler, {
        beforeHandle: userAndAdminOnly,
        schema: receiptDownloadSchema.getInvoice,
    })

