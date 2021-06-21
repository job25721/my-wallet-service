import { Request, Response } from 'express'
import { ClientSession, UpdateQuery } from 'mongoose'
import accountHistoryModel, { AccountHistory } from '../models/accountHistory'
import accountModel from '../models/account'
import ENUM from '../enum'
import checkAccountOwner from '../libs/checkAccountOwner'
import {
  AccountEvent,
  AddAccountEvent,
  CreateAccount,
  UpdateAccount,
} from '../graphql/types/account'

const getByOwner = (_id: string) => accountModel.find({ ownerId: _id }) || []

const create = async (data: CreateAccount, session: ClientSession) => {
  try {
    const created = await accountModel.create([data], { session })
    await accountHistoryModel.create(
      [
        {
          type: AccountEvent.income,
          description: ENUM.DESCRIPTION_EVENT.INIT_ACCOUNT,
          amount: data.amount,
          accountId: created[0]._id,
          date: new Date(),
        },
      ],
      { session }
    )
    await session.commitTransaction()
    session.endSession()
    return created[0]
  } catch (error) {
    await session?.abortTransaction()
    session?.endSession()
    throw new Error()
  }
}

const update = async (id: string, data: UpdateAccount) => {
  const account = await accountModel.findOne({ _id: id })
  if (!account) {
    throw new Error('account not found')
  }
  const updated = await accountModel.findByIdAndUpdate(id, data, {
    new: true,
  })
  if (!updated) {
    throw new Error('update failed')
  }
  const diff = updated.amount - account.amount
  if (diff !== 0) {
    await accountHistoryModel.create({
      type: diff > 0 ? AccountEvent.income : AccountEvent.outcome,
      description: ENUM.DESCRIPTION_EVENT.UPDATE_ACCOUNT_AMOUNT,
      date: new Date(),
      accountId: id,
      amount: Math.abs(diff),
    })
  }
  return updated
}

const deleteByID = async (id: string, session: ClientSession) => {
  try {
    if (!session) {
      throw new Error('no session found')
    }
    await accountModel.deleteOne({ _id: id }, { session })
    await accountHistoryModel.deleteMany({ accountId: id }, { session })
    await session.commitTransaction()
    session.endSession()
    return 'Delete success'
  } catch (error) {
    await session?.abortTransaction()
    session?.endSession()
    return 'Delete failed'
  }
}

const addIncomeOutcome = async (
  id: string,
  type: AccountEvent,
  data: AddAccountEvent,
  session: ClientSession
) => {
  const { amount, date, subType, description } = data
  try {
    if (!session) {
      throw new Error('no session found')
    }
    const account = await accountModel.findOne({ _id: id })
    if (!account) {
      throw new Error('account not found')
    }
    if (!amount || !date) {
      throw new Error('missing required body')
    }
    if (![AccountEvent.income, AccountEvent.outcome].includes(type)) {
      throw new Error('none of type enum account event')
    }
    const updatedAmount =
      type === AccountEvent.income ? account.amount + amount : account.amount - amount
    if (updatedAmount < 0) {
      throw new Error('บัญชีเงินไม่พอ')
    }
    await accountModel.findByIdAndUpdate(id, { amount: updatedAmount }, { new: true, session })
    await accountHistoryModel.create(
      [
        {
          type,
          description:
            description ||
            (type === AccountEvent.income
              ? ENUM.DESCRIPTION_EVENT.DEFAULT_INCOME
              : ENUM.DESCRIPTION_EVENT.DEFAULT_OUTCOME),
          subType: subType || '',
          date,
          amount,
          accountId: id,
        },
      ],
      { session }
    )
    await session.commitTransaction()
    session.endSession()
    return {
      name: account?.name,
      currentAmount: updatedAmount,
      type,
      date,
    }
  } catch (error) {
    await session?.abortTransaction()
    session?.endSession()
    let statusCode = 500
    if (error.message === 'account not found') {
      statusCode = 404
    }
    throw error
  }
}

const moneyTransfer = async (
  req: Request<any, any, { fromAccountID: string; toAccountID: string; amountToTransfer: number }>,
  res: Response
) => {
  const { fromAccountID, toAccountID, amountToTransfer } = req.body
  const { user } = req
  const currentDate = new Date()
  try {
    if (!fromAccountID || !toAccountID || !amountToTransfer) {
      throw new Error('missing required body')
    }
    const account1 = await accountModel.findOne({ _id: fromAccountID })
    const account2 = await accountModel.findOne({ _id: toAccountID })
    if (!account1 || !account2) {
      throw new Error('account not found')
    }
    await checkAccountOwner(user?._id, account1._id)
    if (account1.amount < amountToTransfer) {
      throw new Error('เงินในบัญชีไม่เพียงพอ')
    }
    await accountModel.findByIdAndUpdate(fromAccountID, {
      amount: account1.amount - amountToTransfer,
    })
    await accountModel.findByIdAndUpdate(toAccountID, {
      amount: account2.amount + amountToTransfer,
    })
    await accountHistoryModel.create({
      type: AccountEvent.outcome,
      description: ENUM.DESCRIPTION_EVENT.MONEY_TRANSFER + account2.name,
      date: currentDate,
      accountId: account1._id,
      amount: amountToTransfer,
    })
    await accountHistoryModel.create({
      type: AccountEvent.income,
      description: ENUM.DESCRIPTION_EVENT.RECIEVE_TRANSFER + account1.name,
      date: currentDate,
      accountId: account2._id,
      amount: amountToTransfer,
    })
    return res.status(200).send('transfer success')
  } catch (error) {
    let statusCode = 500
    if (error.message === 'account not found') {
      statusCode = 404
    }
    return res.status(statusCode).send(error.message)
  }
}

export default {
  create,
  update,
  deleteByID,
  addIncomeOutcome,
  moneyTransfer,
  getByOwner,
}
