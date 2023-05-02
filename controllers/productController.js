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

// Model Scaffolding
const productController = {};

// Model Structure
// get all products
productController.getProducts = (req, res) => {
  res.status(200).json({ message: "I will send All Products" });
};

// get single product by its id
productController.getProduct = (req, res) => {
  res
    .status(200)
    .json({ message: `I will send single Product for ${req.params.id}` });
};

// create a product
productController.createProduct = (req, res) => {
  res.status(200).json({ message: `I will create a Product` });
};

// update a product
productController.updateProduct = (req, res) => {
  res.status(200).json({ message: `I will update a Product ${req.params.id}` });
};

// update a product
productController.deleteProduct = (req, res) => {
  res.status(200).json({ message: `I will delete a Product ${req.params.id}` });
};

// Export Model
module.exports = productController;
