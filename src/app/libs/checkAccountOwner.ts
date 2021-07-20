import accountModel from '../models/account'

export default async (userId?: string, accountId?: string): Promise<void> => {
  const foundAccount = await accountModel.findOne({ _id: accountId })
  if (!foundAccount) {
    throw new Error('no this account id')
  }
  const isOwner = foundAccount.ownerId === userId?.toString()
  
  if (!isOwner) {
    throw new Error("You're not account owner")
  }
}
