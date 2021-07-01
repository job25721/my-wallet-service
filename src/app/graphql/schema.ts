import 'graphql-import-node'
import { makeExecutableSchema } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'
import { mergeTypes } from 'merge-graphql-schemas'
import { merge } from 'lodash'

import { userResolver, accountResolver, historyResolver } from './resolvers'
import { userSchema, accountSchema, historySchema } from './schemas'

const typeDefs = mergeTypes([userSchema, accountSchema, historySchema])
const resolvers = merge(userResolver, accountResolver, historyResolver)

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default schema
