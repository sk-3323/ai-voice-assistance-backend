import { cartModel } from "../model/cart.model";
import { UserModel } from "../model/user.model";

export const getCartDetail = async (mobile: string) => {
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
    const cartItems = await cartModel.aggregate([
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
      message: "Cart Details",
      success: true,
      result: { user: userExistWithPhone, orders: cartItems },
    };
  } catch (error) {
    console.log(error, "error while getCartDetail");
  }
};
