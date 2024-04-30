import express from "express";
import {
  createBill,
  deleteBill,
//   getUserFeed,
  getUserBill,
//   handleTweetLikeStatus,
  updateBill,
} from "../../controllers/bill.controller";
import auth from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import * as tweetValidations from "../../validations/tweet.validation";
const billRoute = express.Router();

billRoute.get("/",
    auth("bill"),
    getUserBill
);

billRoute.post(
  "/create",
    auth("bill"),
//   [auth("tweet"), validate(tweetValidations.createTweet)],
  createBill,
);

billRoute.delete("/:id",
auth("bill"),
deleteBill);

billRoute.patch(
  "/:id",
  auth("bill"),
//   [auth("tweet"), validate(tweetValidations.tweetUpdate)],
  updateBill,
);


export default billRoute;
