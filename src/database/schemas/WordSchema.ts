import { IWord } from 'database-interfaces'
import { Schema } from 'mongoose'

export const wordSchema = new Schema<IWord>(
  {
    word: { type: String, unique: true, required: true },
  },
  { timestamps: true }
)
