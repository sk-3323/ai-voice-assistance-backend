import { Router } from "express";
import { getProducts } from "../controller/product.controller";
const ProductRouter = Router();
ProductRouter.get("/", getProducts);
export default ProductRouter;
