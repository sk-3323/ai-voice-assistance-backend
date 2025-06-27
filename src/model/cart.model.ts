import mongoose, { Types } from "mongoose";
import { CartItem, ICart } from "../types/model.types";
const cartItemSchema = new mongoose.Schema<CartItem>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  quantity: { type: Number },
  priceAtAddTime: { type: Number },
});
const cartSchema = new mongoose.Schema<ICart>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  items: {
    type: [cartItemSchema],
  },
  updatedAt: {
    type: "Date",
    default: Date.now(),
  },
});

export const cartModel = mongoose.model("cart", cartSchema);
