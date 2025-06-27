import { Types } from "mongoose";
export interface Address {
  _id: Types.ObjectId;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string; // hashed
  phone: string;
  address: Address[];
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  thumbnail: string;
  images: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
  priceAtAddTime: number;
}
export interface ICart {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: CartItem[];
  updatedAt: Date;
}
export interface OrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}
export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed";
  paymentMethod: "COD" | "UPI" | "Credit Card" | "Net Banking";
  deliveryStatus: "INPROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: ShippingAddress;
  orderedAt: Date;
}
