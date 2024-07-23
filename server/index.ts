import express, { Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

const PORT = process.env.PORT

app.use('/api', require('./api'))

app
  .listen(PORT, () => {
    console.log('Server running at PORT', PORT)
  })
  .on('error', (error) => {
    throw new Error(error.message)
  })
