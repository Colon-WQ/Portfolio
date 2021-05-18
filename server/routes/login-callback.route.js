import express from 'express';
import { getToken } from '../controllers/github-api.controller.js';

const router = express.Router();

router.post('/authenticate', getToken);

export default router;