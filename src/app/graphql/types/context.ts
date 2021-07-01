import { ClientSession } from 'mongoose'

export interface GraphqlContext {
  token: string
  session: ClientSession
}
