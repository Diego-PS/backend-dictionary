import express from 'express'
import cors from 'cors'
import { router } from 'routes'
import mongoose from 'mongoose'
import { errorHandler } from 'middlewares'
import { Cache, JsonWebToken } from 'utils'

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)
app.use(errorHandler)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server started on port ${3000}`)
  mongoose.connect('mongodb://user:pass@localhost:27017')
  JsonWebToken.setKey(
    '8c72e5969d1acd2567ef1c84eafb554c4cdcf39a06dbc2fd3eea675719505239'
  )
  Cache.connect()
  console.log('Connected to DB')
})
