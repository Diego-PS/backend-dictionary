import express from 'express'
import cors from 'cors'
import { router } from 'routes'
import mongoose from 'mongoose'
import { errorHandler } from 'middlewares'

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)
app.use(errorHandler)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server started on port ${3000}`)
  mongoose.connect('mongodb://user:pass@localhost:27017')
  console.log('Connected to DB')
})
