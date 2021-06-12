import express from 'express';
import {
    getPortfolio,
    upsertPortfolio,
    getPortfolios,
    deletePortfolio,
    updatePortfolio,
    postImage,
    getImage,
    getImages
} from '../controllers/portfolio.controller.js';
import { checkGitCreated, checkExistingRepos, createRepo, getRepoContent, publishGithub } from '../controllers/github-api.controller.js';
import auth from '../middleware/auth.middleware.js';
import imageUploader from '../middleware/uploader.middleware.js';

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
 *                              data:
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
 *                data:
 *                  type: string
 *                  description: error message.
 */  
router.post("/createRepo", auth, createRepo);

//TODO shld remove since not being used.
router.get("/getRepoContent", auth, getRepoContent);

/**
 * @openapi
 * portfolio/publishGithub:
 *  put:
 *      summary: Authenticates the user, creates a Github repository if not existing, then pushes files to Github and deploys the Github Repository to ghpages.
 *      tags: [Portfolio]
 *      description: 1. Obtains and attempts to verify JWT from user cookies<br /><br />
 *                   2. Gets repo name, content and route from user request. Files from the user's Github repository under the obtained repo name will be fetched
 *                      via a GET request sent to Github API.<br /><br />
 *                   3. The repository's content will be checked against the request body's content to determine if a SHA key is required to send a PUT request to
 *                      Github API to either create or update a file.
 *      parameters:
 *          - in: cookie
 *            name: authorization
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing JWT encrypted access token.
 *      requestBody:
 *          description: Request body takes in the Github Repositories name to be pushed to, the content to be pushed and the route relative to the Github repository root.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  route:
 *                                      type: string
 *                                      description: Path within the Github repository where file content is either to be pulled from or pushed to.
 *                                  content:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              fileName:
 *                                                  type: string
 *                                                  description: Name of file to be created. Path to file must be prepended to it.
 *                                              fileContent:
 *                                                  type: string
 *                                                  description: Content of the file to be created. Must be base64 encoded.
 *                                  repo:
 *                                      type: string
 *                                      description: Name of Github repository to be either pulled from or pushed to.
 *      responses:
 *          200:
 *              description: Files are successfully pushed to specified Github repository and the repository is deployed to ghpages is necessary.
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
 *                                          description: Successful push to and deployment of Github repository.
 *          400:
 *              description: Either Github repository does not exist, push to Github failed or deployment to ghpages failed.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  description: error message.
 */
router.put("/publishGithub", auth, publishGithub);

router.put("/upsert", auth, upsertPortfolio);

router.put("/updatePortfolio", auth, updatePortfolio);

router.delete("/delete/:id", auth, deletePortfolio);

router.post("/uploadImage", auth, imageUploader.single('file'), postImage);

router.get("/getImage/:id", auth, getImage);

router.get("getImages", auth, getImages);

router.get("/:id", auth, getPortfolio);

router.get("/", auth, getPortfolios);


export default router;