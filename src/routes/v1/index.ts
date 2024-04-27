import config from "../../config/config";
import authRoute from "./auth.route";
import publicRoute from "./public.route";
import tweetRoute from "./tweet.route";


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
