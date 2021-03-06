import express from 'express'
import accountHistoryController from './controllers/accountHistory'
import accountController from './controllers/account'
import userController from './controllers/user'
import { verification, mongoSession } from './middlewares'
const router = express.Router()

router.post('/users/register', userController.create)
router.post('/users/login', userController.authorize)

router.get('/accounts', verification, accountController.getByOwner)
router.post('/accounts', verification, mongoSession, accountController.create)
router.post(
  '/accounts/:id/update/:type',
  verification,
  mongoSession,
  accountController.addIncomeOutcome
)
router.post('/accounts/transfer', verification, accountController.moneyTransfer)
router.put('/accounts/:id', verification, accountController.update)
router.delete(
  '/accounts/:id',
  verification,
  mongoSession,
  accountController.deleteByID
)

router.get(
  '/histories/:accountId',
  verification,
  accountHistoryController.getByAccountID
)
router.put('/histories/:id', verification, accountHistoryController.update)
router.delete(
  '/histories/:id',
  verification,
  accountHistoryController.deleteByID
)

export default router
