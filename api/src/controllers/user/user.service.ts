import { Context } from "elysia";
import axios from "axios";
import { APP_CONSTANTS } from "constant";
import { UserModel } from "@models/user.model";
import { OtpCountModel } from "@models/otpCount.model";
import { EncodeUserPaseto, DecodeUserPaseto } from "@lib/paseto";
import { saveFile } from "@lib/file";
import { RoleType } from "@types";
import { SendOtpSchema, VerifyOtpSchema, GoogleLoginSchema } from "./user.schema";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const COOKIE_NAME = "udayam_access_token_user";

const setUserCookie = (set: any, token: string) => {
    set.cookie = {
        [COOKIE_NAME]: {
            value: token,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            expires: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
        },
    };
};

const trackOtpUsage = async () => {
    try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        let otpCount = await OtpCountModel.findOne({ month, year });
        if (!otpCount) {
            otpCount = new OtpCountModel({ month, year, count: 0 });
        }
        otpCount.count += 1;
        await otpCount.save();
    } catch (err) {
        console.error("OTP tracking error:", err);
    }
};

export const sendOtp = async (ctx: Context<{ body: SendOtpSchema }>) => {
    const { body, set } = ctx;
    const { mobile } = body;

    try {
        const response = await axios.post("https://dev.xopay.in/api/v2/otp/otp", {
            phone: mobile,
            comapny_name: "Udayam International",
        });

        if (response.data.status) {
            await trackOtpUsage();
            set.status = 200;
            return {
                message: "OTP sent successfully",
                status: true,
                otpId: response.data.id,
            };
        } else {
            set.status = 400;
            return {
                message: "Failed to send OTP",
                status: false,
            };
        }
    } catch (error: any) {
        console.error("Send OTP error:", error);
        set.status = 500;
        return {
            error: error.message,
            status: false,
        };
    }
};

export const verifyOtp = async (ctx: Context<{ body: VerifyOtpSchema }>) => {
    const { body, set } = ctx;
    const { otpId, otpNo, mobile, countryCode = "+91", fullName } = body;

    try {
        const response = await axios.post("https://dev.xopay.in/api/v2/otp/otpverify", {
            id: otpId,
            otp_no: otpNo,
        });

        if (!response.data.status) {
            set.status = 400;
            return {
                message: "Invalid or expired OTP",
                status: false,
            };
        }

        let user = await UserModel.findOne({ mobile, countryCode });

        if (!user) {
            user = await UserModel.create({
                fullName: fullName || `User ${mobile.slice(-4)}`,
                mobile,
                countryCode,
                loginType: "MOBILE",
                isMobileVerified: true,
                isEmailVerified: false,
                status: "ACTIVE",
                lastLoginAt: new Date(),
            });
        } else {
            if (user.status === "BLOCKED") {
                set.status = 403;
                return { message: "Your account has been blocked. Please contact support.", status: false };
            }
            user.lastLoginAt = new Date();
            user.isMobileVerified = true;
            await user.save();
        }

        const token = await EncodeUserPaseto({
            id: user._id.toString(),
            role: RoleType.USER,
            mobile,
        });

        if (!token) {
            set.status = 500;
            return { message: "Failed to create session", status: false };
        }

        setUserCookie(set, token);
        set.status = 200;

        return {
            message: "Login successful",
            status: true,
            data: {
                _id: user._id,
                fullName: user.fullName,
                mobile: user.mobile,
                profileImage: user.profileImage,
            },
        };
    } catch (error: any) {
        console.error("Verify OTP error:", error);
        set.status = 500;
        return { error: error.message, status: false };
    }
};

export const googleLogin = async (ctx: Context<{ body: GoogleLoginSchema }>) => {
    const { body, set } = ctx;
    const { idToken, fullName } = body;

    try {
        const googleRes = await axios.get(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
        );

        const googleData = googleRes.data;

        if (
            APP_CONSTANTS.GOOGLE_CLIENT_ID &&
            googleData.aud !== APP_CONSTANTS.GOOGLE_CLIENT_ID
        ) {
            set.status = 401;
            return { message: "Invalid Google token", status: false };
        }

        const googleId = googleData.sub;
        const email = googleData.email;
        const name = fullName || googleData.name || `User ${email?.split("@")[0]}`;
        const profileImage = googleData.picture;

        let user = await UserModel.findOne({
            $or: [{ googleId }, ...(email ? [{ email }] : [])],
        });

        if (!user) {
            user = await UserModel.create({
                fullName: name,
                email,
                googleId,
                profileImage,
                loginType: "GOOGLE",
                isMobileVerified: false,
                isEmailVerified: true,
                status: "ACTIVE",
                lastLoginAt: new Date(),
            });
        } else {
            if (user.status === "BLOCKED") {
                set.status = 403;
                return { message: "Your account has been blocked. Please contact support.", status: false };
            }
            if (!user.googleId) user.googleId = googleId;
            if (!user.profileImage && profileImage) user.profileImage = profileImage;
            user.lastLoginAt = new Date();
            await user.save();
        }

        const token = await EncodeUserPaseto({
            id: user._id.toString(),
            role: RoleType.USER,
            email: email || "",
        });

        if (!token) {
            set.status = 500;
            return { message: "Failed to create session", status: false };
        }

        setUserCookie(set, token);
        set.status = 200;

        return {
            message: "Login successful",
            status: true,
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImage: user.profileImage,
            },
        };
    } catch (error: any) {
        console.error("Google login error:", error);
        set.status = 500;
        return { error: error.message, status: false };
    }
};

