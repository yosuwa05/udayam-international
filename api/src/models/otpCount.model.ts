import { Schema, model } from "mongoose";

interface IOtpCount {
    month: number;
    year: number;
    count: number;
}

const otpCountSchema = new Schema<IOtpCount>({
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    count: { type: Number, default: 0 },
}, { timestamps: true });

otpCountSchema.index({ month: 1, year: 1 }, { unique: true });

export const OtpCountModel = model<IOtpCount>("otpcount", otpCountSchema);
