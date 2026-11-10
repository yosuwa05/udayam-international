import { Schema, model, Types } from "mongoose"

export type CancellationRequestStatus = "PENDING" | "COMPLETED" | "REJECTED"

export interface IAdminRefundDetails {
    refundAmount: number
    deductionAmount: number
    paymentMode: "BANK_TRANSFER" | "UPI" | "CASH" | "ONLINE" | "OTHER"
    transactionReference?: string
    refundDate: Date
    adminNotes?: string
    processedBy?: Types.ObjectId
    processedByName?: string
    processedAt?: Date
}

export interface IAdminRejectionDetails {
    rejectionReason: string
    rejectedBy?: Types.ObjectId
    rejectedByName?: string
    rejectedAt?: Date
}

export interface IBookingCancellationRequest {
    _id?: Types.ObjectId
    bookingId: Types.ObjectId
    userId: Types.ObjectId
    bookingNumber: string
    bookingType: "STANDARD" | "CUSTOMIZED"
    packageId: Types.ObjectId
    totalBookingAmount: number
    totalPaidAmount: number
    reasonCategory: string
    reason: string
    userNotes?: string
    status: CancellationRequestStatus
    previousBookingStatus: string
    adminRefundDetails?: IAdminRefundDetails
    adminRejectionDetails?: IAdminRejectionDetails
    createdAt?: Date
    updatedAt?: Date
}

const adminRefundDetailsSchema = new Schema<IAdminRefundDetails>(
    {
        refundAmount: { type: Number, required: true, min: 0 },
        deductionAmount: { type: Number, required: true, default: 0, min: 0 },
        paymentMode: {
            type: String,
            enum: ["BANK_TRANSFER", "UPI", "CASH", "ONLINE", "OTHER"],
            required: true,
            default: "BANK_TRANSFER",
        },
        transactionReference: { type: String, trim: true },
        refundDate: { type: Date, required: true, default: Date.now },
        adminNotes: { type: String, trim: true },
        processedBy: { type: Schema.Types.ObjectId, ref: "admin" },
        processedByName: { type: String, trim: true },
        processedAt: { type: Date, default: Date.now },
    },
    { _id: false }
)

const adminRejectionDetailsSchema = new Schema<IAdminRejectionDetails>(
    {
        rejectionReason: { type: String, required: true, trim: true },
        rejectedBy: { type: Schema.Types.ObjectId, ref: "admin" },
        rejectedByName: { type: String, trim: true },
        rejectedAt: { type: Date, default: Date.now },
    },
    { _id: false }
)

const bookingCancellationRequestSchema = new Schema<IBookingCancellationRequest>(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: "booking", required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
        bookingNumber: { type: String, required: true, index: true },
        bookingType: { type: String, enum: ["STANDARD", "CUSTOMIZED"], required: true },
        packageId: { type: Schema.Types.ObjectId, ref: "tourism", required: true },
        totalBookingAmount: { type: Number, required: true, default: 0 },
        totalPaidAmount: { type: Number, required: true, default: 0 },
        reasonCategory: {
            type: String,
            required: true,
            default: "Personal Emergency",
        },
        reason: { type: String, required: true, trim: true },
        userNotes: { type: String, trim: true },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "REJECTED"],
            default: "PENDING",
            required: true,
            index: true,
        },
        previousBookingStatus: { type: String, required: true },
        adminRefundDetails: { type: adminRefundDetailsSchema },
        adminRejectionDetails: { type: adminRejectionDetailsSchema },
    },
    { timestamps: true }
)

bookingCancellationRequestSchema.index({ status: 1, createdAt: -1 })
bookingCancellationRequestSchema.index({ bookingId: 1, status: 1 })

export const BookingCancellationRequestModel = model<IBookingCancellationRequest>(
    "bookingCancellationRequest",
    bookingCancellationRequestSchema
)

