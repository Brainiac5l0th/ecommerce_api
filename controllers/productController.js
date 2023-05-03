/*
 *
 *
 ------->Title: 
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: MM/DD/2023
 *
 *
 */

// Dependencies
const Product = require("../models/Product");

// Model Scaffolding
const productController = {};

// Model Structure
// get all products
productController.getProducts = async (req, res) => {
  try {
    const result = await Product.find();
    if (result) {
      return res.status(200).json({ data: result });
    } else {
      return res.status(500).json({ message: "Server side error!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server side error!" });
  }
  res.status(200).json({ message: "I will send All Products" });
};

// get single product by it's id
productController.getProduct = async (req, res) => {
  res
    .status(200)
    .json({ message: `I will send single Product for ${req.params.id}` });
};

// create a product
productController.createProduct = async (req, res) => {
  res.status(200).json({ message: `I will create a Product` });
};

// update a product
productController.updateProduct = async (req, res) => {
  res.status(200).json({ message: `I will update a Product ${req.params.id}` });
};

// delete a product
productController.deleteProduct = async (req, res) => {
  res.status(200).json({ message: `I will delete a Product ${req.params.id}` });
};

// Export Model
module.exports = productController;
