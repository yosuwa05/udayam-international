import { Elysia } from "elysia"
import {
    getPaymentPlanSettingsHandler,
    updatePaymentPlanSettingsHandler,
    calculatePaymentStagesHandler,
} from "./paymentPlanSettings.service"
import { adminOnly } from "@lib/authGuard"

export const paymentPlanSettingsRouter = new Elysia({
    prefix: "/payment-plan-settings",
    detail: { tags: ["Payment Plan Settings"] },
})
    // Public / User / Admin: Get current settings
    .get("/", getPaymentPlanSettingsHandler)

    // Admin: Update / Upsert single settings document
    .put("/", updatePaymentPlanSettingsHandler, { beforeHandle: adminOnly })
    .patch("/", updatePaymentPlanSettingsHandler, { beforeHandle: adminOnly })

    // Public / User / Admin: Calculate stage amounts for any given amount
    .post("/calculate", calculatePaymentStagesHandler)
    .get("/calculate", calculatePaymentStagesHandler)

