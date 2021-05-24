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
 * 
 * /logout:
 *  get:
 *      summary: Authenticates user, then invalidates user's access token and deletes cookie.
 *      description: 1. Obtains and verifies JWT from user cookies and sends a POST request to github API to validate decrypted access token. <br /><br />
 *                   2. Sends a DELETE request to github API to invalidate user's access token <br /><br />
 *                   3. The cookie containing user's access token will then be removed.
 */
router.get('/', auth, logout)

export default router