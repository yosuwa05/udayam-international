import { Schema, model } from "mongoose"

interface IUser {
    fullName: string;
    email?: string;
    mobile?: string;
    countryCode?: string;
    loginType: "MOBILE" | "GOOGLE";
    googleId?: string;
    profileImage?: string;
    isMobileVerified: boolean;
    isEmailVerified: boolean;
    status: "ACTIVE" | "BLOCKED" | "DELETED";
    lastLoginAt?: Date;
}
const userSchema = new Schema<IUser>({
    fullName: { type: String, trim: true },
    email: { type: String, trim: true },
    mobile: { type: String, trim: true },
    countryCode: { type: String, trim: true },
    loginType: { type: String, enum: ["MOBILE", "GOOGLE"], },
    googleId: { type: String, trim: true },
    profileImage: { type: String, trim: true },
    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["ACTIVE", "BLOCKED", "DELETED"], default: "ACTIVE" },
    lastLoginAt: { type: Date },
}, { timestamps: true })


userSchema.index(
    { mobile: 1, countryCode: 1 },
    {
        unique: true,
        sparse: true
    }
);

userSchema.index(
    { email: 1 },
    {
        unique: true,
        sparse: true
    }
);

userSchema.index(
    { googleId: 1 },
    {
        unique: true,
        sparse: true
    }
);

userSchema.index({
    status: 1
});

export const UserModel = model<IUser>("user", userSchema)