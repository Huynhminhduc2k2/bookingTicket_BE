import { model, Schema, Types } from "mongoose";
import { paymentGateway, paymentMethod, paymentStatus } from "src/constant/payment";

export interface IPayment {
  bookingInfo: {
    bookingId: any;
    depaturePlace: string;
    arrival_place: string;
    departure_time: Date;
    arrival_time: Date;
  };
  user?: any;
  paymentMethod: string;
  paymentGateway: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    bookingInfo: { type: Object, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, enum: paymentMethod, required: true, default: null },
    paymentGateway: { type: String, enum: paymentGateway, required: true, default: null },
    transactionId: { type: String, required: true, default: null },
    amount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: paymentStatus, required: true, default: paymentStatus.PENDING },
  },
  { timestamps: true },
);

const Payment = model<IPayment>("Payment", paymentSchema);

export default Payment;
