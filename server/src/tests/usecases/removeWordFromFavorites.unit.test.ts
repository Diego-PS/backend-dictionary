import { removeWordFromFavorites } from '../../usecases'

import { WordRepositoryInterface, UserRepositoryInterface } from 'interfaces'

import { userRepositoryMock, wordRepositoryMock } from '../testSetup'

describe('Caso de Uso: Remover Palavra dos Favoritos', () => {
  const removeWord = new removeWordFromFavorites(
    userRepositoryMock as UserRepositoryInterface,
    wordRepositoryMock as WordRepositoryInterface
  )

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks()
  })

  it('deve remover uma palavra dos favoritos com sucesso', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(true)
    ;(
      userRepositoryMock.removeWordFromFavorites as jest.Mock
    ).mockResolvedValue({ word: 'teste' })

    const result = await removeWord.execute('user1', 'teste')
    expect(result).toEqual({ word: 'teste' })
    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalledWith(
      'user1',
      'teste'
    )
    expect(userRepositoryMock.removeWordFromFavorites).toHaveBeenCalledWith(
      'user1',
      'teste'
    )
  })

  it('deve lançar erro ao tentar remover palavra inexistente', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)

    await expect(removeWord.execute('user1', 'teste')).rejects.toThrow(
      'The word teste is not in favorites'
    )
  })

  it('deve lançar erro ao tentar remover palavra inexistente com caracteres inválidos', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)

    await expect(removeWord.execute('user1', 't3$t3')).rejects.toThrow(
      'Invalid characters in word: t3$t3'
    )
  })

  it('deve lançar erro ao tentar remover palavra com caracteres inválidos', async () => {
    const invalidWord = 't3$t3!'
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(true)

    await expect(removeWord.execute('user1', invalidWord)).rejects.toThrow(
      'Invalid characters in word: t3$t3!'
    )
  })

  it('deve lançar erro quando falhar ao remover palavra dos favoritos', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(true)
    ;(
      userRepositoryMock.removeWordFromFavorites as jest.Mock
    ).mockRejectedValue(new Error('Failed to remove word'))

    await expect(removeWord.execute('user1', 'teste')).rejects.toThrow(
      'Failed to remove word'
    )
  })

  it('deve verificar que a palavra foi removida dos favoritos', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(true)
    ;(
      userRepositoryMock.removeWordFromFavorites as jest.Mock
    ).mockResolvedValue({ word: 'teste' })

    await removeWord.execute('user1', 'teste')
    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalledWith(
      'user1',
      'teste'
    )
    expect(userRepositoryMock.removeWordFromFavorites).toHaveBeenCalledWith(
      'user1',
      'teste'
    )
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)
    await expect(removeWord.execute('user1', 'teste')).rejects.toThrow(
      'The word teste is not in favorites'
    )
  })
})
