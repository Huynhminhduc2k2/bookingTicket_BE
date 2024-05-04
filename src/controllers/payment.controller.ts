import * as httpStatus from "http-status";
import { IUser } from "../models/user.model";
import {
  deletePaymentbyId,
  getPaymentById,
  getUserPayments,
  savePayment,
  updatePaymentInforById,
} from "../services/payment.service";
import catchAsync from "../utils/catchAsync";

const createPayment = catchAsync(async (req, res) => {

  const { user, body }: { user: IUser; body: any } = req;

  const {
    bookingInfo,
    paymentMethod,
    paymentGateway,
    transactionId,
    amount,
    status,
  } = body;

  // Creating the payment payload
  const paymentPayload = {
    bookingInfo,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    },
    paymentMethod,
    paymentGateway,
    transactionId,
    amount,
    status: status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Creating the payment document
  await savePayment(paymentPayload);

  // Sending the response
  res.status(httpStatus.OK).send({ message: "Payment created successfully" });

});


const getUserPayment = catchAsync(async (req, res) => {
  const user = req.user;
  const payments = await getUserPayments(user._id);
  res.status(httpStatus.OK).send({ message: "success", payments });
});

const deletePayment = catchAsync(async (req, res) => {
  const paymentId = req.params.id;

  const user = req.user;

  if (!paymentId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "payment id is required" });
  }

  const payment = await getPaymentById(paymentId);

  if (!payment) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "Payment not found" });
  } else {
    if (payment.user.id.toString() !== user._id.toString()) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    }

    else {
      await deletePaymentbyId(paymentId);
      return res
        .status(httpStatus.OK)
        .send({ message: "Payment deleted successfully" });
    }
  }
});

const updatePayment = catchAsync(async (req, res) => {
  const paymentId = req.params.id;

  const { user, body }: { user: IUser; body: any } = req;

  const {
    bookingInfo,
    paymentMethod,
    paymentGateway,
    transactionId,
    amount,
    status,
  } = body;


  if (!paymentId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "payment id is required" });
  }

  const payment = await getPaymentById(paymentId);

  if (!payment) {
    res.status(httpStatus.NOT_FOUND).send({ message: "Payment not found" });
  } else {

    // Creating the payment payload
    const paymentPayload = {
      bookingInfo,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      paymentMethod,
      paymentGateway,
      transactionId,
      amount,
      status: status,
      createdAt: payment.createdAt,
      updatedAt: new Date(),
    };

    if (payment.user.id.toString() !== user._id.toString()) {
      res.status(httpStatus.UNAUTHORIZED).send({ message: "Unauthorized" });
    }
    else {
      await updatePaymentInforById(paymentId, paymentPayload);
      res.status(httpStatus.OK).send({ message: "Payment updated successfully" });
    }
  }
});

const getPaymentInforByID = catchAsync(async (req, res) => {
  const paymentId = req.params.id;

  if (!paymentId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "payment id is required" });
  }

  const payment = await getPaymentById(paymentId);
  const user = req.user;

  if (!payment) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "payment not found" });
  } else {
    if (payment.user.id.toString() !== user._id.toString()) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    }
    else {
      return res.status(httpStatus.OK).send({ message: "success", payment });
    }
  }
});


export {
  createPayment,
  deletePayment,
  getUserPayment,
  updatePayment,
  getPaymentInforByID,
};
