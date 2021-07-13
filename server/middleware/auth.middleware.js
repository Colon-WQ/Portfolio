import jwt from 'jsonwebtoken';
import { JWT_SECRET, ENCRYPT_KEY } from '../utils/config.js';
import crypto from 'crypto';
//import axios from 'axios'

const sha1 = (input) => {
    return crypto.createHash('sha1').update(input).digest();
}

const password_derive_bytes = (password, salt, iterations, len) => {
    var key = Buffer.from(password + salt);
    for (var i = 0; i < iterations; i++) {
        key = sha1(key);
    }
    if (key.length < len) {
        var hx = password_derive_bytes(password, salt, iterations - 1, 20);
        for (var counter = 1; key.length < len; ++counter) {
            key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
        }
    }
    return Buffer.alloc(len, key);
}

const decode = async (data) => {
    const iv = Buffer.from(data.iv, 'hex');
    const string = data.encrypted;
    var key = password_derive_bytes(ENCRYPT_KEY, '', 100, 32);
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var decrypted = decipher.update(string, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
}


/**
 * Auth middleware gets cookie from the request body and attempts to verify the user
 * by decrypting the JWT encrypted access token.
 * 
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - When invoked, executes the middleware succeeding the current middleware.
 */
const auth = async (req, res, next) => {

    console.log("middleware authenticating...");

    if (req.session.user === undefined) {
        return res.status(401).send("unauthorized user");
    }

    const token = req.session.user.details;

    jwt.verify(token, JWT_SECRET, async (err, decodedData) => {
        if (err) return res.status(401).send("unauthorized user")
        req.gh_token = await decode(decodedData.gh_token);
        req.username = decodedData.login;
        console.log("successfully decoded token")
        /** 
         * The below is merely for testing to check validity of token. It is not safe
         * to pass the unencrypted access token in a request body.
         */
        // await axios({
        //     method: "POST",
        //     url: "https://api.github.com/applications/" + CLIENT_ID + "/token",
        //     withCredentials: true,
        //     data: {
        //         access_token: decodedData.gh_token
        //     },
        //     headers: {
        //         "Accept": 'application/vnd.github.v3+json',
        //     },
        //     auth: {
        //         username: CLIENT_ID,
        //         password: CLIENT_SECRET
        //     }
        // }).then(res => {
        //     console.log("token validated")
        //     next()
        // }).catch(err => {
        //     console.log(err.message)
        //     console.log("token was invalidated before")
        //     return res.status(401).send("Invalid Token")
        // })
        next();
    });
}

export default auth;