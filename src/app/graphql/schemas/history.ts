import { gql } from 'apollo-server-express'

const historySchema = gql`
  enum AccountEvent {
    income
    outcome
  }

  type History {
    _id: String
    type: AccountEvent!
    subType: String
    description: String
    date: String!
    accountId: String!
    amount: Float!
  }

  input UpdateHistoryArg {
    type: AccountEvent
    subType: String
    description: String
    date: String
    accountId: String
    amount: Float
  }

  type Mutation {
    updateHistoryByID(id: String!, data: UpdateHistoryArg): History!
    deleteHistoryByID(id: String!): String!
  }
`

export default historySchema
