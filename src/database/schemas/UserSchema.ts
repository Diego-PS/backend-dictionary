import { IUser } from 'database-interfaces'
import { Schema } from 'mongoose'

export const userSchema = new Schema<IUser>(
  {
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    history: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
  },
  { timestamps: true }
)
