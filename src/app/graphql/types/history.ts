import { AccountEvent } from './account'

export type AccountHistory = {
  type: AccountEvent
  subType?: string
  description: string
  date: Date
  accountId: string
  amount: number
}

export type UpdateHistory = {
  type?: AccountEvent
  subType?: string
  description?: string
  date?: Date
  accountId?: string
  amount?: number
}

export type UpdateHistoryArg = {
  id: string
  data?: UpdateHistory
}
