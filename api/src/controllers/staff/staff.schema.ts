import { t } from "elysia";

export const permissionSchema = t.Object({
    route: t.String(),
    name: t.String(),
    view: t.Boolean({ default: false }),
    create: t.Optional(t.Boolean({ default: false })),
    edit: t.Boolean({ default: false }),
    delete: t.Boolean({ default: false }),
});

export const createStaffDto = {
    body: t.Object({
        name: t.String({ minLength: 2, error: "Name must be at least 2 characters" }),
        email: t.String({ format: "email", error: "A valid email is required" }),
        password: t.String({ minLength: 6, error: "Password must be at least 6 characters" }),
        permissions: t.Array(permissionSchema),
        active: t.Optional(t.Boolean({ default: true })),
    }),
    detail: {
        summary: "Create a new staff member account",
        description: "Admin: Create a staff member with route permissions",
    },
};

export const updateStaffDto = {
    body: t.Object({
        name: t.Optional(t.String({ minLength: 2 })),
        email: t.Optional(t.String({ format: "email" })),
        password: t.Optional(t.String()),
        permissions: t.Optional(t.Array(permissionSchema)),
        active: t.Optional(t.Boolean()),
    }),
    detail: {
        summary: "Update staff account details and permissions",
    },
};

export const getStaffListDto = {
    query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        search: t.Optional(t.String()),
        active: t.Optional(t.String()),
    }),
    detail: {
        summary: "Get list of staff accounts with pagination and filters",
    },
};

export const staffParamDto = {
    params: t.Object({
        id: t.String({ minLength: 24, maxLength: 24, error: "Invalid staff ID format" }),
    }),
};

export const getStaffLogsDto = {
    query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        staffId: t.Optional(t.String()),
        module: t.Optional(t.String()),
        action: t.Optional(t.String()),
        search: t.Optional(t.String()),
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
    }),
    detail: {
        summary: "Get staff activity audit logs with filters and pagination",
    },
};

export const staffLogParamDto = {
    params: t.Object({
        id: t.String({ minLength: 24, maxLength: 24, error: "Invalid log ID format" }),
    }),
};

export type CreateStaffSchema = typeof createStaffDto.body.static;
export type UpdateStaffSchema = typeof updateStaffDto.body.static;

