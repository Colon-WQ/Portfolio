import express from 'express';

const router = express.Router()

export const logout = async (req, res) => {
    //Cookie path defaults to '/' and its domain defaults to domain name of the app
    //Domain name subject to changes. Should add to .env
    try {
        console.log("deleting cookie")
        res.clearCookie("authorization", { domain: 'http://localhost:3000', path: '/'})
    } catch (err) {
        console.log(error)
        res.status(404).json({ message: error.message });
    }
}

export default router