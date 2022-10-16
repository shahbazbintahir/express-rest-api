const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const appConfig = require("./config/index.config");
const dbConfig = require("./config/db.config");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/user/', require('./routes/user.routes'));
app.use('/api/auth/', require('./routes/auth.routes'));
app.use('/api/role/', require('./routes/role.routes'));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // set port, listen for requests
    const PORT = appConfig.application_port;
    app.listen(PORT, () => {
    });
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


