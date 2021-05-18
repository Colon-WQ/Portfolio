import express from 'express';
import mongoose from 'mongoose';
import FormData from 'form-data';
import axios from 'axios';
import jwt from "jsonwebtoken";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, ENCRYPT_SECRET } from '../utils/config.js';

import fetch from 'node-fetch'

// const User = require('../models/user.model.js');

const router = express.Router();
const client_id = CLIENT_ID;
const client_secret = CLIENT_SECRET;
const redirect_uri = REDIRECT_URI;
const cookieParams = {
    httpOnly: true,
    secure: true,
    SameSite: "strict",
    signed: true,
    maxAge: 6 * 60 * 60 * 1000,
}

export const getToken = async (req, res) => {
    try {
        const code = req.body.code;
        const data = new FormData();
        data.append("client_id", client_id);
        data.append("client_secret", client_secret);
        data.append("code", code);
        data.append("redirect_uri", redirect_uri);
        axios({ 
                method: 'POST',
                url: 'https://github.com/login/oauth/access_token',
                data: data,
                responseType: 'text',
                headers: data.getHeaders()
            })
            .then((paramsString) => {
                let params = new URLSearchParams(paramsString);
                //console.log(params)
                console.log("access token achieved")
                return params.get("access_token");;
            }).then((githubToken) => {
                // const { name, login, id , avatar_url, gravatar_id } = axios.get('https://api.github.com/user', {
                //     headers: {'Authorization': `token ${ghToken}`}
                // });
                const name = "bong"
                const login = "bong"
                const id = "bong"
                const avatar_url = "bong"
                const gravatar_id = "bong"
                const ghToken = "bong"
                const jwtoken = jwt.sign(
                    {login: login, id: id , avatar_url: avatar_url, gravatar_id: gravatar_id, gh_token: ghToken }, 
                    ENCRYPT_SECRET,
                    // TODO: discuss expiry duration
                    // TODO: what happens when jwt expires while user editing
                    { expiresIn: "6h"});
                res.cookie("authorization", jwtoken, cookieParams);
                // TODO: check if name == null, replace login otherwise.
                // TODO: update db if user not found/query db for userdata instead.
                return res.status(200).json({ id: id, avatar_url: avatar_url, gravatar_id: gravatar_id, name: login });
            })
            .catch((error) => {
                console.log(error);
                return res.status(400).json(error);
            });
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message });
    }
}

export const checkRepo = async (req, res) => {
    // TODO: get fields from cookie
    const cookie = req.signedCookies.authorization;
    const gh_token = cookie.gh_token;
    const username = cookie.login;
    // Might need authorization for private repos.
    fetch(`https://api.github.com/repos/${username}/${username}.github.io`, {
        method: "GET"
    }).then((response) => {
        if (response.status == 200) {
            console.log("repo present");
            return res.status(200).json({created: true});
        } else if (response.status == 404) {
            return res.status(404).json({created: false});
        } else {
            return res.status(404).json({error: "error in checkRepo in api controller"})
        }
    })
};


export default router;