import express from 'express'
import userController from './controllers/user'

const router = express.Router()

router.post('/users', userController.create)

export default router
