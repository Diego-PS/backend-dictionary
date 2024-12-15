// Imports e configuração inicial

import { EntriesController } from '../controllers';

import {  GetEntries, ViewEntry, AddWordToFavorites, removeWordFromFavorites } from '../usecases';

import { Response } from 'express';

import { CacheInterface, WordRepositoryInterface,UserRepositoryInterface } from 'interfaces';

import {
  userRepositoryMock,
  wordRepositoryMock,
  cacheMock,
  mockRequest,
  mockResponse,
} from './testSetup';

describe('EntriesController', () => {
  const getEntriesUseCaseMock: Partial<GetEntries> = { execute: jest.fn() };
  const viewEntryUseCaseMock: Partial<ViewEntry> = { execute: jest.fn() };

  const entriesController = new EntriesController(
    getEntriesUseCaseMock as GetEntries,
    viewEntryUseCaseMock as ViewEntry,
    new AddWordToFavorites(userRepositoryMock as UserRepositoryInterface, wordRepositoryMock as WordRepositoryInterface),
    new removeWordFromFavorites(userRepositoryMock as UserRepositoryInterface, wordRepositoryMock as WordRepositoryInterface),
    cacheMock as CacheInterface
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter entradas com sucesso', async () => {
    (cacheMock.execute as jest.Mock).mockResolvedValue({
      value: { entries: [] },
      metadata: { cache: 'HIT', responseTime: '10ms' },
    });

    const req = mockRequest({}, {}, { search: 'word', page: '1', limit: '10' });
    const res = mockResponse();

    await entriesController.getEntries(req as any, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ entries: [] });
  });

  it('deve lançar erro quando falhar ao obter entradas do cache', async () => {
    (cacheMock.execute as jest.Mock).mockRejectedValue(new Error('Cache fetch failed'));

    const req = mockRequest({}, {}, { search: 'word', page: '1', limit: '10' });
    const res = mockResponse();

    await expect(entriesController.getEntries(req as any, res as Response)).rejects.toThrow('Cache fetch failed');
  });
});


