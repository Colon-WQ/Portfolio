import express from 'express'
import { logout } from '../controllers/logout.controller.js'
import auth from '../middleware/auth.middleware.js'

const router = express.Router()

/** 
 * @openapi
 * tags: 
 *  name: Logout
 *  description: API to logout user using Github Oauth API.
 * 
 * /logout:
 *  get:
 *      summary: Authenticates user, then invalidates user's access token and deletes cookie.
 *      tags: [Logout]
 *      description: 1. Obtains and attempts to verify JWT from user cookies <br /><br />
 *                   2. Sends a DELETE request to github API to invalidate user's access token <br /><br />
 *                   3. The cookie containing user's access token will then be removed.
 *      parameters:
 *          - in: cookie
 *            name: authorization
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing JWT encrypted access token.
 *      responses:
 *          200:
 *              description: User's access token is successfully invalidated via Github API and the cookie containing the access token is destroyed.
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
 *                                          description: logout successful
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
router.get("/", auth, logout)

export default router