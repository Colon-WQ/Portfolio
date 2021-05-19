import express from 'express';
import mongoose from 'mongoose';
import FormData from 'form-data';
import axios from 'axios';
import jwt from "jsonwebtoken";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, JWT_SECRET } from '../utils/config.js';

// import fetch from 'node-fetch'

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
            }).then((response) => response.data)
            .then((paramsString) => {
                let params = new URLSearchParams(paramsString);
                return params.get("access_token");
            }).then(async (ghToken) => {
                const { name, login, id, avatar_url, gravatar_id } = await axios.get('https://api.github.com/user', {
                    headers: {'Authorization': `token ${ghToken}`}
                }).then((response) => {
                    return response.data;
                })

                const jwtoken = jwt.sign(
                    {login: login, id: id , avatar_url: avatar_url, gravatar_id: gravatar_id, gh_token: ghToken }, 
                    JWT_SECRET,
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
        return res.status(404).json({ message: error.message });
    }
}

export const checkGitCreated = async (req, res) => {
    // fields gh_token and login should be populated from auth in middleware
    const gh_token = req.gh_token;
    const username = req.username;
    console.log(username)
    // Might need authorization for private repos.
    axios({
        method: "GET",
        url: `https://api.github.com/repos/${username}/${username}.github.io`
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

// export const publishGithub = async (req, res) => {}


export default router;