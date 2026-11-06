import { CouponModel } from "@models/coupon.model";
import { CronJob } from "cron";

const couponExpiryJob = new CronJob(
    "0 30 1 * * *", // every day at 1:30 AM (server time)
    // "*/15 * * * * *", // for testing
    // "*/30 * * * * *",
    async () => {
        try {
            console.log("Coupon expiry job started");

            const now = new Date(); // ← Use pure UTC. Do NOT add +5:30

            const result = await CouponModel.updateMany(
                {
                    status: "ACTIVE",
                    isDeleted: false,
                    validTo: { $lte: now } // expired
                },
                {
                    $set: {
                        status: "INACTIVE",
                        updatedAt: new Date()
                    }
                }
            );

            console.log(`Coupon expiry job completed. ${result.modifiedCount} coupons set to INACTIVE.`);
        } catch (error) {
            console.error("Error in couponExpiryJob:", error);
        }
    }
);

export { couponExpiryJob }