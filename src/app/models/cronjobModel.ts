import { FilterQuery } from 'mongoose'
import cronjob, { Cronjob } from './schemas/cronjob'

const create = (data: Cronjob) => cronjob.create(data)

const update = (id: string, data: Cronjob) =>
  cronjob.findByIdAndUpdate(id, data, { new: true })

const find = (query: FilterQuery<Cronjob>) => cronjob.find(query).exec()

const remove = (id: string) => cronjob.findByIdAndDelete(id)

export default {
  create,
  update,
  find,
  remove,
}
