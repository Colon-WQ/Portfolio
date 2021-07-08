import express from 'express';
import { CLIENT_ID, CLIENT_SECRET } from '../utils/config.js';
import axios from 'axios';
import { handleErrors } from '../handlers/errorHandler.js';
import { handleSuccess } from '../handlers/successHandler.js';

const router = express.Router()

export const logout = async (req, res) => {
    try {
        console.log("attempting logout")

        /**
         * This Github API route requires basic authentication, which requires us to provide
         * username （CLIENT ID) and password (CLIENT SECRET) in the header. Axios simplifies 
         * this by allowing us to just place the username and password in an auth object.
         */
        await axios({
            method: "DELETE",
            url: `https://api.github.com/applications/${CLIENT_ID}/token`,
            withCredentials: true,
            data: {
                access_token: req.gh_token
            },
            headers: {
                "Accept": "application/vnd.github.v3+json",
            },
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }
        }).then(res => {
            console.log("Token successfully invalidated by github")
        }).catch(err => {
            console.log(err.message)
        })
        
        req.session.destroy(err => {
            if (err) console.log(err);
            console.log("session destroyed");
            return handleSuccess(res, { message: "logout successful" }, "logout successful");
        })

        
    } catch (err) {
        return handleErrors(res, 401, err, "unauthorized user");
    }
}

export default router