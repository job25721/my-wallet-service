import { Request, Response } from 'express'
import { UpdateQuery } from 'mongoose'

import accountHistoryModel from '../models/accountHistoryModel'
import {
  AccountHistory,
  AccountHistoryDoc,
} from '../models/schemas/accountHistory'

const create = async (createHistory: AccountHistory) =>
  accountHistoryModel.create(createHistory)

const update = async (
  req: Request<{ id: string }, any, UpdateQuery<AccountHistoryDoc>>,
  res: Response
) => {
  const { id } = req.params
  try {
    const updated = await accountHistoryModel.update(id, req.body)
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
  try {
    const histories = await accountHistoryModel.getByAccountID(accountId)
    res.status(200).json(histories)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const deleteByID = async (req: Request<{ id: string }>, res: Response) => {
  return accountHistoryModel
    .remove(req.params.id)
    .then(() => res.status(200).end())
    .catch((error) => res.status(500).send(error.message))
}

export default {
  create,
  update,
  getByAccountID,
  deleteByID,
}
