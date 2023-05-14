/*
 *
 *
 ------->Title: 
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/14/2023
 *
 *
 */

// Dependencies
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Model Scaffolding
const authController = {};

// Model Structure

// user login
authController.login = async (req, res) => {
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

    //email check
    const email =
      req.body?.email?.length > 0 && typeof req.body.email === "string"
        ? req.body.email
        : false;

    //check if any field is missing
    if ((phone || email) && password) {
      //check if user exists with email or phone
      const userFound = await User.findOne({ $or: [{ email }, { phone }] });
      if (userFound && userFound._id) {
        //check if the database password and user given password same
        const isValidPassword = await bcrypt.compare(
          password,
          userFound.password
        );
        if (isValidPassword) {
          //generate a token

          //access token
          const accessToken = jwt.sign(
            {
              phone: userFound.phone,
              role: userFound.role || "User",
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );

          //refresh token
          const refreshToken = jwt.sign(
            { phone: userFound.phone },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
          );

          //set refresh token to the *secure* cookie
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          //send the access token
          return res.status(200).json({ token: accessToken });
        } else {
          return res
            .status(401)
            .json({ message: "Login Failed! Please try again." });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Login Failed! Please try again." });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid Phone, Email or password!" });
    }
  } catch (error) {
    res.status(500).json({ message: "There is a server side error!" });
  }
};
// Export Model
module.exports = authController;
