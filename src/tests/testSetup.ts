// Imports e configuração inicial
import { Signin, Signup } from '../usecases'

import { Response } from 'express'

import {
  CacheInterface,
  WordRepositoryInterface,
  UserRepositoryInterface,
} from 'interfaces'

// Mock de dependências
export const userRepositoryMock: jest.Mocked<UserRepositoryInterface> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  checkIfUserHasWordInHistory: jest.fn(),
  registerWordToHistory: jest.fn(),
  checkIfWordIsInFavorites: jest.fn(),
  addWordToFavorites: jest.fn(),
  removeWordFromFavorites: jest.fn(),
  getHistory: jest.fn(),
  getFavorites: jest.fn(),
  create: jest.fn(),
}

export const wordRepositoryMock: Partial<WordRepositoryInterface> = {}
export const cacheMock: Partial<CacheInterface> = { execute: jest.fn() }
export const signupUseCaseMock: Partial<Signup> = { execute: jest.fn() }
export const signinUseCaseMock: Partial<Signin> = { execute: jest.fn() }

// Mock de Request e Response
export const mockRequest = (body: any, params: any = {}, query: any = {}) => ({
  body,
  params,
  query,
})
export const mockResponse = () => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.set = jest.fn().mockReturnValue(res)
  return res
}
