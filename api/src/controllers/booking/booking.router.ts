import { Elysia } from "elysia"
import {
    validateCoupon,
    getEligibleCouponsForPackage,
    createStandardBookingOrder,
    verifyStandardPayment,
    createSubsequentBookingPaymentOrder,
    getBookingPaymentSummaryHandler,
    handleRazorpayWebhook,
    createCustomizedEnquiry,
    getMyBookings,
    getMyBookingDetails,
    getAdminBookings,
    getBookingDetails,
    updateCustomizedQuotation,
    updateBookingStatus,
    recordCustomizedTransaction,
    requestBookingCancellation,
    getBookingCancellationRequest,
    getAdminCancellationRequests,
    getAdminCancellationRequestDetails,
    processCancellationRequest,
} from "./booking.service"
import { adminOnly, userOnly, userAndAdminOnly } from "@lib/authGuard"

export const bookingRouter = new Elysia({
    prefix: "/booking",
    detail: { tags: ["Booking"] },
})
    // Webhook route (public, signature verified)
    .post("/razorpay/webhook", handleRazorpayWebhook)

    // User routes
    .post("/coupon/validate", validateCoupon, { beforeHandle: userOnly })
    .get("/coupon/eligible/:packageId", getEligibleCouponsForPackage, { beforeHandle: userOnly })
    .post("/standard/create-order", createStandardBookingOrder, { beforeHandle: userOnly })
    .post("/standard/verify-payment", verifyStandardPayment, { beforeHandle: userOnly })
    .post("/standard/subsequent-payment", createSubsequentBookingPaymentOrder, { beforeHandle: userOnly })
    .get("/:id/payment-summary", getBookingPaymentSummaryHandler, { beforeHandle: userAndAdminOnly })
    .post("/:id/cancel-request", requestBookingCancellation, { beforeHandle: userOnly })
    .get("/:id/cancel-request", getBookingCancellationRequest, { beforeHandle: userAndAdminOnly })
    .post("/customized/enquire", createCustomizedEnquiry, { beforeHandle: userOnly })
    .get("/my-bookings", getMyBookings, { beforeHandle: userOnly })
    .get("/my-bookings/:id", getMyBookingDetails, { beforeHandle: userOnly })

    // Admin cancellation management routes (must be before /admin/:id to avoid conflict)
    .get("/admin/cancellation-requests", getAdminCancellationRequests, { beforeHandle: adminOnly })
    .get("/admin/cancellations", getAdminCancellationRequests, { beforeHandle: adminOnly })
    .get("/admin/cancellation-requests/:id", getAdminCancellationRequestDetails, { beforeHandle: adminOnly })
    .get("/admin/cancellations/:id", getAdminCancellationRequestDetails, { beforeHandle: adminOnly })
    .post("/admin/cancellation-requests/:id/process", processCancellationRequest, { beforeHandle: adminOnly })
    .post("/admin/cancellations/:id/process", processCancellationRequest, { beforeHandle: adminOnly })

    // Admin routes
    .get("/admin/list", getAdminBookings, { beforeHandle: adminOnly })
    .get("/admin/:id", getBookingDetails, { beforeHandle: adminOnly })
    .patch("/admin/:id/quotation", updateCustomizedQuotation, { beforeHandle: adminOnly })
    .patch("/admin/:id/status", updateBookingStatus, { beforeHandle: adminOnly })
    .post("/admin/:id/transaction", recordCustomizedTransaction, { beforeHandle: adminOnly })



