import mongoose, { Document } from 'mongoose'
import { AccountEvent } from './accountHistory'

export interface Cronjob extends Document {
  executeOnday?: number
  type?: AccountEvent
  amount?: number
  description?: string
  accountId?: string
}
const cronjobSchema = new mongoose.Schema(
  {
    executeOnday: Number,
    type: { type: String, enum: ['income', 'outcome'] },
    amount: Number,
    description: String,
    accountId: String,
  },
  { versionKey: false }
)

export default mongoose.model<Cronjob>('cronjobs', cronjobSchema)
