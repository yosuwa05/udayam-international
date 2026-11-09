import { Context } from "elysia"
import { PaymentPlanSettingsModel } from "@models/paymentPlanSettings.model"
import {
    getOrCreatePaymentPlanSettings,
    validatePaymentPlanSettingsPayload,
    calculatePaymentStages,
} from "@helper/paymentValidation.helper"

// ─── 1. GET Payment Plan Settings (Singleton Document) ───────────────────────

export const getPaymentPlanSettingsHandler = async (ctx: Context) => {
    const { set } = ctx

    try {
        const settings = await getOrCreatePaymentPlanSettings()
        return {
            status: true,
            data: settings,
        }
    } catch (error: any) {
        console.error("Get Payment Plan Settings Error", error)
        set.status = 500
        return { status: false, error: "Failed to fetch payment plan settings" }
    }
}

// ─── 2. UPDATE / UPSERT Payment Plan Settings (Admin Only) ───────────────────

export const updatePaymentPlanSettingsHandler = async (ctx: Context) => {
    const { body, set } = ctx

    try {
        const validation = validatePaymentPlanSettingsPayload(body)
        if (!validation.isValid || !validation.sanitizedData) {
            set.status = 400
            return { status: false, error: validation.error || "Invalid settings payload" }
        }

        // Upsert the single document in the database
        const updated = await PaymentPlanSettingsModel.findOneAndUpdate(
            {},
            { $set: validation.sanitizedData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )

        return {
            status: true,
            message: "Payment plan settings updated successfully",
            data: updated,
        }
    } catch (error: any) {
        console.error("Update Payment Plan Settings Error", error)
        set.status = 500
        return { status: false, error: "Failed to update payment plan settings" }
    }
}

// ─── 3. CALCULATE STAGES BREAKDOWN HELPER ────────────────────────────────────

export const calculatePaymentStagesHandler = async (ctx: Context) => {
    const { query, body, set }: any = ctx

    try {
        const amount = Number(body?.amount ?? query?.amount)
        if (isNaN(amount) || amount <= 0) {
            set.status = 400
            return { status: false, error: "Valid positive amount is required to calculate stages" }
        }

        const settings = await getOrCreatePaymentPlanSettings()
        const calculation = calculatePaymentStages(amount, settings)

        return {
            status: true,
            data: calculation,
        }
    } catch (error: any) {
        console.error("Calculate Payment Stages Error", error)
        set.status = 500
        return { status: false, error: "Failed to calculate payment stages" }
    }
}

