import mongoose, { Document } from 'mongoose'
import { Account } from '../graphql/types/account'

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, default: () => 0 },
    ownerId: { type: String, ref: 'users', required: true },
    color: { type: String, default: () => '#fff' },
  },
  { versionKey: false }
)

export type AccountDoc = Account & Document
export default mongoose.model<AccountDoc>('accounts', accountSchema)
