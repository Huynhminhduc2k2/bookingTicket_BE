import * as httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { getAllTrips, getTripByRoute } from "../services/trip.service";

const publicLog = catchAsync(async (req, res) => {
  const listTrip = await getAllTrips();
  res.status(httpStatus.OK).send({message:'listTrip', listTrip});
});

const publicSearchTrip = catchAsync(async (req, res) => {
  const routeTrip = await getTripByRoute(req.body);
  // console.log(routeTrip);
  res.status(httpStatus.OK).send({message:'routeTrip', routeTrip});
});

export {publicLog, publicSearchTrip};
