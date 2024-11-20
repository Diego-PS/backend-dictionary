import { Types } from 'mongoose'

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  history: Types.ObjectId[]
  favorites: Types.ObjectId[]
}
