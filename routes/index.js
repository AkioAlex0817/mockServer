const express = require('express');
const {
  ENVIRONMENT,
} = require('../utils/const');
const router = express.Router();

router.get('/', function (req, res, _next) {
  res.send(
    `ENVIRONMENT: ${ENVIRONMENT}<br>`
  );
});

module.exports = router;
