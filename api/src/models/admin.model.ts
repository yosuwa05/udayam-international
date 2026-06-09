import { Schema, model } from "mongoose"

interface Iadmin {
    name: string;
    mobileNumber: string;
    active: boolean;
    fcmToken?: string;
    profileImage?: string
}

const adminSchema = new Schema<Iadmin>({
    name: {
        type: String,
    },
    mobileNumber: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    fcmToken: {
        type: String
    },
    profileImage: {
        type: String
    }
}, { timestamps: true })

adminSchema.index({ email: 1 }, { unique: true })
adminSchema.index({ active: 1, createdAt: -1 });
export const AdminModel = model<Iadmin>("admin", adminSchema)