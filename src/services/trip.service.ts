import Trip from "../models/trip.model";

/**
 * Create a Trip
 * @param {Object} userBody
 * @returns {Promise<Trip>}
 */

/**
 * Get Trip by route
 * @param {Object} reqRoute
 * @returns {Promise<Trip>}
 */

const getTripByRoute = async (reqRoute) => {
  const { route, departureTime } = reqRoute; // Expected input format: '2024-05-01'

  const query = { route, departureTime };

  if (departureTime) {
    const startOfDay = new Date(departureTime); // Start of the specified date
    const endOfDay = new Date(startOfDay);          // Duplicate date object

    // Adjust endOfDay to represent the very end of the specified date
    endOfDay.setDate(endOfDay.getDate() + 1);      // Move to the next day
    endOfDay.setMilliseconds(-1);                  // Set to the very end of the previous day

    query.departureTime = {
      $gte: startOfDay, // Greater than or equal to the start of the specified day
      $lt: endOfDay,    // Less than the start of the following day
    };
  }

  return await Trip.find(query).lean();
};


const getAllTrips = async () => {
  return Trip.find();
};

export { getAllTrips, getTripByRoute };
