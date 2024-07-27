import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'

import db from '@/db'
import { users } from '@/db/schema'
import {
  AuthLoginReq,
  AuthLoginReqType,
  AuthRegisterReq,
  AuthRegisterReqType,
  RefreshTokenReqType
} from '@/schemas/AuthSchema'
import {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '@/utils/authUtils'

const router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
  const body: AuthRegisterReqType = req.body
  const validation = AuthRegisterReq.safeParse(body)
  if (!validation.success) {
    return res.status(400).json(validation.error.format())
  }

  const { email, password } = body
  const saltRounds = 10
  const hash = bcrypt.hashSync(password, saltRounds)
  const result = await db.insert(users).values({ email: email, password: hash }).$returningId()

  const newUserId = result[0]?.id
  if (!newUserId) {
    return res.sendStatus(500)
  }

  const accessToken = generateAccessToken({ email })
  const refreshToken = generateRefreshToken({ email })
  return res.status(200).json({ data: { accessToken, refreshToken } })
})

router.post('/login', async (req: Request, res: Response) => {
  const body: AuthLoginReqType = req.body
  const validation = AuthLoginReq.safeParse(body)
  if (!validation.success) {
    return res.status(400).json(validation.error.format())
  }

  const { email, password } = body
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (!user || !user.password) {
    return res.status(404).json({ message: 'Email or password is incorrect' })
  }

  const result = bcrypt.compareSync(password, user.password)
  if (!result) {
    return res.status(404).json({ message: 'Email or password is incorrect' })
  }

  const accessToken = generateAccessToken({ email })
  const refreshToken = generateRefreshToken({ email })
  return res.status(200).json({ data: { accessToken, refreshToken } })
})

router.post('/refresh-token', async (req: Request, res: Response) => {
  const body: RefreshTokenReqType = req.body
  const { refreshToken } = body
  const email = await verifyRefreshToken(refreshToken)

  const newAccessToken = generateAccessToken({ email })
  const newRefreshToken = generateRefreshToken({ email })
  return res
    .status(200)
    .json({ data: { accessToken: newAccessToken, refreshToken: newRefreshToken } })
})

router.post('/test', authenticateToken, async (req: Request, res: Response) => {
  return res.status(200).json({ data: req.user })
})

export default router
