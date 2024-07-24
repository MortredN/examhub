import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import db from '../db/index.js'
import { users } from '../db/schema.js'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const result = await db.select().from(users)
  return res.status(200).json({ data: result })
})

router.post('/add', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const saltRounds = 10
  const hash = bcrypt.hashSync(password, saltRounds)
  const result = await db.insert(users).values({ email: email, password: hash })
  return res.status(200).json({ data: result })
})

export default router
