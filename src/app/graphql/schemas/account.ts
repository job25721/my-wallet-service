import { gql } from 'apollo-server-express'

const accountSchema = gql`
  type Account {
    _id: String!
    name: String!
    amount: Float!
    ownerId: String!
    color: String!
    histories: [History!]!
  }

  input CreateAccountArg {
    name: String!
    amount: Float!
    color: String!
  }

  input UpdateAccountArg {
    name: String
    amount: Float
    color: String
  }

  input MoneyTrasnferArg {
    fromAccountID: String!
    toAccountID: String!
    amountToTransfer: Float!
  }

  enum AccountEvent {
    income
    outcome
  }

  type AddAccountEventResponse {
    name: String!
    currentAmount: Float!
    type: AccountEvent!
    date: Date!
  }

  input AddAccountEvent {
    type: String!
    subType: String
    description: String
    date: Date!
    amount: Float!
  }

  type Query {
    getAccounts: [Account!]!
  }

  type Mutation {
    createAccount(data: CreateAccountArg!): Account!
    updateAccount(id: String!, data: UpdateAccountArg): Account!
    deleteAccountByID(id: String!): String!
    addAccountEvent(
      id: String!
      type: AccountEvent!
      data: AddAccountEvent
    ): AddAccountEventResponse!
    moneyTransfer(transferData: MoneyTrasnferArg!): String!
  }
`

export default accountSchema