export const userSession = async (ctx: Context) => {
    const { set, cookie } = ctx;
    try {
        const token = cookie[COOKIE_NAME]?.value ?? "";
        if (!token) {
            set.status = 401;
            return { message: "Unauthorized", status: false };
        }

        const payload: any = await DecodeUserPaseto(token);
        if (!payload?.id) {
            set.status = 401;
            return { message: "Unauthorized", status: false };
        }

        const user = await UserModel.findById(payload.id).select(
            "-__v"
        );

        if (!user || user.status !== "ACTIVE") {
            set.status = 401;
            return { message: "Unauthorized", status: false };
        }

        set.status = 200;
        return {
            message: "Session retrieved successfully",
            status: true,
            data: user,
        };
    } catch (error: any) {
        console.error("User session error:", error);
        set.status = 401;
        return { message: "Unauthorized", status: false };
    }
};

export const logoutUser = async (ctx: Context) => {
    const { set } = ctx;
    set.status = 200;
    set.cookie = {
        [COOKIE_NAME]: {
            value: "",
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
            expires: new Date(0),
        },
    };
    return { message: "Logout successful", status: true };
};

export const updateProfile = async (ctx: Context) => {
    const { body, set, store }: any = ctx;
    const userId = store.id;

    if (!userId) {
        set.status = 401;
        return { status: false, error: "Authentication required" };
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user || user.status !== "ACTIVE") {
            set.status = 404;
            return { status: false, error: "User profile not found" };
        }

        const { fullName, email, mobile, countryCode, profileImage } = body || {};

        if (fullName !== undefined && typeof fullName === "string") {
            const cleanName = fullName.trim();
            if (cleanName) user.fullName = cleanName;
        }

        // Email update restrictions
        if (email !== undefined && typeof email === "string") {
            const cleanEmail = email.trim().toLowerCase();
            if (cleanEmail && cleanEmail !== user.email) {
                // If user registered with Mobile, or email is not verified, allow updating email
                const existing = await UserModel.findOne({ email: cleanEmail, _id: { $ne: user._id } });
                if (existing) {
                    set.status = 400;
                    return { status: false, error: "Email address is already in use by another account" };
                }
                user.email = cleanEmail;
            }
        }

        // Mobile update restrictions
        if (mobile !== undefined && typeof mobile === "string") {
            const cleanMobile = mobile.trim();
            if (cleanMobile && cleanMobile !== user.mobile) {
                const existing = await UserModel.findOne({ mobile: cleanMobile, _id: { $ne: user._id } });
                if (existing) {
                    set.status = 400;
                    return { status: false, error: "Mobile number is already in use by another account" };
                }
                user.mobile = cleanMobile;
                if (countryCode) user.countryCode = countryCode.trim();
            }
        }

        const profileImageInput = body.profileImageFile || body.profileImage;
        if (profileImageInput && typeof profileImageInput === "object" && (profileImageInput.name || profileImageInput.type)) {
            const uploadRes = await saveFile(profileImageInput, "users", "avatars");
            if (uploadRes.ok && uploadRes.filename) {
                user.profileImage = uploadRes.filename;
            }
        } else if (profileImageInput !== undefined && typeof profileImageInput === "string") {
            user.profileImage = profileImageInput.trim();
        }

        await user.save();

        return {
            status: true,
            message: "Profile updated successfully",
            data: user,
        };
    } catch (error: any) {
        console.error("Update profile error:", error);
        set.status = 500;
        return { status: false, error: "Failed to update profile" };
    }
};

export const getAdminUsers = async (ctx: Context) => {
    const { query, set }: any = ctx;

    try {
        const page = Math.max(1, parseInt(query.page ?? "1"));
        const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "10")));
        const skip = (page - 1) * limit;

        const filter: Record<string, any> = {};

        if (query.loginType && query.loginType !== "ALL") {
            filter.loginType = query.loginType;
        }

        if (query.status && query.status !== "ALL") {
            filter.status = query.status;
        }

        if (query.search?.trim()) {
            const regex = new RegExp(query.search.trim(), "i");
            filter.$or = [
                { fullName: regex },
                { email: regex },
                { mobile: regex },
            ];
        }

        const [users, total] = await Promise.all([
            UserModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            UserModel.countDocuments(filter),
        ]);

        return {
            status: true,
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error: any) {
        console.error("Get Admin Users Error", error);
        set.status = 500;
        return { status: false, error: "Failed to fetch users list" };
    }
};

export const updateUserStatus = async (ctx: Context) => {
    const { params, body, set }: any = ctx;

    try {
        const { status } = body || {};
        if (!["ACTIVE", "BLOCKED", "DELETED"].includes(status)) {
            set.status = 400;
            return { status: false, error: "Invalid status value" };
        }

        const user = await UserModel.findById(params.id);
        if (!user) {
            set.status = 404;
            return { status: false, error: "User not found" };
        }

        user.status = status;
        await user.save();

        return {
            status: true,
            message: `User status updated to ${status}`,
            data: user,
        };
    } catch (error: any) {
        console.error("Update User Status Error", error);
        set.status = 500;
        return { status: false, error: "Failed to update user status" };
    }
};
