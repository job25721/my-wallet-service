import 'graphql-import-node'
import { makeExecutableSchema } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'
import { mergeTypes } from 'merge-graphql-schemas'
import { merge } from 'lodash'

import userSchema from './schemas/user.gql'
import accountSchema from './schemas/account.gql'
import historySchema from './schemas/history.gql'
import userResolver from './resolvers/user'
import accountResolver from './resolvers/account'
import historyResolver from './resolvers/history'

const typeDefs = mergeTypes([userSchema, accountSchema, historySchema])
const resolvers = merge(userResolver, accountResolver, historyResolver)

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default schema
