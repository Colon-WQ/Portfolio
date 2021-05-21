import express from 'express';
import { CLIENT_ID, CLIENT_SECRET } from '../utils/config.js';
import axios from 'axios';

const router = express.Router()

export const logout = async (req, res) => {
    //Cookie path defaults to '/' and its domain defaults to domain name of the app
    try {
        console.log("attempting logout")

        await axios({
            method: "DELETE",
            url: "https://api.github.com/applications/" + CLIENT_ID + "/token",
            withCredentials: true,
            data: {
                access_token: req.gh_token
            },
            headers: {
                "Accept": 'application/vnd.github.v3+json',
            },
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }
        }).catch(err => {
            console.log(err.message)
        })

        res.clearCookie("authorization", { domain: 'localhost', path: '/'})
        console.log("logout successful")
        
        return res.status(200).json({ message: "logout successful"})
    } catch (err) {
        console.log(error)
        return res.status(404).json({ message: error.message });
    }
}

export default router