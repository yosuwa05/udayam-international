import Elysia from "elysia";
import { adminAuthController } from "./auth/auth.router";
import { userAuthController } from "./user/user.router";
import { tourismRouter } from "./tourism/tourism.router";
import { testimonialRouter } from "./testimonial/testimonial.router";
import { couponRouter } from "./coupon/coupon.router";
import { bookingRouter } from "./booking/booking.router";
import { triptypesRouter } from "./triptypes/triptypes.router";
import { regionRouter } from "./region/region.router";
import { paymentPlanSettingsRouter } from "./paymentPlanSettings/paymentPlanSettings.router";
import { staffRouter } from "./staff/staff.router";

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
    .use(triptypesRouter)
    .use(regionRouter)
    .use(paymentPlanSettingsRouter)
    .use(staffRouter)

export { BaseRouter }