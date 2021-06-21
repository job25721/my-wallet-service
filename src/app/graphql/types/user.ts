export type User = {
  username: string
  email?: string
  password: string
  firstName: string
  lastName: string
}
export type Auth = {
  usernameOrEmail: string
  password: string
}

export type LoginArgs = {
  auth: Auth
}

export type CreateUserArgs = {
  user: User
}
