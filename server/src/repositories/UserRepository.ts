import { IWord } from 'database-interfaces'
import { User, Word, PaginationQuery } from 'entities'
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

  async checkIfUserHasWordInHistory(
    id: string,
    word: string
  ): Promise<boolean> {
    const wordDB = await WordModel.findOne({ word })
    if (wordDB === null)
      throw new Error(`The word ${word} does not exist in this dictionary`)
    const userHasWordInHistory = await UserModel.findOne({
      id,
      history: { $elemMatch: { $eq: wordDB._id } },
    })
    return userHasWordInHistory !== null
  }

  async registerWordToHistory(id: string, word: string): Promise<Word> {
    const wordDB = await WordModel.findOne({ word })
    if (wordDB === null)
      throw new Error(`The word ${word} does not exist in this dictionary`)
    await UserModel.findOneAndUpdate(
      { id },
      { $addToSet: { history: wordDB._id } }
    )
    return { word: wordDB.word, added: wordDB.added }
  }

  async checkIfWordIsInFavorites(id: string, word: string): Promise<boolean> {
    const wordDB = await WordModel.findOne({ word })
    if (wordDB === null)
      throw new Error(`The word ${word} does not exist in this dictionary`)
    const wordIsInFavorites = await UserModel.findOne({
      id,
      favorites: { $elemMatch: { $eq: wordDB._id } },
    })
    return wordIsInFavorites !== null
  }

  async addWordToFavorites(id: string, word: string): Promise<Word> {
    const wordDB = await WordModel.findOne({ word })
    if (wordDB === null)
      throw new Error(`The word ${word} does not exist in this dictionary`)
    await UserModel.findOneAndUpdate(
      { id },
      { $addToSet: { favorites: wordDB._id } }
    )
    return { word: wordDB.word, added: wordDB.added }
  }

  async removeWordFromFavorites(id: string, word: string): Promise<Word> {
    const wordDB = await WordModel.findOne({ word })
    if (wordDB === null)
      throw new Error(`The word ${word} does not exist in this dictionary`)
    await UserModel.findOneAndUpdate(
      { id },
      { $pull: { favorites: wordDB._id } }
    )
    return { word: wordDB.word, added: wordDB.added }
  }

  async getHistory(
    id: string,
    pagination: PaginationQuery
  ): Promise<{ words: Word[]; totalWords: number }> {
    const page = pagination.page ?? 1
    const limit = pagination.limit
    const skip = limit === undefined ? 0 : (page - 1) * limit
    const totalWords = (await UserModel.findOne({ id }))?.history.length
    const options =
      limit !== undefined
        ? {
            skip,
            limit,
          }
        : {}
    const userDB = await UserModel.findOne({ id })
      .populate<{ history: IWord[] }>({
        path: 'history',
        options,
      })
      .exec()
    if (userDB == null) throw new Error(`No user with id ${id} is registered`)
    const words: Word[] = userDB.history.map((word) => ({
      word: word.word,
      added: word.added,
    }))
    return { words, totalWords: totalWords! }
  }

  async getFavorites(
    id: string,
    pagination: PaginationQuery
  ): Promise<{ words: Word[]; totalWords: number }> {
    const page = pagination.page ?? 1
    const limit = pagination.limit
    const skip = limit === undefined ? 0 : (page - 1) * limit
    const totalWords = (await UserModel.findOne({ id }))?.favorites.length
    const options =
      limit !== undefined
        ? {
            skip,
            limit,
          }
        : {}
    const userDB = await UserModel.findOne({ id })
      .populate<{ favorites: IWord[] }>({
        path: 'favorites',
        options,
      })
      .exec()
    if (userDB == null) throw new Error(`No user with id ${id} is registered`)
    const words: Word[] = userDB.favorites.map((word) => ({
      word: word.word,
      added: word.added,
    }))
    return { words, totalWords: totalWords! }
  }

  async create(userInfo: Omit<User, 'id'>): Promise<User> {
    const id = crypto.randomUUID()
    await UserModel.create({ id, ...userInfo })
    const user = { id, ...userInfo }
    return user
  }
}
