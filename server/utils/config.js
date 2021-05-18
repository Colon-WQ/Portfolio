import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SIGN_COOKIE_SECRET: process.env.SIGN_COOKIE_SECRET,
  FRONT_END: process.env.FRONT_END,
  BACK_END: process.env.BACK_END,
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT
};