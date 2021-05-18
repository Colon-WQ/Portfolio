import dotenv from 'dotenv';

dotenv.config();

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;
export const SIGN_COOKIE_SECRET = process.env.SIGN_COOKIE_SECRET;
export const FRONT_END = process.env.FRONT_END;
export const BACK_END = process.env.BACK_END;
export const MONGO_URL = process.env.MONGO_URL;
export const PORT = process.env.PORT;