import { FilterQuery } from 'mongoose'
import userModel, { UserDoc, User } from './schemas/user'

const all = () => userModel.find().exec()

const find = (query: FilterQuery<UserDoc>) => userModel.find(query).exec()

const findByID = (id: string) => userModel.findById(id).exec()

const findOne = (query: FilterQuery<UserDoc>) => userModel.findOne(query).exec()

const update = (id: string, data: User) =>
  userModel.findByIdAndUpdate(id, data, { new: true }).exec()

const create = (data: User) => userModel.create(data)

export default {
  all,
  find,
  findByID,
  findOne,
  update,
  create,
}
