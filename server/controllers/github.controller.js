import express from 'express';
import axios from 'axios';
import { BACK_END } from '../utils/config.js';

const router = express.Router();

const DESCRIPTION = "Portfolio website hosted by ghpages created by Portfolio.io"

// TODO: merge this file with github-api
export const checkExistingRepos = async (req, res) => {
    const gh_token = req.gh_token;
    const username = req.username;
    console.log("checking if " + req.query.repo + "exists")
    await axios({
        method: "GET",
        url: "https://api.github.com/repos/" + username + "/" + req.query.repo,
        headers: {
            'Authorization': `token ${gh_token}`,
            // TODO: standardise ' vs "
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
            'Authorization': `token ${gh_token}`,
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
            'Authorization': `token ${gh_token}`,
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