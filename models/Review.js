/*
 *
 *
 ------->Title: Review Model
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/17/2023
 *
 *
 */

// Dependencies
const mongoose = require("mongoose");

//schema
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: string,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  { timestamps: true }
);

// Model Structure
const Review = new mongoose.model("Review", reviewSchema);

// Export Model
module.exports = Review;
