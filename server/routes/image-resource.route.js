import express from 'express';
import { getImages } from '../controllers/pexels-api.controller.js';


const router = express.Router();

router.get('/', getImages);

export default router;