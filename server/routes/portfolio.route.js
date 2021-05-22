
import express from 'express';
import { 
    postPortfolio, 
    savePortfolio, 
    getPortfolio, 
    createPortfolio, 
    getPortfolios, 
    deletePortfolio 
} from '../controllers/portfolio.controller.js';
import { checkGitCreated } from '../controllers/github-api.controller.js'; 
import { checkExistingRepos, createRepo, getRepoContent } from '../controllers/github.controller.js';
import auth from '../middleware/auth.middleware.js';


const router = express.Router();

// publish includes pushing to github. Saving is only on backend
//NOTE: '/' MUST BE put at the END so it does not intercept the regex detection in the url
router.get('/status', auth, checkGitCreated);


//lists user's repos for checking
router.get('/checkExistingRepos', auth, checkExistingRepos);
router.post('/createRepo', auth, createRepo);
router.get('/getRepoContent', auth, getRepoContent);

router.post('/:id/publish', postPortfolio);
router.patch('/:id/save', savePortfolio);
router.get('/:id', getPortfolio);
router.get('/create', createPortfolio);
router.delete('/:id', deletePortfolio);
router.get('/', getPortfolios);


export default router;