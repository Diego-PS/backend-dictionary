import { Word } from 'entities'
import { UserRepositoryInterface, WordRepositoryInterface } from 'interfaces'

export class AddWordToFavorites {
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
    if (wordIsInFavorites)
      throw new Error(`word ${word} is already in favorites`)

    const wordInfo = await this.userRepository.addWordToFavorites(id, word)
    return wordInfo
  }
}
