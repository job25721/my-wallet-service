import mongoose, { Document, Schema } from 'mongoose'
import { User } from '../graphql/types/user'

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { versionKey: false }
)

export type UserDoc = User & Document

export default mongoose.model<UserDoc>('users', userSchema)
