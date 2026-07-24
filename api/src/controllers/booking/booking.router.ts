import { Elysia } from "elysia"
import {
    validateCoupon,
    getEligibleCouponsForPackage,
    createStandardBookingOrder,
    verifyStandardPayment,
    handleRazorpayWebhook,
    createCustomizedEnquiry,
    getMyBookings,
    getMyBookingDetails,
    getAdminBookings,
    getBookingDetails,
    updateCustomizedQuotation,
    updateBookingStatus,
    setCustomizedFinalAmount,
    addCustomizedPaymentTransaction,
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
    .post("/customized/enquire", createCustomizedEnquiry, { beforeHandle: userOnly })
    .get("/my-bookings", getMyBookings, { beforeHandle: userOnly })
    .get("/my-bookings/:id", getMyBookingDetails, { beforeHandle: userOnly })

    // Admin routes
    .get("/admin/list", getAdminBookings, { beforeHandle: adminOnly })
    .get("/admin/:id", getBookingDetails, { beforeHandle: adminOnly })
    .patch("/admin/:id/quotation", updateCustomizedQuotation, { beforeHandle: adminOnly })
    .patch("/admin/:id/status", updateBookingStatus, { beforeHandle: adminOnly })
    .patch("/admin/:id/final-amount", setCustomizedFinalAmount, { beforeHandle: adminOnly })
    .post("/admin/:id/transactions", addCustomizedPaymentTransaction, { beforeHandle: adminOnly })
