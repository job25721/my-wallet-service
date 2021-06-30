import { ApolloError } from 'apollo-server-express'
import { Request, Response } from 'express'
import { UpdateHistoryArg } from '../graphql/types/history'
import accountHistoryModel, { AccountHistoryDoc } from '../models/accountHistory'
import checkAccountOwner from '../libs/checkAccountOwner'
import accountModel from '../models/account'
import { AccountEvent } from '../graphql/types/account'
import _enum from '../enum'

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
    Object.assign(data, {
      description:
        data.type === AccountEvent.income
          ? _enum.DESCRIPTION_EVENT.DEFAULT_INCOME
          : _enum.DESCRIPTION_EVENT.DEFAULT_OUTCOME,
    })
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

// const deleteByID = async (req: Request<{ id: string }>, res: Response) => {
//   const { id } = req.params
//   const { user } = req
//   try {
//     const history = await accountHistoryModel.findById(id)
//     if (!history) {
//       throw new Error('not found')
//     }
//     const accountId = history.accountId
//     const amountHistory = history.amount
//     const type = history.type
//     await checkAccountOwner(user?._id, accountId)
//     await accountHistoryModel.deleteOne({ _id: id })
//     const account = await accountModel.findById(accountId)
//     if (!account) {
//       throw new Error('not found')
//     }

//     const updateAmount =
//       type === AccountEvent.INCOME ? account.amount - amountHistory : account.amount + amountHistory
//     const updated = await accountModel.findByIdAndUpdate(
//       accountId,
//       {
//         amount: updateAmount,
//       },
//       { new: true }
//     )
//     res.status(200).json(updated)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// }

export default {
  update,
  getByAccountID,
  // deleteByID,
}
