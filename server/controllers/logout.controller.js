import express from 'express';

const router = express.Router()

export const logout = async (req, res) => {
    //Cookie path defaults to '/' and its domain defaults to domain name of the app
    //Domain name subject to changes. Should add to .env
    res.clearCookie("authorization", {domain: 'http://localhost:3000', path: '/'})
}

export default router