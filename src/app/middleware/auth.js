// third party import
const jwt = require('jsonwebtoken');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');

// import config information
const clientSecret = require("../config/clientSecret.config");

// export middleware
module.exports = catchAsync((req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // return error
        return res.status(401).json(
            Response.unauthorize({ message: `Unauthorized.` })
        );
    } // end if
    const token = authHeader.split(' ')[1];
    let decodedToken = jwt.verify(token, clientSecret.key);
    if (!decodedToken) {
        // return error
        return res.status(401).json(
            Response.unauthorize({ message: `Unauthorized.` })
        );
    } // end if
    req.userId = decodedToken.userId;
    // create JWT for next response
    const newToken = jwt.sign(
        {
            email: decodedToken.email,
            userId: decodedToken.userId
        },
        clientSecret.key,
        {expiresIn: '1h'}
    );
    req.token = newToken;
    next();
});
