import { FilterQuery } from 'mongoose'
import userModel, { User } from './schemas/user'

const all = () => userModel.find().exec()

const find = (query: FilterQuery<User>) => userModel.find(query).exec()

const findByID = (id: string) => userModel.findById(id).exec()

const findOne = (query: FilterQuery<User>) => userModel.findOne(query).exec()

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
