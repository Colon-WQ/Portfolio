import express from 'express';
import {
    postPortfolio,
    savePortfolio,
    getPortfolio,
    createPortfolio,
    getPortfolios,
    deletePortfolio
} from '../controllers/portfolio.controller.js';
import { checkGitCreated, checkExistingRepos, createRepo, getRepoContent } from '../controllers/github-api.controller.js';
import auth from '../middleware/auth.middleware.js';
/**
 * @openapi
 * tags:
 *  name: Portfolio
 *  description: API for various portfolio functionalities involving Github and MongoDB.
 * 
 */
const router = express.Router();

// publish includes pushing to github. Saving is only on backend
//NOTE: '/' MUST BE put at the END so it does not intercept the regex detection in the url
router.get('/status', auth, checkGitCreated);


/**
 * @openapi
 * portfolio/checkExistingRepos:
 *  get:
 *    summary: Authenticates user, then checks if user already owns a Github repository under the name specified in query parameters.
 *    tags: [Portfolio]
 *    description: 1. Obtains and attempts to verify JWT from user cookies<br /><br />
 *                 2. Gets query parameter repo from user request and passes it as a query parameter in a GET request to Github API to check for existing Github repositories
 *                    by the same name.
 *    parameters:
 *    - in: cookie
 *      name: authorization
 *      schema:
 *      type: apiKey
 *      required: true
 *      description: Signed Cookie containing JWT encrypted access token.
 *    - in: query
 *      name: repo
 *      schema:
 *      type: string
 *      description: Github Repository name to be checked.
 *      required: true
 *    responses:
 *          200:
 *              description: A Github repository by the name specified in query parameters does not exist for the user.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          description: Repository does not exist.
 *          404:
 *              description: A Github repository by the name specified in query parameters exists for the user.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: Repository exists.
 *          401:
 *              description:  Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: error message.
 */
router.get('/checkExistingRepos', auth, checkExistingRepos);

/**
 * @openapi
 * portfolio/createRepo:
 *  post:
 *    summary: Authenticates the user, then creates a Github repository for the user via Github API under name specified in query parameters.
 *    tags: [Portfolio]
 *    description: 1. Obtains and attempts to verify JWT from user cookies<br /><br />
 *                 2. Gets repo name from user request and passes it in the body of a POST request to Github API to create a Github repository
 *                    under the repo name.
 *    parameters:
 *      - in: cookie
 *        name: authorization
 *        schema:
 *          type: apiKey
 *        required: true
 *        description: Signed Cookie containing JWT encrypted access token.
 *    requestBody:
 *      description: Request body takes in the new Github repository's name.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              data:
 *                type: object
 *                properties:
 *                  repo:
 *                    type: string
 *                    description: Name of Github repository to be created.
 *    responses:
 *      200:
 *        description: User's access token is successfully invalidated via Github API and the cookie containing the access token is destroyed.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: logout successful
 *      401:
 *        description: Authorization information is missing or invalid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: error message.
 */  
router.post("/createRepo", auth, createRepo);
router.get("/getRepoContent", auth, getRepoContent);

router.post("/:id/publish", postPortfolio);
router.patch("/:id/save", savePortfolio);
router.get("/:id", getPortfolio);
router.get("/create", createPortfolio);
router.delete("/:id", deletePortfolio);
router.get("/", getPortfolios);


export default router;