const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/authorization');

const config = {
  PORT: process.env.PORT,
  COOKIES_MAXAGE: +process.env.COOKIES_MAXAGE,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB,
  DAO: process.env.DAO,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_ADMIN: process.env.EMAIL_ADMIN,
  TWILIO_NUMBER: process.env.TWILIO_NUMBER,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};

router.get(
  '/',
  // middlewares.checkAuthentication,
  (req, res) => {
    res.render('view', {
      items: config
    });
  });

module.exports = router;
