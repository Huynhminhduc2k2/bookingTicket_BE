import * as httpStatus from "http-status";
import Trip from "../models/trip.model";
import ApiError from "../utils/ApiError";

/**
 * Create a Trip
 * @param {Object} userBody
 * @returns {Promise<Trip>}
 */

/**
 * Get Trip by id
 * @param {ObjectId} id
 * @returns {Promise<Trip>}
 */
const getTripById = async (id) => {
  return Trip.findById(id).lean();
};

const getAllTrips = async()=>{
    return Trip.find();
}

export {getAllTrips};
