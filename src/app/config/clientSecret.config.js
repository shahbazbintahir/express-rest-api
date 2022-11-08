require('dotenv').config();

module.exports = {
    key: process.env.SECRET_KEY || "jhr-system-secret-ey",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
};