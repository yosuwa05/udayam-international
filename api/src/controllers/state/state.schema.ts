
import { t } from "elysia"

export const getStatesDto = {
    query: t.Object({
        q: t.Optional(t.String()),
    }),
    detail: {
        summary: "Get regions with pagination, active status, and search filters",
    },
}


export type getStatesSchema = typeof getStatesDto.query.static