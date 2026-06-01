import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Všetky polia sú povinné.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Heslo musí mať aspoň 6 znakov.' },
        { status: 400 }
      )
    }

    const existing = await prisma.club.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Klub s týmto emailom už existuje.' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const club = await prisma.club.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { id: club.id, name: club.name, email: club.email },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Nastala serverová chyba.' },
      { status: 500 }
    )
  }
}
