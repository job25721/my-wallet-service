import { IResolvers } from 'graphql-tools'
import { CreateUserArgs, LoginArgs } from '../types/user'
import userController from '../../controllers/user'

const userResolver: IResolvers = {
  Query: {
    helloWorld: () => 'Hello world !!!',
  },
  Mutation: {
    register: (_: void, args: CreateUserArgs) => userController.create(args.user),
    login: (_: void, args: LoginArgs) => userController.authorize(args.auth),
  },
}

export default userResolver
