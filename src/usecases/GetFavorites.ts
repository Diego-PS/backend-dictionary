import { PaginationQuery } from 'entities'
import { UserRepositoryInterface } from 'interfaces'
import { WordsReponseBody } from './GetHistory'

export class GetFavorites {
  constructor(private userRepository: UserRepositoryInterface) {}

  execute = async (
    id: string,
    pagination: PaginationQuery
  ): Promise<WordsReponseBody> => {
    const { words, totalWords } = await this.userRepository.getFavorites(
      id,
      pagination
    );
    const results = words;
    const totalDocs = totalWords;
    const limit = pagination.limit ?? 10;
    const page = pagination.page ?? 1;
    const totalPages = totalDocs === 0 ? 1 : Math.ceil(totalDocs / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      results,
      totalDocs,
      page,
      totalPages,
      hasNext,
      hasPrev,
    };
  };
}

