import { Seeder } from 'mongoose-data-seed';
import Booking from '../../dist/models/booking.model';
const data = require('./mocks/booking/booking.json');

class BookingsSeeder extends Seeder {
  async shouldRun() {
    const count = await Booking.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return Booking.create(data);
  }
}
  
export default BookingsSeeder;