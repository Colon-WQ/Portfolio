import express from 'express';
import mongoose from 'mongoose';
import FormData from 'form-data';
import axios from 'axios';
import jwt from "jsonwebtoken";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, JWT_SECRET, ENCRYPT_KEY } from '../utils/config.js';
import crypto from 'crypto';
import { handleErrors } from '../handlers/errorHandler.js';
import { handleSuccess } from '../handlers/successHandler.js';



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
// const cookieParams = {
//     httpOnly: true,
//     secure: true,
//     SameSite: "strict",
//     signed: true,
//     maxAge: 6 * 60 * 60 * 1000,
// }

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


const encode = async (string) => {
    const iv = crypto.randomBytes(16);
    var key = password_derive_bytes(ENCRYPT_KEY, '', 100, 32);
    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    var part1 = cipher.update(string, 'utf8');
    var part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return { iv: iv.toString('hex'), encrypted: encrypted };
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

                const encrypted_ghToken = await encode(ghToken);

                const jwtoken = jwt.sign(
                    {login: login, id: id , avatar_url: avatar_url, gravatar_id: gravatar_id, gh_token: encrypted_ghToken }, 
                    JWT_SECRET,
                    { expiresIn: "6h"});

                req.session.user = {
                    details: jwtoken
                }

                req.session.save(err => {
                    if (err) console.log(err);
                    console.log("session saved")
                })
                // TODO: check if name == null, replace login otherwise.
                // TODO: update db if user not found/query db for userdata instead.
                return handleSuccess(res, { id: id, avatar_url: avatar_url, gravatar_id: gravatar_id, name: login }, "user info fetched successfully");
            }).catch((err) => {
                return handleErrors(res, 401, err, "unauthorized user");
            });
    } catch (err) {
        return handleErrors(res, 401, err, "unauthorized user");
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
    
// req.body must contain: route, content, repo. 
export const publishGithub = async (req, res) => {
    console.log("pushing to repository " + req.body.repo)

    const files = req.body.content;

    const message = "Page updated with Portfol.io"

    const gh_token = req.gh_token;
    //Changed the url for getting content to this.
    const fetchedContent = await axios({
        method: "GET",
        url: `https://api.github.com/repos/${req.username}/${req.body.repo}/contents/${req.body.route}`,
        headers: {
            "Authorization": `token ${gh_token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    }).then(async res => {
        const fetchedContentObject = {};

        const recurseContent = async (content) => {
            for (let obj of content) {
                if (obj.type === "file") {
                    fetchedContentObject[obj.path] = {
                        sha: obj.sha
                    }
                } else if (obj.type === "dir") {
                    await axios({
                        method: "GET",
                        url: `https://api.github.com/repos/${req.username}/${req.body.repo}/contents/${req.body.route}/${obj.path}`,
                        headers: {
                            "Authorization": `token ${gh_token}`,
                            "Accept": "application/vnd.github.v3+json"
                        }
                    }).then(async response => {
                        await recurseContent(response.data);
                    }).catch(err => {
                        console.log(err);
                        return handleErrors(res, 400, err, "failed to fetch files of a directory");
                    })
                } else {
                    //TODO: Handle SymLink
                }
            }
        }

        await recurseContent(res.data);

        console.log(fetchedContentObject);

        //Set up request body's content for easy reference during push later.
        for (let obj of res.data) {
            fetchedContentObject[obj.path] = {
                sha: obj.sha
            }
        }
        return fetchedContentObject;
    }).catch(err => {
        // TODO: error handling, stop publishing/undo all publishes.
        if (err.response.data.message === "This repository is empty." && err.response.status === 404) {
            console.log("repository is empty");
            //return empty object since it is an empty repository.
            return {};
        } else {
            return handleErrors(res, 404, err, "error encountered when checking repository");
        }
    });

    //TODO: committer object might be required
    console.log("sha obtained, preparing to push")
    
    for (let obj of files) {
        //filename and filetype combined give the full path of the file.
        //fileContent was base64 encoded in the frontend
        console.log(obj.fileName + " is being pushed")
        const data = {
            message: message,
            content: obj.fileContent
        }
        //If file exists, append sha field to the data object in order to update the existing file.
        if (fetchedContent[obj.fileName] != undefined) {
            data['sha'] = fetchedContent[obj.fileName].sha;
        }
        //wait for push to succeed. Push has to completely succeed, otherwise pages deployment shldn't be run.
        await axios({
            method: "PUT",
            url: `https://api.github.com/repos/${req.username}/${req.body.repo}/contents/${obj.fileName}`,
            headers: {
                "Authorization": `token ${gh_token}`,
                "Accept": "application/vnd.github.v3+json"
            },
            data: data
            // TODO: check possible responses from github and if they must be handled separately
            // TODO: discuss what to do on conflict
        }).then(response => {
            console.log(`successfully pushed ${obj.fileName}`)
        }).catch(err => {
            return handleErrors(res, 400, err, "failed to push/overwrite file");
        });
    }

    console.log("all files successfully pushed")

    //TODO Could show some kind of progress indicator. Github Pages does allow us to check when page is being built or built.
    axios({
        method: "GET",
        url: `https://api.github.com/repos/${req.username}/${req.body.repo}/pages`,
        headers: {
            "Authorization": `token ${gh_token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    }).then(response => {
        return handleSuccess(res, { 
            message: `successfully pushed all files and deployed to ghpages at ${response.data.html_url}
                Please wait for ghpages to load and refresh your browser after loading is completed for changes to take place` 
            }, "ghpages already exists");
    }).catch(err => {
        console.log("ghpages does not exist. Need to create a new ghpages site")
        //functionality to toggle ghpages is under preview and requires a custom media type in the Accept header. See docs for more information"
        //TODO: Need to update when Github finalizes the preview.
        axios({
            method: "POST",
            url: `https://api.github.com/repos/${req.username}/${req.body.repo}/pages`,
            headers: {
                "Authorization": `token ${gh_token}`,
                "Accept": "application/vnd.github.switcheroo-preview+json"
            },
            data: {
                //TODO need to actually check if main branch is the correct one. Some older repos do use master.
                source: {
                    branch: "main"
                }
            }
        }).then(responses => {
            return handleSuccess(res, { 
                message: `successfully pushed all files and deployed to ghpages at ${responses.data.html_url}
                Please wait for ghpages to load and refresh your browser after loading is completed for changes to take place` 
            }, "ghpages successfully created");
        }).catch(err => {
            return handleErrors(res, 400, err, "ghpages deployment failed");
        })
    })
    
    
}



