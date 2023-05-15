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
const { login, logOut, refresh } = require("../controllers/authController");

// Model Scaffolding
const authRouter = express.Router();

// Model Structure
// POST - login
authRouter.post("/login", login);

// get - refresh
authRouter.get("/refresh", refresh);

// POST - logout
authRouter.post("/logout", logOut);

// Export Model
module.exports = authRouter;
