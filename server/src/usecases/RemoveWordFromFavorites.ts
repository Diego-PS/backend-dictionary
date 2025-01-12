import { Word } from 'entities'
import { UserRepositoryInterface, WordRepositoryInterface } from 'interfaces'

export class removeWordFromFavorites {
  constructor(
    private userRepository: UserRepositoryInterface,
    private wordRepository: WordRepositoryInterface
  ) {}

  execute = async (id: string, word: string): Promise<Word> => {
    if (!/^[a-zA-Z\s]+$/.test(word)) {
      throw new Error(`Invalid characters in word: ${word}`)
    }

    const wordIsInFavorites =
      await this.userRepository.checkIfWordIsInFavorites(id, word)
    if (!wordIsInFavorites)
      throw new Error(`The word ${word} is not in favorites`)

    const wordInfo = await this.userRepository.removeWordFromFavorites(id, word)
    return wordInfo
  }
}
