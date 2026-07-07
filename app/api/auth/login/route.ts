// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSessionToken } from '@/lib/auth'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Correo y contraseña son obligatorios' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.password || !user.email) {
    return NextResponse.json(
      { message: 'Credenciales incorrectas' },
      { status: 401 }
    )
  }

  if (!user.isActive) {
    return NextResponse.json(
      { message: 'Usuario inactivo' },
      { status: 403 }
    )
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    return NextResponse.json(
      { message: 'Credenciales incorrectas' },
      { status: 401 }
    )
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  const response = NextResponse.json({
    message: 'Login exitoso',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })

  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })

  return response
}