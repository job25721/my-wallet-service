import { IResolvers } from 'graphql-tools'
import { GraphqlContext } from '../types/context'
import { AccountHistory, UpdateHistoryArg } from '../types/history'
import historyController from '../../controllers/accountHistory'
import userControllers from '../../controllers/user'

const historyResolver: IResolvers<AccountHistory, GraphqlContext> = {
  Query: {},
  Mutation: {
    updateHistoryByID: (_: void, args: UpdateHistoryArg, { token }) =>
      historyController.update(args),
    deleteHistoryByID: async (_: void, args: { id: string }, { token, session }) => {
      await userControllers.getUser(token)
      return historyController.deleteByID(args.id, session)
    },
  },
}

export default historyResolver
