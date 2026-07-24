import { t } from "elysia";

// ── Send OTP ─────────────────────────────────────────────────────────────────
export const sendOtpDto = {
    body: t.Object({
        mobile: t.String({ minLength: 10, maxLength: 10 }),
    }),
    detail: {
        summary: "Send OTP to the user's mobile number",
        description: "Send OTP to the user's mobile number for verification",
    },
};

// ── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOtpDto = {
    body: t.Object({
        otpId: t.String(),
        otpNo: t.String({ minLength: 4, maxLength: 6 }),
        mobile: t.String({ minLength: 10, maxLength: 10 }),
        countryCode: t.Optional(t.String({ default: "+91" })),
        fullName: t.Optional(t.String()),
    }),
    detail: {
        summary: "Verify OTP provided by the user",
        description: "Verify OTP, then find or create user and set auth cookie",
    },
};

// ── Google Login ─────────────────────────────────────────────────────────────
export const googleLoginDto = {
    body: t.Object({
        idToken: t.String(),
        fullName: t.Optional(t.String()),
    }),
    detail: {
        summary: "Login via Google OAuth",
        description: "Verify Google id_token and find or create user account",
    },
};

// ── Session ───────────────────────────────────────────────────────────────────
export const userSessionDto = {
    detail: {
        summary: "Get current user session",
        description: "Returns the currently logged-in user's data from cookie",
    },
};

// ── Logout ────────────────────────────────────────────────────────────────────
export const userLogoutDto = {
    detail: {
        summary: "Logout user",
        description: "Clears the user auth cookie",
    },
};

// ── TypeScript types ──────────────────────────────────────────────────────────
export type SendOtpSchema = typeof sendOtpDto.body.static;
export type VerifyOtpSchema = typeof verifyOtpDto.body.static;
export type GoogleLoginSchema = typeof googleLoginDto.body.static;
