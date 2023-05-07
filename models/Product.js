/*
 *
 *
 ------->Title: Product Model
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/04/2023
 *
 *
 */

// Dependencies
const mongoose = require("mongoose");

//schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    images: {
      type: Array,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    qna: [
      {
        type: mongoose.Types.ObjectId,
        ref: "QnA",
      },
    ],
  },
  { timestamps: true }
);

// Model Structure
const Product = new mongoose.model("Product", productSchema);

// Export Model
module.exports = Product;
