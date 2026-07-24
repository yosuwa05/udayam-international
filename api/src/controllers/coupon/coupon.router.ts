import { Elysia } from "elysia"
import {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupons,
    getCouponById,
    getApplicableUsers,
    getApplicablePackages,
    getActiveCoupons,
} from "./coupon.service"
import {
    getCouponsDto,
    couponParamDto,
} from "./coupon.schema"
import { adminOnly } from "@lib/authGuard"

export const couponRouter = new Elysia({
    prefix: "/coupon",
    detail: { tags: ["Coupons"] },
})
    .get("/active", getActiveCoupons)
    .post("/", createCoupon, { beforeHandle: adminOnly })
    .get("/", getAllCoupons, { ...getCouponsDto, beforeHandle: adminOnly })
    .get("/helper/users", getApplicableUsers, { beforeHandle: adminOnly })
    .get("/helper/packages", getApplicablePackages, { beforeHandle: adminOnly })
    .get("/:id", getCouponById, { ...couponParamDto, beforeHandle: adminOnly })
    .patch("/:id", updateCoupon, { beforeHandle: adminOnly })
    .delete("/:id", deleteCoupon, { ...couponParamDto, beforeHandle: adminOnly })
