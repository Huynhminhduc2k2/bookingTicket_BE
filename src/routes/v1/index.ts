import config from "../../config/config";
import authRoute from "./auth.route";
import publicRoute from "./public.route";
import tweetRoute from "./tweet.route";
import billRoute from "./bill.route";
import paymentRoute from "./payment.route";
import ticketRoute from "./ticket.route";

import express from "express";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/",
    route: publicRoute,
  },
  {
    path: "/tweet",
    route: tweetRoute,
  },
  {
    path: "/bill",
    route: billRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/ticket",
    route: ticketRoute,
  },
];

const devRoutes = [];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route: any) => {
    router.use(route.path, route.route);
  });
}

export default router;
