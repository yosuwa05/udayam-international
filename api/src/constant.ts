import dotenv from "dotenv";

const envFileMap: Record<string, string> = {
    localdev: ".env.dev",
    dev: ".env.dev",
    prod: ".env.prod",
};

const mode = process.env.NODE_ENV ?? "localdev";

const nodeEnv = process.env.NODE_ENV;
for (const key in process.env) {
    if (key !== 'NODE_ENV' && key !== 'PATH') {
        delete process.env[key];
    }
}

dotenv.config({ path: envFileMap[mode] });

export const APP_CONSTANTS = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    PASETO_SECRET_KEY: process.env.PASETO_SECRET_KEY,
    PASETO_ADMIN_SECRET_KEY: process.env.PASETO_ADMIN_SECRET_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    ENV: process.env.ENV,
    REGION: process.env.REGION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
}

console.log(APP_CONSTANTS, 'APP_CONSTANTS')