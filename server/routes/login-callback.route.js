import express from 'express';
import { getToken } from '../controllers/github-api.controller.js';

const router = express.Router();
/**
 * @openapi
 * tags: 
 *  name: Login
 *  description: API to login user using Github Oauth API.
 * 
 * components:
 *  schemas: 
 *      Login:
 *          type: object
 *          properties:
 *                          client_id:
 *                              type: string
 *                              description: Client ID received from Github after registration.
 *                          client_secret:
 *                              type: string
 *                              description: Client Secret received from Github after registration.
 *                          code:
 *                              type: string
 *                              description: Code obtained from https://github.com/login/oauth/authorize?scope=repo&client_id=CLIENT_ID where CLIENT_ID is client id.
 *                                           Obtained from request as a query parameter.
 *                          redirect_uri:
 *                              type: string
 *                              description: url to redirect request response to.
 *      User:
 *          type: object
 *          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      id: 
 *                                          type: integer
 *                                          description: User's unique Github account ID.
 *                                      login:
 *                                          type: string
 *                                          description: User's Github account username.
 *                                      name:
 *                                          type: string
 *                                          description: User's Github account name.
 *                                      avatar_url:
 *                                          type: string
 *                                          description: User's Github avatar image url.
 *                                      gravatar_id:
 *                                          type: string
 *                                          description: User's globally recognized avatar url.
 *          
 * /login/authenticate:
 *  post:
 *      summary: Obtain an access token Github Oauth API and retrieves user's Github account details.
 *      tags: [Login]
 *      description: 1. Using gh code provided by frontend, makes a GET request to Github Oauth API at
 *                   https://github.com/login/oauth/access_token to obtain an access token for the user. <br /><br />
 *                   
 *                   2. Then, a GET request is made to https://api.github.com/user with an Authorization header
 *                   containing the access token to obtain user's Github account details, which are then returned
 *                   to the frontend.
 *      requestBody:
 *          description: Optional description in *Markdown*
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema: 
 *                      $ref: '#/components/schemas/Login'                   
 *      responses: 
 *          200:
 *              description: User Github account details.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/User'
 *                          
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *              
 */
router.post('/authenticate', getToken);

export default router;