import { IUser } from 'database-interfaces'
import { model } from 'mongoose'
import { userSchema } from 'schemas'

export const UserModel = model<IUser>('User', userSchema)
