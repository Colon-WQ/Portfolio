import express from 'express'
import { postPortfolio, savePortfolio, getPortfolio, createPortfolio, getPortfolios, deletePortfolio } from '../controllers/portfolio.controller.js';
import auth from '../middleware/auth.middleware.js'

const router = express.Router();

// publish includes pushing to github. Saving is only on backend
router.post('/:id/publish', postPortfolio);
router.patch('/:id/save', savePortfolio);
router.get('/:id', getPortfolio);
router.get('/create', createPortfolio);
router.get('/', getPortfolios);
router.delete('/id', deletePortfolio);

export default router;