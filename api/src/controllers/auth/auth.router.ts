import { Elysia } from "elysia";
import { createAdmin, adminSession, loginAdmin, logoutAdmin } from "./auth.service";
import { createAdminDto, loginAdminDto, logoutDto, sessionDto } from "./auth.schema";
import { adminOnly } from "@lib/authGuard";

export const adminAuthController = new Elysia({
    prefix: '/admin-auth',
    detail: {
        tags: ["Admin Authentication"]
    }
})
    .post("/create", createAdmin, { ...createAdminDto })
    .post("/login", loginAdmin, { ...loginAdminDto })
    .post("/logout", logoutAdmin, { ...logoutDto })
    .get("/session", adminSession, { ...sessionDto })