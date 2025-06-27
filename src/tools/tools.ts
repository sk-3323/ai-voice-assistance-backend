import { tool, DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getAllOrders, getOrderDetail } from "../services/order.service";
import { getCartDetail } from "../services/cart.service";
import { getAllProducts, purchaseProduct } from "../services/product.service";

export const getOrderTool = tool(
  async ({ mobile }: { mobile: string }) => {
    const result = await getOrderDetail(mobile);
    return result;
  },
  {
    name: "order_details",
    description: "get order details from mobile number",
    schema: z.object({
      mobile: z
        .string()
        .describe("mobile number of user for fetch order details"),
    }),
  }
);

export const getCartTool = tool(
  async ({ mobile }: { mobile: string }) => {
    const result = await getCartDetail(mobile);
    return result;
  },
  {
    name: "cart_details",
    description: "get card details from mobile number",
    schema: z.object({
      mobile: z
        .string()
        .describe("mobile number of user for fetch cart details"),
    }),
  }
);

export const getAllOrderTool = tool(
  async () => {
    const res = await getAllOrders();
    return res;
  },
  { name: "get_all_orders", description: "get all orders with details" }
);

export const getAllProductsTool = tool(
  async () => {
    const res = await getAllProducts();
    return res;
  },
  {
    name: "get_all_products",
    description: "get all products with detail or only asked fields",
  }
);

export const buyProduct = tool(
  async ({
    mobile,
    productId,
    price,
    quantity,
    paymentMethod,
  }: {
    mobile: string;
    productId: string;
    price: number;
    quantity: number;
    paymentMethod: string;
  }) => {
    const data = { mobile, productId, quantity, paymentMethod, price };
    const res = await purchaseProduct(data);
    return res;
  },
  {
    name: "buy_product",
    description: "purchase specific product with specific quantity",
  }
);
