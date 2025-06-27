import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "../types/model.types";

const addressSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
  },
  label: {
    type: String,
  },
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: String,
  },
  country: {
    type: String,
  },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    address: {
      type: [addressSchema],
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "customer",
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("user", userSchema);
