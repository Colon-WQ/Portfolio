const express = require('express');
const { postPortfolio, savePortfolio, getPortfolio, createPortfolio, getPortfolios, deletePortfolio } = require('../controllers/portfolio.controller.js');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// publish includes pushing to github. Saving is only on backend
router.post('/:id/publish', postPortfolio);
router.patch('/:id/save', savePortfolio);
router.get('/:id', getPortfolio);
router.get('/create', createPortfolio);
router.get('/', getPortfolios);
router.delete('/id', deletePortfolio);

export default router;