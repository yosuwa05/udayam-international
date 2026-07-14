import Elysia from "elysia";
import { adminAuthController } from "./auth/auth.router";
import { tourismRouter } from "./tourism/tourism.router";
import { testimonialRouter } from "./testimonial/testimonial.router";

const BaseRouter = new Elysia({
    prefix: "/api/V1",
    tags: ["Base Router"]
})

    .use(adminAuthController)
    .use(tourismRouter)
    .use(testimonialRouter)

export { BaseRouter }