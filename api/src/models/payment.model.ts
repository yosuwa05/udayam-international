import { Schema, model, Types } from "mongoose"

export type PaymentStatus = "CREATED" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED"

export interface IPayment {
    bookingId?: Types.ObjectId
    razorpayOrderId: string
    razorpayPaymentId?: string
    razorpaySignature?: string
    amount: number
    currency: string
    status: PaymentStatus
    bookingPayload?: any
    failureReason?: string
    createdAt?: Date
    updatedAt?: Date
}

const paymentSchema = new Schema<IPayment>(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: "booking" },
        razorpayOrderId: { type: String, required: true, index: true },
        razorpayPaymentId: { type: String, index: true },
        razorpaySignature: { type: String },
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true, default: "INR" },
        bookingPayload: { type: Schema.Types.Mixed },
        status: {
            type: String,
            enum: ["CREATED", "PROCESSING", "SUCCESS", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"],
            default: "CREATED",
            required: true,
        },
        failureReason: { type: String, trim: true },
    },
    { timestamps: true }
)

export const PaymentModel = model<IPayment>("payment", paymentSchema)
