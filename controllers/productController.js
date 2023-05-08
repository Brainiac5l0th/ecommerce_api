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
const mongoose = require("mongoose");
const Product = require("../models/Product");

// Model Scaffolding
const productController = {};

// Model Structure
// get all products
productController.getProducts = async (req, res) => {
  try {
    const result = await Product.find().select("-__v -reviews -qna").exec();
    if (result?.length === 0) {
      return res.status(204).json({ message: "No Product Found!" });
    } else if (result?.length > 0) {
      return res.status(200).json({ data: result });
    } else {
      return res.status(500).json({ message: "Server side error!!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server side error!" });
  }
};

// get single product by it's id
productController.getProduct = async (req, res) => {
  try {
    //check the product id is valid
    const productId =
      req.params?.id &&
      req.params.id?.toString()?.length === 24 &&
      mongoose.Types.ObjectId.isValid(req.params?.id)
        ? req.params?.id
        : false;

    if (productId) {
      //find for the product details
      const result = await Product.find({ _id: productId });
      if (result) {
        return res.status(200).json({ message: "Success!", data: result });
      } else {
        return res
          .status(404)
          .json({ message: "Invalid Product Id.No product found!" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Bad Request!Invalid Product id." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server side error!" });
  }
};

// create a product
productController.createProduct = async (req, res) => {
  try {
    //double check all inputs from the frontend
    //title
    const title =
      req.body?.title?.length > 0 && typeof req.body?.title === "string"
        ? req.body?.title
        : false;

    //description
    const description =
      req.body?.description?.length > 0 &&
      typeof req.body?.description === "string"
        ? req.body?.description
        : false;

    //check category
    const category =
      req.body?.category?.length > 0 && typeof req.body?.category === "string"
        ? req.body?.category
        : false;

    //price check
    const price =
      req.body?.price?.length > 0 && typeof req.body?.price === "string"
        ? req.body?.price
        : false;

    //inStock check
    const inStock =
      req.body?.inStock && typeof req.body?.inStock === "boolean"
        ? req.body?.inStock
        : false;

    //images check
    const images =
      req.body?.images?.length > 0 && req.body?.images instanceof Object
        ? req.body?.images
        : false;

    if (title && description && price && category && images) {
      //if all fields are there then proceed
      //check if there is a product with same title, price and category
      const duplicateCheck = await Product.find({
        $and: [
          { title: new RegExp("\\b" + title + "\\b", "i") },
          { price: Number(price) },
          { category: new RegExp("\\b" + category + "\\b", "i") },
        ],
      });
      if (duplicateCheck?.length > 0) {
        //if product exists with same category, price and title return conflict
        return res
          .status(409)
          .json({ message: "There is another product with same details." });
      } else {
        //continue saving the product
        let newProduct;
        if (inStock) {
          newProduct = await Product.create({
            title,
            description,
            category,
            price: Number(price),
            inStock,
            images,
          });
        } else {
          newProduct = await Product.create({
            title,
            description,
            category,
            price: Number(price),
            images,
          });
        }
        if (newProduct) {
          return res.status(201).json({
            message: "Product Created Successfully!",
          });
        } else {
          return res.status(400).json({ message: "Invalid Product Data!" });
        }
      }
    } else {
      return res.status(400).json({ message: "All fields Required!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "There is a server side error!" });
  }
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
