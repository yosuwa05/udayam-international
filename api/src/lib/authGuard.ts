import { Context } from "elysia";
import { RoleType } from "@types";
import { DecodePaseto, DecodeUserPaseto } from "@lib/paseto";
import { UserModel } from "@models/user.model";
import { AdminModel } from "@models/admin.model";

export const adminStrictOnly = (ctx: Context) => roleGuard(ctx, [RoleType.ADMIN]);
export const adminOnly = (ctx: Context) => roleGuard(ctx, [RoleType.ADMIN, RoleType.STAFF]);
export const userOnly = (ctx: Context) => roleGuard(ctx, [RoleType.USER]);
export const userAndAdminOnly = (ctx: Context) => roleGuard(ctx, [RoleType.USER, RoleType.ADMIN]);

export function mapUrlToModuleRoute(urlStr: string): { route: string; secondaryRoute?: string } {
    try {
        const url = new URL(urlStr, "http://localhost");
        const pathname = url.pathname;
        const search = url.searchParams;

        if (pathname.includes("/trip-types")) return { route: "/trip-types" };
        if (pathname.includes("/region")) return { route: "/regions" };
        if (pathname.includes("/tourism")) return { route: "/tourism" };
        if (pathname.includes("/coupon")) return { route: "/coupons" };
        if (pathname.includes("/testimonial")) return { route: "/testimonials" };
        if (pathname.includes("/user")) return { route: "/users" };
        if (pathname.includes("/booking")) {
            const isCustomized =
                pathname.includes("customized") ||
                pathname.includes("quotation") ||
                pathname.includes("transaction") ||
                search.get("bookingType") === "CUSTOMIZED";

            if (isCustomized) {
                return { route: "/bookings/customized" };
            }
            if (search.get("bookingType") === "STANDARD") {
                return { route: "/bookings/standard" };
            }
            // If viewing list without specific type param, allow if has permission for either
            return { route: "/bookings/standard", secondaryRoute: "/bookings/customized" };
        }
        return { route: "/" };
    } catch {
        return { route: "/" };
    }
}

export const roleGuard = async (
    ctx: Context,
    allowedRoles: RoleType[]
) => {
    const { cookie, set, store, request }: any = ctx;

    const isAdminAllowed = allowedRoles.includes(RoleType.ADMIN) || allowedRoles.includes(RoleType.STAFF);
    const isUserAllowed = allowedRoles.includes(RoleType.USER);

    let payload: any = null;
    let isUserToken = false;

    // Try user cookie first if USER role is allowed
    if (isUserAllowed) {
        const userToken = cookie?.udayam_access_token_user?.value;
        if (userToken) {
            payload = await DecodeUserPaseto(userToken);
            if (payload) isUserToken = true;
        }
    }

    // Try admin cookie if ADMIN/STAFF role is allowed and no user payload found yet
    if (!payload && isAdminAllowed) {
        const adminToken = cookie?.udayam_access_token_admin?.value;
        if (adminToken) {
            payload = await DecodePaseto(adminToken);
        }
    }

    if (!payload) {
        set.status = 401;
        return { error: "Authentication token missing", status: false };
    }

    try {
        if (!allowedRoles.includes(payload.role)) {
            set.status = 403;
            return { error: "Forbidden: Insufficient role", status: false };
        }

        // Live check for user tokens
        if (isUserToken && payload.id) {
            const user = await UserModel.findById(payload.id).select("status").lean();
            if (!user || user.status !== "ACTIVE") {
                set.status = 401;
                return { error: "Your account has been blocked. Please contact support.", status: false };
            }
            store.id = payload.id;
            store.role = payload.role;
            return;
        }

        // If ADMIN role: full unconditional access
        if (payload.role === RoleType.ADMIN) {
            store.id = payload.id;
            store.role = RoleType.ADMIN;
            store.email = payload.email;
            store.name = payload.name || "Admin";
            return;
        }

        // If STAFF role: verify active state and module route permissions
        if (payload.role === RoleType.STAFF) {
            const staff = await AdminModel.findById(payload.id);
            if (!staff || !staff.active) {
                set.status = 401;
                return { error: "Staff account is inactive or not found", status: false };
            }

            store.id = staff._id.toString();
            store.role = RoleType.STAFF;
            store.name = staff.name || "Staff Member";
            store.email = staff.email;
            store.isStaff = true;
            store.staffId = staff._id.toString();

            // Determine required permission type from HTTP method
            const method = request.method?.toUpperCase() || "GET";
            const reqAction: "view" | "edit" | "delete" =
                method === "DELETE"
                    ? "delete"
                    : ["POST", "PUT", "PATCH"].includes(method)
                    ? "edit"
                    : "view";

            const { route, secondaryRoute } = mapUrlToModuleRoute(request.url);

            const staffPermissions = staff.permissions || [];
            const perm = staffPermissions.find((p) => p.route === route);
            const secondaryPerm = secondaryRoute
                ? staffPermissions.find((p) => p.route === secondaryRoute)
                : null;

            const hasPermission =
                (perm && perm[reqAction]) ||
                (secondaryPerm && secondaryPerm[reqAction]);

            if (!hasPermission) {
                set.status = 403;
                return {
                    error: `Forbidden: You do not have '${reqAction}' permission for route ${route}`,
                    status: false,
                };
            }
        }
    } catch (error) {
        console.error("RoleGuard error:", error);
        set.status = 401;
        return { error: "Invalid or expired token", status: false };
    }
};
