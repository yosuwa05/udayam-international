import { Schema, model } from "mongoose"

export interface IPaymentStageConfig {
    stage: number
    minimumPercentage: number
    label: string
}

export interface IPaymentPlanSettings {
    currency: string
    minimumAdvancePercentage: number
    maximumPaymentStages: number
    stages: IPaymentStageConfig[]
    createdAt?: Date
    updatedAt?: Date
}

const paymentPlanSettingsSchema = new Schema<IPaymentPlanSettings>(
    {
        currency: { type: String, default: "INR" },
        minimumAdvancePercentage: { type: Number, default: 10 },
        maximumPaymentStages: { type: Number, default: 3 },
        stages: {
            type: [
                {
                    stage: { type: Number, required: true },
                    minimumPercentage: { type: Number, required: true },
                    label: { type: String, required: true },
                },
            ],
            default: [
                { stage: 1, minimumPercentage: 10, label: "Booking Advance" },
                { stage: 2, minimumPercentage: 40, label: "Second Payment" },
                { stage: 3, minimumPercentage: 0, label: "Final Payment" },
            ],
        },
    },
    { timestamps: true }
)

export const PaymentPlanSettingsModel = model<IPaymentPlanSettings>(
    "paymentPlanSettings",
    paymentPlanSettingsSchema
)

