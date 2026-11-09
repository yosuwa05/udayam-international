import { Schema, model, Types } from "mongoose"
import { RoleType } from "@types"

export interface IRoutePermission {
    route: string;
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export interface Iadmin {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: string;
    permissions: IRoutePermission[];
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const routePermissionSchema = new Schema<IRoutePermission>(
    {
        route: { type: String, required: true },
        name: { type: String, required: true },
        view: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
    },
    { _id: false }
)

const adminSchema = new Schema<Iadmin>(
    {
        name: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [RoleType.ADMIN, RoleType.STAFF],
            default: RoleType.ADMIN,
        },
        permissions: {
            type: [routePermissionSchema],
            default: [],
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

adminSchema.index({ email: 1 }, { unique: true })
adminSchema.index({ role: 1, active: 1 })
adminSchema.index({ active: 1, createdAt: -1 })

export const AdminModel = model<Iadmin>("admin", adminSchema)
