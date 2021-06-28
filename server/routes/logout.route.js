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
 *      summary: Authenticates user, then invalidates user's access token and deletes session document from mongodb.
 *      tags: [Logout]
 *      description: 1. Obtains and attempts to verify JWT from user cookies <br /><br />
 *                   2. Sends a DELETE request to github API to invalidate user's access token <br /><br />
 *                   3. Session _id is obtained from connect.sid cookie and used to delete the session document identified by the _id from mongodb.
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session _id.
 *      responses:
 *          200:
 *              description: User is successfully logged out.
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
 *                                          example: logout successful
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: unauthorized user            
 *              
 */
router.get("/", auth, logout)

export default router