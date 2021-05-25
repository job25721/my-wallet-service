import mongoose, { Document } from 'mongoose'

export type AccountEvent = 'income' | 'outcome'
export interface AccountHistory extends Document {
  type?: AccountEvent
  subType?: string
  description?: string
  date?: Date
  accountId?: string
}

const accountHistorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['income', 'outcome'] },
    subType: String,
    description: String,
    date: Date,
    accountId: { type: String, ref: 'accounts' },
  },
  { versionKey: false }
)

export default mongoose.model<AccountHistory>(
  'accounthistories',
  accountHistorySchema
)
