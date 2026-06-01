import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Neplatná požiadavka.' }, { status: 400 })
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Heslo musí mať aspoň 6 znakov.' },
        { status: 400 }
      )
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const club = await prisma.club.findFirst({
      where: {
        resetToken: tokenHash,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Odkaz je neplatný alebo jeho platnosť vypršala. Požiadajte o nový.' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.club.update({
      where: { id: club.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Nastala serverová chyba.' }, { status: 500 })
  }
}
