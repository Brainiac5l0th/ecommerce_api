/*
 *
 *
 ------->Title: error handler
 ->Description: this is to handle error for the api.
 ------>Author: Shawon Talukder
 -------->Date: 05/03/2023
 *
 *
 */

//dependencies

//model scaffolding
const errorHandler = (req, res, next, err) => {
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status).json({ message: err.message, isError: true });
};

//export model
module.exports = errorHandler;
