import { Request, Response } from "express";
import { productModel } from "../model/product.model";
import { UserModel } from "../model/user.model";
import { OrderModel } from "../model/order.model";
type productPayloadType = {
  mobile: string;
  productId: string;
  quantity: number;
  paymentMethod: string;
  price: number;
};
export const getAllProducts = async () => {
  try {
    const products = await productModel.find();
    console.log(products);

    return products;
  } catch (error) {
    console.log(error, "error while getAllProducts");
  }
};
export const purchaseProduct = async (data: productPayloadType) => {
  try {
    let finalMobile;
    if (!data?.mobile?.startsWith("+")) {
      const added = "+91";
      finalMobile = added + " " + data?.mobile;
    } else {
      finalMobile = data?.mobile;
    }
    const userExistWithPhone = await UserModel.findOne({
      phone: finalMobile,
    });
    if (!userExistWithPhone) {
      return { message: "User not found", success: false };
    }
    const userId = userExistWithPhone._id;

    const items = [
      { productId: data.productId, quantity: data.quantity, price: data.price },
    ];
    const totalAmount = data.quantity * data.price;
    let paymentMethod = data.paymentMethod;
    let paymentStatus = paymentMethod === "CASH" ? "pending" : "paid";
    const shippingAddress = userExistWithPhone.address[0];
    const orderData = {
      userId,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      shippingAddress,
    };
    const res = await OrderModel.create(orderData);
    return { success: true, message: "Order Successfully", orderId: res._id };
  } catch (error) {
    console.log("errror in purchse product", error);
  }
};
