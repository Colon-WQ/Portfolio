import express from 'express';
import mongoose from 'mongoose';
import FormData from 'form-data';
import axios from 'axios';
import jwt from "jsonwebtoken";

import fetch from 'node-fetch'

// const User = require('../models/user.model.js');

const router = express.Router();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const cookieParams = {
    httpOnly: true,
    secure: true,
    SameSite: "strict",
    signed: true,
    maxAge: 6 * 60 * 60 * 1000,
}

export const getToken = async (req, res) => { 
    console.log("getToken running");
    try {
        const code = req.body.code;
        const data = new FormData();
        data.append("client_id", client_id);
        data.append("client_secret", client_secret);
        data.append("code", code);
        data.append("redirect_uri", redirect_uri);
        console.log("getToken run");

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
                    process.env.JWT_SECRET,
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

export default router;