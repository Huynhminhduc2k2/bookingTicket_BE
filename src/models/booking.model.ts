import { model, Schema } from "mongoose";

export interface IBooking {
  tripName: string;
  route: string;
  departureTime: Date;
  arrivalTime: Date;
  availableSeats: number;
  seats: {
    seatNumber: number;
    seatType: string;
    seatStatus: string;
    price: number;
  }[];
  totalPrice: number;
  policy: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    tripName: { type: String, required: true },
    route: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    seats: {
      type: [{
        seatNumber: { type: Number, required: true },
        seatType: { type: String, required: true },
        seatStatus: { type: String, required: true },
        price: { type: Number, required: true },
      }], required: true
    },
    totalPrice: { type: Number, required: true },
    policy: { type: String, required: true },
  },
  { timestamps: true },
);

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
