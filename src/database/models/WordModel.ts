import { IWord } from 'database-interfaces'
import { model } from 'mongoose'
import { wordSchema } from 'schemas'

export const WordModel = model<IWord>('Word', wordSchema)
