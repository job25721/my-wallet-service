import { IResolvers } from 'graphql-tools'
import accountController from '../../controllers/account'
import accountHistoryController from '../../controllers/accountHistory'
import checkAccountOwner from '../../libs/checkAccountOwner'
import getUser from '../../libs/getUser'
import { Account } from '../types/account'
import { GraphqlContext } from '../types/context'

const accountResolver: IResolvers<Account, GraphqlContext> = {
  Query: {
    getAccounts: async (_: void, args, context) => {
      const user = await getUser(context.token)
      return accountController.getByOwner(user._id)
    },
  },
  Account: {
    histories: (parent) =>
      accountHistoryController.getByAccountID(parent._id),
  },
}

export default accountResolver
