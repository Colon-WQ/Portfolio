import express from 'express';
import { getToken } from '../controllers/token-exchange.controller.js';

const router = express.Router();

router.post('/authenticate', getToken);

export default router;