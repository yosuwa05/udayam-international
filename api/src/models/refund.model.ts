import { Schema, model, Types } from "mongoose"

export type RefundStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED"

export interface IRefund {
    bookingId: Types.ObjectId
    paymentId?: Types.ObjectId
    cancellationRequestId?: Types.ObjectId
    amount: number
    reason: string
    status: RefundStatus
    refundMode?: string
    transactionReference?: string
    processedBy?: Types.ObjectId
    razorpayRefundId?: string
    createdAt?: Date
    updatedAt?: Date
}

const refundSchema = new Schema<IRefund>(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: "booking", required: true, index: true },
        paymentId: { type: Schema.Types.ObjectId, ref: "payment" },
        cancellationRequestId: { type: Schema.Types.ObjectId, ref: "bookingCancellationRequest", index: true },
        amount: { type: Number, required: true, min: 0 },
        reason: { type: String, required: true, trim: true },
        refundMode: { type: String, trim: true },
        transactionReference: { type: String, trim: true },
        processedBy: { type: Schema.Types.ObjectId, ref: "admin" },
        status: {
            type: String,
            enum: ["PENDING", "PROCESSING", "SUCCESS", "FAILED"],
            default: "SUCCESS",
            required: true,
        },
        razorpayRefundId: { type: String, index: true },
    },
    { timestamps: true }
)

export const RefundModel = model<IRefund>("refund", refundSchema)
