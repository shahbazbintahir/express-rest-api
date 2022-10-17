// third party import
const jwt = require('jsonwebtoken');

// import models
const { User } = require('../models/user');
const { Role } = require('../models/role');

// import utils (helper functions)
const AppError = require('../utils/appError');

// import config information
const clientSecret = require("../config/clientSecret.config");

// export middleware
module.exports = (permission, feature) => {
    return async (req, res, next) => {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
          // return error 
          return next(
            new AppError(`Not Unauthorized.`, 401)
          );
        }
        const token = authHeader.split(' ')[1];
        let decodedToken;
        try {
          decodedToken = jwt.verify(token, clientSecret.key);
        } catch (err) {
          // return error 
          return next(
            new AppError(`${err}`, 500)
          );
        }
        if (!decodedToken) {
          // return error 
          return next(
            new AppError(`Not Unauthorized`, 401)
          );
        }
        req.userId = decodedToken.userId;
        try {
          const result = await User.findById(
            decodedToken.userId,
          ).select({ role: 1 });
          
          const permissionList = await Role.find(
            {
                slug: result.role
            },
          ).select({ rolePermission: 1 });

          if(permissionList.length > 0){
            if(!(permissionList[0].rolePermission).includes(permission+'-'+feature)){
              // return error 
              return next(
                new AppError(`Access Denied You don't have permission to access`, 403)
              );
            } // end if
          } else {
            // return error 
            return next(
              new AppError(`Access Denied You don't have permission to access`, 403)
            );
          } // end if
        } catch (err) {
          return next(
            new AppError(`${err}`, 400)
          );
        } // end catch
        next();
      };
}
