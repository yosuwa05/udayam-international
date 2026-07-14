import { t } from "elysia"

export const createTestimonialDto = {
    detail: {
        summary: "Create a new testimonial",
        description: "Admin: Add a client testimonial.",
    },
}

export const updateTestimonialDto = {
    detail: {
        summary: "Update a testimonial",
        description: "Admin: Edit client testimonial details.",
    },
}

export const getTestimonialsDto = {
    query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        isActive: t.Optional(t.String()), // "true" | "false"
    }),
    detail: {
        summary: "Get testimonials with pagination and active filter",
    },
}

export const testimonialParamDto = {
    params: t.Object({
        id: t.String({ minLength: 24, maxLength: 24 }),
    }),
}
