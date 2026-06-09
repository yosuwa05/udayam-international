import Elysia from "elysia";

const BaseRouter = new Elysia({
    prefix: "/api/V1",
    tags: ["Base Router"]
})



export { BaseRouter }