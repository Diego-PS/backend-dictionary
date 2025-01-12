import { Word } from 'entities'
import { UserRepositoryInterface, WordRepositoryInterface } from 'interfaces'

export class ViewEntry {
  constructor(
    private userRepository: UserRepositoryInterface,
    private wordRepository: WordRepositoryInterface
  ) {}

  execute = async (id: string, word: string): Promise<Word> => {
    const userHasWordInHistory =
      await this.userRepository.checkIfUserHasWordInHistory(id, word)
    const wordInfo = userHasWordInHistory
      ? await this.wordRepository.getWord(word)
      : await this.userRepository.registerWordToHistory(id, word)
    return wordInfo!
  }
}
