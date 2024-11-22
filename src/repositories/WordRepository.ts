import { Word } from 'entities'
import { WordRepositoryInterface } from 'interfaces'
import { WordModel } from 'models'

export class WordRepository implements WordRepositoryInterface {
  async register(word: string): Promise<Word> {
    const added = new Date()
    await WordModel.create({ word, added })
    return { word, added }
  }
}
