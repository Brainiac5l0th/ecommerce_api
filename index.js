/*
 *
 *
 ------->Title: index.js 
 ->Description: this is the index file of the api
 ------>Author: Shawon Talukder
 -------->Date: 04/28/2023
 *
 *
 */

// Dependencies
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

//internal dependencies
const connectDB = require("./config/configDB");
const errorHandler = require("./middlewares/errorHandler");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");

//environment file configuration
dotenv.config();
const PORT = process.env.PORT || 5005;
connectDB();

// Model Scaffolding
const app = express();

// Configuration
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

//routes
app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);

//404 handler
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found!");
  }
});

//error middleware
app.use(errorHandler);

//check if mongoDB connection is successful
mongoose.connection.once("open", () => {
  console.log("Database connection successful!");
  //run the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("Could not connect to the database", err);
});
