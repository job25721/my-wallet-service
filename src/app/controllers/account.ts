import { Request, Response } from 'express'
import { UpdateQuery } from 'mongoose'
import accountHistoryModel, {
  AccountEvent,
  AccountHistory,
} from '../models/accountHistory'
import accountModel from '../models/account'
import { Account, AccountDoc } from '../models/account'
import ENUM from '../enum'
import checkAccountOwner from '../libs/checkAccountOwner'

const getByOwner = async (req: Request<any, any, Account>, res: Response) => {
  const { user } = req
  try {
    if (!user) {
      throw new Error()
    }
    const accounts = await accountModel.find({ ownerId: user._id })
    return res.status(200).json(accounts)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const create = async (req: Request<any, any, Account>, res: Response) => {
  const createData = req.body
  const session = req.mongoSession
  Object.assign(createData, { ownerId: null })
  const ownerId = req.user?._id
  if (ownerId) {
    Object.assign(createData, { ownerId })
  }
  try {
    if (!session) {
      throw new Error('no session found')
    }
    const created = await accountModel.create([createData], { session })
    await accountHistoryModel.create(
      [
        {
          type: AccountEvent.INCOME,
          description: ENUM.DESCRIPTION_EVENT.INIT_ACCOUNT,
          amount: createData.amount,
          accountId: created[0]._id,
          date: new Date(),
        },
      ],
      { session }
    )
    await session.commitTransaction()
    session.endSession()
    return res.status(201).json(created)
  } catch (error) {
    await session?.abortTransaction()
    session?.endSession()
    return res.status(500).send(error.message)
  }
}

const update = async (
  req: Request<{ id: string }, any, UpdateQuery<AccountDoc>>,
  res: Response
) => {
  const { id } = req.params
  const { user } = req
  try {
    await checkAccountOwner(user?._id, id)
    const account = await accountModel.findOne({ _id: id })
    if (!account) {
      throw new Error('account not found')
    }
    const updated = await accountModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    if (!updated) {
      throw new Error('update failed')
    }
    const diff = updated.amount - account.amount
    if (diff !== 0) {
      await accountHistoryModel.create({
        type: diff > 0 ? AccountEvent.INCOME : AccountEvent.OUTCOME,
        description: ENUM.DESCRIPTION_EVENT.UPDATE_ACCOUNT_AMOUNT,
        date: new Date(),
        accountId: id,
        amount: Math.abs(diff),
      })
    }
    return res.status(200).json(updated)
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
  const user = req.user
  const session = req.mongoSession

  try {
    if (!session) {
      throw new Error('no session found')
    }
    await checkAccountOwner(user?._id, id)
    await accountModel.deleteOne({ _id: id }, { session })
    await accountHistoryModel.deleteMany({ accountId: id }, { session })
    await session.commitTransaction()
    session.endSession()
    return res.status(200).send('remove success')
  } catch (error) {
    await session?.abortTransaction()
    session?.endSession()
    return res.status(500).send(error.message)
  }
}

const addIncomeOutcome = async (
  req: Request<{ id: string; type: AccountEvent }, {}, AccountHistory>,
  res: Response
) => {
  const { id, type } = req.params
  const { amount, date, subType, description } = req.body
  const session = req.mongoSession
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
    if (![AccountEvent.INCOME, AccountEvent.OUTCOME].includes(type)) {
      throw new Error('none of type enum account event')
    }
    const updatedAmount =
      type === AccountEvent.INCOME
        ? account.amount + amount
        : account.amount - amount
    if (updatedAmount < 0) {
      throw new Error('บัญชีเงินไม่พอ')
    }
    await accountModel.findByIdAndUpdate(
      id,
      { amount: updatedAmount },
      { new: true, session }
    )
    await accountHistoryModel.create(
      [
        {
          type,
          description:
            description ||
            (type === AccountEvent.INCOME
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
    return res.status(200).json({
      name: account?.name,
      currentAmount: updatedAmount,
      type,
      amount,
      date,
    })
  } catch (error) {
    await session?.abortTransaction()
    session?.endSession()
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
      type: AccountEvent.OUTCOME,
      description: ENUM.DESCRIPTION_EVENT.MONEY_TRANSFER + account2.name,
      date: currentDate,
      accountId: account1._id,
      amount: amountToTransfer,
    })
    await accountHistoryModel.create({
      type: AccountEvent.INCOME,
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
