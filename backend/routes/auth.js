import express from 'express'
import authController from '../controllers/auth.js'
import loginLimiter from '../middlewares/loginLimiter.js'
const { login, logout, refresh } = authController
const router = express.Router()

router.route('/').post(loginLimiter, login)
router.route('/refresh').get(refresh)
router.route('/logout').post(logout)

export default router