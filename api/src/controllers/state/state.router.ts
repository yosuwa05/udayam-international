import Elysia from "elysia";
import { getIndianStates } from "./state.service";
import { getStatesDto } from "./state.schema";

export const StateRouter = new Elysia({
    prefix: "/states",
    detail: { tags: ["States"] },
})

    .get("/indian", getIndianStates, getStatesDto)
