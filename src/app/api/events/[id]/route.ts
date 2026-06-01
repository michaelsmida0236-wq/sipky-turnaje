import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: { club: { select: { name: true } } },
    })

    if (!event) {
      return NextResponse.json({ error: 'Turnaj nebol nájdený.' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('GET /api/events/[id] error:', error)
    return NextResponse.json({ error: 'Nastala serverová chyba.' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Neautorizovaný prístup.' }, { status: 401 })
    }

    const clubId = (session.user as any).id

    const event = await prisma.event.findUnique({ where: { id: params.id } })
    if (!event) {
      return NextResponse.json({ error: 'Turnaj nebol nájdený.' }, { status: 404 })
    }
    if (event.clubId !== clubId) {
      return NextResponse.json({ error: 'Nemáte oprávnenie upraviť tento turnaj.' }, { status: 403 })
    }

    const { title, description, date, location, maxParticipants, contactInfo } = await req.json()

    if (!title || !description || !date || !location || !contactInfo) {
      return NextResponse.json({ error: 'Chýbajú povinné polia.' }, { status: 400 })
    }

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        contactInfo,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/events/[id] error:', error)
    return NextResponse.json({ error: 'Nastala serverová chyba.' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Neautorizovaný prístup.' }, { status: 401 })
    }

    const clubId = (session.user as any).id

    const event = await prisma.event.findUnique({ where: { id: params.id } })
    if (!event) {
      return NextResponse.json({ error: 'Turnaj nebol nájdený.' }, { status: 404 })
    }
    if (event.clubId !== clubId) {
      return NextResponse.json({ error: 'Nemáte oprávnenie vymazať tento turnaj.' }, { status: 403 })
    }

    await prisma.event.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/events/[id] error:', error)
    return NextResponse.json({ error: 'Nastala serverová chyba.' }, { status: 500 })
  }
}
