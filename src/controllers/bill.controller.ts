import * as httpStatus from "http-status";
import {
  deleteBillbyId,
  getBillById,
  getUserBills,
  saveBill,
  updateBillInforById,
} from "../services/bill.service";
import catchAsync from "../utils/catchAsync";
import redis from "../config/redis";

const createBill = catchAsync(async (req, res) => {
  const { slug, booking, branch, payment } = req.body;

  // Creating the bill payload
  const billPayload = {
    slug: slug, // You need to define a function to generate a unique slug
    booking: {
      bookingId: booking.bookingId,
      route: booking.route,
      price: booking.price,
      userId: booking.userId,
      user: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
      startDate: booking.startDate,
    },
    branch: branch,
    payment: {
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      paymentDate: payment.paymentDate,
      paymentAmount: payment.paymentAmount,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Creating the bill document
  const newBill = await saveBill(billPayload);
  const sessionID = `bill:${newBill.booking.userId}:${newBill._id}`;
  await redis.set(sessionID, JSON.stringify(newBill), "EX", 60);
  // Sending the response
  res.status(httpStatus.OK).send({ message: "Bill created successfully", bill: newBill });

});


const getUserBill = catchAsync(async (req, res) => {
  const user = req.user;
  const sessionID = "bills:" + user._id;
  const cachedBills = await redis.get(sessionID, async (err, data) => {
    if (err) {
      console.error(err);
    }
    return data;
  });

  if (cachedBills) {
    return res.status(httpStatus.OK).send({ message: "success", bills: JSON.parse(cachedBills) });
  }

  const bills = await getUserBills(user._id);
  await redis.set(sessionID, JSON.stringify(bills), "EX", 60);

  res.status(httpStatus.OK).send({ message: "success", bills });
});

const deleteBill = catchAsync(async (req, res) => {
  const billId = req.params.id;

  const user = req.user;
  const sessionID = `bill:${user._id}:${billId}`;
  if (!billId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "bill id is required" });
  }

  const bill = await getBillById(billId);

  if (!bill) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "bill not found" });
  } else {
    if (bill.booking.userId.toString() !== user._id.toString()) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    }

    else {
      await deleteBillbyId(billId);
      await redis.del(sessionID);
      return res
        .status(httpStatus.OK)
        .send({ message: "Bill deleted successfully" });
    }
  }
});

const updateBill = catchAsync(async (req, res) => {
  const billId = req.params.id;

  const { slug, booking, branch, payment } = req.body;

  const user = req.user;

  const sessionID = `bill:${user._id}:${billId}`;
  await redis.del(sessionID);

  const billsSessionID = "bills:" + user._id;
  await redis.del(billsSessionID);

  if (!billId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "bill id is required" });
  }

  const bill = await getBillById(billId);

  if (!bill) {
    res.status(httpStatus.NOT_FOUND).send({ message: "Bill not found" });
  } else {

    const billPayload = {
      slug: slug, // You need to define a function to generate a unique slug
      booking: {
        bookingId: booking.bookingId,
        route: booking.route,
        price: booking.price,
        userId: booking.userId,
        user: {
          name: booking.user.name,
          email: booking.user.email,
          phone: booking.user.phone,
        },
        startDate: booking.startDate,
      },
      branch: branch,
      payment: {
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentStatus,
        paymentDate: payment.paymentDate,
        paymentAmount: payment.paymentAmount,
      },
      createdAt: bill.createdAt,
      updatedAt: new Date(),
    };
    if (bill.booking.userId.toString() !== user._id.toString()) {
      res.status(httpStatus.UNAUTHORIZED).send({ message: "Unauthorized" });
    }
    else {
      const updatedBill = await updateBillInforById(billId, billPayload);
      redis.set(sessionID, JSON.stringify(updatedBill), "EX", 60);
      res.status(httpStatus.OK).send({ message: "Bill updated successfully" });
    }
  }
});

const getBillInforByID = catchAsync(async (req, res) => {
  const billId = req.params.id;
  const user = req.user;

  if (!billId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "bill id is required" });
  }

  const sessionID = `bill:${user._id}:${billId}`;
  const cachedBill = await redis.get(sessionID, async (err, data) => {
    if (err) {
      console.error(err);
    }
    return data;
  });
  if (cachedBill) {
    return res.status(httpStatus.OK).send({ message: "success", bill: JSON.parse(cachedBill) });
  }

  const bill = await getBillById(billId);

  if (!bill) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "bill not found" });
  } else {
    await redis.set(sessionID, JSON.stringify(bill), "EX", 60);
    return res.status(httpStatus.OK).send({ message: "success", bill });
  }
});


export {
  createBill,
  deleteBill,
  getUserBill,
  updateBill,
  getBillInforByID
};
