import jwt from 'jsonwebtoken';
import { ENCRYPT_SECRET } from '../utils/config.js';
// require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        console.log("middleware authenticating...");
        const token = req.signedCookies.authorization;
        let decodedData = jwt.verify(token, ENCRYPT_SECRET);
        // console.log(decodedData);
        // populates req for subsequent functions to use
        req.gh_token = decodedData?.gh_token;
        req.username = decodedData?.login;
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;