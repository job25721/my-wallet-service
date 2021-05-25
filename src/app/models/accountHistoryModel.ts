import accountHistory, { AccountHistory } from './schemas/accountHistory'

const create = (data: AccountHistory) => accountHistory.create(data)

const getByAccountID = (accountId: string) => accountHistory.find({ accountId }).exec()

const update = (id: string, data: AccountHistory) =>
  accountHistory.findByIdAndUpdate(id, data, { new: true })

const remove = (id: string) => accountHistory.findByIdAndDelete(id)

export default {
  create,
  getByAccountID,
  update,
  remove,
}
