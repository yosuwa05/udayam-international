import { Elysia } from "elysia"
import {
    createTestimonial,
    updateTestimonial,
    toggleActiveTestimonial,
    getActiveTestimonials,
    getAdminTestimonials,
    getTestimonialById,
} from "./testimonial.service"
import {
    getTestimonialsDto,
    testimonialParamDto,
} from "./testimonial.schema"
import { adminOnly } from "@lib/authGuard"

export const testimonialRouter = new Elysia({
    prefix: "/testimonials",
    detail: { tags: ["Testimonials"] },
})
    .get("/", getActiveTestimonials, getTestimonialsDto)
    .get("/admin", getAdminTestimonials, {
        ...getTestimonialsDto,
        beforeHandle: adminOnly,
    })
    .get("/:id", getTestimonialById, {
        ...testimonialParamDto,
        beforeHandle: adminOnly,
    })
    .post("/", createTestimonial, {
        beforeHandle: adminOnly,
        detail: { summary: "Create a testimonial" }
    })
    .patch("/:id", updateTestimonial, {
        ...testimonialParamDto,
        beforeHandle: adminOnly,
        detail: { summary: "Update a testimonial" }
    })
    .patch("/:id/toggle-active", toggleActiveTestimonial, {
        ...testimonialParamDto,
        beforeHandle: adminOnly,
        detail: { summary: "Toggle activate/deactivate testimonial" }
    })
