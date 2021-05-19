import express from 'express'
import { logout } from '../controllers/logout.controller.js'
import auth from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', auth, logout)

export default router