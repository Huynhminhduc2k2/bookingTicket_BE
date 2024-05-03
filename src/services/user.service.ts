import * as httpStatus from "http-status";
import OTP from "../models/otp.model";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import otpGenerator from "otp-generator";

const sendOTP = async (phone) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  console.log("OTP sent: " + otp);
  try {
    await OTP.create({ phone, code: otp, expiredAt: Date.now() + 5 * 60 * 1000, status: "PENDING" });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const isOTPMatch = async (phone, otp) => {
  const otpDoc = await OTP.findOne({ phone, code: otp, status: "PENDING" });
  if (otpDoc) {
    otpDoc.status = "USED";
    await otpDoc.save();
    return true;
  }
  return false;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createUser = async (userBody) => {
  if (await User.isPhoneTaken(userBody.phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Số điện thoại đã được đăng ký");
  }
  const usr = await User.create(userBody);
  if (sendOTP(usr.phone)) {
    console.log("OTP Sent");
  }
  return usr.toObject();
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).lean();
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByPhone = async (phone) => {
  return User.findOne({ phone });
};

const getUserByAddress = async (address) => {
  return User.findOne({ address }).lean();
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await User.findByIdAndUpdate(userId, updateBody, {
    new: true,
  }).lean();

  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await User.deleteOne({ _id: userId });
  return "user deleted successfully";
};

const searchUsersByName = async (keyword, page, perPage) => {
  return await User.find({ userName: { $regex: keyword, $options: "i" } })
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

export {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByAddress,
  searchUsersByName,
  getUserByPhone,
  isOTPMatch,
};
