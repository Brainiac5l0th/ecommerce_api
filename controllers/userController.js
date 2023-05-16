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
    //check if logged in user is admin
    if (req.loggedInUser?.role !== "Admin") {
      return res.status(401).json({ message: "Unauthorized!" });
    }
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
      //find for user in the database
      const result = await User.findOne({ _id: userId }).select("-password");

      if (result?.phone) {
        //admin or user himself can check details
        if (
          req.loggedInUser?.role === "Admin" ||
          req.loggedInUser?.phone === result?.phone
        ) {
          return res.status(200).json({ message: "Success!", data: result });
        } else {
          return res.status(401).json({ message: "Unauthorized!" });
        }
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
      //duplicate check by phone or email
      const duplicateUser = await User.findOne({ $or: [{ phone }, { email }] });
      if (duplicateUser) {
        //if phone exists send response about conflict
        if (phone && email) {
          //if user give both email and phone
          return res
            .status(409)
            .json({ message: "Phone Number Or Email address already exists!" });
        } else {
          //phone is must, so user has to provide.
          return res
            .status(409)
            .json({ message: "Phone Number already exists!" });
        }
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
      //unauthorized if there is no user id
      return res.status(400).json({ message: "Bad request! Try again later." });
    }
    //continue updating if user id is valid
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

    if (phone || password || role || email || address || fullName) {
      //duplicate check by phone
      const user = await User.findOne({ _id: userId });
      if (!user) {
        //if phone exists send response about conflict
        return res.status(400).json({ message: "Invalid request! Try again" });
      }
      //authorization check
      //admin has no rights to update user information
      if (req.loggedInUser?.phone !== user?.phone) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
      if (phone && phone !== user?.phone) {
        //send response : 400 if user given phone does not match database phone
        return res.status(400).json({ message: "Phone can not be changed!" });
      }
      if (password) {
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10); //salt round = 10
        user.password = hashedPassword;
      }
      //update value for it's key
      if (role) user.role = role;
      if (email) {
        //check if email already exists in the database.
        const duplicateEmail = await User.findOne({ email });
        if (duplicateEmail) {
          return res.status(409).json({ message: "Invalid Request!" });
        } else {
          user.email = email;
        }
      }
      if (address) user.address = address;
      if (fullName) user.fullName = fullName;

      const updatedUser = await user.save();
      if (updatedUser) {
        //if updated value saved into database
        return res.status(200).json({ message: "User updated Successfully!" });
      } else {
        //if updated value could not be saved into database
        return res
          .status(400)
          .json({ message: "Could not update user! Try again later" });
      }
    } else {
      return res.status(400).json({ message: "At least one field required!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is a server side error occured!" });
  }
};

// delete a user
userController.deleteUser = async (req, res) => {
  try {
    //check the user id is valid
    const userId =
      req.params?.id &&
      req.params.id?.toString()?.length === 24 &&
      mongoose.Types.ObjectId.isValid(req.params?.id)
        ? req.params?.id
        : false;

    if (!userId) {
      //if user id is not valid
      return res
        .status(403)
        .json({ message: "Authentication failure! Try again later." });
    }

    //find user by it's id
    const user = await User.find({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: "Valid id required!" });
    }
    // check authentication
    if (
      req.loggedInUser?.role !== "Admin" &&
      req.loggedInUser?.phone !== user?.phone
    ) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    //continue deleting if userId valid
    const result = await User.findOneAndDelete({ _id: userId });
    if (!result) {
      return res
        .status(400)
        .json({ message: "Could not remove the user from the database." });
    }
    // @TODO: delete all orders aganist this id
    //give response if successful
    return res.status(200).json({
      message: `User Deleted Successfully!`,
    });
  } catch (error) {
    return res.status(500).json({ message: "There is a server side error!" });
  }
};

// Export Model
module.exports = userController;
