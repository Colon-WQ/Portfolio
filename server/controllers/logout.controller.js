import express from 'express';
import { FRONT_END } from '../utils/config.js';

const router = express.Router()

export const logout = async (req, res) => {
    //Cookie path defaults to '/' and its domain defaults to domain name of the app
    //Domain name subject to changes. Should add to .env
    try {
        // domain changed from localhost:3000 to FRONT_END from .env
        res.clearCookie("authorization", { domain: 'localhost', path: '/'})
        return res.status(200).json({ message: "successfully deleted cookie"})
    } catch (err) {
        console.log(error)
        return res.status(404).json({ message: error.message });
    }
}

export default router