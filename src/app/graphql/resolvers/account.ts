import { IResolvers } from 'graphql-tools'
import accountController from '../../controllers/account'
import userController from '../../controllers/user'
import accountHistoryController from '../../controllers/accountHistory'
import checkAccountOwner from '../../libs/checkAccountOwner'
import {
  Account,
  AccountEvent,
  AddAccountEvent,
  CreateAccountArg,
  MoneyTrasnferBody,
  UpdateAccountArg,
} from '../types/account'
import { GraphqlContext } from '../types/context'

const accountResolver: IResolvers<Account, GraphqlContext> = {
  Query: {
    getAccounts: async (_: void, args, context) => {
      const user = await userController.getUser(context.token)
      return accountController.getByOwner(user._id)
    },
  },
  Mutation: {
    createAccount: async (_: void, args: CreateAccountArg, context) => {
      const user = await userController.getUser(context.token)
      return accountController.create({ ...args.data, ownerId: user._id }, context.session)
    },
    updateAccount: async (_: void, args: UpdateAccountArg, context) => {
      const user = await userController.getUser(context.token)
      await checkAccountOwner(user._id, args.id)
      return accountController.update(args.id, args.data)
    },
    deleteByID: async (_: void, args: { id: string }, context) => {
      const user = await userController.getUser(context.token)
      await checkAccountOwner(user._id, args.id)
      return accountController.deleteByID(args.id, context.session)
    },
    addAccountEvent: async (
      _: void,
      { id, type, data }: { id: string; type: AccountEvent; data: AddAccountEvent },
      { token, session }
    ) => {
      const user = await userController.getUser(token)
      await checkAccountOwner(user._id, id)
      return accountController.addIncomeOutcome(id, type, data, session)
    },
    moneyTransfer: async (_: void, args: { transferData: MoneyTrasnferBody }, { token }) => {
      const user = await userController.getUser(token)
      await checkAccountOwner(user._id, args.transferData.fromAccountID)
      return accountController.moneyTransfer(args.transferData)
    },
  },
  Account: {
    histories: (parent) => accountHistoryController.getByAccountID(parent._id),
  },
}

export default accountResolver
