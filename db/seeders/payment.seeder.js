import { Seeder } from 'mongoose-data-seed';
import Payment from '../../dist/models/payment.model';
const data = require('./mocks/payment/payment.json');

class PaymentsSeeder extends Seeder {
  async shouldRun() {
    const count = await Payment.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return Payment.create(data);
  }
}
  
export default PaymentsSeeder;