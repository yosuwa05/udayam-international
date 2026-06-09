import { Context } from "elysia";
import { ObjectId } from "mongodb";
import { RoleType } from "@types";
import { CreateAdminSchema, LoginAdminSchema } from "./auth.schema";
import { AdminModel } from "@models/admin.model";
import { DecodePaseto, EncodePaseto } from "@lib/paseto";

export const createAdmin = async (ctx: Context<{ body: CreateAdminSchema }>) => {
    const { body, set } = ctx;
    const { email, password } = body
    try {


        const existing = await AdminModel.findOne({ email: email });

        if (existing) {
            set.status = 400;
            return {
                message: "Email already exists",
            };
        }
        const hashedPassword = await Bun.password.hash(password);
        await AdminModel.insertOne({
            email,
            password: hashedPassword,
            role: RoleType.ADMIN,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        set.status = 201;

        return {
            message: "Admin created successfully",
        }

    } catch (error: any) {
        console.log("Create Admin Error", error)
        set.status = 500
        return { error: "Failed to create admin", status: false };
    }
}
export const loginAdmin = async (ctx: Context<{ body: LoginAdminSchema }>) => {
    const { body, set } = ctx;
    const { email, password } = body
    try {

        const admin = await AdminModel.findOne({ email: email });

        if (!admin) {
            set.status = 400;
            return { message: "Invalid email or password" };
        }

        if (await Bun.password.verify(password, admin.password)) {
            let token = await EncodePaseto({
                id: admin._id.toString(),
                email: admin.email,
                role: admin.role,
            })
            set.status = 200;
            set.cookie = {
                udayam_access_token_admin: {
                    value: token,
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 1000 * 60 * 60 * 24,
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                },
            };
            return {
                message: "Login Successful",
                data: {
                    email: admin.email,
                    token,
                },
                ok: true,
            };
        }
        set.status = 401;
        return {
            message: "Invalid email or password",
        };

    } catch (error: any) {
        console.log("Login Admin Error", error)
        set.status = 500
        return { error: "Failed to Login admin", status: false };
    }
}
export const logoutAdmin = async (ctx: Context) => {
    const { set } = ctx;
    set.status = 200;
    set.cookie = {
        udayam_access_token_admin: {
            value: "",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
            expires: new Date(0),
        },
    };
    return {
        message: "Logout Successful",
        ok: true,
    };
}
export const adminSession = async (ctx: Context) => {
    const { set, cookie } = ctx;
    try {
        const token = cookie.udayam_access_token_admin?.value ?? "";

        if (!token) {
            set.status = 401;
            return { message: "Unauthorized" };
        }

        const payload: any = await DecodePaseto(token);
        if (!payload?.id) {
            set.status = 401;
            return { message: "Unauthorized" };
        }

        const admin = await AdminModel.findById(payload.id).select("-password");

        if (!admin || !admin.isActive) {
            set.status = 401;
            return { message: "Unauthorized" };
        }

        set.status = 200;
        return {
            message: "Session retrieved successfully",
            data: admin,
            status: true
        };
    } catch (error: any) {
        console.log("Admin Session Error", error);
        set.status = 401;
        return { message: "Unauthorized", status: false };
    }
};