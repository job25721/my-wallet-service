import mongoose, { Document } from 'mongoose'

export interface Account extends Document {
  name?: string
  amount?: number
  ownerId?: string
  color?: string
}

const accountSchema = new mongoose.Schema(
  {
    name: String,
    amount: { type: Number, default: () => 0 },
    ownerId: { type: String, ref: 'users' },
    color: { type: String, default: () => '#fff' },
  },
  { versionKey: false }
)

export default mongoose.model<Account>('accounts', accountSchema)
