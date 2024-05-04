import { model, Schema, Document } from "mongoose";

export interface IOTP extends Document {
    phone: string;
    code: string;
    expiredAt: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const otpSchema = new Schema<IOTP>(
    {
        phone: { type: String, required: true },
        code: { type: String, required: true },
        expiredAt: { type: Date, required: true },
        status: { type: String, required: true },
    },
    { timestamps: true },
);

const OTP = model<IOTP>("OTP", otpSchema);

export default OTP;