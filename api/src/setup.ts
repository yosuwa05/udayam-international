import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@rasla/logify";
import { APP_CONSTANTS } from "constant";
import { BaseRouter } from "controllers/routes";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { TestimonialModel } from "./models/testimonial.model";

const URL = APP_CONSTANTS.DB_URL

const seedTestimonials = async () => {
    try {
        const count = await TestimonialModel.countDocuments()
        if (count === 0) {
            await TestimonialModel.create([
                {
                    name: "Priya Menon",
                    avatarInitial: "P",
                    rating: 5,
                    text: "The Rajasthan heritage tour was absolutely magical and exceeded all of our expectations. Every detail was meticulously taken care of by Udayam — the heritage hotels were beautiful, the transport was highly comfortable, and the local guides were incredibly knowledgeable. Udayam made our travel experience feel completely effortless, organized, and truly royal!",
                    trip: "Rajasthan Heritage Tour · 2025",
                    isActive: true,
                },
                {
                    name: "Arjun & Sneha Pillai",
                    avatarInitial: "A",
                    rating: 5,
                    text: "Our Maldives honeymoon was beyond our wild dreams. The water villa, sunset dinners, snorkelling sessions, and spa arrangements — every single moment was perfect. The team at Udayam coordinated everything seamlessly from arrival to departure. We highly recommend their premium services for anyone planning a stress-free travel getaway!",
                    trip: "Maldives Honeymoon · 2025",
                    isActive: true,
                },
                {
                    name: "Rajesh Krishnamurthy",
                    avatarInitial: "R",
                    rating: 5,
                    text: "Switzerland with the family was the best travel decision we made. The Jungfraujoch train ride, scenic lake tours, and resort stays were fantastic. The Udayam team handled our visa processing and travel itinerary arrangements with total professionalism and care. Truly world-class service that we will definitely use again!",
                    trip: "Swiss Alps Family Tour · 2025",
                    isActive: true,
                },
            ])
            console.log("Seeded initial testimonials successfully")
        }
    } catch (err) {
        console.error("Failed to seed initial testimonials", err)
    }
}

try {
    await mongoose.connect(URL as string, {
        dbName: "Udyam",
        maxConnecting: 10,
    });
    console.log("Connected to Database");
    await seedTestimonials();
} catch (e) {
    console.log(e);
}


const app = new Elysia();
const isProd = process.env.ENV === 'PROD';
app.use(cors());

app.use(
    swagger({
        // path: isProd ? "/docs" : "/api/docs",
        path: "/docs",
        exclude: ["/docs", "/docs/json"],
        theme: "dark",
        documentation: {
            servers: [
                {
                    url: "http://localhost:4000/"
                },
            ],
            info: {
                title: "Udyam API",
                version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        scheme: "bearer",
                        type: "http",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
    })
);


app.use(
    logger({
        level: "info",
        format:
            "[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms{ip}",
    })
);

app.use(BaseRouter);

app.onError(({ code, error }) => {
    if (code === "VALIDATION") {
        return {
            status: 400,
            body: error.all,
        };
    }
});

export { app };
