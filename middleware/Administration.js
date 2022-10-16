const jwt = require('jsonwebtoken');

// import models
const { User } = require('../models/user');

const AppError = require('../utils/appError');

const clientSecret = require("../config/clientSecret.config");

module.exports = async (req, res, next) => {
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
  try {
    const result = await User.findById(
      decodedToken.userId,
    ).select({ role: 1 });
    
    if(result.role !== 'administration'){
      return next(
        new AppError(`Not Unauthorized`, 401)
      );
    }

  } catch (err) {
    return next(
      new AppError(`${err}`, 400)
    );
  }
  next();
};
