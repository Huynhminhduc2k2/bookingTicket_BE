import ApiError from "../utils/ApiError";

import passport from "passport";
import httpStatus from "http-status";

import { roleRights } from "../config/roles";

const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"),
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight),
      );
      console.log("AAAAAA")
      console.log(user)
      console.log(user.role)
      console.log(userRights)
      console.log(hasRequiredRights)


      if (!hasRequiredRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights) =>
    async (req, res, next) => {
      return new Promise((resolve, reject) => {
        passport.authenticate(
          "jwt",
          { session: false },
          verifyCallback(req, resolve, reject, requiredRights),
        )(req, res, next);
      })
        .then(() => next())
        .catch((err) => next(err));
    };

export default auth;
