import express from "express";
import {
  createBill,
  deleteBill,
  getUserBill,
  updateBill,
  getBillInforByID,
} from "../../controllers/bill.controller";
import auth from "../../middlewares/auth";

const billRoute = express.Router();

billRoute.get("/",
    auth("bill"),
    getUserBill
);

billRoute.get("/:id",
    auth("bill"),
    getBillInforByID
);

billRoute.post(
  "/create",
    auth("bill"),
  createBill,
);

billRoute.delete("/:id",
auth("bill"),
deleteBill);

billRoute.patch(
  "/:id",
  auth("bill"),
  updateBill,
);


export default billRoute;
