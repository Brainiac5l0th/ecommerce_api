/*
 *
 *
 ------->Title: 
 ->Description: 
 ------>Author: Shawon Talukder
 -------->Date: 05/15/2023
 *
 *
 */

// Dependencies
const jwt = require("jsonwebtoken");

// Model Scaffolding
const verifyJWT = {};

// Model Structure

//authentication check
verifyJWT.checkLogin = async (req, res, next) => {
  try {
    //get token from headers
    const auth = req.headers.authorization || req.headers.Authorization;

    //check if it is Bearer token
    if (!auth?.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Authentication Failure!" });
    }
    //filter token
    const token = auth.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, data) => {
      if (error || !data) {
        return res.status(403).json({ message: error.message });
      }
      //set jwt data into loggedInUser
      req.loggedInUser = { phone: data.phone, role: data.role || "User" };
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "There is a server side error!" });
  }
};

// Export Model
module.exports = verifyJWT;
