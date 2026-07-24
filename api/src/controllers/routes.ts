import Elysia from "elysia";
import { adminAuthController } from "./auth/auth.router";
import { userAuthController } from "./user/user.router";
import { tourismRouter } from "./tourism/tourism.router";
import { testimonialRouter } from "./testimonial/testimonial.router";
import { couponRouter } from "./coupon/coupon.router";
import { bookingRouter } from "./booking/booking.router";

const BaseRouter = new Elysia({
    prefix: "/api/V1",
    tags: ["Base Router"]
})

    .use(adminAuthController)
    .use(userAuthController)
    .use(tourismRouter)
    .use(testimonialRouter)
    .use(couponRouter)
    .use(bookingRouter)

export { BaseRouter }