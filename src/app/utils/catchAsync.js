
// import utils (helper functions)
const { Response } = require('../../framework');

// helper function for handling catch statement
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(exception => {
            res.status(500).json(
                Response.exception({ message: exception.message })
            );
        });
    };
};
