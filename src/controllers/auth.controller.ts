import * as httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { createUser, getUserByPhone, isOTPMatch } from "../services/user.service";
import { generateAuthTokens, removeToken } from "../services/token.service";

const register = catchAsync(async (req, res) => {
  const user = await createUser(req.body);
  const token = await generateAuthTokens(user);

  res
    .status(httpStatus.OK)
    .send({ message: "user created successfully", user, token });
});

const login = catchAsync(async (req, res) => {
  const { phone, password } = req.body;

  const user = await getUserByPhone(phone);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: "Invalid credentials",
    });
  }

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: "Invalid credentials",
    });
  }

  const token = await generateAuthTokens(user);
  res.status(httpStatus.OK).send({ message: "login successful", user, token });
});

const logout = catchAsync(async (req, res) => {
  const user = req.user;
  await removeToken(user);
  res.status(httpStatus.OK).send({
    message: "logout successful",
    status: true,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { phone, otp } = req.body;
  const user = await getUserByPhone(phone);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: "Không tìm thấy số điện thoại này",
    });
  }

  const ok = await isOTPMatch(phone, otp);
  if (!ok) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "Mã OTP không đúng",
    });
  }

  const token = await generateAuthTokens(user);
  res.status(httpStatus.OK).send({ message: "login successful", user, token });
});

export { register, login, logout, verifyOTP };
