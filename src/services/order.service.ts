import { OrderModel } from "../model/order.model";
import { UserModel } from "../model/user.model";

export const getOrderDetail = async (mobile) => {
  try {
    let finalMobile;
    if (!mobile.startsWith("+")) {
      const added = "+91";
      finalMobile = added + " " + mobile;
    } else {
      finalMobile = mobile;
    }
    const userExistWithPhone = await UserModel.findOne({
      phone: finalMobile,
    });
    if (!userExistWithPhone) {
      return { message: "User not found", success: false };
    }
    const ordersForUsers = await OrderModel.aggregate([
      { $match: { userId: userExistWithPhone._id } },
      {
        $lookup: {
          as: "ProductDetails",
          from: "products",
          foreignField: "_id",
          localField: "items.productId",
        },
      },
    ]);
    return {
      message: "Orders Details",
      success: true,
      result: { user: userExistWithPhone, orders: ordersForUsers },
    };
  } catch (error) {
    console.log(error, "error while getOrderDetails");
  }
};

export const getAllOrders = async () => {
  try {
    const result = await OrderModel.find();
    return {
      message: "Orders Details",
      success: true,
      result,
    };
  } catch (error) {
    console.log(error);
  }
};
