import mongoose, { Document, Schema, Model } from 'mongoose'

export interface User {
  _id?: string
  username: string
  email: string
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
const userModel: Model<UserDoc> = mongoose.model('users', userSchema)
export default userModel
