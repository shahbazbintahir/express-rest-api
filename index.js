// third party import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import config information
const appConfig = require("./config/index.config");
const dbConfig = require("./config/db.config");

// create express application
const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());
// set header fo api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// define routes from imports (./routes)
app.use('/api/user/', require('./routes/user.routes'));
app.use('/api/auth/', require('./routes/auth.routes'));
app.use('/api/role/', require('./routes/role.routes'));
app.use('/api/permission/', require('./routes/permission.routes'));

// define nod found response
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// connect to mongo database
mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // set port, listen for requests
    const PORT = appConfig.application_port;
    // listen application
    app.listen(PORT, () => {
    });
  })
  .catch(err => {
    // throw error and exit
    console.error("Connection error", err);
    process.exit();
  });


