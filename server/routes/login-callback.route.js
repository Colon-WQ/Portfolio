const express = require('express');
const { getToken } = require('../controllers/token-exchange.controller.js');

const router = express.Router();

router.get('/authenticate', getToken);

export default router;