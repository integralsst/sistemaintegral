// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET)

export async function createSessionToken(payload: {
  userId: string
  email: string
  role: string
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret)
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload as {
    userId: string
    email: string
    role: string
  }
}