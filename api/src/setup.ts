import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@rasla/logify";
import { APP_CONSTANTS } from "constant";
import { BaseRouter } from "controllers/routes";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { TestimonialModel } from "./models/testimonial.model";

const URL = APP_CONSTANTS.DB_URL

try {
    await mongoose.connect(URL as string, {
        dbName: "Udyam",
        maxConnecting: 10,
    });
    console.log("Connected to Database");
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
