import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      include: {
        club: { select: { name: true } },
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('GET /api/events error:', error)
    return NextResponse.json({ error: 'Nastala serverová chyba.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Neautorizovaný prístup.' }, { status: 401 })
    }

    const clubId = (session.user as any).id
    const { title, description, date, location, maxParticipants, contactInfo } = await req.json()

    if (!title || !description || !date || !location || !contactInfo) {
      return NextResponse.json({ error: 'Chýbajú povinné polia.' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        contactInfo,
        clubId,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('POST /api/events error:', error)
    return NextResponse.json({ error: 'Nastala serverová chyba.' }, { status: 500 })
  }
}
