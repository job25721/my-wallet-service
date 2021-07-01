import mongoose, { Document } from 'mongoose'
import { AccountEvent } from '../graphql/types/account'
import { AccountHistory } from '../graphql/types/history'

const accountHistorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: AccountEvent },
    subType: String,
    description: String,
    date: { type: Date, required: true, default: () => new Date() },
    accountId: { type: String, ref: 'accounts', required: true },
    amount: { type: Number, required: true },
  },
  { versionKey: false }
)

export type AccountHistoryDoc = AccountHistory & Document
export default mongoose.model<AccountHistoryDoc>('accounthistories', accountHistorySchema)
