import { Word, PaginationQuery } from 'entities'
import { UserRepositoryInterface} from 'interfaces'

export type WordsReponseBody = {
  results: Word[]
  totalDocs: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export class GetHistory {
  constructor(private userRepository: UserRepositoryInterface) {}

  execute = async (
    id: string, pagination: PaginationQuery
  ): Promise<WordsReponseBody> => {
    const { words, totalWords } = await this.userRepository.getHistory(id, pagination)
    const results = words
    const totalDocs = totalWords
    const limit = pagination.limit
    const page = pagination.page ?? 1
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
