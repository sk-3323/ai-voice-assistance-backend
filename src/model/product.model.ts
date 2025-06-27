import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types/model.types";

const productSchema = new Schema<IProduct>(
  {
    _id: {
      type: Schema.Types.ObjectId,
    },
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    category: { type: String },
    brand: { type: String },
    stock: { type: Number },
    thumbnail: { type: String },
    images: { type: [String] },
    rating: { type: Number },
  },
  { timestamps: true }
);

export const productModel = mongoose.model<IProduct>("product", productSchema);
