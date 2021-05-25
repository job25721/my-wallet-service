import { Request, Response } from 'express'
import { UpdateQuery } from 'mongoose'
import accountHistoryModel from '../models/accountHistoryModel'
import accountModel from '../models/accountModel'
import { Account, AccountDoc } from '../models/schemas/account'
import { AccountEvent, AccountHistory } from '../models/schemas/accountHistory'
import accountHistoryController from './accountHistory'
import ENUM from '../enum'

const create = async (req: Request<any, any, Account>, res: Response) => {
  const createData = req.body
  const ownerId = req.user?._id
  if (ownerId) {
    Object.assign(createData, { ownerId })
  }
  try {
    const account = await accountModel.create(createData)
    await accountHistoryModel.create({
      type: ENUM.ACCOUNT_EVENT.INCOME,
      description: ENUM.DESCRIPTION_EVENT.INIT_ACCOUNT,
      amount: account.amount,
      accountId: account._id,
      date: new Date(),
    })
    return res.status(201).json(account)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const update = async (
  req: Request<{ id: string }, any, UpdateQuery<AccountDoc>>,
  res: Response
) => {
  const { id } = req.params
  try {
    const account = await accountModel.findOne({ _id: id })
    if (!account) {
      throw new Error('account not found')
    }
    const updated = await accountModel.update(id, req.body)
    if (!updated) {
      throw new Error('update failed')
    }
    const diff = updated.amount - account.amount
    if (diff !== 0) {
      await accountHistoryController.create({
        type: diff > 0 ? ENUM.ACCOUNT_EVENT.INCOME : ENUM.ACCOUNT_EVENT.OUTCOME,
        description: ENUM.DESCRIPTION_EVENT.UPDATE_ACCOUNT_AMOUNT,
        date: new Date(),
        accountId: id,
        amount: Math.abs(diff),
      })
    }
    return res.status(204).json(updated)
  } catch (error) {
    let statusCode = 500
    if (error.message === 'account not found') {
      statusCode = 404
    }
    return res.status(statusCode).send(error.message)
  }
}

const deleteByID = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    await accountModel.remove(id)
    return res.status(200).end()
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const addIncomeOutcome = async (
  req: Request<{ id: string; type: AccountEvent }, {}, AccountHistory>,
  res: Response
) => {
  const { id, type } = req.params
  const { amount, date, subType, description } = req.body
  try {
    const account = await accountModel.findOne({ _id: id })
    if (!account) {
      throw new Error('account not found')
    }
    if (!amount || !date) {
      throw new Error('missing required body')
    }
    const updatedAmount =
      type === ENUM.ACCOUNT_EVENT.INCOME
        ? account.amount + amount
        : account.amount - amount
    if (updatedAmount < 0) {
      throw new Error('บัญชีเงินไม่พอ')
    }
    await accountModel.update(id, { amount: updatedAmount })
    await accountHistoryController.create({
      type,
      description:
        description ||
        (type === ENUM.ACCOUNT_EVENT.INCOME
          ? ENUM.DESCRIPTION_EVENT.DEFAULT_INCOME
          : ENUM.DESCRIPTION_EVENT.DEFAULT_OUTCOME),
      subType: subType || '',
      date,
      accountId: id,
      amount,
    })
  } catch (error) {
    let statusCode = 500
    if (error.message === 'account not found') {
      statusCode = 404
    }
    return res.status(statusCode).send(error.message)
  }
}

const moneyTransfer = async (
  req: Request<
    any,
    any,
    { fromAccountID: string; toAccountID: string; amountToTransfer: number }
  >,
  res: Response
) => {
  const { fromAccountID, toAccountID, amountToTransfer } = req.body
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
    if (account1.amount < amountToTransfer) {
      throw new Error('เงินในบัญชีไม่เพียงพอ')
    }
    await accountModel.update(fromAccountID, {
      amount: account1.amount - amountToTransfer,
    })
    await accountModel.update(toAccountID, {
      amount: account2.amount + amountToTransfer,
    })
    await accountHistoryController.create({
      type: ENUM.ACCOUNT_EVENT.OUTCOME,
      description: ENUM.DESCRIPTION_EVENT.MONEY_TRANSFER + account2.name,
      date: currentDate,
      accountId: account1._id,
      amount: amountToTransfer,
    })
    await accountHistoryController.create({
      type: ENUM.ACCOUNT_EVENT.INCOME,
      description: ENUM.DESCRIPTION_EVENT.RECIEVE_TRANSFER + account1.name,
      date: currentDate,
      accountId: account2._id,
      amount: amountToTransfer,
    })
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
}
