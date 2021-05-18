import express from 'express';
import { FRONT_END } from '../utils/config.js';

const router = express.Router()

export const logout = async (req, res) => {
    //Cookie path defaults to '/' and its domain defaults to domain name of the app
    //Domain name subject to changes. Should add to .env
    try {
        console.log("deleting cookie")
        // domain changed from localhost:3000 to FRONT_END from .env
        res.clearCookie("authorization", { domain: FRONT_END, path: '/'})
    } catch (err) {
        console.log(error)
        res.status(404).json({ message: error.message });
    }
}

export default router