import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'

import api from './api/index'

const app = express()

app.use(bodyParser.json())

app.use('/api', api)

const PORT = process.env.PORT
app
  .listen(PORT, () => {
    console.log('Server running at port', PORT)
  })
  .on('error', (error) => {
    throw new Error(error.message)
  })
