import mongoose from 'mongoose';
import UsersSeeder from './db/seeders/user.seeder';
import dotenv from 'dotenv';
dotenv.config();

const mongoURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/dbname';
console.log('mongoURL', mongoURL);
/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
  UsersSeeder,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
