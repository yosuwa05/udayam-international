import { Schema, model } from "mongoose"

export interface ITestimonial {
    name: string
    avatarInitial?: string
    rating: number
    text: string
    trip: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
}

const testimonialSchema = new Schema<ITestimonial>(
    {
        name: { type: String, required: true, trim: true },
        avatarInitial: { type: String, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
        text: { type: String, required: true, trim: true, minlength: 250, maxlength: 400 },
        trip: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export const TestimonialModel = model<ITestimonial>("testimonial", testimonialSchema)
