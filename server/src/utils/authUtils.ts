import { NextFunction, Request, Response } from 'express'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { eq } from 'drizzle-orm'

import db from '@/db/index'
import { users } from '@/db/schema'

export const generateAccessToken = ({ email }: { email: string }) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('Cannot create token')
  }
  return jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' })
}

export const generateRefreshToken = ({ email }: { email: string }) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('Cannot create token')
  }
  return jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1y' })
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('Cannot create token')
  }

  const authHeader = req.headers['authorization']
  const accessToken = authHeader && authHeader.split(' ')[1]
  if (accessToken == null) return res.sendStatus(401)

  try {
    const { email } = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as { email: string }
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    req.user = user
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.sendStatus(401)
    }
  }
  next()
}

export const verifyRefreshToken = async (refreshToken: string) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('Cannot create token')
  }
  if (!refreshToken) {
    throw new Error('No refresh token')
  }
  const { email } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as { email: string }
  return email
}
