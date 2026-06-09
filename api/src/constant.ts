import dotenv from "dotenv";

const envFileMap: Record<string, string> = {
    localdev: ".env.localdev",
    dev: ".env.dev",
    prod: ".env.prod",
};

const mode = process.env.NODE_ENV ?? "localdev";

// Clear all env vars except NODE_ENV
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
    ENV: process.env.ENV,
    GOLD_RATE_TOPIC: process.env.GOLD_RATE_TOPIC,
    SILVER_RATE_TOPIC: process.env.SILVER_RATE_TOPIC,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    REGION: process.env.REGION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    REFER_AND_EARN_LINK: process.env.REFER_AND_EARN_LINK,
    PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
    PHONEPE_SALT_KEY: process.env.PHONEPE_SALT_KEY,
    PHONEPE_SALT_INDEX: process.env.PHONEPE_SALT_INDEX,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    BASE_URL: process.env.BASE_URL
}

console.log(APP_CONSTANTS, 'APP_CONSTANTS')
console.log(JSON.stringify(APP_CONSTANTS), 'APP_CONSTANTS')