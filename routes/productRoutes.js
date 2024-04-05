import express from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getProducts).post(addProduct).put(updateProduct);

router.route("/:id").get(getProduct).delete(deleteProduct);

export default router;
