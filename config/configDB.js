/*
 *
 *
 ------->Title: 
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 01/17/2023
 *
 *
 */
//dependencies
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (err) {
    console.log("mongoDB error:", err);
  }
};

module.exports = connectDB;
