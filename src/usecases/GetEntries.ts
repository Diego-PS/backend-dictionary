import { SearchQuery } from 'entities'
import { WordRepositoryInterface } from 'interfaces'

export type EntriesReponseBody = {
  results: string[]
  totalDocs: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export class GetEntries {
  constructor(private wordRepository: WordRepositoryInterface) {}

  async execute(
    query: SearchQuery
  ): Promise<EntriesReponseBody> {
    const { words, totalWords } = await this.wordRepository.get(query)
    const results = words.map(word => word.word)
    const totalDocs = totalWords
    const limit = query.limit
    const page = query.page ?? 1
    const totalPages = limit === undefined ? 1 : Math.ceil(totalDocs / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    return {
      results,
      totalDocs,
      page,
      totalPages,
      hasNext,
      hasPrev
    }
  }
}
