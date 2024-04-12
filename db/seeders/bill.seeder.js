import { Seeder } from 'mongoose-data-seed';
import Bill from '../../dist/models/bill.model';
const data = require('./mocks/bill/bill.json');

class BillsSeeder extends Seeder {
  async shouldRun() {
    const count = await Bill.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return Bill.create(data);
  }
}
  
export default BillsSeeder;