
import express from 'express';
import auth from '../middleware/auth.middleware.js';
import { postPortfolio, savePortfolio, getPortfolio, createPortfolio, getPortfolios, deletePortfolio } from '../controllers/portfolio.controller.js';
import { publishGithub, checkGitCreated } from '../controllers/github-api.controller.js'; 
import checkAuth from '../middleware/auth.middleware.js';


const router = express.Router();

// publish includes pushing to github. Saving is only on backend
router.get('/', getPortfolios);
router.post('/:id/publish', postPortfolio);
router.patch('/:id/save', savePortfolio);
router.get('/:id', getPortfolio);
router.get('/create', createPortfolio);
router.get('/status', checkAuth, checkGitCreated);
router.delete('/:id', deletePortfolio);

export default router;