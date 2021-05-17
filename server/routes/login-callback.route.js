import express from 'express';
import getToken from '../controllers/token-exchange.controller.js';


const router = express.Router();

router.get('/authenticate', getToken);

export default router;