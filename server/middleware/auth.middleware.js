import jwt from 'jsonwebtoken';
import { JWT_SECRET, CLIENT_ID, CLIENT_SECRET } from '../utils/config.js';
import axios from 'axios'
// require('dotenv').config();

const auth = async (req, res, next) => {
    console.log("middleware authenticating...");
    const token = req.signedCookies.authorization;
    jwt.verify(token, JWT_SECRET, async (err, decodedData) => {
        if (err) return res.status(403).json({ message: err.message })
        req.gh_token = decodedData.gh_token;
        req.username = decodedData.login;
        console.log("successfully decoded token")
        await axios({
            method: "POST",
            url: "https://api.github.com/applications/" + CLIENT_ID + "/token",
            withCredentials: true,
            data: {
                access_token: decodedData.gh_token
            },
            headers: {
                "Accept": 'application/vnd.github.v3+json',
            },
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }
        }).then(res => {
            console.log("token validated")
            next()
        }).catch(err => {
            console.log(err.message)
            console.log("token was invalidated before")
            return res.status(403).send("Invalid Token")
        })
    });
}

export default auth;