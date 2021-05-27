import express from 'express';
import mongoose from 'mongoose';
import FormData from 'form-data';
import axios from 'axios';
import jwt from "jsonwebtoken";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, JWT_SECRET } from '../utils/config.js';

// const User = require('../models/user.model.js');

const router = express.Router();
const client_id = CLIENT_ID;
const client_secret = CLIENT_SECRET;
const redirect_uri = REDIRECT_URI;
//Description that users' Github repositories will be created with.
const DESCRIPTION = "Portfolio website hosted by ghpages created by Portfolio.io"

/**
 * cookieParams define the options that our cookies will be created with.
 * httpOnly ensures that cookies are not accessible via javascript files.
 *  mitigates XSS attacks.
 * secure ensures cookies are only sent to the server when a request is made using https: scheme (with exception of localhost).
 *  mitigates man-in-the-middle attacks.
 * sameSite ensures that browser only sends cookies for same-site requests.
 *  provides protection against CSRF attacks.
 * signed: ensures that cookies are not tampered with.
 *  ensures cookies can be trusted.
 * maxAge: sets a relative time from cookie's creation to its expiry when it will be removed from browser.
 */
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
        console.log(data.getHeaders)
        axios({ 
                method: "POST",
                url: "https://github.com/login/oauth/access_token",
                data: data,
                responseType: "text",
                headers: data.getHeaders()
            }).then((response) => response.data)
            .then((paramsString) => {
                let params = new URLSearchParams(paramsString);
                return params.get("access_token");
            }).then(async (ghToken) => {
                const { login, id, avatar_url, gravatar_id } = await axios.get("https://api.github.com/user", {
                    headers: {"Authorization": `token ${ghToken}`}
                }).then((response) => {
                    return response.data;
                })

                /**
                 * Using JWT encryption allows us to not store user sessions and enables us to freely expand our number
                 * of servers if we choose to in the future, since only the secret is required for JWTs to work.
                 * 
                 * JWT encryption has been proven by industry experts to be sufficiently secure. However we have taken
                 * caution to not store any sensitive data in JWT regardless.
                 */
                const jwtoken = jwt.sign(
                    {login: login, id: id , avatar_url: avatar_url, gravatar_id: gravatar_id, gh_token: ghToken }, 
                    JWT_SECRET,
                    // TODO: what happens when jwt expires while user editing
                    { expiresIn: "6h"});

                /**
                 * JWTs are stored in a HTTPonly cookie to mitigate token theft. Even in the case of stolen tokens, we
                 * offer the logout option to invalidate the user's access token.
                 */
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
    const gh_token = req.gh_token;
    const username = req.username;

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

// TODO: research updating multiple files at a time to make undo easier
// TODO: deploy to ghpages if not a .io repo
// TODO: handle pagination for extra large files
// req.body must contain: route, content. 
export const publishGithub = async (req, res) => {
    console.log("pushing to repository " + req.body.repo)
    const data = new FormData();
    const message = "Page updated with Portfol.io"
    const gh_token = req.gh_token;
    //Changed the url for getting content to this.
    const sha = await axios({
        method: "GET",
        url: `https://api.github.com/repos/${req.username}/${req.body.repo}/contents/${route}`,
        headers: {"Authorization": `token ${ghToken}`}
    }).then(res => res.body.sha).catch(e => {
        // TODO: error handling, stop publishing/undo all publishes.
        console.log(err.message)
        if(res.status !== 404) console.log(`Unexpected error occured: ${e}`);
        return "";
    });
    // content should be base64 encoded already
    data.append('content', req.body.content);
    //message is required
    data.append('message', "test push by Portfol.io")
    //encrypting the content with sha
    data.append('sha', sha);
    //TODO: committer object might be required
    console.log("sha obtained preparing to push")
    
    axios({
        method: "PUT",
        url: `https://api.github.com/repos/${req.username}/${req.body.repo}/${route}`,
        headers: {
            "Authorization": `token ${ghToken}`,
            "Accept": "application/vnd.github.v3+json"
        },
        data:  data
        // TODO: check possible responses from github and if they must be handled separately
        // TODO: discuss what to do on conflict
    }).then(response => res.status(200).json({published: true}))
    // TODO: check correct code for status id
    .catch(error => res.status(400).json(error));
}



// TODO: merge this file with github-api
export const checkExistingRepos = async (req, res) => {
    const gh_token = req.gh_token;
    const username = req.username;
    console.log("checking if " + req.query.repo + "exists")
    await axios({
        method: "GET",
        url: "https://api.github.com/repos/" + username + "/" + req.query.repo,
        headers: {
            "Authorization": `token ${gh_token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    }).then(response => {
        return res.status(404).send(response.data.name + " exists. Possible data loss. Requires user permission")
    }).catch(err => {
        return res.status(200).json({ message: "repository does not exist. Attempting to create new repository under name" + req.query.repo })
    })
}

export const createRepo = async (req, res) => {
    const gh_token = req.gh_token;
    console.log("attempting to create repository under name " + req.body.repo)
    await axios({
        method: "POST",
        url: "https://api.github.com/user/repos",
        headers: {
            "Authorization": `token ${gh_token}`,
            "Accept": "application/vnd.github.v3+json"
        },
        data: {
            name: req.body.repo,
            description: DESCRIPTION,
            homepage: "",
            private: false
        }
    }).then(response => {
        return res.status(200).json({ message: "successfully created repository " + response.data.name})
    }).catch(err => {
        console.log(err.message)
        return res.status(404).send("repository creation failed")
    })
}

export const getRepoContent = async (req, res) => {
    const gh_token = req.gh_token;
    const username = req.username;
    console.log("attempting to get " +  req.query.repo +" repository content")
    await axios({
        method: "GET",
        url: "https://api.github.com/repos/" + username + "/" + req.query.repo + "/contents/",
        headers: {
            "Authorization": `token ${gh_token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    }).then(response => {
        console.log("successfully fetched contents of repository " + req.query.repo)
        return res.status(200).json({ content: response.data })
    }).catch(err => {
        console.log(err.message)
        return res.status(404).send("getting repository contents failed")
    })
}

export default router;