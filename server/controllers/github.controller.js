import express from 'express';
import axios from 'axios';

const router = express.Router();

export const checkExistingRepos = async (req, res) => {
    const gh_token = req.gh_token;
    const username = req.username;
    await axios({
        method: "GET",
        url: "https://api.github.com/repos/" + username + "/" + req.query.repo,
        headers: {
            'Authorization': `token ${gh_token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    }).then(response => {
        return res.status(404).send(response.data.name + " exists")
    }).catch(err => {
        console.log(err.message)
        return res.status(200).json({ message: "repository does not exist" })
    })
}

export default router;