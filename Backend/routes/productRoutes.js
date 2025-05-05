import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createCategory
} from "../controllers/productController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Create a new product
router.post("/", createProduct);

router.post('/category', createCategory)

// Get all products
router.get("/",  getAllProducts);

// Get product by ID
router.get("/:id", getProductById);

// Update product by ID
router.put("/:id",  updateProduct);

// Delete product by ID
router.delete("/:id", deleteProduct);



export default router;
