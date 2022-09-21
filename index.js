const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require("./config/index.js");

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

app.use('/user', require('./routes/user.routes'));
app.use('/auth', require('./routes/auth.routes'));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(`mongodb://${config.db.HOST}:${config.db.PORT}/${config.db.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // set port, listen for requests
    const PORT = process.env.APP_PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


