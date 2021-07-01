import { ApolloError } from 'apollo-server-express'
import { UpdateHistoryArg } from '../graphql/types/history'
import accountHistoryModel, { AccountHistoryDoc } from '../models/accountHistory'
import accountModel from '../models/account'
import { AccountEvent } from '../graphql/types/account'
import _enum from '../enum'
import { ClientSession } from 'mongoose'

const update = async (args: UpdateHistoryArg) => {
  const { id } = args
  const data = args.data || {}
  const history = await accountHistoryModel.findById(id)
  if (!history) {
    throw new ApolloError('not found')
  }
  const accountId = history.accountId
  const typeChanged: boolean = data.type ? history.type !== data.type : false
  const amountChanged: boolean = data.amount ? data.amount - history.amount !== 0 : false
  const shouldUpdate: boolean = typeChanged || amountChanged

  let updated: AccountHistoryDoc | null = null
  if (typeChanged && !data.description) {
    let assignNewDescription: string = ''
    if (
      history.description === _enum.DESCRIPTION_EVENT.DEFAULT_INCOME ||
      history.description === _enum.DESCRIPTION_EVENT.DEFAULT_OUTCOME
    ) {
      assignNewDescription =
        data.type === AccountEvent.income
          ? _enum.DESCRIPTION_EVENT.DEFAULT_INCOME
          : _enum.DESCRIPTION_EVENT.DEFAULT_OUTCOME
    } else {
      assignNewDescription = history.description
    }
    Object.assign(data, { description: assignNewDescription })
  }
  if (Object.keys(data).length > 0) {
    updated = await accountHistoryModel.findByIdAndUpdate(id, data, {
      new: true,
    })
    if (!updated) {
      throw new ApolloError('update failed')
    }
  }
  if (shouldUpdate && updated) {
    const account = await accountModel.findById(accountId)
    if (account) {
      let updateAmount: number =
        history.type === AccountEvent.income
          ? account.amount - history.amount
          : account.amount + history.amount

      updateAmount =
        updated.type === AccountEvent.income
          ? updateAmount + updated.amount
          : updateAmount - updated.amount

      await accountModel.updateOne({ _id: accountId }, { amount: updateAmount })
    }
  }

  return updated || history
}

const getByAccountID = async (accountId: string) =>
  accountHistoryModel.find({ accountId }).sort({ date: -1 })

const deleteByID = async (id: string, session: ClientSession) => {
  try {
    const history = await accountHistoryModel.findById(id)
    if (!history) {
      throw new Error('history not found')
    }
    const accountId = history.accountId
    const amountHistory = history.amount
    const type = history.type
    const account = await accountModel.findById(accountId)
    if (!account) {
      throw new Error('account not found')
    }
    //delete process
    await accountHistoryModel.deleteOne({ _id: id }, { session })
    const updateAmount =
      type === AccountEvent.income ? account.amount - amountHistory : account.amount + amountHistory
    await accountModel.findByIdAndUpdate(
      accountId,
      {
        amount: updateAmount,
      },
      { session }
    )
    await session.commitTransaction()
    session.endSession()
    return 'Delete history successful'
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw new ApolloError(error.message)
  }
}

export default {
  update,
  getByAccountID,
  deleteByID,
}
