import { Seeder } from 'mongoose-data-seed';
import Payment from '../../dist/models/payment.model';
import User from '../../dist/models/user.model';
import Booking from '../../dist/models/booking.model';

const data = require('./mocks/payment/payment.json');

class PaymentsSeeder extends Seeder {
  async beforeRun() {
    this.users = await User.find({}).exec();
    this.bookings = await Booking.find({}).exec();
  }
  async shouldRun() {
    const count = await Payment.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return Payment.create(data);
  }
  _generatePayment() {
    return Array.apply(null, Array(10)).map(() => {
      
    });
  }
}
  
export default PaymentsSeeder;