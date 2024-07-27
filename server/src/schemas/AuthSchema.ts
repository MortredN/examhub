import z from 'zod'

export const AuthRegisterReq = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string()
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirm password does not match',
        path: ['confirmPassword']
      })
    }
  })
export type AuthRegisterReqType = z.TypeOf<typeof AuthRegisterReq>

export const AuthLoginReq = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(100)
  })
  .strict()
export type AuthLoginReqType = z.TypeOf<typeof AuthLoginReq>

export const RefreshTokenReq = z
  .object({
    refreshToken: z.string()
  })
  .strict()
export const RefreshTokenRes = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
  .strict()
export type RefreshTokenReqType = z.TypeOf<typeof RefreshTokenReq>
export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>
