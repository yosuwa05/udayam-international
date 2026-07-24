import { Schema, model, Types } from "mongoose"

export interface ICoupon {
    title: string
    description?: string
    couponCode: string
    
    bannerImage: string
    
    discountType: "PERCENTAGE" | "FIXED_AMOUNT"
    discountValue: number
    
    minimumBookingAmount: number
    maximumDiscountAmount?: number
    
    totalUsageLimit: number
    perUserUsageLimit: number
    usedCount: number
    
    applicableFor: "ALL" | "STANDARD" | "CUSTOMIZED" | "SELECTED"
    packageIds: Types.ObjectId[]
    
    userType: "ALL_USERS" | "NEW_USERS" | "EXISTING_USERS" | "SELECTED_USERS"
    userIds: Types.ObjectId[]
    
    validFrom: Date
    validTo: Date
    
    status: "ACTIVE" | "INACTIVE"
    isDeleted: boolean
    
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    createdAt?: Date
    updatedAt?: Date
}

const couponSchema = new Schema<ICoupon>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        couponCode: { 
            type: String, 
            required: true, 
            trim: true, 
            uppercase: true 
        },
        bannerImage: { type: String, required: true },
        discountType: {
            type: String,
            enum: ["PERCENTAGE", "FIXED_AMOUNT"],
            required: true
        },
        discountValue: { type: Number, required: true, min: 0 },
        minimumBookingAmount: { type: Number, required: true, min: 0, default: 0 },
        maximumDiscountAmount: { type: Number, min: 0 },
        totalUsageLimit: { type: Number, required: true, min: 1, default: 1 },
        perUserUsageLimit: { type: Number, required: true, min: 1, default: 1 },
        usedCount: { type: Number, required: true, default: 0, min: 0 },
        applicableFor: {
            type: String,
            enum: ["ALL", "STANDARD", "CUSTOMIZED", "SELECTED"],
            required: true,
            default: "ALL"
        },
        packageIds: [{ type: Schema.Types.ObjectId, ref: "tourism" }],
        userType: {
            type: String,
            enum: ["ALL_USERS", "NEW_USERS", "EXISTING_USERS", "SELECTED_USERS"],
            required: true,
            default: "ALL_USERS"
        },
        userIds: [{ type: Schema.Types.ObjectId, ref: "user" }],
        validFrom: { type: Date, required: true },
        validTo: { type: Date, required: true },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            required: true,
            default: "ACTIVE"
        },
        isDeleted: { type: Boolean, required: true, default: false },
        createdBy: { type: Schema.Types.ObjectId, ref: "admin", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "admin", required: true }
    },
    { timestamps: true }
)

// Indexes for filters and partial index for unique coupon code when not deleted
couponSchema.index(
    { couponCode: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
)
couponSchema.index({ status: 1, isDeleted: 1 })
couponSchema.index({ validFrom: 1, validTo: 1 })

export const CouponModel = model<ICoupon>("coupon", couponSchema)