export const checkExistingRepos = async (req, res) => {
    const gh_token = req.gh_token;
    const username = req.username;
    console.log(`checking if ${req.query.repo} exists`);
    await axios({
        method: "GET",
        url: `https://api.github.com/repos/${username}/${req.query.repo}`,
        headers: {
            "Authorization": `token ${gh_token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    }).then(response => {
        return handleErrors(res, 404, undefined, `${response.data.name} exists. Possible data loss. Requires user permission`);
    }).catch(err => {
        return handleSuccess(res, { message: `repository does not exist. Attempting to create new repository under name ${req.query.repo}` });
    })
}

export const createRepo = async (req, res) => {
    const gh_token = req.gh_token;
    console.log(`attempting to create repository under name ${req.body.repo}`)
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
        return handleSuccess(res, { message: `successfully created repository ${response.data.name}` }, "successfully created new Github repository");
    }).catch(err => {
        return handleErrors(res, 404, err, "repository creation failed");
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
        return handleSuccess(res, { content: response.data }, `successfully fetched contents of repository ${req.query.repo}`);
    }).catch(err => {
        return handleErrors(res, 404, err, "getting repository contents failed");
    })
}


export const getGithubPageStatus = async (req, res) => {
    const gh_token = req.gh_token;
    const username = req.username;
    const repo = req.query.repo;
    console.log("checking github page status");
    await axios({
        method: "GET",
        url: `https://api.github.com/repos/${username}/${repo}/pages`,
        headers: {
            "Authorization": `token ${gh_token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    }).then(response => {
        return handleSuccess(res, { status: response.data.status, url: response.data.html_url }, "github page status retrieved successfully");
    }).catch(err => {
        return handleErrors(res, 400, err, "failed to obtain Github Page status");
    })
}

export default router;