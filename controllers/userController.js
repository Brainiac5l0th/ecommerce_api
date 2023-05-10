/*
 *
 *
 ------->Title: 
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/10/2023
 *
 *
 */

// Dependencies
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Model Scaffolding
const userController = {};

// Model Structure
// get all users
userController.getUsers = async (req, res) => {
  try {
    //@TODO: check if logged in user is admin or not
    // if (loggedInUser?.role === "admin") {
    //only admin can access all users data
    const result = await User.find().select("-password");
    if (result?.length === 0) {
      return res.status(204).json({ message: "No Users Found!" });
    } else if (result?.length > 0) {
      return res.status(200).json({ message: "Success!", data: result });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid Request!Try Again later." });
    }
    // } else {
    //   return res.status(403).json({ message: "Authorized Route! Forbidden" });
    // }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is a server side error occured!" });
  }
};

// get single user by it's id
userController.getUser = async (req, res) => {
  try {
    //check the user id is valid
    const userId =
      req.params?.id &&
      req.params.id?.toString()?.length === 24 &&
      mongoose.Types.ObjectId.isValid(req.params?.id)
        ? req.params?.id
        : false;

    if (userId) {
      const result = await User.findOne({ _id: userId }).select("-password");
      if (result) {
        return res.status(200).json({ message: "Success!", data: result });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong! Server Error" });
      }
    } else {
      return res.status(400).json({ message: "Bad request! Check " });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is a server side error occured!" });
  }
};

// create a user
userController.createUser = async (req, res) => {
  try {
    //phone check
    const phone =
      req.body?.phone?.length === 11 && typeof req.body.phone === "string"
        ? req.body.phone
        : false;

    //password check
    const password =
      req.body?.password?.length > 0 && typeof req.body.password === "string"
        ? req.body.password
        : false;

    //role check
    const role =
      req.body?.role?.length > 0 && typeof req.body.role === "string"
        ? req.body.role
        : false;

    //email check
    const email =
      req.body?.email?.length > 0 && typeof req.body.email === "string"
        ? req.body.email
        : false;

    //address check
    const address =
      req.body?.address?.length > 0 && typeof req.body.address === "string"
        ? req.body.address
        : false;

    //fullName check
    const fullName =
      req.body?.fullName?.length > 0 && typeof req.body.fullName === "string"
        ? req.body.fullName
        : false;

    if (phone && password) {
      //duplicate check by phone
      const duplicateUser = await User.findOne({ phone });
      if (duplicateUser?.phone) {
        //if phone exists send response about conflict
        return res
          .status(409)
          .json({ message: "Phone Number already exists!" });
      } else {
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10); //salt round = 10
        //make object to save into USER model
        let userObject = {
          phone,
          password: hashedPassword,
        };
        if (role) userObject = { ...userObject, role };
        if (email) userObject = { ...userObject, email };
        if (address) userObject = { ...userObject, address };
        if (fullName) userObject = { ...userObject, fullName };

        const newUser = await User.create(userObject);

        if (newUser) {
          return res
            .status(201)
            .json({ message: "User created Successfully!" });
        } else {
          return res
            .status(400)
            .json({ message: "Could not create user! Try again later" });
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "Both Phone and Password required!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is a server side error occured!" });
  }
};

// update a user
userController.updateUser = async (req, res) => {
  try {
    //check the user id is valid
    const userId =
      req.params?.id &&
      req.params.id?.toString()?.length === 24 &&
      mongoose.Types.ObjectId.isValid(req.params?.id)
        ? req.params?.id
        : false;
    if (!userId) {
    } else {
      //phone check
      const phone =
        req.body?.phone?.length === 11 && typeof req.body.phone === "string"
          ? req.body.phone
          : false;

      //password check
      const password =
        req.body?.password?.length > 0 && typeof req.body.password === "string"
          ? req.body.password
          : false;

      //role check
      const role =
        req.body?.role?.length > 0 && typeof req.body.role === "string"
          ? req.body.role
          : false;

      //email check
      const email =
        req.body?.email?.length > 0 && typeof req.body.email === "string"
          ? req.body.email
          : false;

      //address check
      const address =
        req.body?.address?.length > 0 && typeof req.body.address === "string"
          ? req.body.address
          : false;

      //fullName check
      const fullName =
        req.body?.fullName?.length > 0 && typeof req.body.fullName === "string"
          ? req.body.fullName
          : false;

      if (phone && password) {
        //duplicate check by phone
        const duplicateUser = await User.findOne({ phone });
        if (duplicateUser?.phone) {
          //if phone exists send response about conflict
          return res
            .status(409)
            .json({ message: "Phone Number already exists!" });
        } else {
          //hash the password
          const hashedPassword = await bcrypt.hash(password, 10); //salt round = 10
          //make object to save into USER model
          let userObject = {
            phone,
            password: hashedPassword,
          };
          if (role) userObject = { ...userObject, role };
          if (email) userObject = { ...userObject, email };
          if (address) userObject = { ...userObject, address };
          if (fullName) userObject = { ...userObject, fullName };

          const newUser = await User.create(userObject);

          if (newUser) {
            return res
              .status(201)
              .json({ message: "User created Successfully!" });
          } else {
            return res
              .status(400)
              .json({ message: "Could not create user! Try again later" });
          }
        }
      } else {
        return res
          .status(400)
          .json({ message: "Both Phone and Password required!" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is a server side error occured!" });
  }
};

// delete a user
userController.deleteUser = async (req, res) => {
  res.status(200).json({ message: "I will delete user" });
};

// Export Model
module.exports = userController;
