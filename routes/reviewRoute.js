/*
 *
 *
 ------->Title: Auth Route
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/17/2023
 *
 *
 */

// Dependencies
const express = require("express");

// Model Scaffolding
const reviewRouter = express.Router();

// Model Structure

//GET review
reviewRouter.get("/", getReview);

//GET review by product id
reviewRouter.get("/product/:id", getProductReview);

//POST - Review
reviewRouter.post("/", createReview);

// Export Model
module.exports = reviewRouter;
