import { Context } from "elysia";
import { AdminModel } from "@models/admin.model";
import { StaffLogModel } from "@models/staffLog.model";
import { RoleType } from "@types";
import { CreateStaffSchema, UpdateStaffSchema } from "./staff.schema";

export const AVAILABLE_STAFF_MODULES = [
    { route: "/", name: "Dashboard", description: "Overview and statistics" },
    { route: "/bookings/standard", name: "Standard Bookings", description: "Manage package bookings & installment stages" },
    { route: "/bookings/customized", name: "Customized Bookings", description: "Manage customized tour requests & quotations" },
    { route: "/users", name: "Users", description: "User accounts & status management" },
    { route: "/tourism", name: "Tourism", description: "Tour packages, destinations, and pricing" },
    { route: "/testimonials", name: "Testimonials", description: "Customer reviews and testimonials" },
    { route: "/coupons", name: "Coupons", description: "Discount codes and promotions" },
    { route: "/trip-types", name: "Trip Types", description: "Travel categories and styles" },
    { route: "/regions", name: "Regions", description: "Geographical destinations" },
];

// ── GET AVAILABLE MODULES ──────────────────────────────────────────────────
export const getAvailableModules = async () => {
    return {
        message: "Available modules retrieved successfully",
        data: AVAILABLE_STAFF_MODULES,
        status: true,
    };
};

// ── CREATE STAFF ──────────────────────────────────────────────────────────
export const createStaff = async (ctx: Context<{ body: CreateStaffSchema }>) => {
    const { body, set } = ctx;
    const { name, email, password, permissions, active } = body;

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const existing = await AdminModel.findOne({ email: normalizedEmail });

        if (existing) {
            set.status = 400;
            return { error: "An account with this email already exists", status: false };
        }

        const hashedPassword = await Bun.password.hash(password);

        const newStaff = await AdminModel.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: RoleType.STAFF,
            permissions: permissions || [],
            active: active !== undefined ? active : true,
        });

        const staffData = newStaff.toObject();
        delete (staffData as any).password;

        set.status = 201;
        return {
            message: "Staff account created successfully",
            data: staffData,
            status: true,
        };
    } catch (error: any) {
        console.error("Create Staff Error:", error);
        set.status = 500;
        return { error: "Failed to create staff account", status: false };
    }
};

// ── GET STAFF LIST ────────────────────────────────────────────────────────
export const getStaffList = async (ctx: Context<{ query: any }>) => {
    const { query, set } = ctx;

    try {
        const page = Math.max(1, parseInt(query.page || "1", 10));
        const limit = Math.max(1, Math.min(100, parseInt(query.limit || "10", 10)));
        const skip = (page - 1) * limit;

        const filter: Record<string, any> = { role: RoleType.STAFF };

        if (query.active === "true") filter.active = true;
        if (query.active === "false") filter.active = false;

        if (query.search && query.search.trim()) {
            const regex = new RegExp(query.search.trim(), "i");
            filter.$or = [{ name: regex }, { email: regex }];
        }

        const [total, staffMembers] = await Promise.all([
            AdminModel.countDocuments(filter),
            AdminModel.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        return {
            message: "Staff list retrieved successfully",
            data: staffMembers,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
            status: true,
        };
    } catch (error: any) {
        console.error("Get Staff List Error:", error);
        set.status = 500;
        return { error: "Failed to retrieve staff list", status: false };
    }
};

// ── GET STAFF BY ID ───────────────────────────────────────────────────────
export const getStaffById = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, set } = ctx;

    try {
        const staff = await AdminModel.findOne({
            _id: params.id,
            role: RoleType.STAFF,
        }).select("-password");

        if (!staff) {
            set.status = 404;
            return { error: "Staff member not found", status: false };
        }

        return {
            message: "Staff details retrieved successfully",
            data: staff,
            status: true,
        };
    } catch (error: any) {
        console.error("Get Staff Details Error:", error);
        set.status = 500;
        return { error: "Failed to retrieve staff details", status: false };
    }
};

