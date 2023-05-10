/*
 *
 *
 ------->Title: User Model
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/09/2023
 *
 *
 */

// Dependencies
const mongoose = require("mongoose");

//schema
const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    email: {
      type: String,
    },
    fullName: {
      type: String,
    },
    address: {
      type: String,
    },
    orders: {
      type: Array,
      ref: "Order",
    },
  },
  { timestamps: true }
);

// Model Structure
const User = new mongoose.model("User", userSchema);

// Export Model
module.exports = User;
