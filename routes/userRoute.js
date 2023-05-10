/*
 *
 *
 ------->Title: User Route
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/09/2023
 *
 *
 */

// Dependencies
const express = require("express");
const {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} = require("../controllers/userController");
// Model Scaffolding
const userRouter = express.Router();

// Model Structure
// GET - all users
userRouter.get("/", getUsers);

// GET - a user
userRouter.get("/:id", getUser);

// POST - a user
userRouter.post("/", createUser);

// PATCH - a user
userRouter.patch("/:id", updateUser);

// DELETE - a user
userRouter.delete("/:id", deleteUser);

// Export Model
module.exports = userRouter;
