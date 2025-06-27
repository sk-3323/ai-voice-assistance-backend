import { Request, Response } from "express";
import { OrderModel } from "../model/order.model";
import { UserModel } from "../model/user.model";
import { StatusCodes } from "http-status-codes";
export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    let { mobile } = req.body;
    let finalMobile;
    if (!mobile.startsWith("+")) {
      const added = "+91";
      finalMobile = added + " " + mobile;
    } else {
      finalMobile = mobile;
    }

    // const aggreagat = await OrderModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "users",
    //       as: "userDetail",
    //       localField: "userId",
    //       foreignField: "_id",
    //     },
    //   },
    //   {
    //     $match: {
    //       "userDetail.phone": finalMobile,
    //     },
    //   },
    // ]);
    // console.log(aggreagat, "agg");
    const userExistWithPhone = await UserModel.findOne({
      phone: finalMobile,
    });
    if (!userExistWithPhone) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found", success: false });
      return;
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
    // const ordersForUsers = await OrderModel.findOne({
    //   userId: userExistWithPhone._id,
    // })
    //   .populate("items.productId")
    //   .lean();
    res.status(StatusCodes.OK).json({
      message: "Orders Details",
      success: true,
      result: { user: userExistWithPhone, orders: ordersForUsers },
    });
  } catch (error) {
    console.log(error, "error while getOrderDetails");
  }
};
