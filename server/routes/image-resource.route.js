import express from 'express';
import { getImages } from '../controllers/pexels-api.controller';


const router = express.Router();

router.get('/', getImages);

export default router;