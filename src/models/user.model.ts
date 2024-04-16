import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { toJSON, paginate } from "./plugins";
import { roles } from "../config/roles";
// import { UNAVAILABLE_FOR_LEGAL_REASONS } from "http-status";

export interface IUser extends Document {
  email: string;
  phone: string;
  name?: string;
  password: string;
  address: {
    address: string;
    address_name: string;
  };
  job?: string;
  dob?: Date;
  avatar?: string;
  role: string;
  isPasswordMatch: (password: string) => Promise<boolean>;
}

interface UserModel extends Model<IUser> {
  isEmailTaken: (email: string, excludeUserId?: string) => Promise<boolean>;
  isPhoneTaken: (phone: string, excludeUserId?: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      private: true, // used by the toJSON plugin
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate(value: string) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Invalid phone number");
        }
      }
    },
    address: {
      address: {
        type: String,
        required: false,
        trim: true,
      },
      address_name: {
        type: String,
        required: false,
        trim: true,
      },
    },
    job: {
      type: String,
      required: false,
      trim: true,
    },
    dob: {
      type: Date,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (
  email: string,
  excludeUserId?: string,
) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isPhoneTaken = async function (
  phone: string,
  excludeUserId?: string,
) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this as IUser;
  return bcrypt.compare(password, user.password);
};

userSchema.pre<IUser>("save", async function (next) {
  const user = this as IUser;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
