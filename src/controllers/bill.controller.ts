import * as httpStatus from "http-status";
import Bill from "../models/bill.model";
import { IUser } from "../models/user.model";
import {
  deleteBillbyId,
  getBillById,
  getUserBills,
  saveBill,
  updateBillInforById,
} from "../services/bill.service";
import catchAsync from "../utils/catchAsync";

const createBill = catchAsync(async (req, res) => {
  const {slug, booking, branch, payment } = req.body;

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
  await saveBill(billPayload);

  // Sending the response
  res.status(httpStatus.OK).send({ message: "Bill created successfully"});

});


const getUserBill = catchAsync(async (req, res) => {
  const user = req.user;
  const bills = await getUserBills(user._id);
  res.status(httpStatus.OK).send({ message: "success", bills });
});

const deleteBill = catchAsync(async (req, res) => {
  const billId = req.params.id;

  const user = req.user;

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
      return res
        .status(httpStatus.OK)
        .send({ message: "Bill deleted successfully" });
    }
  }
});

const updateBill = catchAsync(async (req, res) => {
  const billId = req.params.id;

  const {slug, booking, branch, payment } = req.body;

  const user = req.user;
  
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
      await updateBillInforById(billId, billPayload);
      res.status(httpStatus.OK).send({ message: "Bill updated successfully" });
    }
  }
});

const getBillInforByID = catchAsync(async (req, res) => {
  const billId = req.params.id;

  if (!billId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "bill id is required" });
    }

    const bill = await getBillById(billId);
    const user = req.user;

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
          return res.status(httpStatus.OK).send({ message: "success", bill });
  }
}
});
  

export {
  createBill,
  deleteBill,
  getUserBill,
  updateBill,
  getBillInforByID
};
