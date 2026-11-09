import { Elysia } from "elysia";
import {
    createStaff,
    getStaffList,
    getStaffById,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
    getStaffLogs,
    getStaffLogById,
    getAvailableModules,
} from "./staff.service";
import {
    createStaffDto,
    updateStaffDto,
    getStaffListDto,
    staffParamDto,
    getStaffLogsDto,
    staffLogParamDto,
} from "./staff.schema";
import { adminStrictOnly } from "@lib/authGuard";

export const staffRouter = new Elysia({
    prefix: "/staff",
    detail: { tags: ["Staff Management & Audit Logs"] },
})
    .get("/modules", getAvailableModules, { beforeHandle: adminStrictOnly })
    .get("/logs", getStaffLogs, { ...getStaffLogsDto, beforeHandle: adminStrictOnly })
    .get("/logs/:id", getStaffLogById, { ...staffLogParamDto, beforeHandle: adminStrictOnly })
    .post("/", createStaff, { ...createStaffDto, beforeHandle: adminStrictOnly })
    .get("/", getStaffList, { ...getStaffListDto, beforeHandle: adminStrictOnly })
    .get("/:id", getStaffById, { ...staffParamDto, beforeHandle: adminStrictOnly })
    .patch("/:id", updateStaff, { ...staffParamDto, ...updateStaffDto, beforeHandle: adminStrictOnly })
    .delete("/:id", deleteStaff, { ...staffParamDto, beforeHandle: adminStrictOnly })
    .patch("/:id/status", toggleStaffStatus, { ...staffParamDto, beforeHandle: adminStrictOnly });

