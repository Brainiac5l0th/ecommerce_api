/*
 *
 *
 ------->Title: Auth Route
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/13/2023
 *
 *
 */

// Dependencies
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { login } = require("../controllers/authController");

// Model Scaffolding
const authRouter = express.Router();

// Model Structure
authRouter.post("/", login);

// Export Model
module.exports = authRouter;
