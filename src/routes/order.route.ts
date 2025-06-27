import { Router } from "express";
import { getOrderDetails } from "../controller/order.controller";
const OrderRouter = Router();
OrderRouter.post("/", getOrderDetails);
export default OrderRouter;
