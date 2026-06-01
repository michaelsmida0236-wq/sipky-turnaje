import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Zadajte email.' }, { status: 400 })
    }

    const club = await prisma.club.findUnique({ where: { email } })

    // Pre bezpečnosť odpovedáme rovnako, či email existuje alebo nie,
    // aby sa nedalo zistiť, ktoré kluby sú zaregistrované.
    if (club) {
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
      const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hodina

      await prisma.club.update({
        where: { id: club.id },
        data: {
          resetToken: tokenHash,
          resetTokenExpiry: expiry,
        },
      })

      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

      try {
        await sendPasswordResetEmail(club.email, resetUrl)
      } catch (e) {
        // Email sa nepodarilo odoslať (napr. chýbajúce nastavenie).
        // Nehlásime to používateľovi, ale zalogujeme pre diagnostiku.
        console.error('Email send error:', e)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Nastala serverová chyba.' }, { status: 500 })
  }
}
