import { Schema, model, Types } from "mongoose"

export interface ICouponUsage {
    couponId: Types.ObjectId
    bookingId: Types.ObjectId
    userId: Types.ObjectId
    userEmail: string
    userMobile: string
    discountAmount: number
    usedAt: Date
}

const couponUsageSchema = new Schema<ICouponUsage>(
    {
        couponId: { type: Schema.Types.ObjectId, ref: "coupon", required: true, index: true },
        bookingId: { type: Schema.Types.ObjectId, ref: "booking", required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
        userEmail: { type: String, required: true, lowercase: true, trim: true },
        userMobile: { type: String, required: true, trim: true },
        discountAmount: { type: Number, required: true, min: 0 },
        usedAt: { type: Date, default: Date.now, required: true },
    },
    { timestamps: true }
)

couponUsageSchema.index({ couponId: 1, userId: 1 })

export const CouponUsageModel = model<ICouponUsage>("couponUsage", couponUsageSchema)
