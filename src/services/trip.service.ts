import Trip from "../models/trip.model";
import elastic from "../config/elastic";
import config from "../config/config";
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

const searchTrip = async (route, departureTime, ticketNumber = 1) => {
  try {
    const results = await elastic.search({
      index: config.elastic.index,
      body: {
        query: {
          bool: {
            must: [
              { match: { route } },
              { match: { departureTime } },
              { range: { availableSeats: { gte: ticketNumber } } },
            ],
            should: [
              { match: { route } },
              { match: { departureTime } },
              { range: { availableSeats: { gte: ticketNumber } } },
            ],
            minimum_should_match: 1
          },
        }
      }
    });
    return results.hits.hits;

  } catch (error) {
    console.error('Error while searching:', error);
    throw error;
  }
};

export { getAllTrips, getTripByRoute, searchTrip };
