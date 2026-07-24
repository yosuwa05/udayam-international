import { Schema, model, Types } from "mongoose"

export type BookingType = "STANDARD" | "CUSTOMIZED"

export type StandardBookingStatus =
    | "PAYMENT_PENDING"
    | "PAYMENT_PROCESSING"
    | "PAYMENT_SUCCESS"
    | "BOOKED"
    | "CONFIRMED"
    | "TRAVEL_STARTED"
    | "COMPLETED"
    | "CANCELLED"
    | "PAYMENT_FAILED"
    | "REFUND_PENDING"
    | "REFUND_PROCESSING"
    | "PARTIALLY_REFUNDED"
    | "REFUNDED"

export type CustomizedBookingStatus =
    | "ENQUIRY_RECEIVED"
    | "UNDER_REVIEW"
    | "QUOTATION_SHARED"
    | "CUSTOMER_CONFIRMED"
    | "PAYMENT_PENDING"
    | "BOOKED"
    | "COMPLETED"
    | "ENQUIRY_CANCELLED"

export type BookingStatus = StandardBookingStatus | CustomizedBookingStatus

export interface ITraveller {
    name: string
    age: number
    gender: "MALE" | "FEMALE" | "OTHER"
}

export interface ITravellerInfo {
    fullName: string
    mobileNumber: string
    email: string
    numberOfPersons: number
    travelDate: Date
    travelType: string
    specialRequests?: string
    travellers: ITraveller[]
}

export interface IPricingDetails {
    originalAmount: number
    discountAmount: number
    finalAmount: number
    currency: string
}

export interface IQuotation {
    amount: number
    notes?: string
    sharedAt?: Date
    validUntil?: Date
}

export interface ICustomizedTransaction {
    amount: number
    paymentMode: "CASH" | "BANK_TRANSFER" | "UPI" | "ONLINE" | "OTHER"
    transactionDate: Date
    notes?: string
    createdAt?: Date
}

export interface IBooking {
    bookingNumber: string
    packageId: Types.ObjectId
    userId: Types.ObjectId
    bookingType: BookingType
    travellerInfo: ITravellerInfo
    pricingDetails: IPricingDetails
    couponId?: Types.ObjectId
    paymentId?: Types.ObjectId
    status: BookingStatus
    quotation?: IQuotation
    transactions?: ICustomizedTransaction[]
    createdAt?: Date
    updatedAt?: Date
}

const travellerSchema = new Schema<ITraveller>(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, required: true, min: 0 },
        gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
    },
    { _id: false }
)

const travellerInfoSchema = new Schema<ITravellerInfo>(
    {
        fullName: { type: String, required: true, trim: true },
        mobileNumber: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        numberOfPersons: { type: Number, required: true, min: 1 },
        travelDate: { type: Date, required: true },
        travelType: { type: String, required: true, trim: true },
        specialRequests: { type: String, trim: true },
        travellers: { type: [travellerSchema], default: [] },
    },
    { _id: false }
)

const pricingDetailsSchema = new Schema<IPricingDetails>(
    {
        originalAmount: { type: Number, required: true, default: 0, min: 0 },
        discountAmount: { type: Number, required: true, default: 0, min: 0 },
        finalAmount: { type: Number, required: true, default: 0, min: 0 },
        currency: { type: String, required: true, default: "INR" },
    },
    { _id: false }
)

const quotationSchema = new Schema<IQuotation>(
    {
        amount: { type: Number, required: true, min: 0 },
        notes: { type: String, trim: true },
        sharedAt: { type: Date, default: Date.now },
        validUntil: { type: Date },
    },
    { _id: false }
)

const customizedTransactionSchema = new Schema<ICustomizedTransaction>(
    {
        amount: { type: Number, required: true, min: 0.01 },
        paymentMode: {
            type: String,
            enum: ["CASH", "BANK_TRANSFER", "UPI", "ONLINE", "OTHER"],
            required: true,
        },
        transactionDate: { type: Date, required: true, default: Date.now },
        notes: { type: String, trim: true },
    },
    { timestamps: { createdAt: true, updatedAt: false }, _id: false }
)

const bookingSchema = new Schema<IBooking>(
    {
        bookingNumber: { type: String, required: true, unique: true, index: true },
        packageId: { type: Schema.Types.ObjectId, ref: "tourism", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
        bookingType: { type: String, enum: ["STANDARD", "CUSTOMIZED"], required: true },
        travellerInfo: { type: travellerInfoSchema, required: true },
        pricingDetails: { type: pricingDetailsSchema, required: true },
        couponId: { type: Schema.Types.ObjectId, ref: "coupon" },
        paymentId: { type: Schema.Types.ObjectId, ref: "payment" },
        status: {
            type: String,
            required: true,
            enum: [
                "PAYMENT_PENDING",
                "PAYMENT_PROCESSING",
                "PAYMENT_SUCCESS",
                "BOOKED",
                "CONFIRMED",
                "TRAVEL_STARTED",
                "COMPLETED",
                "CANCELLED",
                "PAYMENT_FAILED",
                "REFUND_PENDING",
                "REFUND_PROCESSING",
                "PARTIALLY_REFUNDED",
                "REFUNDED",
                "ENQUIRY_RECEIVED",
                "UNDER_REVIEW",
                "QUOTATION_SHARED",
                "CUSTOMER_CONFIRMED",
                "ENQUIRY_CANCELLED",
            ],
        },
        quotation: { type: quotationSchema },
        transactions: { type: [customizedTransactionSchema], default: [] },
    },
    { timestamps: true }
)

bookingSchema.index({ userId: 1, createdAt: -1 })
bookingSchema.index({ packageId: 1, createdAt: -1 })
bookingSchema.index({ bookingType: 1, status: 1 })
bookingSchema.index({ "travellerInfo.mobileNumber": 1 })
bookingSchema.index({ "travellerInfo.email": 1 })

export const BookingModel = model<IBooking>("booking", bookingSchema)
