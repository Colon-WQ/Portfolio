import jwt from 'jsonwebtoken';

// require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        console.log("middleware authenticating...");
        const token = req.signedCookies.authorization;
        let decodedData = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedData);
        // req.gh_token = decodedData?.gh_token;
        // req.username = decodedData?.login;
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;