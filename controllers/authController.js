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
            { expiresIn: "1m" }
          );

          //refresh token
          const refreshToken = jwt.sign(
            { phone: userFound.phone },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: "15m" }
          );

          //set refresh token to the *secure* cookie
          res.cookie(process.env.COOKIE_NAME, refreshToken, {
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

//refresh token generator
authController.refresh = async (req, res) => {
  try {
    //get cookies from the request
    const cookies = Object.keys(req.cookies)?.length > 0 ? req.cookies : null;
    if (cookies && !cookies[process.env.COOKIE_NAME]) {
      return res
        .status(401)
        .json({ message: "Authentication Failure! Please log in" });
    }
    //else generate access token again
    const refreshToken = cookies[process.env.COOKIE_NAME];

    //verify the refresh token from cookie
    const decodedData = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    //check if there is no phone data against the jwt
    if (!decodedData?.phone) {
      return res
        .status(401)
        .json({ message: "Authentication Failure! Please log in" });
    }

    //find the user in the database
    const user = await User.findOne({ phone: decodedData.phone });
    if (!user) {
      //send 403: if no user exists
      return res
        .status(401)
        .json({ message: "Authentication Failure! Please log in" });
    }

    //if user is in the database, generate access token again
    const accessToken = jwt.sign(
      {
        phone: user.phone,
        role: user.role || "User",
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    res.status(200).json({ token: accessToken });
  } catch (error) {
    res.status(500).json({ message: "There is a server side error!" });
  }
};

//log out the user
authController.logOut = async (req, res) => {
  try {
    //get cookies from the request
    const cookies = Object.keys(req.cookies)?.length > 0 ? req.cookies : null;
    if (cookies && !cookies[process.env.COOKIE_NAME]) {
      return res.status(204).json({ message: "No cookie!" });
    }
    //if there is cookie, clear this
    res.clearCookie(process.env.COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    //send response
    res.status(200).json({ message: "Cookie Cleared!" });
  } catch (error) {
    res.status(500).json({ message: "There is a server side error!" });
  }
};
// Export Model
module.exports = authController;
