const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

const clientSecret = require("../config/clientSecret.config");

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(
      new AppError(`Not Unauthorized.`, 401)
    );
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, clientSecret.key);
  } catch (err) {
    return next(
      new AppError(`${err}`, 500)
    );
  }
  if (!decodedToken) {
    return next(
      new AppError(`Not Unauthorized`, 401)
    );
  }
  req.userId = decodedToken.userId;
  next();
};
