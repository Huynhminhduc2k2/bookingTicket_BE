import { Seeder } from 'mongoose-data-seed';
import Trip from '../../dist/models/trip.model';
const data = require('./mocks/trip/trip.json');

class TripsSeeder extends Seeder {
  async shouldRun() {
    const count = await Trip.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return Trip.create(data);
  }
}
  
export default TripsSeeder;