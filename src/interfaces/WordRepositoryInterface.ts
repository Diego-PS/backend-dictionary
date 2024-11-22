import { SearchQuery, Word } from 'entities'

export interface WordRepositoryInterface {
  register(word: string): Promise<Word>
  get(query: SearchQuery): Promise<{ words: Word[], totalWords: number }>
}
