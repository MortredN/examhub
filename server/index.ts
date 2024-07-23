import express from 'express'
import dotenv from 'dotenv'

import apiRouter from './api/index.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT

app.use('/api', apiRouter)

app
  .listen(PORT, () => {
    console.log('Server running at port', PORT)
  })
  .on('error', (error) => {
    throw new Error(error.message)
  })