// ── UPDATE STAFF ──────────────────────────────────────────────────────────
export const updateStaff = async (
    ctx: Context<{ body: UpdateStaffSchema; params: { id: string } }>
) => {
    const { body, params, set } = ctx;

    try {
        const staff = await AdminModel.findOne({
            _id: params.id,
            role: RoleType.STAFF,
        });

        if (!staff) {
            set.status = 404;
            return { error: "Staff member not found", status: false };
        }

        if (body.email) {
            const normalizedEmail = body.email.toLowerCase().trim();
            if (normalizedEmail !== staff.email) {
                const existing = await AdminModel.findOne({
                    email: normalizedEmail,
                    _id: { $ne: params.id },
                });
                if (existing) {
                    set.status = 400;
                    return { error: "Another account is already using this email", status: false };
                }
                staff.email = normalizedEmail;
            }
        }

        if (body.name !== undefined) {
            staff.name = body.name.trim();
        }

        if (body.password && body.password.trim().length >= 6) {
            staff.password = await Bun.password.hash(body.password.trim());
        }

        if (body.permissions !== undefined) {
            staff.permissions = body.permissions as any;
        }

        if (body.active !== undefined) {
            staff.active = body.active;
        }

        await staff.save();

        const updatedData = staff.toObject();
        delete (updatedData as any).password;

        return {
            message: "Staff account updated successfully",
            data: updatedData,
            status: true,
        };
    } catch (error: any) {
        console.error("Update Staff Error:", error);
        set.status = 500;
        return { error: "Failed to update staff account", status: false };
    }
};

// ── DELETE STAFF ──────────────────────────────────────────────────────────
export const deleteStaff = async (ctx: Context<{ params: { id: string } }>) => {
    const { params, set } = ctx;

    try {
        const deleted = await AdminModel.findOneAndDelete({
            _id: params.id,
            role: RoleType.STAFF,
        });

        if (!deleted) {
            set.status = 404;
            return { error: "Staff member not found", status: false };
        }

        return {
            message: "Staff member deleted successfully",
            status: true,
        };
    } catch (error: any) {
        console.error("Delete Staff Error:", error);
        set.status = 500;
        return { error: "Failed to delete staff member", status: false };
    }
};

// ── TOGGLE STAFF STATUS ───────────────────────────────────────────────────
export const toggleStaffStatus = async (
    ctx: Context<{ params: { id: string } }>
) => {
    const { params, set } = ctx;

    try {
        const staff = await AdminModel.findOne({
            _id: params.id,
            role: RoleType.STAFF,
        });

        if (!staff) {
            set.status = 404;
            return { error: "Staff member not found", status: false };
        }

        staff.active = !staff.active;
        await staff.save();

        return {
            message: `Staff member ${staff.active ? "activated" : "deactivated"} successfully`,
            data: { active: staff.active },
            status: true,
        };
    } catch (error: any) {
        console.error("Toggle Staff Status Error:", error);
        set.status = 500;
        return { error: "Failed to update staff status", status: false };
    }
};

// ── GET STAFF ACTIVITY LOGS ───────────────────────────────────────────────
export const getStaffLogs = async (ctx: Context<{ query: any }>) => {
    const { query, set } = ctx;

    try {
        const page = Math.max(1, parseInt(query.page || "1", 10));
        const limit = Math.max(1, Math.min(100, parseInt(query.limit || "10", 10)));
        const skip = (page - 1) * limit;

        const filter: Record<string, any> = {};

        if (query.staffId && query.staffId.trim()) {
            filter.staffId = query.staffId.trim();
        }

        if (query.module && query.module.trim()) {
            filter.module = query.module.trim();
        }

        if (query.action && query.action.trim()) {
            filter.action = query.action.trim().toUpperCase();
        }

        if (query.search && query.search.trim()) {
            const regex = new RegExp(query.search.trim(), "i");
            filter.$or = [
                { staffName: regex },
                { staffEmail: regex },
                { module: regex },
                { recordTitle: regex },
                { details: regex },
            ];
        }

        if (query.startDate || query.endDate) {
            filter.createdAt = {};
            if (query.startDate) {
                filter.createdAt.$gte = new Date(query.startDate);
            }
            if (query.endDate) {
                const end = new Date(query.endDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }

        const [total, logs] = await Promise.all([
            StaffLogModel.countDocuments(filter),
            StaffLogModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        return {
            message: "Staff activity logs retrieved successfully",
            data: logs,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
            status: true,
        };
    } catch (error: any) {
        console.error("Get Staff Logs Error:", error);
        set.status = 500;
        return { error: "Failed to retrieve staff activity logs", status: false };
    }
};

// ── GET SINGLE STAFF LOG DETAILS ──────────────────────────────────────────
export const getStaffLogById = async (
    ctx: Context<{ params: { id: string } }>
) => {
    const { params, set } = ctx;

    try {
        const log = await StaffLogModel.findById(params.id).lean();

        if (!log) {
            set.status = 404;
            return { error: "Activity log not found", status: false };
        }

        return {
            message: "Activity log details retrieved successfully",
            data: log,
            status: true,
        };
    } catch (error: any) {
        console.error("Get Staff Log Details Error:", error);
        set.status = 500;
        return { error: "Failed to retrieve activity log details", status: false };
    }
};

