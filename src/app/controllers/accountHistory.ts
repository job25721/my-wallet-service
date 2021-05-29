import { Request, Response } from 'express'
import { UpdateQuery } from 'mongoose'
import checkAccountOwner from '../libs/checkAccountOwner'
import accountModel from '../models/account'

import accountHistoryModel, {
  AccountEvent,
  AccountHistoryDoc,
} from '../models/accountHistory'

const update = async (
  req: Request<{ id: string }, any, UpdateQuery<AccountHistoryDoc>>,
  res: Response
) => {
  const { id } = req.params
  const { user } = req
  try {
    const history = await accountHistoryModel.findById(id)
    if (!history) {
      throw new Error('not found')
    }
    const accountId = history.accountId
    await checkAccountOwner(user?._id, accountId)
    const updated = await accountHistoryModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    if (!updated) {
      throw new Error()
    }

    const typeChanged = history.type !== updated.type
    const shouldUpdate: boolean =
      typeChanged || updated.amount - history.amount !== 0
    if (shouldUpdate) {
      const account = await accountModel.findById(accountId)
      if (account) {
        let updateAmount: number =
          history.type === AccountEvent.INCOME
            ? account.amount - history.amount
            : account.amount + history.amount
        updateAmount =
          updated.type === AccountEvent.INCOME
            ? updateAmount + updated.amount
            : updateAmount - updated.amount
        await accountModel.updateOne(
          { _id: accountId },
          { amount: updateAmount }
        )
      }
    }
    return res.status(201).json(updated)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const getByAccountID = async (
  req: Request<{ accountId: string }>,
  res: Response
) => {
  const { accountId } = req.params
  const { user } = req
  try {
    await checkAccountOwner(user?._id, accountId)
    const histories = await accountHistoryModel
      .find({ accountId })
      .sort({ date: -1 })
    res.status(200).json(histories)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const deleteByID = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  const { user } = req
  try {
    const history = await accountHistoryModel.findById(id)
    if (!history) {
      throw new Error('not found')
    }
    const accountId = history.accountId
    const amountHistory = history.amount
    const type = history.type
    await checkAccountOwner(user?._id, accountId)
    await accountHistoryModel.deleteOne({ _id: id })
    const account = await accountModel.findById(accountId)
    if (!account) {
      throw new Error('not found')
    }

    const updateAmount =
      type === AccountEvent.INCOME
        ? account.amount - amountHistory
        : account.amount + amountHistory
    const updated = await accountModel.findByIdAndUpdate(
      accountId,
      {
        amount: updateAmount,
      },
      { new: true }
    )
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export default {
  update,
  getByAccountID,
  deleteByID,
}
