import express from 'express';
import { getToken } from '../controllers/github-api.controller.js';

const router = express.Router();
/**
 * @openapi
 * tags: 
 *  name: Login
 *  description: API to login user using Github Oauth API.
 * 
 * 
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
 *          description: Github will provide code to get access token.
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type: string
 *                                      description: Github code provided to get access token from Github API.                   
 *      responses: 
 *          200:
 *              description: 1. User authenticated using Github API <br /><br />
 *                           2. User Github account details. <br /><br />
 *                           3. The access token is returned in a signed cookie named 'authorization'. 
 *                              You may need to include this cookie for other requests that require authorization
 *              headers:
 *                  Set-Cookie:
 *                      schema:
 *                          type: apiKey
 *                          example: connect.sid=session _id; Path=/; HttpOnly; secure; signed; SameSite=Strict; maxAge:6 * 60 * 60 * 1000
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
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
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: error message.
 *              
 */
router.post("/authenticate", getToken);

export default router;