
// third party import
const jwt = require('jsonwebtoken');

// import models
const { User } = require('../models/user');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');

// import config information
const clientSecret = require("../config/clientSecret.config");

// export middleware
module.exports = catchAsync(async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // return error
        return res.status(401).json(
            Response.unauthorize({ message: `Unauthorized.` })
        );
    } // end if
    const token = authHeader.split(' ')[1];
    
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, clientSecret.key);
    } catch (err) {
        // return error
        return res.status(401).json(
            Response.unauthorize({ message: `Token expired` })
        );
    } // catch
    
    req.userId = decodedToken.userId;
    // get user
    const result = await User.findById(
        decodedToken.userId,
    ).select({ role: 1 });
    if (result.role !== 'administration') {
        // return error
        return res.status(401).json(
            Response.unauthorize({ message: `Unauthorized.` })
        );
    } // end if
    // create JWT for next response
    req.token = jwt.sign(
        {
            email: decodedToken.email,
            userId: decodedToken.userId
        },
        clientSecret.key,
        { expiresIn: '1h' }
    );
    next();
});
