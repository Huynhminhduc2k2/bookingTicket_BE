import * as httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { getAllTrips } from "../services/trip.service";

const publicLog = catchAsync(async (req, res) => {
  const listTrip = await getAllTrips();
  res.status(httpStatus.OK).send({message:'listTrip', listTrip});
});

export {publicLog};
