import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Create a new product
router.post("/",protectRoute, createProduct);

// Get all products
router.get("/", protectRoute, getAllProducts);

// Get product by ID
router.get("/:id",protectRoute, getProductById);

// Update product by ID
router.put("/:id", protectRoute, updateProduct);

// Delete product by ID
router.delete("/:id",protectRoute, deleteProduct);

export default router;
