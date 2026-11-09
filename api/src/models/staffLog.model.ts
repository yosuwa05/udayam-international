import { Schema, model, Types } from "mongoose"

export interface IStaffLog {
    _id?: Types.ObjectId;
    staffId: Types.ObjectId;
    staffName: string;
    staffEmail: string;
    action: "CREATE" | "UPDATE" | "DELETE";
    module: string;
    route: string;
    recordId?: string;
    recordTitle?: string;
    previousData?: any;
    updatedData?: any;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const staffLogSchema = new Schema<IStaffLog>(
    {
        staffId: {
            type: Schema.Types.ObjectId,
            ref: "admin",
            required: true,
        },
        staffName: {
            type: String,
            default: "Staff",
        },
        staffEmail: {
            type: String,
            required: true,
            trim: true,
        },
        action: {
            type: String,
            enum: ["CREATE", "UPDATE", "DELETE"],
            required: true,
        },
        module: {
            type: String,
            required: true,
        },
        route: {
            type: String,
            required: true,
        },
        recordId: {
            type: String,
            default: "",
        },
        recordTitle: {
            type: String,
            default: "",
        },
        previousData: {
            type: Schema.Types.Mixed,
            default: null,
        },
        updatedData: {
            type: Schema.Types.Mixed,
            default: null,
        },
        details: {
            type: String,
            default: "",
        },
        ipAddress: {
            type: String,
            default: "",
        },
        userAgent: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
)

staffLogSchema.index({ staffId: 1, createdAt: -1 })
staffLogSchema.index({ module: 1, createdAt: -1 })
staffLogSchema.index({ action: 1, createdAt: -1 })
staffLogSchema.index({ createdAt: -1 })

export const StaffLogModel = model<IStaffLog>("staffLog", staffLogSchema)

