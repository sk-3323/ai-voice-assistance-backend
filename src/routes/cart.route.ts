import { Router } from "express";
import { getMyCartDetails } from "../controller/cart.controller";
const CartRouter = Router();
CartRouter.get("/", getMyCartDetails);
export default CartRouter;
