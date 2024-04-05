import { model, Schema, Types } from "mongoose";
import { paymentMethod, paymentStatus } from "../constant/payment";

export interface IBill {
  slug: string;
  booking: {
    bookingId: any;
    route: string;
    price: string;
    seat: Date;
    user_id?: any;
    user: {
      name: string;
      email: string;
      phone: string;
    }
    startDate: Date;
  };
  branch: {
    branchName: string;
    phone: string;
    branchAddress: string;
    taxCode: string;
  };
  payment: {
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: Date;
    paymentAmount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const billSchema = new Schema<IBill>(
  {
    slug: { type: String, required: true, unique: true },
    booking: {
      bookingId: { type: Types.ObjectId, ref: "Booking", required: true },
      route: { type: String, required: true },
      price: { type: String, required: true },
      seat: { type: Date, required: true },
      user_id: { type: Types.ObjectId, ref: "User", required: true },
      user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
      },
      startDate: { type: Date, required: true },
    },
    branch: { type: Object, required: true },
    payment: {
      paymentMethod: { type: String, enum: paymentMethod, required: true, default: null },
      paymentStatus: { type: String, enum: paymentStatus, default: null },
      paymentDate: { type: Date, required: true, default: null },
      paymentAmount: { type: Number, required: true, default: 0 },
    },
  },
  { timestamps: true },
);

const Bill = model<IBill>("Bill", billSchema);

export default Bill;
