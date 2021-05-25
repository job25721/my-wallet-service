import { FilterQuery, UpdateQuery } from 'mongoose'
import user, { User, UserDoc } from './schemas/user'

const all = () => user.find().exec()

const find = (query: FilterQuery<UserDoc>) => user.find(query).exec()

const findByID = (id: string) => user.findById(id).exec()

const findOne = (query: FilterQuery<UserDoc>) => user.findOne(query).exec()

const update = (id: string, data: UpdateQuery<UserDoc>) =>
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
