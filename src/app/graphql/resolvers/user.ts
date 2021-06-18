import { IResolvers } from 'graphql-tools'
import { LoginArgs } from '../types/user'
import userController from '../../controllers/user'

const userResolver: IResolvers = {
  Query: {
    helloWorld: () => 'Hello world !!!',
  },
  Mutation: {
    login: async (_: void, args: LoginArgs) =>
      userController.authorize(args.auth),
  },
}

export default userResolver
