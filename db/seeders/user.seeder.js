import { Seeder } from 'mongoose-data-seed';
import User from '../../dist/models/user.model';
const data = require('./mocks/user/user.json');

class UsersSeeder extends Seeder {
  async shouldRun() {
    const count = await User.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return User.create(data);
  }
}
  
export default UsersSeeder;