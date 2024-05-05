import { model, Schema, Types } from "mongoose";
import { bookingStatus } from "../constant/booking";

export interface IBooking {
  user: {
    id?: string;
    email: string;
    name: string;
    phone: string;
  },
  trip: {
    id: any;
    seats: number[];
  };
  totalPrice: number;
  status?: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      id: { type: Types.ObjectId, ref: "User", required: false },
      email: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    trip: {
      id: { type: Types.ObjectId, ref: "Trip", required: true },
      seats: { type: [Number], required: true },
    },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: bookingStatus, required: true, default: bookingStatus.CREATED },
  },
  { timestamps: true },
);

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
