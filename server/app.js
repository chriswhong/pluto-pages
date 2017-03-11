// simple express app to serve up custom APIs

const express = require('express');
const compression = require('compression');
const spa = require('express-spa');
const PUBLIC_DIR_PATH = require('path').resolve('./public');

const app = express();

app.use(compression());
app.use(express.static(PUBLIC_DIR_PATH));
app.use(spa(`${PUBLIC_DIR_PATH}/index.html`));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
