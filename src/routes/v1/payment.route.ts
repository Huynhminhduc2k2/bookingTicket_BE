import express from "express";
import {
  createPayment,
  deletePayment,
  getUserPayment,
  updatePayment,
  getPaymentInforByID,
} from "../../controllers/payment.controller";
import auth from "../../middlewares/auth";

const paymentRoute = express.Router();

paymentRoute.get("/",
    auth("payment"),
    getUserPayment
);

paymentRoute.get("/:id",
    auth("payment"),
    getPaymentInforByID
);

paymentRoute.post(
  "/create",
    auth("payment"),
  createPayment,
);

paymentRoute.delete("/:id",
auth("payment"),
deletePayment);

paymentRoute.patch(
  "/:id",
  auth("payment"),
  updatePayment,
);


export default paymentRoute;
