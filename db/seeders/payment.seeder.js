import { Seeder } from 'mongoose-data-seed';
import Payment from '../../dist/models/payment.model';
import Trip from '../../dist/models/trip.model';
import Booking from '../../dist/models/booking.model';
import { paymentMethod, paymentGateway, paymentStatus } from '../../dist/constant/payment';
const eligibleStatuses = ['COMPLETED', 'WAITING_PAYMENT', 'CANCELLED'];
class PaymentsSeeder extends Seeder {
  async beforeRun() {
    const bookings = await Booking.find({ status: { $in: eligibleStatuses } }).populate('user trip').exec();
    const paymentPromises = bookings.map(async booking => {
      const trip = await Trip.findById(booking.trip.id).exec();
      return this._generatePayment(booking, trip);
    });
    this.payments = await Promise.all(paymentPromises);
  }
  async shouldRun() {
    const count = await Payment.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return Payment.create(this.payments);
  }
  _getRandomPaymentMethod() {
    const methods = Object.values(paymentMethod);
    const randomIndex = Math.floor(Math.random() * methods.length);
    return methods[randomIndex];
  }

  _getRandomPaymentGateway(method) {
    const GATEWAYS = Object.values(paymentGateway);
    const ATM_GATEWAYS = [paymentGateway.ATM_DOMESTIC, paymentGateway.ATM_INTERNATIONAL];
    const E_WALLET_GATEWAYS = [paymentGateway.MOMO, paymentGateway.ZALO_PAY, paymentGateway.SHOPEE_PAY, paymentGateway.VN_PAY, paymentGateway.FUTA_PAY];
    switch (method) {
      case paymentMethod.ATM:
        return ATM_GATEWAYS[Math.floor(Math.random() * ATM_GATEWAYS.length)];
      case paymentMethod.E_WALLET:
        return E_WALLET_GATEWAYS[Math.floor(Math.random() * E_WALLET_GATEWAYS.length)];
      default:
        return GATEWAYS[Math.floor(Math.random() * paymentGateway.length)];
    }
  }
  _getRandomCancelledStatus() {
    const cancelledStatuses = [paymentStatus.CANCELLED, paymentStatus.FAILED, paymentStatus.REFUNDED, paymentStatus.EXPIRED];
    const randomIndex = Math.floor(Math.random() * cancelledStatuses.length);
    return cancelledStatuses[randomIndex];
}
  _getPaymentStatus(bookingStatus) {
    switch (bookingStatus) {
      case 'COMPLETED':
        return paymentStatus.PAID;
      case 'WAITING_PAYMENT':
        return paymentStatus.PENDING;
      case 'CANCELLED':
        return this._getRandomCancelledStatus();
      default:
        return paymentStatus.PENDING;
    }
  }
  _generateTransactionId() {
    const timestamp = Date.now().toString(36); // Convert timestamp to a base-36 string
    const randomString = Math.random().toString(36).substring(2, 15); // Create a random string
    return `TXN-${timestamp}-${randomString}`;
  }
  _generatePayment(booking, trip) {
    const method = this._getRandomPaymentMethod();
    return {
      bookingInfo: {
        bookingId: booking._id,
        depaturePlace: trip.tripName.split(' to ')[0],
        arrivalPlace: trip.tripName.split(' to ')[1],
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
      },
      user: {
        id: booking.user.id,
        email: booking.user.email,
        name: booking.user.name,
        phone: booking.user.phone,
      },
      paymentMethod: method,
      paymentGateway: this._getRandomPaymentGateway(method),
      transactionId: this._generateTransactionId(),
      amount: booking.totalPrice,
      status: this._getPaymentStatus(booking.status),
    };
  }
}
  
export default PaymentsSeeder;