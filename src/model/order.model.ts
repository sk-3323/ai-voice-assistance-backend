import mongoose, { Schema } from "mongoose";
import { IOrder } from "../types/model.types";

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "product" },
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: Number,
    paymentStatus: { type: String, enum: ["paid", "pending", "failed"] },
    paymentMethod: { type: String, enum: ["CASH", "CARD", "UPI"] },
    deliveryStatus: {
      type: String,
      enum: ["INPROGRESS", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "INPROGRESS",
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    orderedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>("order", OrderSchema);
