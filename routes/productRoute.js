/*
 *
 *
 ------->Title: 
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/03/2023
 *
 *
 */

// Dependencies
const express = require("express");
const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Model Scaffolding
const productRouter = express.Router();

// Model Structure
// GET - all products
productRouter.get("/", getProducts);

// GET - single product
productRouter.get("/:id", getProduct);

// POST - a product
productRouter.post("/", createProduct);

// PATCH - a product
productRouter.patch("/:id", updateProduct);

// DELETE - a product
productRouter.delete("/:id", deleteProduct);

// Export Model
module.exports = productRouter;
