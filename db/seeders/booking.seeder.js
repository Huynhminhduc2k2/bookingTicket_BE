import { Seeder } from 'mongoose-data-seed';
import Booking from '../../dist/models/booking.model';
import User from '../../dist/models/user.model';
import Trip from '../../dist/models/trip.model';
import { bookingStatus } from '../../dist/constant/booking';
const data = []
class BookingsSeeder extends Seeder {
  async beforeRun() {
    this.users = await User.find({}).exec();
    this.trips = await Trip.find({}).exec();
    this._generateBookings();
  }
  async shouldRun() {
    const count = await Booking.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return Booking.create(data);
  }
  _generateBookings() {
    for (let i = 0; i < 10; i++) {
      const user = this._getRandomUser();
      const trip = this._getRandomTrip();
      const status = this._getRandomStatus();
      const { seats, totalPrice } = this._getRandomSeats(trip);
      const booking = {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
        trip: {
          id: trip._id,
          seats: seats,
        },
        status: status,
        totalPrice: totalPrice,
      };
      data.push(booking);
    }
  }
  _getRandomUser() {
    return this.users[Math.floor(Math.random() * this.users.length)];
  }

  _getRandomTrip() {
    return this.trips[Math.floor(Math.random() * this.trips.length)];
  }
  _getRandomStatus() {
    const statuses = Object.values(bookingStatus);
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
  _getRandomSeats(trip) {
    const seatCount = trip.seats.length;
    const maxSeats = Math.min(5, seatCount);
    const numSeats = Math.floor(Math.random() * maxSeats) + 1;
    const selectedSeats = new Set();

    let totalPrice = 0;
    while (selectedSeats.size < numSeats) {
      const seatIndex = Math.floor(Math.random() * seatCount);
      const seat = trip.seats[seatIndex];
      if (!selectedSeats.has(seat.seatNumber)) {
        selectedSeats.add(seat.seatNumber);
        totalPrice += seat.price;  // Cộng giá tiền ghế vào tổng
      }
    }

    return {
      seats: Array.from(selectedSeats),
      totalPrice: totalPrice,
    };
  }
}
  
export default BookingsSeeder;