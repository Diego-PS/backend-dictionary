import { User } from 'entities'
import { UserRepositoryInterface } from 'interfaces'
import { UserModel } from 'models'

export class UserRepository implements UserRepositoryInterface {
  async findById(id: string): Promise<User | null> {
    const userDB = await UserModel.findOne({ id })
    if (!userDB) return null
    const user: User = {
      id,
      email: userDB.email,
      name: userDB.name,
      password: userDB.password,
    }
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDB = await UserModel.findOne({ email })
    if (!userDB) return null
    const user: User = {
      id: userDB.id,
      email,
      name: userDB.name,
      password: userDB.password,
    }
    return user
  }

  async create(userInfo: Omit<User, 'id'>): Promise<User> {
    const id = crypto.randomUUID()
    await UserModel.create({ id, ...userInfo })
    const user = { id, ...userInfo }
    return user
  }
}
