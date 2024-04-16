import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TripsSeeder, UsersSeeder, BookingsSeeder, PaymentsSeeder } from './db/seeders';
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
  TripsSeeder,
  BookingsSeeder,
  PaymentsSeeder,
  // BillsSeeder,
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
