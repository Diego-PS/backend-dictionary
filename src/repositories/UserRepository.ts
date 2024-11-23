import { User, Word } from 'entities'
import { UserRepositoryInterface } from 'interfaces'
import { UserModel, WordModel } from 'models'

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

  async checkIfUserHasWordInHistory(id: string, word: string): Promise<boolean> {
    const wordDB = await WordModel.findOne({ word })
    if (wordDB === null) throw new Error(`The word ${word} does not exist in this dictionary`)
    const userHasWordInHistory = await UserModel.findOne({
      id,
      history: { $elemMatch: { $eq: wordDB._id } }
    })
    return userHasWordInHistory !== null
  }

  async registerWordToHistory(id: string, word: string): Promise<Word> {
    const wordDB = await WordModel.findOne({ word })
    if (wordDB === null) throw new Error(`The word ${word} does not exist in this dictionary`)
    await UserModel.findOneAndUpdate({ id }, { $addToSet: { history: wordDB.id }})
    return { word: wordDB.word, added: wordDB.added }
  }

  async create(userInfo: Omit<User, 'id'>): Promise<User> {
    const id = crypto.randomUUID()
    await UserModel.create({ id, ...userInfo })
    const user = { id, ...userInfo }
    return user
  }
}
