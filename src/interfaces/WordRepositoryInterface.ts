import { Word } from 'entities'

export interface WordRepositoryInterface {
  register(word: string): Promise<Word>
}
