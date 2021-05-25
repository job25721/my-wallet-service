import mongoose, { Document, Schema } from 'mongoose'

export interface User {
  username: string
  email?: string
  password: string
  firstName: string
  lastName: string
}

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
