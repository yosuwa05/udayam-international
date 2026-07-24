import { Schema, model, Types } from "mongoose"

export interface IBookingStatusHistory {
    bookingId: Types.ObjectId
    fromStatus: string
    toStatus: string
    changedBy?: Types.ObjectId | string
    notes?: string
    createdAt?: Date
}

const bookingStatusHistorySchema = new Schema<IBookingStatusHistory>(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: "booking", required: true, index: true },
        fromStatus: { type: String, required: true },
        toStatus: { type: String, required: true },
        changedBy: { type: Schema.Types.Mixed, required: true },
        notes: { type: String, trim: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

export const BookingStatusHistoryModel = model<IBookingStatusHistory>(
    "bookingStatusHistory",
    bookingStatusHistorySchema
)
