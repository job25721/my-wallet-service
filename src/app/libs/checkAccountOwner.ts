import accountModel from '../models/account'

export default async (userId?: string, accountId?: string): Promise<void> => {
  const foundAccount = await accountModel.findOne({
    _id: accountId,
    ownerId: userId,
  })
  if (!foundAccount) {
    throw new Error("You're not account owner")
  }
}
