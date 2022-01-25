const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./services/winston');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const server = express();

server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(cors());

server.listen(process.env.PORT || 8080, function () {
  logger.debug(`Listening at ${process.env.PORT || 8080}`);
});

server.use('/', indexRouter);
server.use('/api', apiRouter);

server.use(function (req, res, _next) {
  res.sendStatus(404);
});

module.exports = server;
