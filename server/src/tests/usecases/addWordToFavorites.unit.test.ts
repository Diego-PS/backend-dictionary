import { AddWordToFavorites } from '../../usecases'

import { WordRepositoryInterface, UserRepositoryInterface } from 'interfaces'

import { userRepositoryMock, wordRepositoryMock } from '../testSetup'

describe('AddWordToFavorites', () => {
  const addWordToFavorites = new AddWordToFavorites(
    userRepositoryMock as UserRepositoryInterface,
    wordRepositoryMock as WordRepositoryInterface
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve adicionar uma palavra aos favoritos com sucesso', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)
    ;(userRepositoryMock.addWordToFavorites as jest.Mock).mockResolvedValue({
      word: 'teste',
    })

    const result = await addWordToFavorites.execute('user1', 'teste')
    expect(result).toEqual({ word: 'teste' })
    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalledWith(
      'user1',
      'teste'
    )
    expect(userRepositoryMock.addWordToFavorites).toHaveBeenCalledWith(
      'user1',
      'teste'
    )
  })

  it('deve lançar erro ao adicionar palavra já existente nos favoritos', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(true)

    await expect(addWordToFavorites.execute('user1', 'teste')).rejects.toThrow(
      'word teste is already in favorites'
    )
  })

  it('deve lançar erro quando falhar ao adicionar palavra aos favoritos', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)
    ;(userRepositoryMock.addWordToFavorites as jest.Mock).mockRejectedValue(
      new Error('word  is already in favorites')
    )

    await expect(addWordToFavorites.execute('user1', 'teste')).rejects.toThrow(
      'word  is already in favorites'
    )
  })

  it('deve falhar quando o ID do usuário está vazio', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)

    await expect(addWordToFavorites.execute('', 'teste')).rejects.toThrow(
      'word  is already in favorites'
    )
  })

  it('deve lançar erro se o argumento "word" estiver vazio', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)

    await expect(addWordToFavorites.execute('user1', '')).rejects.toThrow(
      'Invalid characters in word: '
    )
  })

  it('deve verificar se "checkIfWordIsInFavorites" é chamado antes de "addWordToFavorites"', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)
    ;(userRepositoryMock.addWordToFavorites as jest.Mock).mockResolvedValue({
      word: 'teste',
    })

    await addWordToFavorites.execute('user1', 'teste')

    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalled()
  })

  it('deve verificar comportamento para palavra com espaços extras', async () => {
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)
    ;(userRepositoryMock.addWordToFavorites as jest.Mock).mockResolvedValue({
      word: ' teste ',
    })

    const result = await addWordToFavorites.execute('user1', ' teste ')
    expect(result).toEqual({ word: ' teste ' })
    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalledWith(
      'user1',
      ' teste '
    )
    expect(userRepositoryMock.addWordToFavorites).toHaveBeenCalledWith(
      'user1',
      ' teste '
    )
  })

  it('deve lançar erro ao adicionar palavra com caracteres inválidos', async () => {
    const invalidWord = 't3$t3!'
    ;(
      userRepositoryMock.checkIfWordIsInFavorites as jest.Mock
    ).mockResolvedValue(false)

    await expect(
      addWordToFavorites.execute('user1', invalidWord)
    ).rejects.toThrow('Invalid characters in word: t3$t3!')
  })
})
