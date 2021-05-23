import express from 'express'
import userRouter from './user'
import accountRouter from './account'
import historyRouter from './history'
const router = express.Router()

router.use('/users', userRouter)
router.use('/accounts', accountRouter)
router.use('/histories', historyRouter)

export default router
