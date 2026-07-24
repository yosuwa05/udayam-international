import { Elysia } from "elysia";
import {
    sendOtp,
    verifyOtp,
    googleLogin,
    userSession,
    logoutUser,
    updateProfile,
    getAdminUsers,
    updateUserStatus,
} from "./user.service";
import {
    sendOtpDto,
    verifyOtpDto,
    googleLoginDto,
    userSessionDto,
    userLogoutDto,
} from "./user.schema";
import { userOnly, adminOnly } from "@lib/authGuard";

export const userAuthController = new Elysia({
    prefix: "/user-auth",
    detail: {
        tags: ["User Authentication"],
    },
})
    .post("/send-otp", sendOtp, { ...sendOtpDto })
    .post("/verify-otp", verifyOtp, { ...verifyOtpDto })
    .post("/google-login", googleLogin, { ...googleLoginDto })
    .get("/session", userSession, { ...userSessionDto })
    .post("/logout", logoutUser, { ...userLogoutDto })
    .patch("/profile", updateProfile, { beforeHandle: userOnly })
    
    // Admin User Management routes
    .get("/admin/users", getAdminUsers, { beforeHandle: adminOnly })
    .patch("/admin/users/:id/status", updateUserStatus, { beforeHandle: adminOnly });
