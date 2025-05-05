import Category from "../models/Category.js";
import Product from "../models/Product.js"



// Create a new product
export const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            sizes,
            category,
            images,
            sku,
            stock
        } = req.body;
        
console.log("title:",title,"price:",price,"category:",category)
        // Check for required fields
        if (!title || !price || !category) {
            return res.status(400).json({ error: "Title, price, and category are required." });
        }

const findingCategory = await Category.findOne({name:category})
        const newProduct = new Product({
            title,
            description,
            price,
            sizes,
            category:findingCategory._id,
            images,
            sku,
            stock
        });
console.log("NEW PRODUCT:",newProduct);

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};


export const createCategory = async(req, res)=>{
    try {
const {
name,
description
        } = req.body

        console.log("name:", name, "description:", description);
        if(!name || !description){
            return res.status(400).json({error:"name and description are required"})
        }
        const isExisted = Category.findOne({
            name:name
        })
if(isExisted){
    return res.status(400).json({error:"category already existed"})
}

const category = new Category({
    name,
    description
})
await category.save()
res.status(200).json({msg:"category successfully created"})

    } catch (error) {
        console.log("error in createCategory:", error)
        res.status(500).json({ error: "Failed to create Category" });
    }
}

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products || "khali hai ");
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};
