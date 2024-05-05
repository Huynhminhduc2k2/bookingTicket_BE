import ApiError from "../utils/ApiError";
import Ticket, { IBooking } from "../models/booking.model";
import Trip, { ITrip } from "../models/trip.model";
import httpStatus from "http-status";
import { bookingStatus } from "../constant/booking";
import { seatStatus } from "../constant/trip";
import redis from "../config/redis";
import elastic from "../config/elastic";
import config from "../config/config";

const getTicketById = async (id: string) => {
  return await Ticket.findById(id);
};

const getUserTickets = async (userId: string) => {
  return await Ticket.find({ "user.id": userId }).sort({ createdAt: -1 });
};

const createTicket = async (ticket: IBooking) => {
  let newTicket;
  let trip;
  try {
    // Lấy thông tin chuyến xe từ database
    trip = await Trip.findById(ticket.trip.id);

    // Kiểm tra nếu chuyến xe không tồn tại
    if (!trip) {
      throw new ApiError(httpStatus.NOT_FOUND, "Chuyến xe không tồn tại");
    }
    // Kiểm tra số lượng ghế được chọn
    if (ticket.trip.seats.length < 1 || ticket.trip.seats.length > 5) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Số lượng ghế không hợp lệ");
    }

    // Kiểm tra tính hợp lệ của từng ghế
    for (const seat of ticket.trip.seats) {
      const selectedSeat = trip.seats.find(
        (s) => s.seatNumber === seat
      );

      // Kiểm tra nếu ghế không tồn tại hoặc không có sẵn
      if (!selectedSeat || selectedSeat.seatStatus !== seatStatus.AVAILABLE) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Ghế không hợp lệ");
      }
      // Cập nhật trạng thái của ghế đã chọn
      selectedSeat.seatStatus = seatStatus.BOOKED;
    }
    // Lưu thay đổi vào chuyến xe
    await trip.save();
    await updateTripInforInSearchEngine(trip);
    // Tạo vé mới
    newTicket = await Ticket.create(ticket);
    ticket.status = bookingStatus.WAITING_PAYMENT;
    await newTicket.save();
    const sessionId = `ticket:${newTicket._id}`;
    // Lưu thông tin vé vào cache trong 1 phút
    await redis.setex(sessionId, JSON.stringify(newTicket), 60);
    return newTicket;
  } catch (error) {
    // Nếu có lỗi xảy ra khi tạo vé, phải đảm bảo rằng ghế được cập nhật trở lại trạng thái "available"
    if (newTicket) {
      // Xóa vé đã tạo nếu có
      await Ticket.findByIdAndDelete(newTicket._id);
      // Đặt lại trạng thái của từng ghế đã chọn thành "available"
      for (const seat of ticket.trip.seats) {
        const selectedSeat = trip.seats.find(
          (s) => s.seatNumber === seat
        );
        if (selectedSeat) {
          selectedSeat.seatStatus = seatStatus.AVAILABLE;
        }
      }
      await trip.save();
      await updateTripInforInSearchEngine(trip);
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const cancelExpiredTickets = async () => {
  try {
    const sessionId = `ticket:*`;
    const keys = await redis.keys(sessionId);
    if (keys.length > 0) {
      // Xóa tất cả các vé khỏi Redisq
      for (const key of keys) {
        await redis.del(key);
        const ticketId = key.split(":")[1];
        // Xóa vé khỏi MongoDB
        await cancelTicket(ticketId);
      }
      return;
    }

    // Tìm tất cả các vé được tạo trước 1 phút
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const expiredTickets = await Ticket.find({ createdAt: { $lte: oneMinuteAgo } });

    // Hủy bất kỳ vé nào đã hết hạn
    for (const ticket of expiredTickets) {
      await cancelTicket(ticket._id);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const cancelTicket = async (ticketId) => {
  try {
    // Xóa vé khỏi Redis
    const sessionId = `ticket:${ticketId}`;
    await redis.del(sessionId);
    // Xóa vé khỏi MongoDB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new ApiError(httpStatus.NOT_FOUND, "Vé không tồn tại");
    }
    // Đặt lại trạng thái của từng ghế đã chọn thành "available"
    const trip = await Trip.findById(ticket.trip.id);
    for (const seat of ticket.trip.seats) {
      const selectedSeat = trip.seats.find(
        (s) => s.seatNumber === seat
      );
      if (selectedSeat) {
        selectedSeat.seatStatus = "available";
      }
    }
    await trip.save();
    await updateTripInforInSearchEngine(trip);
    await Ticket.findByIdAndUpdate(ticketId, { status: bookingStatus.CANCELLED });
  } catch (error) {
    throw new Error(error);
  }
};

const updateTripInforInSearchEngine = async (trip: ITrip) => {
  await elastic.update({
    index: config.elastic.index,
    id: trip._id.toString(),
    body: {
      doc: {
        seats: trip.seats,
      },
    },

  });
};

export {
  getTicketById,
  getUserTickets,
  createTicket,
  cancelExpiredTickets
};
