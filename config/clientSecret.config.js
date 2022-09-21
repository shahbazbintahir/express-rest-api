require('dotenv').config();

module.exports = {
    key: process.env.SECRET_KEY || "jhr-system-secreat-key"
};