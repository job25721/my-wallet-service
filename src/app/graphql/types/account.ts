export enum AccountEvent {
  income = 'income',
  outcome = 'outcome',
}
export type Account = {
  _id: string
  name: string
  amount: number
  ownerId: string
  color: string
}

export type CreateAccountArg = {
  data: {
    name: string
    amount: number
    color: string
  }
}

export type UpdateAccountArg = {
  data: {
    name?: string
    amount?: number
    color?: string
  }
  id: string
}

export type UpdateAccount = {
  name?: string
  amount?: number
  color?: string
}

export type CreateAccount = {
  name: string
  amount: number
  ownerId: string
  color: string
}

export type AddAccountEvent = {
  type: string
  subType?: string
  description?: string
  date: Date
  amount: number
}

export type MoneyTrasnferBody = {
  fromAccountID: string
  toAccountID: string
  amountToTransfer: number
}
