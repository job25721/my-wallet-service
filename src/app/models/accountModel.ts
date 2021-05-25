import { UpdateQuery,UpdateWithAggregationPipeline } from 'mongoose'
import account, { Account, AccountDoc } from './schemas/account'

const create = (data: Account) => account.create(data)

const getByUserID = (ownerId: string) => account.find({ ownerId }).exec()

const update = (id: string, updateDoc: UpdateQuery<AccountDoc>) =>
  account.findByIdAndUpdate(id, updateDoc, { new: true })

const remove = (id: string) => account.findByIdAndDelete(id)

export default {
  create,
  getByUserID,
  update,
  remove,
}


