import express from 'express'
import accountController from './controllers/account'
import userController from './controllers/user'
import verify from './middlewares/jwt'
const router = express.Router()

router.post('/users/register', userController.create)
router.post('/users/login', userController.authorize)

router.get('/accounts', verify, accountController.getByOwner)
router.post('/accounts', verify, accountController.create)

export default router
