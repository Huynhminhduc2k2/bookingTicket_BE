import { model, Schema, Types } from "mongoose";
import { paymentGateway, paymentMethod, paymentStatus } from "../constant/payment";

export interface IPayment {
  bookingInfo: {
    bookingId: any;
    depaturePlace: string;
    arrivalPlace: string;
    departureTime: Date;
    arrivalTime: Date;
  };
  user: {
    id?: any;
    email: string;
    name: string;
    phone: string;
  };
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
    bookingInfo: {
      bookingId: { type: Types.ObjectId, ref: "Booking", required: true },
      depaturePlace: { type: String, required: true },
      arrivalPlace: { type: String, required: true },
      departureTime: { type: Date, required: true },
      arrivalTime: { type: Date, required: true },
    },
    user: {
      id: { type: Types.ObjectId, ref: "User", required: false },
      email: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },

    },
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
