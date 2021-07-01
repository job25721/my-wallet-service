import { IResolvers } from 'graphql-tools'
import { CreateUserArgs, LoginArgs, User } from '../types/user'
import userController from '../../controllers/user'
import { GraphqlContext } from '../types/context'

const userResolver: IResolvers<User, GraphqlContext> = {
  Query: {
    getMyInfo: (_: void, args, { token }) => userController.getUser(token),
  },
  Mutation: {
    register: (_: void, args: CreateUserArgs) => userController.create(args.user),
    login: (_: void, args: LoginArgs) => userController.authorize(args.auth),
  },
}

export default userResolver
