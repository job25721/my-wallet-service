import { gql } from 'apollo-server-express'

const userSchema = gql`
  type User {
    _id: String!
    username: String!
    email: String
    password: String!
    firstName: String!
    lastName: String!
  }

  type UserInfo {
    _id: String!
    username: String!
    email: String
    firstName: String!
    lastName: String!
  }

  input CreateUser {
    username: String!
    email: String
    password: String!
    firstName: String!
    lastName: String!
  }

  input Auth {
    usernameOrEmail: String!
    password: String!
  }

  type Query {
    getMyInfo: UserInfo
  }

  type Mutation {
    register(user: CreateUser!): User!
    login(auth: Auth!): String!
  }
`

export default userSchema
