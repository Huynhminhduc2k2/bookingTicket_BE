import { model, Schema, Document } from "mongoose";
import mongoosastic, { MongoosasticModel, MongoosasticDocument } from 'mongoosastic';
import { seatType } from "../constant/trip";
import { Client } from "@elastic/elasticsearch";
export interface ITrip extends Document, MongoosasticDocument {
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
  vehicle: {
    id: string;
    name: string;
    type: string;
    licensePlate: string;
  };
  totalPrice: number;
  policy: string;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip, MongoosasticModel<ITrip>>(
  {
    tripName: { type: String, required: true },
    route: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    vehicle: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, required: true },
      licensePlate: { type: String, required: true },
    },
    seats: {
      type: [{
        seatNumber: { type: Number, required: true },
        seatType: { type: String, enum: seatType, required: true },
        seatStatus: { type: String, required: true },
        price: { type: Number, required: true },
      }], required: true
    },
    totalPrice: { type: Number, required: true },
    policy: { type: String, required: true },
  },
  { timestamps: true },
);

tripSchema.plugin(mongoosastic, {
  esClient: Client as any,
  index: process.env.ELASTIC_INDEX || "booking_ticket",
});

const Trip = model<ITrip, MongoosasticModel<ITrip>>("Trip", tripSchema);

export default Trip;
