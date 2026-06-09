import { RoleType } from "@types";
import { t } from "elysia";



const adminModel = t.Object({
    email: t.String({ format: "email" }),
    password: t.String(),
    role: t.Optional(t.String({ default: RoleType.ADMIN })),
    isActive: t.Optional(t.Boolean({ default: true })),
})

export const createAdminDto = {
    body: adminModel,
    detail: {
        description: "Create a new Admin",
        summary: "Create Admin"
    }
}
export const loginAdminDto = {
    body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
    }),
    detail: {
        description: "Login Admin",
        summary: "Login Admin"
    }
}
export const logoutDto = {
    detail: {
        description: "Logout Admin",
        summary: "Logout Admin"
    }
}
export const sessionDto = {
    detail: {
        description: "Session Admin",
        summary: "Session Admin"
    }
}

export type CreateAdminSchema = typeof createAdminDto.body.static
export type LoginAdminSchema = typeof loginAdminDto.body.static
export type LogOutAdminSchema = typeof logoutDto.detail
export type AdminSessionSchema = typeof sessionDto.detail
