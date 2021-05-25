import mongoose, { Document } from 'mongoose'

export type AccountEvent = 'income' | 'outcome'
export interface AccountHistory {
  type: AccountEvent
  subType?: string
  description: string
  date: Date
  accountId: string
  amount: number
}

const accountHistorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['income', 'outcome'] },
    subType: String,
    description: String,
    date: { type: Date, required: true, default: () => new Date() },
    accountId: { type: String, ref: 'accounts', required: true },
    amount: { type: Number, required: true },
  },
  { versionKey: false }
)

export type AccountHistoryDoc = AccountHistory & Document
export default mongoose.model<AccountHistoryDoc>(
  'accounthistories',
  accountHistorySchema
)
