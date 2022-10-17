// third party import
const jwt = require('jsonwebtoken');

// import utils (helper functions)
const AppError = require('../utils/appError');

// import config information
const clientSecret = require("../config/clientSecret.config");

// export middleware
module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    // return error 
    return next(
      new AppError(`Not Unauthorized.`, 401)
    );
  } // end if
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, clientSecret.key);
  } catch (err) {
    // return error 
    return next(
      new AppError(`${err}`, 500)
    );
  } // end catch
  if (!decodedToken) {
    // return error 
    return next(
      new AppError(`Not Unauthorized`, 401)
    );
  } // end if
  req.userId = decodedToken.userId;
  next();
};
