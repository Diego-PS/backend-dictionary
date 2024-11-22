import { SearchQuery, Word } from 'entities'
import { WordRepositoryInterface } from 'interfaces'
import { WordModel } from 'models'

export class WordRepository implements WordRepositoryInterface {
  async register(word: string): Promise<Word> {
    const added = new Date()
    await WordModel.create({ word, added })
    return { word, added }
  }

  async get(query: SearchQuery): Promise<{ words: Word[]; totalWords: number }> {
    let { page, limit, search } = query
    page = page ?? 1
    const searchQuery = search 
      ? { word: { $regex: `^${search}`, $options: 'i' }} // 'i' for case-insensitive
      : {}
    const totalWords = await WordModel.countDocuments(searchQuery)
    const skip = limit === undefined ? 0 : (page-1)*limit
    let dbQuery = WordModel.find(searchQuery).skip(skip)
    if (limit != undefined) dbQuery = dbQuery.limit(limit)
    const wordsDB = await dbQuery.exec()
    const words: Word[] = wordsDB.map(wordDB => ({ word: wordDB.word, added: wordDB.added }))
    return { words, totalWords }
  }
}
