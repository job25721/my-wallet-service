import { Document, FilterQuery, UpdateQuery } from 'mongoose'
import cronjob, { Cronjob, CronjobDoc } from './schemas/cronjob'

const create = (data: Cronjob) => cronjob.create(data)

const update = (id: string, data: UpdateQuery<CronjobDoc>) =>
  cronjob.findByIdAndUpdate(id, data, { new: true })

const find = (query: FilterQuery<CronjobDoc>) => cronjob.find(query).exec()

const remove = (id: string) => cronjob.findByIdAndDelete(id)

export default {
  create,
  update,
  find,
  remove,
}
