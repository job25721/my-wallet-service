import { IResolvers } from 'graphql-tools'
import { GraphqlContext } from '../types/context'
import { AccountHistory, UpdateHistoryArg } from '../types/history'
import historyController from '../../controllers/accountHistory'

const historyResolver: IResolvers<AccountHistory, GraphqlContext> = {
  Query: {},
  Mutation: {
    updateHistoryByID: (_: void, args: UpdateHistoryArg, { token }) =>
      historyController.update(args),
  },
}

export default historyResolver
