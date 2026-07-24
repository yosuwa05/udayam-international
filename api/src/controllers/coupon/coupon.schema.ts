import { t } from "elysia"

export const getCouponsDto = {
    query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        search: t.Optional(t.String()),
        status: t.Optional(t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE"), t.Literal("ALL")])),
        applicableFor: t.Optional(t.Union([t.Literal("ALL"), t.Literal("STANDARD"), t.Literal("CUSTOMIZED"), t.Literal("SELECTED"), t.Literal("ALL_TYPES")])),
        sortBy: t.Optional(
            t.Union([
                t.Literal("newest"),
                t.Literal("oldest"),
                t.Literal("discount_high"),
                t.Literal("discount_low"),
            ])
        ),
    }),
    detail: {
        summary: "Get all coupons with filters",
        description: "Admin: View and filter all coupons (including pagination, sorting, search).",
    },
}

export const couponParamDto = {
    params: t.Object({
        id: t.String({ minLength: 24, maxLength: 24 }),
    }),
}

export type GetCouponsQuery = typeof getCouponsDto.query.static
