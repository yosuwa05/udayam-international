import { StaffLogModel } from "@models/staffLog.model";
import { RoleType } from "@types";

export interface IRecordStaffActivityParams {
    action: "CREATE" | "UPDATE" | "DELETE";
    module: string;
    route: string;
    recordId?: string;
    recordTitle?: string;
    previousData?: any;
    updatedData?: any;
    details?: string;
}

export async function recordStaffActivity(
    ctx: any,
    params: IRecordStaffActivityParams
) {
    try {
        const { store, headers } = ctx;

        // Only log actions executed by staff members
        if (store?.role !== RoleType.STAFF && !store?.isStaff) {
            return;
        }

        const staffId = store?.id || store?.staffId;
        if (!staffId) return;

        const staffName = store?.name || store?.staffName || "Staff Member";
        const staffEmail = store?.email || store?.staffEmail || "";

        const ipAddress =
            headers?.["x-forwarded-for"] ||
            headers?.["x-real-ip"] ||
            "";
        const userAgent = headers?.["user-agent"] || "";

        // Clone objects to avoid mutation or circular refs
        const cleanPrevious = params.previousData
            ? JSON.parse(JSON.stringify(params.previousData))
            : null;
        const cleanUpdated = params.updatedData
            ? JSON.parse(JSON.stringify(params.updatedData))
            : null;

        await StaffLogModel.create({
            staffId,
            staffName,
            staffEmail,
            action: params.action,
            module: params.module,
            route: params.route,
            recordId: params.recordId ? String(params.recordId) : "",
            recordTitle: params.recordTitle || "",
            previousData: cleanPrevious,
            updatedData: cleanUpdated,
            details: params.details || `${params.action} on ${params.module}`,
            ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
            userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
        });
    } catch (error) {
        console.error("Staff activity logging error:", error);
    }
}

