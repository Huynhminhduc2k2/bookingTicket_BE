import * as httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { getAllTrips, getTripByRoute, searchTrip } from "../services/trip.service";
import { ITrip } from "src/models/trip.model";
import { Types } from "mongoose";

const publicLog = catchAsync(async (req, res) => {
  const listTrip = await getAllTrips();
  res.status(httpStatus.OK).send({ message: 'listTrip', listTrip });
});

const publicSearchTrip = catchAsync(async (req, res) => {
  const hits = await searchTrip(req.body.route, req.body.departureTime, req.body.ticketNumber);

  if (hits.length != 0) {
    const listTrip = hits.map((hit) => {
      const trip: ITrip = hit._source as ITrip;
      return {
        _id: new Types.ObjectId(hit._id),
        tripName: trip.tripName,
        route: trip.route,
        departureTime: new Date(trip.departureTime),
        arrivalTime: new Date(trip.arrivalTime),
        availableSeats: trip.availableSeats,
        seats: trip.seats,
        vehicle: trip.vehicle,
        totalPrice: trip.totalPrice,
        policy: trip.policy,
        createdAt: new Date(trip.createdAt),
        updatedAt: new Date(trip.updatedAt),
      };
    });
    console.log(listTrip);
    return res.status(httpStatus.OK).send({ message: 'routeTrip', routeTrip: listTrip });
  }
  const routeTrip = await getTripByRoute(req.body);
  console.log(routeTrip);
  res.status(httpStatus.OK).send({ message: 'routeTrip', routeTrip });
});

export { publicLog, publicSearchTrip };
