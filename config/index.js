
const dbConfig = require("./db.config.js");
const cliendSecretConfig = require("./db.config.js");

module.exports = {
    db: dbConfig,
    client: cliendSecretConfig,
}

