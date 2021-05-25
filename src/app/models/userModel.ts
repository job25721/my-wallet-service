import { FilterQuery } from 'mongoose'
import user, { User } from './schemas/user'

const all = () => user.find().exec()

const find = (query: FilterQuery<User>) => user.find(query).exec()

const findByID = (id: string) => user.findById(id).exec()

const findOne = (query: FilterQuery<User>) => user.findOne(query).exec()

const update = (id: string, data: User) =>
  user.findByIdAndUpdate(id, data, { new: true }).exec()

const create = (data: User) => user.create(data)

export default {
  all,
  find,
  findByID,
  findOne,
  update,
  create,
}
