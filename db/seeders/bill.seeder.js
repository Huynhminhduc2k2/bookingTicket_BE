import { Seeder } from 'mongoose-data-seed';
import Bill from '../../dist/models/bill.model';
import Payment from '../../dist/models/payment.model';
import Trip from '../../dist/models/trip.model';

class BillsSeeder extends Seeder {
  async shouldRun() {
    const count = await Bill.countDocuments().exec();

    return count === 0;
  }

  async run() {
    const eligiblePayments = await Payment.find({
      status: { $in: ['PAID', 'REFUNDED'] }
    }).populate('bookingInfo.bookingId');

    const bills = eligiblePayments.map(async payment => {
      const trip = await Trip.findById(payment.bookingInfo.bookingId.trip.id).exec();
      return this._generateBills(payment, trip);
    });
    return Bill.create(await Promise.all(bills));
  }
  _generateBills(payment, trip) {
    const booking = payment.bookingInfo.bookingId;
    const branch = {
      branchName: "Main Branch",
      phone: "123-456-7890",
      branchAddress: "123 Main St, Anytown, USA",
      taxCode: "ABC123456"
    };

    return {
      slug: this._generateSlug(),
      booking: {
        bookingId: booking._id,
        route: trip.route,
        price: booking.totalPrice,
        userId: booking.user.id,
        user: {
          name: booking.user.name,
          email: booking.user.email,
          phone: booking.user.phone,
        },
        startDate: trip.departureTime,
      },
      branch: branch,
      payment: {
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.status,
        paymentDate: payment.createdAt, // Assuming payment date is the creation date of the payment record
        paymentAmount: payment.amount,
      },
    };
  }
  _generateSlug() {
    // Generates a unique slug
    return `BILL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
  
export default BillsSeeder;