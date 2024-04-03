import jwt from "jsonwebtoken";
import moment from "moment";
import ApiError from "../utils/ApiError";
import config from "src/config/config";
import httpStatus from "http-status";
import { getUserByEmail } from "./user.service";
import Token from "../models/token.model";
import { tokenTypes } from "../config/tokens";
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, type, expires = null, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    type,
    expires,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessToken = generateToken(user._id, tokenTypes.ACCESS);
  await saveToken(accessToken, user._id, tokenTypes.ACCESS,);
  return accessToken;
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes",
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD,
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    tokenTypes.RESET_PASSWORD,
    expires,
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes",
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL,
  );
  await saveToken(verifyEmailToken, user.id, tokenTypes.VERIFY_EMAIL, expires);
  return verifyEmailToken;
};

const removeToken = async (user) => {
  const res = await Token.findOneAndDelete({ user: user.id });
  return res;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  removeToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
